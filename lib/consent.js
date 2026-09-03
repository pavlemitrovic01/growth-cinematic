// Consent state (CB1). Prilagodjeno US rezimu, NIJE GDPR baner.
//
// Pravni sav je CPRA razlika izmedju "sale/sharing" i obicne analitike:
// opt-out pravo se odnosi na deljenje za oglasavanje, ne na merenje poseta.
// Zato dve kategorije a ne jedna — granica se poklapa sa F6a (GA4) naspram
// F6b (Meta/TikTok pikseli).
//
// localStorage a ne cookie: sve sto se gejtuje su klijentske skripte, server
// nikad ne mora da zna odluku. Bonus — ne postavljamo cookie da bismo
// zapamtili cookie odluku.
//
// Fajl je namerno podeljen na cist deo (bez `window`) i storage omotac:
// vitest.config.js je `environment:'node'` gde `localStorage` ne postoji, pa
// se logika testira a omotac dokazuje u browseru. Ne dodavati `jsdom` zbog ovoga.

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'growth.consent';

// Emituje se posle svake izmene — F6a/F6b se vezuju na ovo umesto na reload.
export const CONSENT_EVENT = 'growth:consentchange';
// Ponovno otvaranje panela ("Your privacy choices" u footeru, /privacy sekcija 6).
export const CONSENT_OPEN_EVENT = 'growth:consentopen';

// analytics   -> GA4 (F6a). Pod CPRA nije ni "sale" ni "sharing".
// advertising -> Meta/TikTok pikseli (F6b). JESTE "sharing for cross-context
//                behavioral advertising" — na ovo se odnosi opt-out pravo i
//                na ovo se odnosi GPC signal.
export const CATEGORIES = ['analytics', 'advertising'];

// CCPA/CPRA: posle opt-out-a se pristanak ne sme ponovo traziti najmanje 12
// meseci. Kod nas se baner ionako NIKAD ne otvara sam posle odluke — ovaj
// prozor gatuje jedini slucaj kad bi mogao: promenu CONSENT_VERSION (nova
// kategorija u buducnosti). Ako je korisnik nesto odbio unutar prozora,
// odbijanje se prenosi dalje umesto da ga ponovo pitamo.
export const REPROMPT_BLACKOUT_MS = 365 * 24 * 60 * 60 * 1000;

/* ─── cisti deo (bez window/localStorage) ─────────────────────────────── */

/** Nijedna kategorija dozvoljena, odluka nije doneta. */
export function emptyConsent() {
  return { v: CONSENT_VERSION, analytics: false, advertising: false, decidedAt: null, gpc: false };
}

/**
 * Citanje zapisa iz stringa. Vraca `null` za sve sto nije upotrebljiv zapis
 * (pokvaren JSON, ne-objekat, nepoznata verzija) — pozivalac to tretira kao
 * "odluka ne postoji" i pita ponovo. Nikad ne baca.
 */
export function parseStored(raw) {
  if (typeof raw !== 'string' || raw === '') return null;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return null;
  if (!Number.isInteger(data.v) || data.v < 1) return null;

  // Verzija se NE odbacuje ovde — shouldPrompt odlucuje sta sa starom
  // verzijom (moze da prenese odbijanje unutar 12-mesecnog prozora).
  return {
    v: data.v,
    analytics: data.analytics === true,
    advertising: data.advertising === true,
    decidedAt: Number.isFinite(data.decidedAt) ? data.decidedAt : null,
    gpc: data.gpc === true,
  };
}

export function serialize(record) {
  return JSON.stringify({
    v: record.v,
    analytics: record.analytics === true,
    advertising: record.advertising === true,
    decidedAt: record.decidedAt ?? null,
    gpc: record.gpc === true,
  });
}

/** Da li je korisnik ikad doneo odluku (bilo kakvu). */
export function isDecided(record) {
  return record !== null && record.decidedAt !== null;
}

/** Da li je bilo sta odbijeno — ulaz u 12-mesecni prozor. */
export function hasDenial(record) {
  if (record === null) return false;
  return CATEGORIES.some((c) => record[c] !== true);
}

/**
 * GPC (`navigator.globalPrivacyControl`) je obavezujuci opt-out iz deljenja
 * za oglasavanje u CA/CO/CT. Primenjuje se pri SVAKOM citanju, ne samo pri
 * upisu — ako korisnik ukljuci GPC posle sto je dozvolio oglasavanje, signal
 * pobedjuje stariju odluku. Analitiku GPC ne dira.
 */
export function applyGpc(record, gpcEnabled) {
  if (!gpcEnabled) return record;
  const base = record ?? emptyConsent();
  return { ...base, advertising: false, gpc: true };
}

