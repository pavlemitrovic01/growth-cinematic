#!/usr/bin/env node
/**
 * verify-nojs — dokazuje da je sadrzaj citljiv BEZ JavaScripta, na svakoj ruti.
 *
 * ⚠️ ADAPTIRANO, NE PREPISANO. Izvorni projekat (`C:/dev/growth/scripts/verify-nojs.mjs`)
 * cilja jedan konkretan uzrok: framer-motion pece `initial` stanje u SSR HTML kao obican
 * inline `opacity:0`, koji se bez JS-a nikad ne ponisti. Ovaj projekat nema framer-motion,
 * pa bi doslovan prenos proveravao problem koji ne postoji.
 *
 * Ovde je rizik drugi: hero je 3D scena koja se ucitava dinamicki, a copy oko nje mora
 * postojati i kad se scena nikad ne pokrene (mobilni, reduced-motion, saveData, WebGL pao).
 * Zato skripta meri PRISUSTVO teksta u serverskom HTML-u, a ne odsustvo jednog stila —
 * i uz to i dalje trazi stilove koji sakrivaju, jer su jeftini za proveru.
 *
 * Upotreba:
 *   node scripts/verify-nojs.mjs                # protiv servera na :3000
 *   node scripts/verify-nojs.mjs --port 5199
 *   node scripts/verify-nojs.mjs --base https://primer.vercel.app   # deploy
 *   VERIFY_BASE=https://primer.vercel.app node scripts/verify-nojs.mjs
 *
 * ⚠️ Trazi POKRENUT server (`npm run dev` ili `node scripts/preview.mjs`). Ne pokrece ga
 * sam — pozivalac bira da li meri dev ili build.
 */
import { PAGE_PATHS } from '../lib/routes.js';
import { POSTS } from '../lib/posts.js';
import { EMAIL, HAS_PHONE, PHONE_DISPLAY } from '../lib/contact.js';

/**
 * Origin koji se meri. `--base` gadja bilo koji origin (deploy), `--port` ostaje za localhost.
 *
 * ⚠️ Trazi CIST origin, isto pravilo kao `lib/seo.js:3`. Putanja u base-u bi se udvostrucila
 * pri `BASE + path` — merenje bi gadjalo nepostojece rute, dobijalo 404 i prijavilo PASS
 * ni na cemu. Tiha laz je gora od pada, pa se ovde pada glasno.
 */
const BASE = (() => {
  /**
   * ⚠️ ZASTO ENV, NE SAMO ARGV. `node --test` NE prosledjuje argumente posle `--` test
   * fajlu — `process.argv` u njemu ih ne vidi. Dokazano: sa `-- --port 9999` i sa
   * `-- --base https://nepostojeci` test je i dalje prolazio 9/9, jer je tiho merio
   * difolt `localhost:3000`. Kapija koja meri pogresnu metu a prijavi PASS je gora od
   * kapije koja padne. `VERIFY_BASE` prolazi u child proces i radi u oba slucaja.
   */
  const raw0 = process.env.VERIFY_BASE || (() => {
    const b = process.argv.indexOf('--base');
    return b !== -1 && process.argv[b + 1] ? process.argv[b + 1] : null;
  })();
  if (!raw0) {
    const p = process.argv.indexOf('--port');
    const port = process.env.VERIFY_PORT || (p !== -1 && process.argv[p + 1] ? process.argv[p + 1] : '3000');
    return `http://localhost:${port}`;
  }
  const raw = raw0.replace(/\/$/, '');
  let origin;
  try {
    origin = new URL(raw);
  } catch {
    throw new Error(`base nije URL: ${raw} (ocekivano npr. https://primer.vercel.app)`);
  }
  if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error(`base mora biti cist origin bez putanje: ${raw}`);
  }
  return raw;
})();

// Meta merenja se ISPISUJE — da se nikad vise ne desi da PASS znaci "merio sam nesto drugo".
console.log(`meri se: ${BASE}`);

