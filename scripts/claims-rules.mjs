/**
 * Pravila registra tvrdnji, odvojena od merenja.
 *
 * ⚠️ ZASTO ZASEBAN FAJL. Do 2026-09-06 su pravila zivela unutar `verify-claims.mjs`, koji na
 * vrhu nivoa radi `await fetch`. Takav modul se ne moze uvesti u test bez pokretanja merenja,
 * pa kapija nikad nije bila dokazana u OBA smera -- samo se videlo da prolazi na zatecenom
 * tekstu. Ovde su pravila cista funkcija nad HTML-om; `__tests__/claims-rules.test.js` ih
 * dokazuje na izmisljenim povredama i na doslovnom zatecenom copy-ju.
 */

/**
 * Skida `<script>`/`<style>` sadrzaj, pa tagove, pa dekodira entitete.
 *
 * ⚠️ ZASTO SE TAGOVI SKIDAJU. `components/ApplyForm.tsx:178` renderuje
 * `A recruiter <strong>usually</strong> calls you back within 15-20 minutes
 * <strong>during staffed hours</strong>.` -- tvrdnja i oba hedza su u ISTOJ recenici, ali ih
 * u HTML-u razdvajaju tagovi. Podela na recenice nad sirovim HTML-om bi tu recenicu isekla i
 * prijavila gol oblik na tekstu koji je ispravan.
 *
 * ⚠️ STA OVO NE VIDI: `application/ld+json`. Za prozna pravila je to tacno -- posetilac
 * strukturirane podatke ne cita. Pravila koja gadjaju JSON-LD moraju ostati `scope: 'html'`.
 */
