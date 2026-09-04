import { getSql } from '@/db';

/**
 * Kocnica za javne POST endpointe.
 *
 * Jedno mesto, tri pozivaoca — isti obrazac koji `lib/email.js` vec koristi.
 *
 * DVA SLOJA, i drugi postoji zbog izmerenog ogranicenja:
 *   1) Baza (Neon/Postgres) — deljena izmedju svih instanci, jedan round-trip po zahtevu.
 *   2) In-memory po instanci — pali se SAMO kad baza nije vezana ili vrati gresku.
 *
 * ⚠️ DVA PUTA MENJAN SLOJ 1, i oba puta zbog platforme. MAIN
 * (`C:/dev/growth/lib/rate-limit.js`) koristi `ioredis` preko TCP-a ka Redis Cloudu.
 * Na Cloudflare Workers-u to ne radi — nema sirovog TCP socketa — pa je tamo bio D1.
 * Na Vercelu bi Redis opet radio, ali baza je ovde vec potrebna zbog `leads`, pa drugi
 * spoljni servis za brojac ne bi kupio nista osim jos jednog racuna i jos jednog otkaza.
 *
 * ⚠️ Sloj 2 je sam po sebi slab (po instanci, brise se na cold start), a na serverless
 * platformi je slabiji nego na dugozivom serveru: instanci ima vise i krace zive. Zato
 * sloj 1 nije luksuz nego nosilac — bez njega je zastita blizu nule. Ostaje svejedno,
 * jer je bolji od potpuno otvorenog endpointa dok baza nije podignuta.
 *
 * ⚠️ U bazi su ISKLJUCIVO brojaci po IP-u i vremenu isteka. Nista licno, nikad.
 */

// 10 na sat: pravi vozac salje jednom, a 10 pokriva i retry posle 503. Namerno velikodusno —
// vozaci dele IP na truck stop wi-fi-ju i iza CGNAT-a mobilnih operatera, pa prestrog limit
// tiho odbija STVARNE kandidate, sto je gore od propustenog bota.
export const LIMIT = 10;
export const WINDOW_SECONDS = 3600;

/**
 * ⚠️ Ovde je do prelaska na Vercel stajao `getD1()` sa `await import('cloudflare:workers')`
 * u `try`: taj modul postoji SAMO u Workers runtime-u, pa je u vitest-u uvoz pucao,
 * funkcija vracala `null` i modul padao na sloj 2 — sto je tacno ono sto testovi mere.
 *
 * `getSql()` iz `@/db` cuva isti ugovor bez dinamickog uvoza: vraca `null` kad
 * `DATABASE_URL` ne postoji, sto je u testovima uvek slucaj. Rezervni put je nepromenjen.
 */

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
 * Isto ciscenje, ali za bazu — i ovde je bilo IZOSTAVLJENO.
 *
 * ⚠️ Memorijski sloj je nasledio `sweepMemory` iz izvornog projekta; sloj nad bazom je nov
 * i dugo nije imao nijedan `DELETE`. Red se prepisuje po kljucu, pa jedan IP drzi jedan red —
 * ali svaki NOV IP dodaje nov red, zauvek. Tabela je tako rasla monotono sa brojem
 * posetilaca, i najbrze bas pod raspodeljenim napadom, kad je pritisak na bazu najmanje
 * pozeljan.
 *
 * Ciscenje je verovatnosno umesto na svaki zahtev: brisanje je jeftino ali nije besplatno,
 * a istekli redovi ne smetaju nikome dok stoje. 2% pogadja svaki pedeseti zahtev, sto je na
 * bilo kakvom saobracaju dovoljno cesto da tabela ostane mala.
 *
 * ⚠️ Ceka se namerno (`await`), i razlog prezivljava prelazak sa Workers-a na Vercel:
 * neceakan promise u serverless funkciji biva prekinut kad odgovor ode, pa „ciscenje" tiho
 * nikad ne bi zavrsilo. Cena je jedan DELETE po indeksiranoj koloni na 2% zahteva. Greska
 * se guta — ciscenje nikad ne sme oboriti prijavu.
 */
const SWEEP_PROBABILITY = 0.02;

async function sweepDb(sql, now) {
  if (Math.random() >= SWEEP_PROBABILITY) return;
  try {
    await sql`DELETE FROM rate_limit WHERE reset_at <= ${now}::bigint`;
  } catch (error) {
    console.warn('[rate-limit] ciscenje isteklih redova nije uspelo.', { error: error?.message });
  }
}

