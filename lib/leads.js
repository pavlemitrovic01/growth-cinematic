import { getSql } from '@/db';

/**
 * Trajni zapis prijave u bazu.
 *
 * ⚠️ OVOGA NEMA U MAIN-u. Tamo je isti posao zaveden kao F1c i parkiran 2026-08-30 —
 * kod je bio gotov i zelen, ali ziva baza nikad nije provisionovana, pa se nije imalo
 * gde pisati. Posledica koja je tamo prihvacena odlaganjem: TCPA dokaz o pristanku
 * postoji ISKLJUCIVO u telu notifikacionog mejla. Za backup leada je to prihvatljivo;
 * za dokaz o pristanku nije — prva prijava se osporava kao i stota.
 *
 * ⚠️ Baza je ovde Neon (Postgres) preko Vercel Marketplace integracije. Do prelaska je
 * bila Cloudflare D1; zapis ide u bazu od prvog dana i ta odluka se prelaskom ne menja.
 *
 * ⚠️ MEJL OSTAJE NOSILAC. Ova funkcija je DRUGI zapis, ne zamena:
 *   - nikad ne baca — neuspeh upisa se loguje i vozac svejedno dobija svoj odgovor
 *   - nikad ne odlucuje o statusu odgovora — to radi iskljucivo ishod slanja mejla
 * Pravilo iz MAIN-a ostaje na snazi: uspeh znaci da je mejl STVARNO otisao.
 */

/**
 * Polja koja se NE upisuju u bazu, nego zamenjuju markerom.
 *
 * ⚠️ Ovo je prenet sud iz MAIN-a (`app/api/apply/route.js`, backup-u-log granu), ne nov:
 * `violationsDetails` i `sapDetails` su osetljive izjave — SAP je program za zloupotrebu
 * supstanci. MAIN ih je redigovao pre upisa u Vercel logove uz obrazlozenje da privacy
 * stranica ne pominje to cuvanje. Baza je trajnija od loga, pa isti sud vazi jace.
 *
 * ⚠️ ODLUKA ZA REVIZIJU: kad se napise privacy stranica ovog sajta, ovde se odlucuje
 * da li ostaju redigovani. Za povracaj leada je dovoljno ime + telefon — detalji se na
 * pozivu ionako prikupljaju ponovo — a puni tekst i dalje stoji u notifikacionom mejlu.
 */
const REDACTED_FIELDS = ['violationsDetails', 'sapDetails'];
const REDACTED_MARKER = '[redigovano]';

function redact(payload) {
  const out = { ...payload };
  for (const field of REDACTED_FIELDS) {
    if (out[field]) out[field] = REDACTED_MARKER;
  }
  // Honeypot nema sta da trazi u zapisu — ako je popunjen, zahtev nikad ne stigne dovde.
  delete out.company_website;
  return out;
}

/**
 * ⚠️ Pre prelaska na Vercel je ovde stajao lokalni `getD1()` koji je radio
 * `await import('cloudflare:workers')` u `try` — jer taj modul postoji SAMO u Workers
 * runtime-u, pa je u vitest-u uvoz pucao i funkcija je vracala `null`. Neon klijent je
 * obican npm paket i uvozi se svuda, pa gimnastika sa dinamickim uvozom vise nije
 * potrebna; `getSql()` (vrh fajla) vraca `null` kad `DATABASE_URL` ne postoji, sto je
 * isti ugovor i cuva isti rezervni put u testovima.
 */

/**
 * @param {object}  args
 * @param {'apply'|'callback'|'carrier-inquiry'} args.source  koja ruta je primila
 * @param {object}  args.payload         validirano telo zahteva (redigujem ga ovde)
 * @param {object}  args.consent         rezultat `buildConsentRecord()`
 * @param {boolean} args.emailDelivered  da li je notifikacija stvarno otisla
 * @param {string=} args.userAgent
 * @returns {Promise<{ok: boolean, skipped?: boolean, error?: string}>}
 */
export async function recordLead({ source, payload, consent, emailDelivered, userAgent }) {
  const sql = getSql();
  if (!sql) {
    // Ne greska: baza jos nije vezana ili se vrti van produkcije (test/lokalno).
    console.warn('[leads] Baza nije konfigurisana — prijava nije trajno zapisana.', { source });
    return { ok: false, skipped: true };
  }

  try {
    /**
     * ⚠️ Tagged template, ne konkatenacija. Neon klijent svaku `${...}` rupu salje kao
     * vezan parametar ($1, $2, ...), pa je ovo parametrizovan upit uprkos tome sto lici
     * na string. Ovde su podaci koje salje neproveren posetilac — nijedna vrednost ne
     * sme da zavrsi u tekstu izjave.
     *
     * ⚠️ `::jsonb` je izricit namerno. Kolona je `jsonb`, a upisuje se JSON NISKA;
     * Postgres bi tip parametra izveo iz odredista i verovatno pogodio, ali putanja koja
     * nosi TCPA dokaz nije mesto za „verovatno".
     *
     * ⚠️ `consent_granted` i `email_delivered` su sada pravi `boolean` (na D1/SQLite-u
     * su bili 1/0). `Boolean(...)` je tu da `undefined` ne ode kao NULL u NOT NULL kolonu.
     */
    await sql`
      INSERT INTO leads
        (source, payload, consent_granted, consent_text, consent_version,
         consent_ip, consent_user_agent, email_delivered)
      VALUES (
        ${source},
        ${JSON.stringify(redact(payload))}::jsonb,
        ${Boolean(consent?.granted)},
        ${consent?.scope ?? null},
        ${consent?.textVersion ?? null},
        ${consent?.ip ?? null},
        ${userAgent ?? null},
        ${Boolean(emailDelivered)}
      )`;

    return { ok: true };
  } catch (error) {
    // Upis je backup; njegov neuspeh ne sme da promeni odgovor vozacu.
    console.error('[leads] Upis u bazu nije uspeo — prijava postoji samo u mejlu.', {
      source,
      error: error?.message,
    });
    return { ok: false, error: error?.message };
  }
}
