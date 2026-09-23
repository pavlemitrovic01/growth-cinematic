import assert from 'node:assert/strict';
import test from 'node:test';
// ⚠️ UVOZ, NE PREKUCAN SPISAK. `lib/routes.js` je jedini izvor istine za staticke rute — isti
// koji `scripts/verify-nojs.mjs:24` vec uvozi. Prekucan spisak bi BROJAO umesto da POREDI.
import { PAGE_PATHS } from '../lib/routes.js';
import { allPostSlugs } from '../lib/posts.js';
import { FAQ_ITEMS, homeFaqItems } from '../lib/faq.js';

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
  // TTI1: „Partner carriers." i „Cost to drivers." su bili poglavlja 3D scene i otisli su sa njom; `$0` nosi sekcija naplate.
  for (const text of ['Your next route.', 'partner carriers', 'How we get paid.', 'get-started', '/for-carriers', '/about', '/truckers-lounge']) assert.ok(html.includes(text), text);
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
 *  ⚠️ TTI1 (2026-09-23): `Motion.tsx` je uklonjen, pa atributi vise nista ne pokrecu -- census ostaje kao
 *  tripwire nad markupom naslovne dok se atributi ne obrisu zasebnim poslom.
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

/* ── U1 — struktura FAQ-a ─────────────────────────────────────────────────────────────────
 *
 * ⚠️ TRI ODVOJENA `test()` BLOKA, NAMERNO. `node:test` ih izoluje, pa svaka tvrdnja nosi svoje
 * crveno. Tri `assert`-a u jednom bloku prekinula bi izvrsavanje na prvom, pa bi falsifikacija
 * dokazala samo njega (`LESSONS` L19).
 *
 * ⚠️ Pitanja i sidra se UVOZE iz `lib/faq.js`, ne prekucavaju — isti razlog zbog kog
 * `GATED_ROUTES` izvodi rute umesto da ih nabraja. Prekucan spisak bi BROJAO umesto da POREDI.
 */

/** Prvi OTVOREN tag unutar svakog `<summary>`-ja. Od `U1` tu stoji naslov pitanja. */
const summaryFirstChildTags = (html) => {
  const toks = tokenize(html);
  const out = [];
  toks.forEach((t, i) => {
    if (t.close || t.tag !== 'summary') return;
    const next = toks.slice(i + 1).find((x) => !x.close);
    out.push(next ? next.tag : null);
  });
  return out;
};

/** VREDNOST atributa, bez regexa.
 *  ⚠️ Trazi se ` ime="` SA RAZMAKOM ISPRED, da `xclass=` ne prodje kao `class=` — ista zamka
 *  koju `attrNames` resava za imena.
 *  ⚠️ PRVA VERZIJA JE BILA POKVARENA: regex sklopljen u template literalu izgubio je nivo
 *  escape-ovanja, pa je `\b` postao znak backspace a `\s` slovo `s`. Provera nije mogla da
 *  matchuje nista i prijavila je da sidara nema — iako su bila u HTML-u (`LESSONS` L18). */
const attrValue = (blob, attr) => {
  const needle = ' ' + attr.toLowerCase() + '="';
  const at = (' ' + blob.toLowerCase()).indexOf(needle);
  if (at === -1) return null;
  const start = at + needle.length - 1;
  const end = blob.indexOf('"', start);
  return end === -1 ? null : blob.slice(start, end);
};

/** React escape-uje tekstualnu decu; schema ide kroz `dangerouslySetInnerHTML` i ne escape-uje. */
const decodeText = (s) => s
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const faqSchemaQuestions = (html) => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage');
  return faq ? faq.mainEntity.map((q) => q.name) : [];
};

test('U1/A — svako pitanje na /faq je naslov nivoa 2', async () => {
  const html = await (await get('/faq')).text();
  const heads = summaryFirstChildTags(html);
  assert.equal(heads.length, FAQ_ITEMS.length, `/faq: ocekivano ${FAQ_ITEMS.length} pitanja iz \`lib/faq.js\``);
  const wrong = heads.filter((tag) => tag !== 'h2');
  assert.equal(
    wrong.length, 0,
    `/faq: ${wrong.length} pitanja nije \`h2\` (naslo: ${[...new Set(wrong)].join(', ') || 'bez naslova'}).`
    + ' Do `U1` ih nije bilo nijedan, pa je stranica imala samo `h1` i tri `h2` iz futera.',
  );
});

