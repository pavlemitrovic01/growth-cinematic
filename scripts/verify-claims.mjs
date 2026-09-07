#!/usr/bin/env node
/**
 * verify-claims — sprovodi registar tvrdnji nad RENDEROVANIM HTML-om.
 *
 * ⚠️ ZASTO POSTOJI. `docs/CLAIMS.md` u izvornom projektu je registar koji je tamo sprovodjen
 * rucno, kroz sedam claims batch-eva. Ovaj projekat je copy preneo verbatim, ali `lib/posts.js`
 * je vec jednom prepisan (+202/−143) — a to je bas povrsina na kojoj tvrdnja moze tiho da se
 * vrati. Rucna provera koja se ne ponavlja nije zastita.
 *
 * Meri se RENDEROVAN HTML, ne izvorni kod: tvrdnja moze doci iz podatka (`lib/posts.js`,
 * `lib/faq.js`), iz komponente ili iz metapodataka, a posetilac vidi samo ishod.
 *
 * Sama PRAVILA zive u `scripts/claims-rules.mjs` da bi bila dokaziva testom; ovde je samo
 * merenje. Vidi `__tests__/claims-rules.test.js`.
 *
 * Upotreba:
 *   node scripts/verify-claims.mjs                # protiv servera na :3000
 *   node scripts/verify-claims.mjs --port 5199
 *   node scripts/verify-claims.mjs --base https://primer.vercel.app   # deploy
 *   VERIFY_BASE=https://primer.vercel.app node scripts/verify-claims.mjs
 */
import { PAGE_PATHS } from '../lib/routes.js';
import { POSTS } from '../lib/posts.js';
import { checkPage } from './claims-rules.mjs';

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

/**
 * ⚠️ RUTE SE IZVODE, NE PREKUCAVAJU. Do 2026-09-06 je ovde stajao tvrd spisak od 13 putanja,
 * ukljucujuci tri slug-a clanaka doslovno. Posledica: cetvrti clanak — a `lib/posts.js` je bas
 * povrsina na koju zaglavlje gore upozorava — objavio bi se NEIZMEREN, i kapija bi i dalje
 * prijavljivala PASS. Provera koja broji ne vidi ono cega u njenom spisku nema.
 */
const ROUTES = [
  ...PAGE_PATHS,
  ...POSTS.map((post) => `/truckers-lounge/${post.slug}`),
];

const fails = [];
const notes = [];
const pages = {};

for (const path of ROUTES) {
  try {
    const res = await fetch(BASE + path);
    pages[path] = res.status === 200 ? await res.text() : '';
    if (res.status !== 200) fails.push(`${path} — status ${res.status}`);
  } catch (error) {
    fails.push(`${path} — server nedostupan: ${error.message}`);
  }
}

for (const path of ROUTES) {
  if (!pages[path]) continue;
  const result = checkPage(path, pages[path]);
  fails.push(...result.fails);
  notes.push(...result.notes);
}

for (const n of notes) console.log('  ok  ' + n);
console.log();
if (fails.length) {
  console.error(`FAIL — ${fails.length} nalaza:`);
  for (const f of fails) console.error('  · ' + f);
  process.exit(1);
}
console.log(`PASS — ${ROUTES.length} ruta (${PAGE_PATHS.length} stranica + ${POSTS.length} clanaka), nijedna zabranjena tvrdnja, svaka uslovna hedzovana.`);
