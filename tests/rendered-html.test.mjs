import assert from 'node:assert/strict';
import test from 'node:test';
// ⚠️ UVOZ, NE PREKUCAN SPISAK. `lib/routes.js` je jedini izvor istine za staticke rute — isti
// koji `scripts/verify-nojs.mjs:24` vec uvozi. Prekucan spisak bi BROJAO umesto da POREDI.
import { PAGE_PATHS } from '../lib/routes.js';
import { allPostSlugs } from '../lib/posts.js';

/**
 * ⚠️ PREPISAN TRANSPORT, ISTE TVRDNJE. Do prelaska na Vercel je ovaj fajl uvozio
 * `../dist/server/index.js` i zvao `worker.fetch(request, env, ctx)` direktno. Taj artefakt
 * je bio Cloudflare Worker bundle i na Vercelu ne postoji — pa bi fajl ili nestao ili
 * prestao da meri bilo sta.
 *
 * Umesto toga meri se preko HTTP-a, protiv POKRENUTOG servera. To je i tacnije nego ranije:
 * `x-robots-tag` i CSP sada dolaze iz `headers()` u `next.config.ts`, a 403 na cross-origin
 * POST iz `proxy.ts` — nijedno se ne bi videlo da se modul uvozi mimo lanca.
 *
 * Upotreba (server mora vec da radi):
 *   npm run build && npm start
 *   npm run test:rendered
 *   VERIFY_PORT=3001 node --test tests/rendered-html.test.mjs
 *   VERIFY_BASE=https://primer.vercel.app node --test tests/rendered-html.test.mjs
 *
 * ⚠️ NE koristiti `-- --port` / `-- --base`: `node --test` te argumente ne prosledjuje
 * fajlu, pa bi merenje tiho islo na difolt umesto na trazenu metu.
 */
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

const get = (path, init) => fetch(BASE + path, { redirect: 'manual', ...init });

/* ══ G1 (2026-09-09) — kapija za `data-wipe` placement i census pokreta ═══════════════════
 *
 * ZASTO POSTOJI. `clip-path` razlicit od `none` pravi containing block za `position:fixed`
 * I `position:absolute` potomke. Sajt ima cetiri takva elementa: `.mobar`, `.consent-bar`,
 * `.route-loading`, `.skip-link`. Zato `[data-wipe]` sme ISKLJUCIVO na listne tekstualne
 * elemente. Do ovog batcha je to ograniceje zivelo na tri mesta i sva tri su bila KOMENTAR:
 * `app/globals.css:908`, `docs/MOTION.md:332`, `LESSONS` L17. Nijedna kapija ga nije sprovodila.
 *
 * ZASTO RENDEROVAN HTML, A NE GREP PO IZVORU. Izmereno pri planiranju G1: `grep -o data-reveal`
 * nad `CinematicHome.tsx` vraca 7, a zivih atributa ima 6 — sedmi je pomen u komentaru. Isto za
 * `data-stagger` (6 -> 4) i `data-line` (4 -> 3). Provera po izvoru bi lagala na prvom
 * pokretanju. Renderovan HTML nema JSX komentare.
 *
 * ⚠️ L18 — PROVERA KOJA PRIJAVI DEFEKT MOZE BITI POKVARENA SAMA. U `M1` je grep tri puta
 * prijavio problem kojeg nema. Zato ove funkcije imaju SOPSTVENI fixture test nize, koji ih
 * gura kroz poznate ulaze bez servera. */

/** `<script>`, `<style>` i HTML komentari izlaze iz igre PRE tokenizacije. RSC flight payload
 *  nosi propove kao JSON (`\"data-wipe\":true`) i JS ume da sadrzi `i<b.length` — nista od toga
 *  nije markup, ali ume da lici na njega. Jeftinije je iseci nego dokazivati da ne smeta. */
const stripInert = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