test('U1/B — svako pitanje na /faq nosi svoje sidro', async () => {
  const html = await (await get('/faq')).text();
  const ids = tokenize(html)
    .filter((t) => !t.close && t.tag === 'details' && (attrValue(t.blob, 'class') || '').includes('faq-item'))
    .map((t) => attrValue(t.blob, 'id'));
  assert.deepEqual(ids, FAQ_ITEMS.map((item) => item.id), '/faq: sidra pitanja se ne poklapaju sa `lib/faq.js`');
});

/* ⚠️ ZASEBAN BLOK, NE DRUGI `assert` U `U1/B` (`LESSONS` L19). Da stoji uz sidra, prvi `assert`
 *  bi prekidao blok i ova tvrdnja se NIKAD ne bi mogla dokazati crvenom — a upravo je ona
 *  razlog zbog kog test postoji.
 *
 * ⚠️ Postojeci test `FAQ schema matches visible questions` je do `U1` proveravao SAMO da rec
 *  `FAQPage` postoji u HTML-u; vidljiva pitanja nije pogledao nikad, pa je ime tvrdilo vise nego
 *  sto je merilo (`LESSONS` L20). Ovde se stvarno porede — mehanizam kojim se u MAIN-u lazna
 *  tvrdnja uvukla samo na jedno od dva mesta je bas razlazenje dve kopije istih pitanja. */
