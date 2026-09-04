// LEAD1 — jedan izvor za vrednosti koje `<select>` polja nude i koje server prihvata.
//
// ZASTO POSTOJI: audit je nasao da `apply/route.js` proverava samo istinitost
// (`if (!cdlClass)`), pa `cdlClass: "banana"` prolazi validaciju i zavrsava u mejlu.
// Ocigledna popravka je whitelist na serveru — ali whitelist prepisan rukom je zamka:
// promeni se `<option>` u formi, server pocne da odbija PRAVE prijave, a niko ne primeti
// jer forma i dalje izgleda ispravno.
//
// Zato lista zivi ovde, a UVOZE JE OBA: `ApplyForm.jsx` renderuje `<option>` iz nje,
// `lib/validation.js` proverava protiv nje. Razilazenje postaje nemoguce, ne samo
// nepozeljno. Isti obrazac koji `lib/contact.js`, `lib/faq.js` i `lib/seo.js` vec koriste.
//
// ⚠️ Vrednosti su IZMERENE iz `ApplyForm.jsx` pre izdvajanja (2026-09-02), ne prepisane
// po secanju — svaka razlika bi tiho odbijala prijave koje su do juce prolazile.

/**
 * CDL klasa. `None` pokriva vozace sa dozvolom u pripremi (BRIEF §4 — svi, ukljucujuci fresh grads).
 *
 * ⚠️ CLASS B NAMERNO NIJE PONUDJEN. Pavlova odluka 2026-09-04: „prima ali za sad neka ostane
 * samo A". Poslovna cinjenica je dakle da GROWTH PRIMA Class B — sajt ga zasad ne nudi.
 * Usaglaseno sa `docs/BRIEF.md:80` („Class A sada, Class B uskoro") i `DECISIONS.md` D28.
 *
 * ⚠️ ZASTO NE „Class B (coming soon)": ta formulacija tvrdi da usluga JOS NE POSTOJI, a
 * postoji. Napomena bi bila netacna na drugi nacin nego gola opcija — jedna tvrdi da danas
 * plasiramo Class B, druga da ne mozemo uopste. Izostavljanje ne tvrdi nista.
 *
 * ⚠️ Ovo uklanja i vrednost iz serverskog whitelist-a, jer se `CDL_CLASS_VALUES` IZVODI iz ove
 * liste. Namerno: forma koja ne nudi opciju ne treba ni da je prihvata. Kad se Class B aktivira,
 * vraca se jedan red i whitelist ga prati sam.
 *
 * ⚠️ Nasledjeno iz MAIN-a doslovnim prenosom ovog fajla — tamo je isti red zaveden kao otvoren
 * bug (`STATE.md`, PB1 grana: „evidentiran a ne popravljen"). Na `main`-u i dalje stoji.
 */
export const CDL_CLASSES = [
  { value: 'A', label: 'Class A' },
  { value: 'None', label: 'No CDL / Permit only' },
];

/** Iskustvo. Rasponi su BRIEF odluka, ne tehnicka — ne menjati bez odluke. */
export const EXPERIENCE_LEVELS = [
  { value: 'Student/Recent Grad', label: 'Student / Recent Grad' },
  { value: '1-3 months', label: '1 - 3 months' },
  { value: '3-6 months', label: '3 - 6 months' },
  { value: '6-12 months', label: '6 - 12 months' },
  { value: '1-2 years', label: '1 - 2 years' },
  { value: '2+ years', label: '2+ years' },
];

/** Violations i SAP dele isti par. Redosled je namerno `No` prvi — vidi napomenu ispod. */
export const YES_NO = [
  { value: 'No', label: 'No' },
  { value: 'Yes', label: 'Yes' },
];

// Gole vrednosti za serversku proveru. Izvedene, ne prepisane.
export const CDL_CLASS_VALUES = CDL_CLASSES.map((o) => o.value);
export const EXPERIENCE_VALUES = EXPERIENCE_LEVELS.map((o) => o.value);
export const YES_NO_VALUES = YES_NO.map((o) => o.value);

/**
 * SEC-2b — poruke koje vozac VIDI kad polje padne.
 *
 * ⚠️ Ovo je popravka gubitka leadova, ne kozmetika. Izmereno na produkciji 2026-09-02:
 * server vraca `{error:"Validation failed", fields:["phone"]}`, a sve tri forme prikazuju
 * `payload.error` doslovno — vozac dobije **„Validation failed"** i ponudu da zove telefonom.
 * Server tacno zna koje je polje palo; klijent je tu informaciju bacao.
 *
 * Tekst je engleski jer je to jezik sajta (RULES §12). Kaze STA da se popravi, ne sta je pravilo.
 */
export const FIELD_MESSAGES = {
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  phone: 'Enter all 10 digits, including the area code.',
  email: 'Check the email address — it looks incomplete.',
  cdlClass: 'Pick your CDL class.',
  experience: 'Pick how much driving experience you have.',
  hasViolations: 'Let us know about violations — either answer is fine.',
  hasSAP: 'Let us know about SAP — either answer is fine.',
  violationsDetails: 'Add a short note about the violations.',
  sapDetails: 'Add a short note about your SAP status.',
  companyName: 'Enter the company name.',
  contactName: 'Enter a contact name.',
  tcpaConsent: 'Check the consent box so we are allowed to call you.',
};

/**
 * Sklapa jednu recenicu iz liste polja koju je server vratio.
 * Nepoznato ime polja se preskace umesto da izbaci `undefined` — server sme dobiti novo
 * polje pre nego sto klijent za njega dobije tekst, i to ne sme da proizvede prazan ekran.
 */
export function messageForFields(fields, fallback) {
  if (!Array.isArray(fields)) return fallback;
  const msgs = fields.map((f) => FIELD_MESSAGES[f]).filter(Boolean);
  return msgs.length ? msgs.join(' ') : fallback;
}
