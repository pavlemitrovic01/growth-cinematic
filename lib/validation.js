import { CDL_CLASS_VALUES, EXPERIENCE_VALUES, YES_NO_VALUES } from '@/lib/form-options';

/**
 * LEAD1 — telefon.
 *
 * ⚠️ STARI REGEX JE PUSTAO BROJEVE BEZ IJEDNE CIFRE. Izmereno pokretanjem, ne pregledom:
 * `/^[\d\s()+-]{7,20}$/` prolazi `"       "` (7 razmaka), `"+++++++"`, `"()()()()"` i
 * `"-------"`. Proveravao je SKUP ZNAKOVA i duzinu, a nikad nije trazio cifru. Posledica nije
 * teorijska: ceo model stoji na recenici „a real recruiter usually calls you back within
 * 15-20 minutes", a lead sa brojem `()()()()` je lead kome se ne moze uzvratiti — dok je vozac
 * na ekranu dobio „Got your number."
 *
 * `lib/email.js:42` je to vec pola znao: `telHref()` odbija da napravi link ispod 10 cifara.
 * Znanje je postojalo u sloju za PRIKAZ, ali ne u sloju za VALIDACIJU.
 *
 * ⚠️ TACKA JE DODATA U SKUP ZNAKOVA. `240.226.3786` je uobicajen americki zapis i stari regex
 * ga je ODBIJAO — nadjeno pri pisanju ovog fajla, nije bilo u auditu. To je bio tih gubitak
 * pravih leadova, dakle popravka ide u istom smeru kao i sve ostalo u ovom batchu.
 *
 * ⚠️ Gornja granica podignuta 20 → 25 znakova. Medjunarodni zapisi sa razmacima
 * (`+387 63 123 456`) staju u 20, ali bez rezerve; posle uslova od 10 cifara duzina vise nije
 * odbrana pa nema razloga da bude tesna.
 */
const PHONE_ALLOWED_RE = /^[\d\s().+-]{7,25}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * D27 — donja granica je 10 cifara, BEZ ogranicenja formata i drzave.
 *
 * Odbija se iskljucivo ono sto se ne moze pozvati:
 *   · nula cifara (`"       "`, `"+++++++"`)  — nedostupno
 *   · manje od 10 cifara (`555-1234`)         — nepotpuno; US broj bez pozivnog se
 *                                               na nacionalnom nivou ne moze pozvati
 * Prolazi netaknuto: `240-226-3786`, `+1 (240) 226-3786`, `240.226.3786`, `+387 63 123 456`.
 *
 * ⚠️ Prag je prihvatljiv SAMO uz SEC-2b (poruka po polju). Do 2026-09-02 je vozac sa losim
 * brojem video doslovno „Validation failed" — pod tim uslovom bi svaka nova kocnica bila
 * cist gubitak leada. Sa porukom „Enter all 10 digits, including the area code" odbijanje
 * postaje ispravka. Ne razdvajati ovo dvoje.
 */
export const PHONE_MIN_DIGITS = 10;

const CONSENT_TEXT_VERSION = '2026-09-06';

/**
 * Gornje granice duzine. NAMERNO VELIKODUSNE — Pavlova granica pri odobrenju LEAD1 je
 * „ne smemo imati preostroga ogranicenja, treba da ne gubimo leadove."
 *
 * ⚠️ `violationsDetails` i `sapDetails` nose 2000 znakova jer su jedina mesta gde bi tesan
 * limit odsekao PRAV i VAZAN odgovor — vozac koji objasnjava svoj dosije mora imati prostora,
 * i to je tacno onaj vozac kome je ovaj sajt najpotrebniji.
 *
 * Do LEAD1 granice nisu postojale UOPSTE: `firstName` od 4 MB je prolazio validaciju i
 * ulazio u telo mejla. Jedina kocnica je bio Vercelov limit tela zahteva, dakle platforma.
 */
export const MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  phone: 25,
  email: 254, // RFC 5321 maksimum za adresu
  companyName: 200,
  contactName: 200,
  violationsDetails: 2000,
  sapDetails: 2000,
};

/** Broj cifara u unosu, bez obzira na format. */
export function phoneDigitCount(phone) {
  return (String(phone ?? '').match(/\d/g) || []).length;
}

export function isValidPhone(phone) {
  const value = String(phone ?? '');
  if (!PHONE_ALLOWED_RE.test(value)) return false;
  return phoneDigitCount(value) >= PHONE_MIN_DIGITS;
}

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email || ''));
}

/**
 * Duzina se meri na SIROVOJ vrednosti, pre `trim()`. Unos od 4 MB razmaka je napad bez
 * obzira sto se posle trimovanja svede na prazno — trosak je vec placen na prenosu i parsiranju.
 */
export function isWithinLength(value, max) {
  if (value === undefined || value === null) return true;
  return String(value).length <= max;
}

/**
 * Whitelist za `<select>` polja. Lista dolazi iz `lib/form-options.js` koji uvozi i sama
 * forma — pa se strane ne mogu raziti. Prazna/nepostojeca vrednost pada, sto je isto
 * ponasanje kao stara provera istinitosti.
 */
export function isOneOf(value, allowed) {
  return allowed.includes(value);
}

export const CDL_CLASSES = CDL_CLASS_VALUES;
export const EXPERIENCE = EXPERIENCE_VALUES;
export const YES_NO = YES_NO_VALUES;

// TCPA: pristanak mora biti eksplicitan boolean true. String "true"/"on" je
// ranije prolazio u apply/route.js (F0 nalaz) — ovde se ta rupa zatvara
// za sve rute odjednom, ne samo za onu gde je prvi put nadjena.
export function isConsentGranted(value) {
  return value === true;
}

/**
 * SEC-3 — zapis o pristanku dobija IP.
 *
 * Standardni TCPA dokazni zapis nosi vreme, tekst na koji je pristanak dat, broj telefona
 * I adresu sa koje je stigao. Prva tri su postojala; cetvrto je nedostajalo iako
 * `clientIp(req)` iz `lib/rate-limit.js` vec radi u istom zahtevu (SEC2 ga je uveo za limiter).
 *
 * ⚠️ `textVersion` je podignut na `2026-09-02` jer je LEAD1 promenio Chatbot consent tekst
 * (LEG-1). Verzija identifikuje TEKST koji je vozac video — da je ostala na `2026-07-30`,
 * zapis bi tvrdio da je prikazan stari tekst. To bi bio isti kvar koji LEG-1 popravlja,
 * samo iz drugog ugla.
 *
 * ⚠️ `ip` je opcion parametar sa `'unknown'` fallback-om: bolje zapis bez adrese nego
 * izostanak zapisa ako `clientIp` iz bilo kog razloga ne vrati vrednost.
 */
export function buildConsentRecord(scope, ip) {
  return {
    granted: true,
    grantedAt: new Date().toISOString(),
    scope,
    textVersion: CONSENT_TEXT_VERSION,
    ip: ip || 'unknown',
  };
}