/** ⚠️ Alternacija `"[^"]*"|'[^']*'` guta navodnike KAO CELINU — zato `>` unutar vrednosti
 *  (`aria-label="a > b"`) ne prekida tag. Naivni `[^>]*` bi tu pukao. */
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;

const tokenize = (html) => [...stripInert(html).matchAll(TAG)].map((m) => ({
  close: m[1] === '/',
  tag: m[2].toLowerCase(),
  blob: m[3],
  selfClosing: /\/\s*$/.test(m[3]),
  raw: m[0],
}));

/** Imena atributa BEZ vrednosti. ⚠️ Vrednosti se seku prve: `class="a data-wipe "` bi inace
 *  proslo kao atribut. Poredi se SKUP, ne podstring — `data-wipeout` nije `data-wipe`. */
const attrNames = (blob) => blob
  .replace(/=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/g, ' ')
  .replace(/\/\s*$/, ' ')
  .trim().toLowerCase().split(/\s+/).filter(Boolean);

const hasAttr = (blob, attr) => attrNames(blob).includes(attr);
const openTagsWith = (html, attr) => tokenize(html).filter((t) => !t.close && hasAttr(t.blob, attr));

/** Tokeni koji su POTOMCI tokena `i`, kroz brojac dubine nad istim imenom taga.
 *  ⚠️ Ugnezden isti tag (`<span><span/></span>`) lomi naivni rez do prvog `</span>`.
 *  ⚠️ Void elementi nemaju close tag; ovo se zove samo nad `WIPE_ALLOWED`, gde ih nema. */
const descendantsOf = (toks, i) => {
  const { tag } = toks[i];
  let depth = 1;
  const out = [];
  for (let j = i + 1; j < toks.length; j += 1) {
    const t = toks[j];
    if (t.tag === tag) {
      if (t.close) { depth -= 1; if (depth === 0) return out; continue; }
      if (!t.selfClosing) depth += 1;
    }
    out.push(t);
  }
  return out;
};

/** Listni tekstualni elementi. ⚠️ ALLOWLIST, ne denylist: ROADMAP imenuje `section`/`main`/`body`,
 *  ali `<div data-wipe>` oko celog podstabla je ISTI defekt i denylist bi ga pustio. Pad ovde je
 *  DECISION POINT — ako `M2` legitimno trazi nov tag, dopisuje se u istom batchu. */
const WIPE_ALLOWED = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'dt', 'dd', 'strong', 'em', 'a']);

/** Rute nad kojima rade tvrdnje A i B (G2, 2026-09-09).
 *
 * ⚠️ ZASTO SE OVAJ SPISAK PROSIRIO SA 10 NA 14. `G1` je merio samo `PAGE_PATHS`. Nezavisan
 * pregled `M2` plana je izmerio da `<PageShell>` ima 11 poziva i renderuje 13 povrsina:
 * devet podstranica, `/404` (`app/not-found.tsx`) i tri clanka (`[slug]/page.tsx`). Cetiri od
 * njih nijedna kapija nije gledala — a `M2` menja bas `PageShell`, dakle sve njih odjednom.
 * `scripts/verify-nojs.mjs` je taj obuhvat imao od pocetka; `G1` je jedini ostao na uzem spisku.
 *
 * ⚠️ IZVODI SE, NE PREKUCAVA. Cetvrti clanak ne trazi izmenu ove kapije. Isti razlog koji
 * `lib/routes.js` navodi u svom zaglavlju: provera koja BROJI ne vidi ono cega nema.
 *
 * ⚠️ `/missing-page` VRACA 404, I TO JE NAMERNO. `app/not-found.tsx` renderuje `PageShell` kao
 * i svaka druga stranica, pa isti motion atributi stizu i tamo. Tvrdnje A i B rade nad TELOM
 * odgovora, status im je nebitan. Ko ovo kasnije bude „popravljao" izbacivanjem 404 — vraca
 * rupu koju je `G2` zatvorio. */
