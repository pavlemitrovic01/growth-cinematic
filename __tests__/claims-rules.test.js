import { it, expect } from 'vitest';
import { checkPage, extractText, splitSentences } from '../scripts/claims-rules.mjs';

/**
 * Dokaz kapije u OBA smera.
 *
 * ⚠️ ZASTO POSTOJI. Do 2026-09-06 kapija tvrdnji nije imala nijedan test. Videlo se samo da
 * prolazi na zatecenom tekstu -- a to je isto sto i ne znati da li uopste sprovodi. Dva
 * pravila su tada bila prividna: C11 hedz je bio tautologija (`as little as` je deo same
 * tvrdnje), a C19 je pokrivao jednu od pet imenica koje registar nabraja.
 *
 * Svaki "prolazi" slucaj ispod je DOSLOVAN zivi copy, sa navedenim mestom u izvoru. Test koji
 * bi izmislio dozvoljen tekst ne bi dokazao nista -- kapija sme da bude stroga samo ako je
 * dokazano da ne obara ono sto registar zove kanonskim.
 */

const page = (body, head = '') => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
const of = (fails, id) => fails.filter((f) => f.startsWith(id));

// ---------- C11 ----------

it('C11 — tvrdnja vise ne zadovoljava sopstveni hedz ("as little as" je deo tvrdnje)', () => {
  const { fails } = checkPage('/t', page('<p>Ready drivers can start in as little as 3–5 days.</p>'));
  const c11 = of(fails, 'C11');
  expect(c11).toHaveLength(1);
  expect(c11[0]).toContain('BEZ CAVEATA');
});

it('C11 — kanonski obrazac prolazi: kvalifikator uz tvrdnju, caveat drugde na stranici', () => {
  // Doslovno: app/how-it-works/page.tsx:35 (korak 04) + :158-161 (kanonski caveat).
  const html = page(
    '<p>Paperwork, DOT physical, and drug test happen here — we help you through them. Ready drivers can start in as little as 3–5 days.</p>' +
      '<section><p>That is the whole model.</p></section>' +
      '<p><strong>One honest caveat:</strong> we can&apos;t promise a 3–5 day start to a driver who isn&apos;t ready — paperwork, physicals, and drug tests move at their own pace. We help you track the next steps, but a start date is not guaranteed.</p>'
  );
  expect(of(checkPage('/how-it-works', html).fails, 'C11')).toEqual([]);
});

it('C11 — gol bedz pada iako stranica nosi pun hedzovan tekst', () => {
  const html = page(
    '<div class="stat">3–5 days</div>' +
      '<p>Ready drivers can start in as little as 3–5 days — paperwork, physicals, and drug tests move at their own pace.</p>'
  );
  const c11 = of(checkPage('/t', html).fails, 'C11');
  expect(c11).toHaveLength(1);
  expect(c11[0]).toContain('GOL OBLIK');
});

// ---------- C12 ----------

it('C12 — sve zive pojave nose oba hedza u istoj recenici', () => {
  const cases = [
    ['lib/contact.js:60 CALLBACK_SENTENCE', '<p>A recruiter usually calls back within 15–20 minutes during staffed hours.</p>'],
    ['components/ApplyForm.tsx:178 (hedzovi razdvojeni <strong>-om)', '<p>A recruiter <strong>usually</strong> calls you back within 15–20 minutes <strong>during staffed hours</strong>.</p>'],
    ['app/contact/page.tsx:50', '<p>No phone tree, no ticket number. We answer fast — usually within 15–20 minutes during staffed hours. Reach out daily, including weekends.</p>'],
    ['app/how-it-works/page.tsx:25 (korak 02)', '<p>Usually within 15–20 minutes during staffed hours. A real recruiter walks through your priorities — pay, home time, equipment, lanes.</p>'],
  ];
  for (const [where, body] of cases) {
    expect(of(checkPage('/t', page(body)).fails, 'C12'), where).toEqual([]);
  }
});

it('C12 — tvrdnja u <meta description> se i dalje meri', () => {
  // app/how-it-works/page.tsx:13. Skidanje tagova brise `content` atribute; da meta nije
  // izdvojena, ova pojava bi tiho ispala iz merenja.
  const hedged = '<meta name="description" content="The whole process, start to finish: apply in 2 minutes, usually get a callback within 15–20 minutes during staffed hours. No fees for drivers."/>';
  expect(of(checkPage('/how-it-works', page('<p>Telo.</p>', hedged)).fails, 'C12')).toEqual([]);

  const bare = '<meta name="description" content="Get a callback within 15–20 minutes."/>';
  expect(of(checkPage('/how-it-works', page('<p>Telo.</p>', bare)).fails, 'C12')).toHaveLength(1);
});

it('C12 — hedz na drugom mestu na stranici vise ne legalizuje gol bedz', () => {
  const html = page(
    '<p>A recruiter usually calls back within 15–20 minutes during staffed hours.</p>' +
      '<div class="stat">15–20 minutes</div>'
  );
  const c12 = of(checkPage('/t', html).fails, 'C12');
  expect(c12).toHaveLength(1);
  expect(c12[0]).toContain('GOL OBLIK');
});

// ---------- C19 ----------

it('C19 — hvata svih pet imenica iz registra, ne samo zaradu', () => {
  const forms = ['guaranteed pay', 'guaranteed miles', 'guaranteed job', 'guaranteed home time', 'guaranteed safety'];
  for (const form of forms) {
    expect(of(checkPage('/t', page(`<p>We offer ${form} for every driver.</p>`)).fails, 'C19'), form).toHaveLength(1);
  }
  expect(of(checkPage('/t', page('<p>We guarantee a start date for every driver.</p>')).fails, 'C19')).toHaveLength(1);
});

it('C19 — kanonski NEGIRANI oblici iz registra prolaze', () => {
  const cases = [
    ['app/terms/page.tsx:47 (kanonski dozvoljen tekst)', 'We are not a motor carrier, broker, or employer. We do not guarantee employment, specific miles, pay, or home time; these terms are ultimately agreed upon directly between the driver and the hiring carrier.'],
    ['lib/faq.js:18', 'A completed program does not guarantee a job.'],
    ['lib/posts.js:227', 'Do not assume that an advertised maximum is a guaranteed weekly amount.'],
    ['app/how-it-works/page.tsx:160', 'We help you track the next steps, but a start date is not guaranteed.'],
  ];
  for (const [where, text] of cases) {
    expect(of(checkPage('/t', page(`<p>${text}</p>`)).fails, 'C19'), where).toEqual([]);
  }
});

it('C19 — negacija daleko od tvrdnje NE izuzima (prozor je ogranicen namerno)', () => {
  const s = 'We do not charge drivers any fee whatsoever, and on top of everything else our partner carriers guarantee pay every single week.';
  expect(of(checkPage('/t', page(`<p>${s}</p>`)).fails, 'C19')).toHaveLength(1);
});

// ---------- ekstrakcija ----------

it('extractText spaja tekst kroz inline tagove, a blok tag zavrsava recenicu', () => {
  const sentences = splitSentences(extractText('<p>A <strong>b</strong> c.</p><div>d</div>'));
  expect(sentences).toContain('A b c.');
  expect(sentences).toContain('d.');
});

it('extractText ne cita <script> — JSON-LD nije proza i ne sme da nosi hedz umesto teksta', () => {
  const html = page('<div class="stat">15–20 minutes</div>', '<script type="application/ld+json">{"x":"usually during staffed hours"}</script>');
  expect(of(checkPage('/t', html).fails, 'C12')).toHaveLength(1);
});