/**
 * Jedini put kojim se baner otvara sam.
 *  - nema zapisa            -> pitaj
 *  - zapis tekuce verzije   -> ne pitaj (odluka stoji dok je korisnik ne promeni)
 *  - zapis stare verzije    -> pitaj, OSIM ako je nesto odbijeno unutar
 *                              12-mesecnog prozora (tada prenesi odbijanje)
 */
export function shouldPrompt(record, now = Date.now()) {
  if (record === null) return true;
  // Zapis bez `decidedAt` NIJE odluka, ma koja verzija bila. Bez ove provere
  // je `{v:1, analytics:true}` (pokvaren ili rucno pisan zapis) zauvek utisavao
  // baner, a getConsent() ga citao kao dozvolu — pristanak koji nikad nije dat.
  if (!isDecided(record)) return true;
  if (record.v === CONSENT_VERSION) return false;

  if (hasDenial(record) && record.decidedAt !== null) {
    if (now - record.decidedAt < REPROMPT_BLACKOUT_MS) return false;
  }
  return true;
}

/**
 * Sta potrosaci stvarno vide, iz sirovog zapisa i GPC signala. CISTA funkcija —
 * `getConsent()` je samo tanak omotac koji joj dodaje citanje storage-a i
 * `navigator`. Odvojena je bas zato da se cela odluka testira u `node` env-u,
 * bez `jsdom`: ranije je zivela unutar getConsent-a i nije imala nijedan test.
 */
export function effectiveConsent(stored, gpcEnabled) {
  // Zapis bez odluke se ne racuna — sve `false`, da se nezabelezen pristanak
  // nikad ne procita kao dat.
  if (!isDecided(stored)) return applyGpc(emptyConsent(), gpcEnabled);
  // migrateForward podize staru verziju na tekucu i popunjava kategorije koje u
  // njoj nisu postojale — inace bi hasConsent('novaKategorija') vracao
  // `undefined` umesto `false` dok korisnik ne odgovori na ponovno pitanje.
  return applyGpc(migrateForward(stored), gpcEnabled);
}

/** Zapis podignut na tekucu verziju, sa odbijanjima prenesenim iz stare. */
export function migrateForward(record) {
  const base = record ?? emptyConsent();
  const next = { ...base, v: CONSENT_VERSION };
  for (const c of CATEGORIES) next[c] = base[c] === true;
  return next;
}

/* ─── storage omotac (browser) ────────────────────────────────────────── */

/**
 * Baner i footer link postoje samo kad ima sta da se gejtuje. Dok F6a/F6b ne
 * postave analytics, sajt ne sme da tvrdi da koristi analytics cookie —
 * ista klasa tvrdnje bez pokrica koju su F0 i S1 cistili.
 *
 * Ako flag ostane ugasen kad F6a stigne, GA4 se nikad ne ucita (nema
 * pristanka) — otkaz je vidljiv (prazan dashboard), ne tih. Isti smer kao
 * F0 odluka da API rute vracaju 503 umesto laznog uspeha.
 */
export function isConsentRequired() {
  return process.env.NEXT_PUBLIC_CONSENT_REQUIRED === 'true';
}

export function detectGpc() {
  if (typeof navigator === 'undefined') return false;
  return navigator.globalPrivacyControl === true;
}

/** Sirov zapis iz storage-a, bez GPC sloja. `null` ako ga nema ili je pokvaren. */
export function readStoredConsent() {
  if (typeof window === 'undefined') return null;
  try {
    return parseStored(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    // Safari private mode baca na sam pristup localStorage-u.
    return null;
  }
}

/**
 * Ono sto potrosaci (F6a/F6b) treba da zovu. Zapis + GPC override.
 * Kad odluka ne postoji, sve je `false` — nista se ne ucitava bez pristanka.
 */
export function getConsent() {
  return effectiveConsent(readStoredConsent(), detectGpc());
}

/** Da li je konkretna kategorija dozvoljena. */
export function hasConsent(category) {
  return getConsent()[category] === true;
}

/**
 * Upis korisnikove odluke. `choices` je `{analytics, advertising}`; sve sto
 * nije eksplicitno `true` upisuje se kao odbijeno.
 */
export function setConsent(choices) {
  const gpc = detectGpc();
  const record = {
    v: CONSENT_VERSION,
    analytics: choices?.analytics === true,
    advertising: choices?.advertising === true,
    decidedAt: Date.now(),
    gpc,
  };
  // GPC pobedjuje i u trenutku upisa, ne samo pri citanju.
  const effective = applyGpc(record, gpc);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, serialize(effective));
    } catch {
      // Upis moze da padne (private mode, puna kvota). Odluka onda ne
      // prezivljava reload, ali u ovoj sesiji vazi preko event-a ispod.
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: effective }));
  }
  return effective;
}
