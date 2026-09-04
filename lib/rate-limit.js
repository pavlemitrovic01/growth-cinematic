/**
 * Kocnica za javne POST endpointe.
 *
 * Jedno mesto, tri pozivaoca — isti obrazac koji `lib/email.js` vec koristi.
 *
 * DVA SLOJA, i drugi postoji zbog izmerenog ogranicenja:
 *   1) D1 (Cloudflare) — deljen izmedju svih izolata, jedan round-trip po zahtevu.
 *   2) In-memory po izolatu — pali se SAMO kad D1 nije vezan ili vrati gresku.
 *
 * ⚠️ PRENETO IZ MAIN-a (`C:/dev/growth/lib/rate-limit.js`), sloj 1 zamenjen.
 * Original je koristio `ioredis` preko TCP-a ka Redis Cloudu. Na Cloudflare Workers-u
 * to ne radi: nema sirovog TCP socketa koji `ioredis` ume da otvori. D1 je ovde vec
 * dostupan, besplatan je i daje ISTU garanciju koju je Redis davao — brojac deljen
 * izmedju instanci — u jednom round-tripu.
 *
 * ⚠️ Sloj 2 je sam po sebi slab (po izolatu, brise se na cold start) i na Workers-u je
 * SLABIJI nego sto je bio na Vercelu: izolata ima vise i krace zive. Zato D1 ovde nije
 * luksuz nego nosilac — bez njega je zastita blizu nule. Ostaje svejedno, jer je bolji
 * od potpuno otvorenog endpointa dok binding nije podignut.
 *
 * ⚠️ U bazi su ISKLJUCIVO brojaci po IP-u i vremenu isteka. Nista licno, nikad.
 */

// 10 na sat: pravi vozac salje jednom, a 10 pokriva i retry posle 503. Namerno velikodusno —
// vozaci dele IP na truck stop wi-fi-ju i iza CGNAT-a mobilnih operatera, pa prestrog limit
// tiho odbija STVARNE kandidate, sto je gore od propustenog bota.
export const LIMIT = 10;
export const WINDOW_SECONDS = 3600;

/**
 * D1 binding se cita lenjo i kroz `try`, jer `cloudflare:workers` postoji SAMO u Workers
 * runtime-u. U vitest-u (obican Node) import pukne, funkcija vrati `null`, i modul padne
 * na sloj 2 — sto je tacno ono sto testovi mere. Bez ovog guarda bi ceo test fajl pukao
 * na uvozu.
 */
let d1Broken = false;

async function getD1() {
  if (d1Broken) return null;
  try {
    const { env } = await import('cloudflare:workers');
    return env?.DB ?? null;
  } catch {
    d1Broken = true;
    return null;
  }
}

// ── Sloj 2: in-memory, po izolatu ─────────────────────────────────────────────
// Namerno prost: Map<kljuc, {count, resetAt}>. Ne pokusava da bude tacan preko izolata —
// to je posao sloja 1. Ovde je cilj da napad ne prodje potpuno neometano dok D1 grei.
const memory = new Map();

function memoryHit(key, now) {
  const rec = memory.get(key);
  if (!rec || rec.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return 1;
  }
  rec.count += 1;
  return rec.count;
}

// Mapa raste samo dok traje napad; ovo je ciscenje isteklih, ne pravi GC.
function sweepMemory(now) {
  if (memory.size < 5000) return;
  for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
}

/**
 * Isto ciscenje, ali za D1 — i ovde je bilo IZOSTAVLJENO.
 *
 * ⚠️ Memorijski sloj je nasledio `sweepMemory` iz izvornog projekta; D1 sloj je nov i
 * dugo nije imao nijedan `DELETE`. Red se prepisuje po kljucu, pa jedan IP drzi jedan red —
 * ali svaki NOV IP dodaje nov red, zauvek. Tabela je tako rasla monotono sa brojem
 * posetilaca, i najbrze bas pod raspodeljenim napadom, kad je pritisak na bazu najmanje
 * pozeljan.
 *
 * Ciscenje je verovatnosno umesto na svaki zahtev: brisanje je jeftino ali nije besplatno,
 * a istekli redovi ne smetaju nikome dok stoje. 2% pogadja svaki pedeseti zahtev, sto je na
 * bilo kakvom saobracaju dovoljno cesto da tabela ostane mala.
 *
 * ⚠️ Ceka se namerno (`await`). Neceakan promise na Workers-u moze biti prekinut kad
 * odgovor ode, pa bi „ciscenje" tiho nikad ne bi zavrsilo. Cena je jedan DELETE po
 * indeksiranoj koloni na 2% zahteva. Greska se guta — ciscenje nikad ne sme oboriti prijavu.
 */