test('U1/D — schema pita tacno ona pitanja koja se vide na /faq', async () => {
  const html = await (await get('/faq')).text();
  const visible = [...html.matchAll(/<summary[^>]*>\s*<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
    .map((m) => decodeText(m[1]).trim());
  assert.equal(visible.length, FAQ_ITEMS.length, '/faq: parser nije nasao sva pitanja u markup-u');
  assert.deepEqual(visible, faqSchemaQuestions(html), '/faq: schema i vidljiva pitanja se razilaze');
});

test('U1/C — pitanja na naslovnoj su `h3`, ne `h2`', async () => {
  const html = await (await get('/')).text();
  const heads = summaryFirstChildTags(html);
  assert.equal(heads.length, homeFaqItems().length, 'naslovna: broj pitanja se ne poklapa sa `homeFaqItems()`');
  const wrong = heads.filter((tag) => tag !== 'h3');
  assert.equal(
    wrong.length, 0,
    `naslovna: ${wrong.length} pitanja nije \`h3\` (naslo: ${[...new Set(wrong)].join(', ') || 'bez naslova'}).`
    + ' Sekcija vec nosi `<h2 id="faq-heading">`, pa bi `h2` preskocio nivo.',
  );
});

/* ══ T1 (2026-09-14) — Arial svuda, Arimo samo gde Arial-a nema ════════════════════════════
 *
 * ZASTO POSTOJI. Android u `fonts.xml` ima `<alias name="arial" to="sans-serif" />`, pa Arimo koji
 * samo stoji iza Arial-a u listi fontova ume da se nikad ne ucita. Zato "Growth Sans" prvo trazi
 * INSTALIRAN Arial (`local()`), a tek onda preuzima Arimo (`url()`). Sva tri kvara su tiha na
 * desktopu: bez `local()` desktop preuzima i crta Arimo umesto Arial-a; bez fajla na koji `url()`
 * pokazuje Android ostaje na svom pismu; sa `preload`-om svako preuzima font koji mu ne treba.
 *
 * ZASTO SERVIRAN CSS, A NE `globals.css`. Build prepisuje i minifikuje CSS (navodnici, `url()`),
 * pa se meri ono sto browser stvarno dobija (`LESSONS` L21, L23). */
const ARIMO_BYTES = { 'arimo-v36-latin.woff2': 20132, 'arimo-v36-latin-italic.woff2': 22352 };

test('T1/A — Growth Sans: instaliran Arial prvi, Arimo samo kao zamena, bez preload-a', async () => {
  const html = await (await get('/')).text();
  const preloads = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => m[0])
    .filter((tag) => /rel="preload"/.test(tag) && /as="font"/.test(tag));
  assert.equal(preloads.length, 0, `/: HTML unapred ucitava font (${preloads.join(' ')}) — i uredjaji sa Arial-om bi ga preuzimali`);

  const hrefs = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0, '/: HTML nema nijedan stylesheet');
  const css = (await Promise.all(hrefs.map(async (href) => (await get(href)).text()))).join('\n');

  const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1])
    .filter((block) => /font-family:\s*["']?Growth Sans["']?\s*(;|$)/.test(block));
  assert.equal(faces.length, 4, `CSS: ocekivana 4 Growth Sans @font-face (400/700, normal/italic), nadjeno ${faces.length}`);

  const urls = new Set();
  for (const face of faces) {
    const src = (face.match(/src:([^;]+)/) || [])[1] || '';
    const label = `${(face.match(/font-weight:\s*([^;]+)/) || [])[1]} ${(face.match(/font-style:\s*([^;]+)/) || [])[1]}`;
    const local = src.search(/local\(\s*["']?Arial/);
    const url = src.search(/url\(/);
    assert.ok(local !== -1 && url !== -1 && local < url, `CSS: Growth Sans ${label} nema instaliran Arial ispred Arimo-a (src:${src})`);
    urls.add((src.match(/url\(\s*["']?([^"')]+)/) || [])[1]);
  }

  const body = [...css.matchAll(/(?:^|[};])\s*body\s*\{([^}]*)\}/g)].map((m) => m[1]).find((block) => /font-family/.test(block)) || '';
  assert.match(body, /font-family:\s*["']?Growth Sans["']?\s*,\s*Arial\b/, 'CSS: `body` ne pocinje sa Growth Sans pa Arial');

  for (const u of urls) {
    const r = await get(u);
    const bytes = Buffer.from(await r.arrayBuffer()).length;
    assert.equal(r.status, 200, `${u}: HTTP ${r.status} — font na koji CSS pokazuje ne postoji`);
    assert.match(r.headers.get('content-type') || '', /font\/woff2/, `${u}: content-type ${r.headers.get('content-type')}`);
    assert.equal(bytes, ARIMO_BYTES[u.split('/').pop()], `${u}: ${bytes} B, ocekivano ${ARIMO_BYTES[u.split('/').pop()]}`);
  }
  assert.equal(urls.size, 2, `CSS: ocekivana 2 Arimo fajla (normal i italic), nadjeno ${urls.size}`);
});

/**
 * `RD7` (pravac B, `SMER-B`, Pavle 2026-09-22) — ritam naslovne i mesto brze forme.
 *
 * ⚠️ ZASTO KAPIJA. Forma sa pristankom je STRICT povrsina: do `RD7` je stajala u traci odmah posle heroja i trazila
 * telefon pre obecanja koja ga opravdavaju (audit `U2`). Sada zivi u zavrsnom pozivu. Kapija meri dve stvari koje bi
 * tiho mogle da se vrate: REDOSLED sekcija po `SMER-B` i da postoji TACNO JEDNA brza forma, unutar `home-close`, sa
 * `#get-started` (cilj „Skip to your next step") i pristankom. Redosled se meri u renderovanom HTML-u, ne u izvoru.
 */
test('RD7 — naslovna po SMER-B: proces posle heroja, brza forma samo u zavrsnom pozivu', async () => {
  const html = await (await get('/')).text();
  const at = (cls) => html.search(new RegExp(`<section[^>]*class="${cls}[ "]`));
  const order = ['home-hero', 'home-process', 'home-pay', 'home-values', 'home-guard', 'home-founder', 'home-faq', 'home-close'];
  const pos = order.map(at);
  order.forEach((cls, i) => assert.ok(pos[i] >= 0, `sekcija ${cls} ne postoji`));
  for (let i = 1; i < order.length; i++) assert.ok(pos[i - 1] < pos[i], `redosled: ${order[i - 1]} mora pre ${order[i]}`);
  assert.ok(!html.includes('home-callback'), 'traka sa formom posle heroja ne sme da postoji');
  assert.equal((html.match(/id="qa-first"/g) || []).length, 1, 'tacno jedna brza forma na naslovnoj');
  const close = pos[order.indexOf('home-close')];
  const target = html.indexOf('id="get-started"');
  assert.ok(target > close, '#get-started mora biti u zavrsnom pozivu');
  assert.ok(html.indexOf('id="qa-first"') > target, 'brza forma mora biti unutar #get-started');
  assert.ok(html.indexOf('name="tcpaConsent"', target) > target, 'pristanak mora biti uz brzu formu');
});

/**
 * `RD4` (`RD4-LOOK`, Pavle 2026-09-22) — na >= 1025 px meni je staklena pilula desno.
 *
 * ⚠️ ZASTO KAPIJA. Dve stvari bi tiho mogle da se pokvare, a nijedna se ne vidi na telefonu ni u izvoru CSS-a:
 *  1. Pilula mora biti PRAVO DUGME koje kontrolise `#nav-links` — preview je MENU crtao pseudo-elementom, a tada ga
 *     tastatura i citac ekrana ne vide, a tablet bez misa nema cime da otvori meni.
 *  2. `<noscript>` pravilo za navigaciju ne sme da vazi iznad 1024 px. Do `RD4` je vazilo do 1200 px i bez JS-a bi
 *     rasporedilo linkove u mrezu UNUTAR pilule na 1025–1200 px.
 *  Uz to: pilula stoji ODMAH ispred `<nav>` — na tome visi otvaranje prelazom preko pilule (`+` u CSS-u).
 * Meri se na svakoj strani koja nosi navigaciju (`GATED_ROUTES`), u renderovanom HTML-u.
 */
test('RD4 — pilula je dugme koje kontrolise #nav-links; noscript navigacije ne vazi iznad 1024 px', async () => {
  for (const path of GATED_ROUTES) {
    const html = await (await get(path)).text();
    const pills = tokenize(html).filter((t) => !t.close && t.tag === 'button' && /class="nav-pill"/.test(t.blob));
    assert.equal(pills.length, 1, `${path}: tacno jedna pilula`);
    for (const [attr, value] of [['type', 'button'], ['aria-controls', 'nav-links'], ['aria-expanded', 'false']]) {
      assert.ok(pills[0].blob.includes(`${attr}="${value}"`), `${path}: pilula nema ${attr}="${value}"\n  ${pills[0].raw}`);
    }
    // CSS otvara panel i prelazom preko pilule (`.nav-pill:hover+.nav-links`), pa pilula mora biti ODMAH ispred `<nav>`.
    const pill = html.indexOf('class="nav-pill"');
    const between = html.slice(html.indexOf('</button>', pill) + '</button>'.length, html.indexOf('id="nav-links"'));
    assert.ok(/^<nav\b[^>]*$/.test(between), `${path}: pilula mora stajati odmah ispred <nav id="nav-links">, izmedju je: ${between.slice(0, 120)}`);
    const widths = [...html.matchAll(/@media\(max-width:(\d+)px\)\{\.nav-links\{display:grid!important/g)].map((m) => Number(m[1]));
    assert.equal(widths.length, 1, `${path}: noscript pravilo navigacije nije nadjeno`);
    assert.ok(widths[0] <= 1024, `${path}: noscript navigacije vazi do ${widths[0]} px — razbija pilulu na 1025+`);
  }
});

/**
 * `TTI1` (Pavle 2026-09-23) — obican sajt: naslovna nema 3D scenu, heroj je staticna fotografija.
 *
 * ⚠️ ZASTO KAPIJA. Scena je bila najveci deo JS-a i jedini izvor gresaka hidratacije (`H2`). Kapija meri da se ne vrati
 * tiho: nijedan `<canvas>`, nijedan trag `journey` markupa, a heroj ima fotografiju i jedini `<h1>`.
 */
test('TTI1 — naslovna bez 3D scene: staticni heroj sa fotografijom', async () => {
  const html = await (await get('/')).text();
  assert.ok(!/<canvas[\s>]/.test(html), 'naslovna ne sme imati <canvas>');
  assert.ok(!html.includes('journey-canvas') && !/class="journey[ "]/.test(html), 'naslovna ne sme imati markup 3D scene');
  const hero = html.search(/<section[^>]*class="home-hero[ "]/);
  assert.ok(hero >= 0, 'heroj `home-hero` ne postoji');
  assert.ok(html.indexOf('/images/hero-01-night.jpg', hero) > hero, 'heroj mora imati fotografiju');
  assert.ok(html.indexOf('<h1', hero) > hero, '<h1> mora biti u heroju');
});