/** Minimum teksta koji ruta mora imati u serverskom HTML-u, i markeri koji moraju postojati. */
const ROUTES = [
  { path: '/', min: 1500, needs: ['Straight answers', 'partner carriers', 'Apply'] },
  { path: '/apply', min: 900, needs: ['Class A', 'Consent is not a condition', 'company_website'] },
  { path: '/for-carriers', min: 700, needs: ['Consent is not a condition', 'company_website'] },
  { path: '/how-it-works', min: 1200, needs: ['One honest caveat', 'as little as 3'] },
  { path: '/about', min: 900, needs: ['Nate Mikic'] },
  // ⚠️ Bez doslovnog markera. Prva verzija je trazila frazu prepisanu iz izvornog projekta i
  // pala je cim je FAQ legitimno prepisan — provera koja puca na tacnu izmenu teksta meri
  // pogresnu stvar. Umesto toga se dole proverava da je SVAKI odgovor iz `lib/faq.js`
  // prisutan u serverskom HTML-u; to je ono sto no-JS ugovor stvarno trazi, i prati sadrzaj samo.
  { path: '/faq', min: 2000, needs: [], everyFaqAnswer: true },
  { path: '/contact', min: 500, needs: ['Consent is not a condition'] },
  { path: '/privacy', min: 2000, needs: ['Where Your Information Is Stored', 'Telephone Consumer Protection Act'] },
  { path: '/terms', min: 900, needs: ['not a motor carrier'] },
  { path: '/truckers-lounge', min: 500, needs: ['Truckers'] },
  /**
   * ⚠️ CLANCI SE IZVODE IZ `POSTS`, NE PREKUCAVAJU. Do 2026-09-06 ova kapija clanke nije
   * merila UOPSTE — spisak je imao 11 tvrdih ruta, a `lib/posts.js` je bas povrsina koja je
   * vec jednom prepisana. Cetvrti clanak bi se objavio bez ijedne provere no-JS ugovora.
   *
   * Prag je IZMEREN protiv deploy-a 2026-09-06 (6362 / 4362 / 3420 znakova), ne izabran:
   * 2500 hvata slomljen render, a ne pada na obicnom skracivanju copy-ja.
   */
  ...POSTS.map((post) => ({ path: `/truckers-lounge/${post.slug}`, min: 2500, needs: [], postTitle: post.title })),
  { path: '/nepostojeca-ruta-za-proveru', min: 200, needs: ['Wrong exit'], status: 404 },
];

/**
 * ⚠️ POREDI SA IZVOROM, NE BROJI. Spisak gore ostaje rucni jer svaka ruta nosi svoj prag i
 * svoje markere — ali sme da bude rucni samo ako se DOKAZE da pokriva sve staticke rute.
 * Bez ovoga bi nova stranica koju niko ne dopise ostala nemerena, a kapija bi i dalje
 * prijavljivala PASS. Isti obrazac koji je zatvoren u `verify-claims.mjs` i `app/sitemap.ts`.
 */
const uncovered = PAGE_PATHS.filter((path) => !ROUTES.some((route) => route.path === path));
if (uncovered.length) {
  console.error(`FAIL — ${uncovered.length} ruta iz lib/routes.js nije u spisku ove kapije: ${uncovered.join(', ')}`);
  process.exit(1);
}

/**
 * Kontakt mora biti dohvatljiv sa SVAKE rute — bez JS-a je to jedini izlaz.
 *
 * ⚠️ TTI1 (2026-09-23): telefon je prazan dok ga Pavle ne posalje (`lib/contact.js`), pa je dohvatljiv
 * kontakt tada MEJL. Izvodi se iz izvora: kad broj stigne, kapija sama ponovo trazi telefon.
 */
const CONTACT = HAS_PHONE ? PHONE_DISPLAY : EMAIL;

/**
 * TTI1: staro ime ne sme da se pojavi nigde u serverskom HTML-u (tekst, meta, JSON-LD). Velika slova su
 * namerna: interni kljucevi (`growth.consent`) i porodica fonta „Growth Sans" se posetiocu ne prikazuju.
 */
const LEGACY_BRAND = /GROWTH|Capljinac|growthcdl|corecruitinggroup/;

/** Inline stilovi koji sadrzaj cine nevidljivim ili ga izbacuju iz kadra. */
const HIDING = [
  { name: 'opacity:0', re: /style="[^"]*opacity\s*:\s*0(?!\.)/ },
  { name: 'display:none', re: /style="[^"]*display\s*:\s*none/ },
  { name: 'visibility:hidden', re: /style="[^"]*visibility\s*:\s*hidden/ },
];

