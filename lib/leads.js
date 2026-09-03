/**
 * Trajni zapis prijave u D1.
 *
 * ⚠️ OVOGA NEMA U MAIN-u. Tamo je isti posao zaveden kao F1c i parkiran 2026-08-30 —
 * kod je bio gotov i zelen, ali ziva baza nikad nije provisionovana, pa se nije imalo
 * gde pisati. Posledica koja je tamo prihvacena odlaganjem: TCPA dokaz o pristanku
 * postoji ISKLJUCIVO u telu notifikacionog mejla. Za backup leada je to prihvatljivo;
 * za dokaz o pristanku nije — prva prijava se osporava kao i stota.
 *
 * Na ovom stacku je D1 vec vezan, pa zapis ide u bazu od prvog dana.
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

let d1Broken = false;

async function getD1() {
  if (d1Broken) return null;
  try {
    const { env } = await import('cloudflare:workers');
    return env?.DB ?? null;
  } catch {
    d1Broken = true;
    return null;
  }
}

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
  const db = await getD1();
  if (!db) {
    // Ne greska: binding jos nije podignut ili se vrti van Workers-a (test/lokalno).
    console.warn('[leads] D1 nije vezan — prijava nije trajno zapisana.', { source });
    return { ok: false, skipped: true };
  }

  try {
    await db
      .prepare(
        `INSERT INTO leads
           (source, payload, consent_granted, consent_text, consent_version,
            consent_ip, consent_user_agent, email_delivered)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      )
      .bind(
        source,
        JSON.stringify(redact(payload)),
        consent?.granted ? 1 : 0,
        consent?.scope ?? null,
        consent?.textVersion ?? null,
        consent?.ip ?? null,
        userAgent ?? null,
        emailDelivered ? 1 : 0,
      )
      .run();

    return { ok: true };
  } catch (error) {
    // Upis je backup; njegov neuspeh ne sme da promeni odgovor vozacu.
    console.error('[leads] Upis u D1 nije uspeo — prijava postoji samo u mejlu.', {
      source,
      error: error?.message,
    });
    return { ok: false, error: error?.message };
  }
}