const GATED_ROUTES = [
  ...PAGE_PATHS,
  ...allPostSlugs().map((slug) => '/truckers-lounge/' + slug),
  '/missing-page',
];

// Obuhvat se ISPISUJE, iz istog razloga iz kog se ispisuje i meta merenja: da „PASS" nikad ne
// znaci „merio sam manje nego sto mislis".
console.log(`G1/A i G1/B mere ${GATED_ROUTES.length} ruta`);

test('server odgovara pre nego sto ostali testovi krenu', async () => {
  try {
    await get('/');
  } catch (error) {
    assert.fail(
      `Nema servera na ${BASE}. Pokreni \`npm run build && npm start\` pa ponovo. (${error?.message})`,
    );
  }
});

test('production responses carry preview and security policy', async () => {
  for (const path of ['/', '/about', '/faq', '/apply', '/privacy', '/truckers-lounge', '/missing-page']) {
    const r = await get(path);
    assert.equal(r.status, path === '/missing-page' ? 404 : 200);
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.ok(r.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    assert.ok(!r.headers.get('content-security-policy').includes('unsafe-eval'));
    const html = await r.text();
    assert.ok(!html.includes('codex-preview'));
    if (path !== '/missing-page') assert.ok(html.includes(BASE + path));
  }
});
test('preview robots denies crawling and sitemap excludes public URLs', async () => {
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Disallow: \/\s/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.ok(!(await sitemap.text()).includes('<loc>'));
});
test('proxy rejects a cross-origin submission before reaching delivery', async () => {
  const r = await get('/api/apply', { method: 'POST', headers: { Origin: 'https://evil.example' } });
  assert.equal(r.status, 403);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  // ⚠️ Odgovor koji nastane u proxy-ju ne prolazi kroz `headers()` iz next.config.ts.
  // Zato `proxy.ts` sam pecati politiku — ovo je provera da to i dalje radi.
  assert.ok(r.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
  assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
});
test('FAQ schema matches visible questions, no fabricated jobs', async () => {
  const html = await (await get('/faq')).text();
  assert.ok(html.includes('FAQPage'));
  assert.ok(!html.includes('JobPosting'));
  assert.ok(!html.includes('AggregateRating'));
});

test('homepage includes the full story, navigation and a real application path in server HTML', async () => {
  const response = await get('/');
  const html = await response.text();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  for (const text of ['Your next route.', 'Partner carriers.', 'Cost to drivers.', 'get-started', '/for-carriers', '/about', '/truckers-lounge']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('cdn.jsdelivr.net'));
  assert.ok(!html.includes('verified carriers'));
  assert.ok(!html.includes('+10000000000'));
  assert.ok(html.includes('method="post"'));
  assert.ok(html.includes('The online form needs JavaScript.'));
  assert.ok(!response.headers.get('content-security-policy').includes('jsdelivr'));
});
test('contact forms have a no-JS contact alternative and never fall back to GET submission', async () => {
  for (const path of ['/apply','/for-carriers','/contact']) {
    const html = await (await get(path)).text();
    assert.ok(html.includes('The online form needs JavaScript.'), path);
    assert.ok(html.includes('method="post"'), path);
  }
});

test('unknown articles render a complete accessible 404, not a bare text response', async () => {
  const response = await get('/truckers-lounge/unknown-article');
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /Wrong exit/);
  assert.match(html, /id="main-content"/);
  assert.ok(html.includes('href="/apply"'));
});
test('article metadata is concise, specific and does not inherit the generic social image', async () => {
  const { POSTS } = await import('../lib/posts.js');
  for (const post of POSTS) {
    const html = await (await get('/truckers-lounge/' + post.slug)).text();
    assert.match(html, /property="og:type" content="article"/);
    assert.ok(!html.includes('property="og:image"'));
    assert.ok(post.description.length <= 180);
    assert.ok(html.includes(post.modified));
  }
});

/* ══ G1 — tri tvrdnje o pokretu ═══════════════════════════════════════════════════════════ */

/** ⚠️ KAPIJA KOJA PROVERAVA SAMU SEBE (L18). Ne trazi server. Svaki slucaj ispod je greska koju
 *  je neko vec napravio ili koju bi naivna verzija propustila. Ako ovaj test padne, sve ostalo
 *  ispod njega je bezvredno — prvo se popravlja provera, pa tek onda gleda nalaz. */
test('G1 fixture — parser vidi tacno ono sto tvrdi da vidi', () => {
  const wipes = (html) => openTagsWith(html, 'data-wipe').map((t) => t.tag);

  // Osnovni tacan slucaj.
  assert.deepEqual(wipes('<h3 data-wipe>Pay</h3>'), ['h3']);
  // Atribut NIJE prvi. ⚠️ Oba oblika su stvarna: JSX `data-wipe` bez vrednosti stize kao
  // `data-wipe="true"` (izmereno na deploy-u u G1), a `=""` daje rucno pisan markup.
  assert.deepEqual(wipes('<section class="x" data-wipe="">t</section>'), ['section']);
  assert.deepEqual(wipes('<section data-reveal="true" data-wipe="true" class="x">t</section>'), ['section']);
  // Prefiks kolizija — isti obrazac koji je u `M1` tri puta dao lazan nalaz.
  assert.deepEqual(wipes('<div data-wipeout></div>'), []);
  // Atribut kao VREDNOST, ne kao atribut.
  assert.deepEqual(wipes('<p aria-label="data-wipe">t</p>'), []);
  assert.deepEqual(wipes('<p class="a data-wipe ">t</p>'), []);
  // `>` unutar vrednosti ne sme prekinuti tag.
  assert.deepEqual(wipes('<h3 aria-label="a > b" data-wipe>t</h3>'), ['h3']);
  // Skripta i komentar nisu markup.
  assert.deepEqual(wipes('<script>var a="<h3 data-wipe>"</script>'), []);
  assert.deepEqual(wipes('<!-- <h3 data-wipe> -->'), []);

  // Ugnezden ISTI tag lomi naivni rez do prvog close-taga.
  const nested = '<span data-wipe><span>x</span><span data-line>y</span></span>';
  const toks = tokenize(nested);
  const i = toks.findIndex((t) => !t.close && hasAttr(t.blob, 'data-wipe'));
  assert.ok(descendantsOf(toks, i).some((t) => hasAttr(t.blob, 'data-line')), 'B mora videti ugnezden data-line');

  // Jedini ISPRAVAN raspored (L17): linija na kontejneru, wipe na tekstu unutar njega.
  const ok = '<li data-line><span class="value-num">01</span><h3 data-wipe>Pay</h3></li>';
  const t2 = tokenize(ok);
  const j = t2.findIndex((t) => !t.close && hasAttr(t.blob, 'data-wipe'));
  assert.ok(!descendantsOf(t2, j).some((t) => hasAttr(t.blob, 'data-line')), 'B ne sme pasti na ispravnom rasporedu');
});

/** A — `data-wipe` iskljucivo na listnim tekstualnim elementima, na SVIM rutama iz
 *  `GATED_ROUTES` (14 od `G2`). Kapija koja gleda samo `/` ne bi videla `M2` prekrsaj, a to
 *  joj je jedina svrha. */
test('G1/A — data-wipe nikad na elementu koji moze da sadrzi fixed potomka', async () => {
  for (const path of GATED_ROUTES) {
    const html = await (await get(path)).text();
    for (const t of openTagsWith(html, 'data-wipe')) {
      assert.ok(
        WIPE_ALLOWED.has(t.tag),
        `${path}: <${t.tag}> nosi data-wipe, a nije listni tekstualni element.\n`
        + `  ${t.raw}\n`
        + '  `clip-path != none` pravi containing block za position:fixed I position:absolute\n'
        + '  potomke (.mobar, .consent-bar, .route-loading, .skip-link). Vidi app/globals.css:908.\n'
        + `  Dozvoljeno: ${[...WIPE_ALLOWED].join(', ')}`,
      );
    }
  }
});

/** B — `LESSONS` L17 pravilo 2. Clip guta pseudo-element, pa linija ne moze da vodi.
 *  ⚠️ Preskace tagove van allowliste: njih je A vec prijavio, a void element bez close-taga
 *  bi ovde dao lazan pozitiv (dubina se nikad ne vrati na nulu). */
test('G1/B — data-line nikad unutar data-wipe elementa', async () => {
  for (const path of GATED_ROUTES) {
    const html = await (await get(path)).text();
    const toks = tokenize(html);
    for (let i = 0; i < toks.length; i += 1) {
      const t = toks[i];
      if (t.close || !hasAttr(t.blob, 'data-wipe') || !WIPE_ALLOWED.has(t.tag)) continue;
      const inner = descendantsOf(toks, i).find((d) => !d.close && hasAttr(d.blob, 'data-line'));
      assert.ok(
        !inner,
        `${path}: <${inner?.tag}> sa data-line stoji UNUTAR <${t.tag} data-wipe>.\n`
        + `  ${t.raw} ... ${inner?.raw}\n`
        + '  Clip guta pseudo-element, pa linija ne moze da vodi (LESSONS L17, pravilo 2).\n'
        + '  Ispravan raspored: linija na kontejneru, wipe na tekstu unutar njega.',
      );
    }
  }
});

/** C — census. ⚠️ TRIPWIRE, NE DEKORACIJA. Promena ovih brojeva je legitimna, ali ide u ISTOM
 *  batchu koji menja markup — nikad kao zaseban „fix testa".
 *
 *  ⚠️ `data-beat` (hero) se NE broji: vozi ga `HeroExperience.tsx`, nije iz recnika pokreta.
 *  Census pokriva tacno ono sto `Motion.tsx:76` posmatra — taj red je izvor istine za spisak
 *  ispod, koji je ovde nuzno dupliran. */
test('G1/C — census motion atributa na naslovnoj', async () => {
  const html = await (await get('/')).text();
  /* ⚠️ BROJEVI POMERENI U `M2b` (2026-09-09), U ISTOM BATCHU KOJI JE PROMENIO MARKUP.
   *  `6/4/3/3` -> `0/4/9/9`. Sest sekcija naslovne je preslo sa `data-reveal` na par
   *  `CRTA` + `OTKRIVANJE`, pa je fade-up nestao a linija i wipe dosli na njegovo mesto.
   *
   *  ⚠️ `data-reveal` je sada 0 NA CELOM SAJTU, ne samo ovde. Nula NIJE greska i ne znaci
   *  „obrisi tvrdnju" — dok primitiv postoji u `globals.css` i u `Motion.tsx:76`, ovaj red
   *  je jedino sto ce primetiti ako se negde tiho vrati.
   *
   *  ⚠️ FALSIFIKOVANO PO ATRIBUTU, NE ODJEDNOM (`LESSONS` L19). Sva cetiri reda padaju pod
   *  ISTU tvrdnju, a `assert` prekida petlju na prvom — pa bi jedno pokretanje sa sve tri
   *  promene dokazalo samo prvu. Mereno u tri pokretanja: `data-reveal` 0!==6,
   *  `data-wipe` 9!==3, `data-line` 9!==3. Crveni izlazi su u `LOG.md`. */
  const CENSUS = { 'data-reveal': 0, 'data-stagger': 4, 'data-wipe': 9, 'data-line': 9 };
  for (const [attr, expected] of Object.entries(CENSUS)) {
    assert.equal(
      openTagsWith(html, attr).length, expected,
      `/: broj \`${attr}\` se promenio. Ako je izmena namerna, ispravi broj U ISTOM batchu`
      + ' koji menja markup — nikad zasebno.',
    );
  }
});