/**
 * Elementi koji SMEJU startovati skriveni — imenovani, ne pretpostavljeni.
 * Svaki izuzetak nosi razlog; „ne izgleda kao problem" nije razlog.
 */
const ALLOWED_HIDDEN = [
  // Honeypot je van ekrana po dizajnu (SEC2). Ne koristi display:none bas zato sto
  // deo botova takva polja preskace; pozicioniran je van kadra kroz klasu, ne inline.
  'company_website',
];

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const fails = [];
const rows = [];

for (const route of ROUTES) {
  const expected = route.status ?? 200;
  let res, html;
  try {
    res = await fetch(BASE + route.path);
    html = await res.text();
  } catch (error) {
    fails.push(`${route.path} — server nedostupan: ${error.message}`);
    continue;
  }

  if (res.status !== expected) fails.push(`${route.path} — status ${res.status}, ocekivan ${expected}`);

  const text = textOf(html);
  if (text.length < route.min) {
    fails.push(`${route.path} — samo ${text.length} znakova teksta, minimum ${route.min}`);
  }

  for (const marker of route.needs) {
    if (!html.includes(marker)) fails.push(`${route.path} — nedostaje marker: "${marker}"`);
  }

  // Sklopljen `<details>` drzi odgovor u DOM-u, pa mora biti u serverskom HTML-u — i za
  // pretragu i za citac ekrana. Odgovori se citaju iz `lib/faq.js`, pa provera prati sadrzaj.
  if (route.everyFaqAnswer) {
    const { FAQ_ITEMS } = await import('../lib/faq.js');
    const missing = FAQ_ITEMS.filter((item) => !textOf(html).includes(textOf(item.a).slice(0, 60)));
    if (missing.length) {
      fails.push(`${route.path} — ${missing.length}/${FAQ_ITEMS.length} FAQ odgovora nije u HTML-u: ${missing.map((m) => m.id).join(', ')}`);
    }
  }

  // Naslov clanka mora biti u serverskom HTML-u. Poredi se kroz `textOf` na obe strane, jer
  // naslovi nose tipografske navodnike koje bi doslovno `includes` uporedjivanje promasilo.
  if (route.postTitle && !text.includes(textOf(route.postTitle))) {
    fails.push(`${route.path} — naslov clanka nije u serverskom HTML-u`);
  }

  if (!html.includes(CONTACT)) fails.push(`${route.path} — kontakt (${CONTACT}) nije dohvatljiv bez JS-a`);
  const legacy = html.match(LEGACY_BRAND);
  if (legacy) fails.push(`${route.path} — staro ime u HTML-u: "${legacy[0]}"`);
  // Bez broja ne sme da postoji nijedan `tel:`/`sms:` link — prazan link je gori od nikakvog.
  if (!HAS_PHONE && /href="(tel|sms):/.test(html)) fails.push(`${route.path} — tel:/sms: link bez telefona`);
  // ...i nijedna recenica ne sme da salje posetioca da zove broj koji ne postoji (TTI1, nadjeno na snimku /contact).
  const callCopy = !HAS_PHONE && text.match(/\b(call or text|call us|or call|text us)\b/i);
  if (callCopy) fails.push(`${route.path} — tekst trazi poziv bez telefona: "${callCopy[0]}"`);

  for (const rule of HIDING) {
    const hits = html.match(new RegExp(rule.re.source, 'g')) ?? [];
    const unexplained = hits.filter((hit) => !ALLOWED_HIDDEN.some((ok) => {
      const at = html.indexOf(hit);
      return html.slice(Math.max(0, at - 300), at + 300).includes(ok);
    }));
    if (unexplained.length) {
      fails.push(`${route.path} — ${unexplained.length}x ${rule.name} bez obrazlozenja`);
    }
  }

  rows.push([route.path, String(res.status), String(text.length)]);
}

const width = Math.max(...rows.map((r) => r[0].length), 6);
console.log('ruta'.padEnd(width), 'st   znakova');
for (const [p, s, n] of rows) console.log(p.padEnd(width), s.padEnd(4), n.padStart(6));

console.log();
if (fails.length) {
  console.error(`FAIL — ${fails.length} nalaza:`);
  for (const f of fails) console.error('  · ' + f);
  process.exit(1);
}
console.log(`PASS — ${rows.length} ruta, sadrzaj i kontakt dostupni bez JavaScripta.`);
