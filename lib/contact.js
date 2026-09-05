const PHONE_E164 = '+12402263786';
const digits = PHONE_E164.slice(2); // US 10-cifreni broj, bez +1 prefiksa

export const PHONE_DISPLAY = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
export const PHONE_TEL_HREF = `tel:${PHONE_E164}`;
export const PHONE_SMS_HREF = `sms:${PHONE_E164}`;

export const EMAIL = 'growth.corecruitinggroup@gmail.com';
export const EMAIL_HREF = `mailto:${EMAIL}`;

/**
 * Pravno lice iza sajta.
 *
 * ⚠️ OVO JE POCETAK ISPRAVKE, NE ISPRAVKA. Ime je danas prekucano na SEDAM zasebnih
 * povrsina — tri API rute, privacy stranica, obe forme, footer i strukturirani podaci —
 * i nijedna ne uvozi iz zajednickog izvora. Ime je svuda tacno, ali je to TACNO ISTA
 * struktura koja je u MAIN-u zahtevala ceo batch kad je halucinirano ime zivelo na osam
 * mesta bez izvora (`docs/AUDIT.md`, § „Struktura koja je vec jednom pukla").
 *
 * Konstanta se za sada koristi samo na NOVIM mestima (`/terms`). Postojeca mesta se
 * NAMERNO ne migriraju u istom potezu: dve od njih su TCPA tekst cija se verzija upisuje
 * u bazu uz svaki pristanak (`ApplyForm.tsx` -> `CONSENT_TEXT_VERSION`), pa promena izvora
 * te niske trazi svoju odluku i svoju provereru, ne usputnu izmenu.
 */
export const LEGAL_ENTITY = 'Capljinac LLC';

/**
 * Datum poslednje izmene pravnih tekstova (`/terms`, `/privacy`).
 *
 * ⚠️ Jedan izvor za obe stranice namerno: MAIN ih ima odvojeno na dva mesta i vec su se
 * razisle. Menja se kad se promeni SADRZAJ tih tekstova, ne na svaki deploy.
 *
 * ⚠️ Oba teksta su i dalje NACRT ZA PRAVNU PROVERU. Kad advokat zavrsi pregled, ovaj
 * datum se postavlja na dan tog pregleda.
 */
export const LEGAL_UPDATED = 'September 5, 2026';
