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
 * Upotreba:
 *   node scripts/verify-claims.mjs                # protiv servera na :3000
 *   node scripts/verify-claims.mjs --port 5199
 */

const PORT = (() => {
  const i = process.argv.indexOf('--port');
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : '3000';
})();
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/', '/apply', '/for-carriers', '/how-it-works', '/about', '/faq', '/contact',
  '/privacy', '/terms', '/truckers-lounge',
  '/truckers-lounge/new-cdl-graduate-what-training-provided-actually-means',
  '/truckers-lounge/sap-and-violations-how-the-return-to-duty-process-works',
  '/truckers-lounge/how-to-spot-hidden-costs-before-signing-a-contract',
];

/**
 * ZABRANJENE formulacije. Svaka nosi oznaku reda iz registra i razlog — bez razloga se
 * pravilo posle godinu dana ne moze ni proveriti ni ukloniti.
 */
const PROHIBITED = [
  {
    id: 'C10',
    why: 'proces provere carrier-a nije definisan, pa „vetted/verified" tvrdi nepostojeci postupak',
    re: /vetted|verified carrier/i,
  },
  {
    id: 'C9',
    why: 'founder nikad nije vozio kamion — svaka formulacija koja implicira voznju je trajna zabrana',
    re: /in the seat|behind the wheel|years driving|from the cab|years on the road/i,
  },
  {
    id: 'C19',
    why: 'garancija zarade',
    re: /guarantee[a-z]* (earnings|pay|income)|stable and secure earnings|we promise[^.]{0,30}(earn|pay)/i,
  },
  { id: 'C8', why: 'pokrivenost je 48 kontinentalnih drzava, ne 50', re: /all 50 states/i },
  { id: 'S1', why: 'izmisljen broj plasiranih vozaca', re: /\b\d{2,}\+\s*(drivers|placements) placed|\b70\+\s*drivers/i },
  { id: 'S2', why: 'testimonijal bez izvora', re: /—\s*[A-Z][a-z]+ [A-Z]\.,?\s*(driver|OTR|CDL)/ },
  { id: 'D20', why: 'negativna univerzalna tvrdnja o industriji', re: /scam and cheat|most recruiters lie|everyone in this business/i },
];

/**
 * USLOVNE tvrdnje: smeju da postoje ISKLJUCIVO uz svoj hedz. Gol oblik je zabranjen trajno,
 * jer zavisi od promenljive koju GROWTH ne kontrolise.
 */
const CONDITIONAL = [
  {
    id: 'C11',
    claim: /3[–-]5 days/,
    hedge: /as little as|isn['’]t ready|paperwork, physicals|depends on|own pace/i,
    why: 'vreme do plasmana zavisi od vozacevog papirnog traga',
  },
  {
    id: 'C12',
    claim: /15[–-]20 minutes/,
    hedge: /usually/i,
    hedge2: /business hours/i,
    why: 'vreme odgovora vazi samo u radno vreme i nije zagarantovano',
  },
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

for (const rule of PROHIBITED) {
  const hits = ROUTES.filter((p) => pages[p] && rule.re.test(pages[p]));
  if (hits.length) fails.push(`${rule.id} ZABRANJENO (${rule.why}) — ${hits.join(', ')}`);
}

for (const rule of CONDITIONAL) {
  for (const path of ROUTES) {
    const html = pages[path];
    if (!html || !rule.claim.test(html)) continue;
    const ok = rule.hedge.test(html) && (!rule.hedge2 || rule.hedge2.test(html));
    if (ok) notes.push(`${rule.id} na ${path} — hedz prisutan`);
    else fails.push(`${rule.id} GOL OBLIK (${rule.why}) — ${path}`);
  }
}

for (const n of notes) console.log('  ok  ' + n);
console.log();
if (fails.length) {
  console.error(`FAIL — ${fails.length} nalaza:`);
  for (const f of fails) console.error('  · ' + f);
  process.exit(1);
}
console.log(`PASS — ${ROUTES.length} ruta, nijedna zabranjena tvrdnja, svaka uslovna hedzovana.`);