function decodeEntities(s) {
  return s
    .replace(/&(?:apos|#39|#x27);/g, "'")
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:nbsp|#160);/g, ' ')
    .replace(/&(?:ndash|#8211);/g, '–')
    .replace(/&(?:mdash|#8212);/g, '—')
    .replace(/&(?:rsquo|#8217);/g, '’')
    .replace(/&(?:amp|#38);/g, '&');
}

/** Svaki isecak dobija zavrsnu interpunkciju, da podela na recenice ne spoji naslov sa telom. */
function terminate(s) {
  const t = s.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  return /[.!?]$/.test(t) ? t : t + '.';
}

/**
 * ⚠️ METAPODACI SE MERE ZAJEDNO SA TELOM. Skidanje tagova brise i `content` atribute, a jedna
 * od pet zivih C12 pojava zivi bas u `<meta name="description">` (`app/how-it-works/page.tsx:13`).
 * Da su ovde ostali samo tagovi tela, kapija bi tu tvrdnju prestala da vidi -- tiha regresija
 * u odnosu na staru verziju koja je merila sirov HTML. Naslov i opis su javne tvrdnje: vozac
 * ih vidi u rezultatima pretrage pre nego sto otvori stranicu.
 */
const META_CLAIM_FIELDS = /(?:name|property)=["'](?:description|og:description|og:title|twitter:description|twitter:title)["']/i;

export function extractText(html) {
  const chunks = [];

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) chunks.push(title[1]);

  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (!META_CLAIM_FIELDS.test(tag)) continue;
    const content = tag.match(/\bcontent=["']([\s\S]*?)["']/i);
    if (content) chunks.push(content[1]);
  }

  chunks.push(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      /**
       * ⚠️ BLOK ZAVRSAVA RECENICU, INLINE NE. Bez ovoga bi bedz bez interpunkcije
       * (`<span class="stat">3-5 days</span>`) bio spojen sa susednom recenicom i pozajmio
       * njen hedz -- tacno rupa koju ovaj batch zatvara. Inline tagovi (`strong`, `em`, `a`,
       * `span`) NAMERNO nisu ovde: `ApplyForm.tsx:178` deli tvrdnju i oba hedza `<strong>`-om
       * unutar jedne recenice, i prekid bi tu prijavio gol oblik na ispravnom tekstu.
       *
       * ⚠️ Ostaje granica: inline element bez interpunkcije koji stoji neposredno uz recenicu
       * i dalje se spaja sa njom. Blok markup pokriva stvarne slucajeve u ovom projektu.
       */
      .replace(/<\/(?:p|div|li|h[1-6]|section|article|aside|main|header|footer|nav|td|th|dt|dd|blockquote|figcaption|figure|ul|ol|dl|tr|table|form|label|button|summary|details)\s*>/gi, '. ')
      .replace(/<br\s*\/?>/gi, '. ')
      .replace(/<[^>]+>/g, ' ')
      // Blok koji se vec zavrsava tackom dobija drugu; niz tacaka se svodi na jednu.
      .replace(/\s*\.(?:\s*\.)+/g, '.')
  );

  return chunks.map((c) => terminate(decodeEntities(c))).filter(Boolean).join(' ');
}

/** Podela na recenice. Prazne se odbacuju; tacka unutar skracenice daje kraci fragment, sto je bezopasno. */
export function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

/**
 * Negacija ISPRED tvrdnje o garanciji, u prozoru od 60 znakova.
 *
 * ⚠️ ZASTO POSTOJI. Kanonski DOZVOLJEN tekst registra je negiran oblik:
 * "We do not guarantee employment, specific miles, pay, or home time" (`app/terms/page.tsx:47`).
 * Isto vazi za `lib/faq.js:18` i `lib/posts.js:227`. Sirenje C19 na sve imenice iz registra
 * bez ovog izuzetka oborilo bi bas tekst koji registar navodi kao kanonski -- kapija koja
 * odbija ono sto registar dozvoljava tera pisca da prekrsi registar da bi prosao build (isti
 * kvar koji je C12 `hedge2` vec jednom imao).
 *
 * ⚠️ Prozor je ogranicen namerno. Bez granice bi "We don't charge fees and we guarantee pay"
 * bio tiho izuzet -- lazan negativ je ovde skuplji od lazno pozitivnog.
 */
const NEGATION_BEFORE = /\b(?:not|never|cannot|can'?t|nobody|nothing|no one|without)\b[^.!?]{0,60}$/i;

function isNegated(sentence, matchIndex) {
  return NEGATION_BEFORE.test(sentence.slice(0, matchIndex));
}

/**
 * ZABRANJENE formulacije. Svaka nosi oznaku reda iz registra i razlog.
 *
 * `scope` bira nad cim se meri:
 *   'html'     -- sirov HTML cele strane (difolt, zateceno ponasanje; vidi i JSON-LD)
 *   'sentence' -- pojedinacna recenica ekstrahovanog teksta, uz izuzetak za negaciju
 */
export const PROHIBITED = [
  {
    id: 'C10',
    why: 'proces provere carrier-a nije definisan, pa "vetted/verified" tvrdi nepostojeci postupak',
    re: /vetted|verified carrier/i,
  },
  {
    id: 'C9',
    why: 'founder nikad nije vozio kamion - svaka formulacija koja implicira voznju je trajna zabrana',
    re: /in the seat|behind the wheel|years driving|from the cab|years on the road/i,
  },
  {
    /**
     * ⚠️ KAPIJA JE BILA UZA OD REDA KOJI SPROVODI. Do 2026-09-06 je regex pokrivao
     * `earnings|pay|income` -- jednu od PET imenica koje `CLAIMS.md:273` nabraja
     * ("guaranteed pay/miles/job/safety/start time"). Izmereno tada: `guaranteed miles`,
     * `guaranteed job` i `guaranteed home time` prolazili su kao ispravni.
     *
     * `home time`, `employment` i `work` dodati su jer ih kanonski dozvoljeni tekst registra
     * sam imenuje kao stvari koje se NE garantuju -- ako ih registar nabraja, kapija ih mora znati.
     */
    id: 'C19',
    why: 'garancija zarade, milja, posla, bezbednosti ili vremena pocetka',
    scope: 'sentence',
    allowNegated: true,
    re: /guarantee[a-z]*\s+(?:\w+\s+){0,2}(?:earnings|pay|income|miles|jobs?|employment|work|safety|home\s+time|start\s+(?:date|time))/i,
  },
  {
    id: 'C19',
    why: 'garancija zarade (imenovani obrasci iz registra)',
    re: /stable and secure earnings|we promise[^.]{0,30}(earn|pay)/i,
  },
  { id: 'C8', why: 'pokrivenost je 48 kontinentalnih drzava, ne 50', re: /all 50 states/i },
  { id: 'S1', why: 'izmisljen broj plasiranih vozaca', re: /\b\d{2,}\+\s*(drivers|placements) placed|\b70\+\s*drivers/i },
  { id: 'S2', why: 'testimonijal bez izvora', re: /—\s*[A-Z][a-z]+ [A-Z]\.,?\s*(driver|OTR|CDL)/ },
  { id: 'D20', why: 'negativna univerzalna tvrdnja o industriji', re: /scam and cheat|most recruiters lie|everyone in this business/i },
];

/**
 * USLOVNE tvrdnje: smeju da postoje ISKLJUCIVO uz svoj hedz.
 *
 * ⚠️ DVA DOSEGA, JER REGISTAR TRAZI DVE RAZLICITE STVARI.
 *   `local` -- mora stajati u ISTOJ recenici sa tvrdnjom
 *   `page`  -- mora postojati bilo gde na istoj ruti
 *
 * Do 2026-09-06 je sve bilo `page`, pa je hedz bilo gde na stranici legalizovao golu tvrdnju
 * bilo gde drugde. Izmereno tada: stranica sa hedzovanom recenicom i golim bedzom
 * "15-20 minutes" prolazila je. Cista `local` provera bi pak oborila ISPRAVAN tekst --
 * `app/how-it-works` nosi kanonski C11 caveat 120 redova ispod same tvrdnje.
 */
export const CONDITIONAL = [
  {
    /**
     * ⚠️ HEDZ JE BIO TAUTOLOGIJA. Do 2026-09-06 je `hedge` glasio
     * `/as little as|isn't ready|paperwork, physicals|depends on|own pace/i`, a `as little as`
     * je DEO SAME kanonske tvrdnje ("as little as 3-5 days"). Tvrdnja je tako sopstvenim
     * tekstom zadovoljavala svoj hedz. Izmereno: "Ready drivers can start in as little as
     * 3-5 days." prolazilo je bez ijednog caveata na stranici.
     *
     * Registar (`CLAIMS.md` C11) trazi DVOJE, i zato su ovde razdvojeni:
     *   kvalifikator "as little as"/"ready drivers" -- zabranjen je "bilo koji prikaz (badge,
     *     brojcani stat) koji ga ispusti", dakle mora stajati uz sam broj  -> `local`
     *   vidljiv caveat da rok zavisi od vozacevog papirnog traga           -> `page`
     */
    id: 'C11',
    claim: /3[–-]5 days/,
    local: [{ re: /as little as|ready drivers/i, what: 'kvalifikator ("as little as" / "ready drivers")' }],
    page: [{ re: /paperwork|physicals?|drug tests?|own pace|not guaranteed|isn'?t ready|depends on your (?:documents|paperwork)/i, what: 'caveat o papirnom tragu vozaca' }],
    why: 'vreme do plasmana zavisi od vozacevog papirnog traga',
  },
  {
    /**
     * ⚠️ KAPIJA JE BILA UZA OD REGISTRA KOJI SPROVODI. `hedge2` je do 2026-09-05 glasio
     * `/business hours/i`, a C12 dozvoljena formulacija je "usually within 15-20 minutes
     * during business/staffed hours" -- dakle registar priznaje oba, kapija samo prvo.
     *
     * Otkriveno kad je copy prelazio na "staffed hours": provera bi pala na svih 13 ruta i
     * izgledalo bi kao greska u tekstu, a greska je bila ovde.
     *
     * ⚠️ OBA HEDZA SU `local`, i to je IZMERENO pre nego sto je doseg stegnut: svih pet
     * zivih pojava (`lib/contact.js:60`, `ApplyForm.tsx:178`, `app/contact:50`,
     * `app/how-it-works` meta i korak 02) nosi i "usually" i "staffed hours" u istoj recenici.
     */
    id: 'C12',
    claim: /15[–-]20 minutes/,
    local: [
      { re: /usually/i, what: 'ucestalost ("usually")' },
      { re: /(?:business|staffed) hours/i, what: 'vremenski okvir ("staffed/business hours")' },
    ],
    page: [],
    why: 'vreme odgovora vazi samo u radno vreme i nije zagarantovano',
  },
];

/** Kratak isecak recenice za poruku o padu - nalaz mora biti dovoljan da se odmah nadje u izvoru. */
function snippet(sentence) {
  const s = sentence.trim();
  return s.length > 120 ? s.slice(0, 117) + '…' : s;
}

/**
 * Meri jednu rutu. Vraca `{ fails, notes }` - bez I/O i bez `process.exit`, da bi se moglo testirati.
 */
export function checkPage(path, html) {
  const fails = [];
  const notes = [];
  const text = extractText(html);
  const sentences = splitSentences(text);

  for (const rule of PROHIBITED) {
    if (rule.scope === 'sentence') {
      for (const sentence of sentences) {
        const hit = rule.re.exec(sentence);
        if (!hit) continue;
        if (rule.allowNegated && isNegated(sentence, hit.index)) continue;
        fails.push(`${rule.id} ZABRANJENO (${rule.why}) - ${path}: "${snippet(sentence)}"`);
      }
    } else if (rule.re.test(html)) {
      fails.push(`${rule.id} ZABRANJENO (${rule.why}) - ${path}`);
    }
  }

  for (const rule of CONDITIONAL) {
    const claimSentences = sentences.filter((s) => rule.claim.test(s));
    if (!claimSentences.length) continue;

    const before = fails.length;

    for (const sentence of claimSentences) {
      const missing = rule.local.filter((h) => !h.re.test(sentence)).map((h) => h.what);
      if (missing.length) {
        fails.push(`${rule.id} GOL OBLIK (${rule.why}) - ${path}: nedostaje ${missing.join(' i ')} uz samu tvrdnju: "${snippet(sentence)}"`);
      }
    }

    const missingPage = rule.page.filter((h) => !h.re.test(text)).map((h) => h.what);
    if (missingPage.length) {
      fails.push(`${rule.id} BEZ CAVEATA (${rule.why}) - ${path}: stranica nosi tvrdnju ali nema ${missingPage.join(' i ')}`);
    }

    if (fails.length === before) {
      notes.push(`${rule.id} na ${path} - hedz uz tvrdnju (${claimSentences.length}x)${rule.page.length ? ' i caveat na stranici' : ''}`);
    }
  }

  return { fails, notes };
}