const SWEEP_PROBABILITY = 0.02;

async function sweepD1(db, now) {
  if (Math.random() >= SWEEP_PROBABILITY) return;
  try {
    await db.prepare('DELETE FROM rate_limit WHERE reset_at <= ?1').bind(now).run();
  } catch (error) {
    console.warn('[rate-limit] ciscenje isteklih redova nije uspelo.', { error: error?.message });
  }
}

/**
 * Klijentski IP.
 *
 * ⚠️ RAZLIKA U ODNOSU NA MAIN: `cf-connecting-ip` ide PRVI. Na Cloudflare-u to zaglavlje
 * postavlja edge i klijent ga ne moze falsifikovati — Cloudflare ga prepisuje na svakom
 * zahtevu. `x-forwarded-for` na Workers-u dolazi od klijenta i JESTE falsifikovljiv, pa
 * bi ostavljanje MAIN-ovog redosleda znacilo limiter koji se zaobilazi jednim zaglavljem.
 * Redosled ispod je zato zamena, ne dodatak.
 */
export function clientIp(req) {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Fixed window u JEDNOJ izjavi: upsert koji ili resetuje istekao prozor ili inkrementira
 * ziv, pa vrati novi brojac kroz `RETURNING`. Jedan round-trip, isto kao Redis pipeline.
 *
 * Fixed umesto sliding je namerno — sliding trosi vise operacija za dobitak koji na ovom
 * obimu niko ne oseti.
 *
 * @returns {Promise<{ok: boolean, remaining: number, layer: 'd1'|'memory'}>}
 */
export async function checkRateLimit(req, bucket) {
  const now = Date.now();
  const key = `rl:${bucket}:${clientIp(req)}`;
  const resetAt = now + WINDOW_SECONDS * 1000;

  const db = await getD1();
  if (db) {
    try {
      const row = await db
        .prepare(
          `INSERT INTO rate_limit (key, count, reset_at) VALUES (?1, 1, ?3)
           ON CONFLICT(key) DO UPDATE SET
             count    = CASE WHEN rate_limit.reset_at <= ?2 THEN 1   ELSE rate_limit.count + 1 END,
             reset_at = CASE WHEN rate_limit.reset_at <= ?2 THEN ?3  ELSE rate_limit.reset_at   END
           RETURNING count`,
        )
        .bind(key, now, resetAt)
        .first();

      const count = row?.count;
      if (typeof count === 'number') {
        await sweepD1(db, now);
        return { ok: count <= LIMIT, remaining: Math.max(0, LIMIT - count), layer: 'd1' };
      }
      throw new Error(`RETURNING dao ${typeof count}, ocekivan broj`);
    } catch (error) {
      console.warn('[rate-limit] D1 nedostupan — prelazim na in-memory sloj.', {
        bucket,
        error: error?.message,
      });
    }
  }

  // Sloj 2. Ako binding ne postoji, ovo je jedina odbrana koju imamo.
  sweepMemory(now);
  const count = memoryHit(key, now);
  return { ok: count <= LIMIT, remaining: Math.max(0, LIMIT - count), layer: 'memory' };
}

/**
 * Honeypot zivi u `lib/honeypot.js` — modul bez ijedne zavisnosti, da ga forme smeju
 * uvesti bez povlacenja `import('cloudflare:workers')` u klijentski bundle.
 *
 * Re-export postoji da rute i testovi prenesene iz MAIN-a nastave da uvoze odavde,
 * neizmenjeni. Jedan izvor, dva ulaza.
 */
export { HONEYPOT_FIELD, isHoneypotTripped } from './honeypot.js';

// Ciscenje test stanja — vitest ne deli instancu izmedju fajlova, ali deli unutar fajla.
export function __resetMemoryForTests() {
  memory.clear();
  d1Broken = false;
}
