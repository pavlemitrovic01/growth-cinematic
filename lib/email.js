import { Resend } from 'resend';

// F1a — jedno mesto koje sklapa i salje lead notifikaciju.
// Sve tri rute ga zovu; bez toga bi se ista logika triplicirala kroz lock zonu
// (app/api/**), gde svaka izmena posle toga kosta STRICT batch.
//
// Salje SAMO obavestenje nama. Autoresponder vozacu je F1b i ceka verifikovan
// domen — sandbox posiljalac isporucuje iskljucivo na adresu Resend naloga.

const SANDBOX_FROM = 'GROWTH.CO <onboarding@resend.dev>';

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL);
}

// Vrednosti dolaze od vozaca i idu u HTML telo mejla — bez ovoga jedan `<`
// u polju razbija prikaz, a `<script>` putuje do naseg inboxa kao markup.
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Subject se sklapa iz korisnickog unosa (ime vozaca, naziv firme), a validacija
// tamo proverava samo da polje nije prazno. Prelom reda u naslovu u najboljem
// slucaju sece naslov taman gde stoji telefon, a da li ga posiljalac tretira kao
// separator zaglavlja nije nase da pretpostavljamo — sklanjamo ga ovde.
function singleLine(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

// Telefon je jedino polje koje vredi kao link: otvoris mejl na telefonu i zoves
// iz jednog dodira umesto da prekucavas broj.
//
// Link se pravi SAMO za broj koji se stvarno moze pozvati — US 10 cifara, ili 11
// sa vodecom jedinicom. isValidPhone propusta i 7 znakova ("555-1234"), a od toga
// bi ispao `tel:+5551234` koji ne zove nigde. Bez linka je bolje nego link koji
// laze: sam broj se u oba slucaja vidi kao tekst.
function telHref(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`;
  return null;
}

function presentFields(fields) {
  return fields.filter(([, value]) => String(value ?? '').trim() !== '');
}

function renderHtml(fields, consent) {
  const rows = presentFields(fields)
    .map(([label, value, kind]) => {
      const href = kind === 'phone' ? telHref(value) : null;
      const cell = href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value);
      return `<tr>
        <td style="padding:6px 14px 6px 0;color:#5b6b63;white-space:nowrap;vertical-align:top">${esc(label)}</td>
        <td style="padding:6px 0;color:#0a1f17;font-weight:600">${cell}</td>
      </tr>`;
    })
    .join('');

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5">
  <table style="border-collapse:collapse">${rows}</table>
  <p style="margin:22px 0 6px;color:#5b6b63;font-size:12px;text-transform:uppercase;letter-spacing:.08em">TCPA consent record</p>
  <table style="border-collapse:collapse;font-size:13px">
    <tr><td style="padding:3px 14px 3px 0;color:#5b6b63">Granted at</td><td style="padding:3px 0;color:#0a1f17">${esc(consent.grantedAt)}</td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#5b6b63">Scope</td><td style="padding:3px 0;color:#0a1f17">${esc(consent.scope)}</td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#5b6b63">Text version</td><td style="padding:3px 0;color:#0a1f17">${esc(consent.textVersion)}</td></tr>
  </table>
</div>`;
}

// Tekstualna verzija nije ukras — deo klijenata je prikazuje umesto HTML-a,
// i filteri gledaju na poruke koje je nemaju.
function renderText(fields, consent) {
  const lines = presentFields(fields).map(([label, value]) => `${label}: ${value}`);
  return [
    ...lines,
    '',
    'TCPA CONSENT RECORD',
    `Granted at: ${consent.grantedAt}`,
    `Scope: ${consent.scope}`,
    `Text version: ${consent.textVersion}`,
  ].join('\n');
}

/**
 * Salje lead notifikaciju. NIKAD ne baca — rute moraju da razlikuju
 * "poslato" od "nije poslato" da bi mogle da vrate 503 umesto laznog uspeha.
 *
 * @returns {Promise<{ok: true, id?: string} | {ok: false, error: string}>}
 */
export async function sendLead({ subject, fields, consent, replyTo }) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      // LEAD_FROM_EMAIL: opcion override posiljaoca, server-only, nikad NEXT_PUBLIC_.
      // Dok domen nije verifikovan ostaje sandbox — Resend tada isporucuje
      // iskljucivo na adresu naloga. F1b/F6c ga postavljaju na
      // "GROWTH.CO <apply@growthcdl.com>" cim growthcdl.com prodje verifikaciju.
      // NAPOMENA: CONTEXT.md:70 jos ne navodi ovu varijablu — vidi LOG za F1a.
      from: process.env.LEAD_FROM_EMAIL || SANDBOX_FROM,
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      ...(replyTo ? { replyTo } : {}),
      subject: singleLine(subject),
      html: renderHtml(fields, consent),
      text: renderText(fields, consent),
    });

    if (error) return { ok: false, error: error.message || JSON.stringify(error) };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}