/**
 * Klijentski IP.
 *
 * ⚠️ OVAJ REDOSLED JE OBRNUT PRI PRELASKU NA VERCEL, I TO JE POPRAVKA RUPE, NE STIL.
 *
 * Na Cloudflare-u je `cf-connecting-ip` islo PRVO jer ga edge postavlja i prepisuje na
 * svakom zahtevu — klijent ga nije mogao falsifikovati. Vercel to zaglavlje ne postavlja
 * uopste. Da je preneto doslovno, svako bi uz zahtev poslao `cf-connecting-ip: <bilo sta>`,
 * dobio svoj privatni brojac po izmisljenom IP-u i kocnica bi se zaobilazila jednim
 * zaglavljem — bez ijedne druge greske u kodu.
 *
 * Zato sada prvo idu zaglavlja koja postavlja SAMA platforma:
 *   1) `x-vercel-forwarded-for` — Vercel ga pise sam, klijentska vrednost se odbacuje
 *   2) `x-real-ip` — takodje platformsko
 *
 * ⚠️ A `x-forwarded-for` uzima POSLEDNJI unos, ne prvi. Ovo je druga polovina iste rupe:
 * XFF je lanac `klijent, proxy1, proxy2`, i sto je unos levlji to je manje proveren —
 * krajnje levi je onaj koji je poslao sam posetilac. Ranije se uzimao bas taj, uz
 * obrazlozenje da je „klijent, ostalo su proksiji", sto vazi samo ako ispred nema proxyja
 * koji dodaje na vec postojeci lanac. Krajnje desni unos je dodao proxy najblizi nama i
 * jedini je koji posetilac ne moze da napise.
 */
export function clientIp(req) {
  const vercel = req.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();

  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const chain = xff.split(',').map((part) => part.trim()).filter(Boolean);
    if (chain.length) return chain[chain.length - 1];
  }

  return 'unknown';
}

/**
 * Fixed window u JEDNOJ izjavi: upsert koji ili resetuje istekao prozor ili inkrementira
 * ziv, pa vrati novi brojac kroz `RETURNING`. Jedan round-trip, isto kao Redis pipeline.
 *
 * Fixed umesto sliding je namerno — sliding trosi vise operacija za dobitak koji na ovom
 * obimu niko ne oseti.
 *
 * @returns {Promise<{ok: boolean, remaining: number, layer: 'db'|'memory'}>}
 */
export async function checkRateLimit(req, bucket) {
  const now = Date.now();
  const key = `rl:${bucket}:${clientIp(req)}`;
  const resetAt = now + WINDOW_SECONDS * 1000;

  const sql = getSql();
  if (sql) {
    try {
      /**
       * ⚠️ `ON CONFLICT (key)` sa zagradama — Postgres trazi conflict target u zagradama,
       * SQLite ga je primao i bez njih. Postojeci red se i dalje adresira imenom tabele
       * (`rate_limit.count`), sto u Postgresu znaci STARU vrednost; predlozeni red bi bio
       * `excluded`. To je isto znacenje koje je izraz imao na D1.
       *
       * ⚠️ `::bigint` na oba mesta gde ide vreme. `reset_at` je epoch u milisekundama i
       * kolona je `bigint`; bez izricitog casta Postgres tip parametra izvodi, a pogresno
       * izveden `integer` bi na ovoj vrednosti pukao na overflow-u.
       */
      const rows = await sql`
        INSERT INTO rate_limit (key, count, reset_at)
        VALUES (${key}, 1, ${resetAt}::bigint)
        ON CONFLICT (key) DO UPDATE SET
          count    = CASE WHEN rate_limit.reset_at <= ${now}::bigint THEN 1 ELSE rate_limit.count + 1 END,
          reset_at = CASE WHEN rate_limit.reset_at <= ${now}::bigint THEN ${resetAt}::bigint ELSE rate_limit.reset_at END
        RETURNING count`;

      const count = rows?.[0]?.count;
      if (typeof count === 'number') {
        await sweepDb(sql, now);
        return { ok: count <= LIMIT, remaining: Math.max(0, LIMIT - count), layer: 'db' };
      }
      throw new Error(`RETURNING dao ${typeof count}, ocekivan broj`);
    } catch (error) {
      console.warn('[rate-limit] Baza nedostupna — prelazim na in-memory sloj.', {
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
 * uvesti bez povlacenja drajvera baze u klijentski bundle.
 *
 * Re-export postoji da rute i testovi prenesene iz MAIN-a nastave da uvoze odavde,
 * neizmenjeni. Jedan izvor, dva ulaza.
 */
export { HONEYPOT_FIELD, isHoneypotTripped } from './honeypot.js';

// Ciscenje test stanja — vitest ne deli instancu izmedju fajlova, ali deli unutar fajla.
// ⚠️ `d1Broken` je otpao sa D1 putanjom: `getSql()` cita `DATABASE_URL` na svaki poziv i
// nema zapamceno stanje kvara koje bi trebalo resetovati.
export function __resetMemoryForTests() {
  memory.clear();
}
