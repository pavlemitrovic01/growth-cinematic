import type { Metadata } from 'next';
import { APPLY_CTA } from '@/lib/cta';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { EMAIL, EMAIL_HREF, LEGAL_ENTITY, LEGAL_UPDATED, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/terms',
  title: 'Terms of Service | GROWTH.CO',
  description: 'The terms that govern use of the GROWTH.CO website and recruiting services.',
});

/**
 * ⚠️ NACRT ZA PRAVNU PROVERU, sekcije 01–05 prenete doslovno iz MAIN-a
 * (`app/terms/page.jsx`). Tekst tih pet nije menjan ni u jednoj reci.
 *
 * „Our Role" nosi istu tvrdnju kao footer disclaimer — agencija i posrednik, ne
 * prevoznik ni poslodavac, bez garancije zaposlenja, milja, plate ni home time-a.
 * Te dve povrsine moraju da se poklapaju; menjanje jedne bez druge je greska koju
 * je MAIN vec jednom napravio na relaciji privacy/marketing.
 *
 * ⚠️ STA JE DODATO 2026-09-05 (Faza 3), i zasto je svako od toga cinjenica a ne nov
 * pravni stav:
 *   · brojevi sekcija — `/privacy` ih vec ima kroz `.sub-num`, `/terms` je bio jedina
 *     numerisana stranica koja ih je izgubila. Za dokument na koji se referise po broju
 *     sekcije to nije kozmetika.
 *   · `Last updated` — MAIN ga ima na obe pravne stranice, ovaj projekat nije imao nijednu.
 *     Pravni dokument bez datuma stupanja na snagu.
 *   · imenovanje pravnog lica — ugovor bez ugovorne strane. Ime je vec na sajtu
 *     (`/privacy`, footer, strukturirani podaci); ovde je samo dodato, nista prepisano.
 *   · Contact sekcija — `/privacy` je ima, `/terms` nije, pa nije postojao kanal za
 *     pravno pitanje.
 *
 * ⚠️ STA NAMERNO NIJE DODATO — trazi kvalifikovanog americkog advokata, ne mene:
 *   · governing law / jurisdiction — biranje merodavnog prava je pravna odluka
 *   · arbitraza i odricanje od kolektivne tuzbe
 *   · intelektualna svojina
 *   · uslovi prekida koriscenja
 * Sve cetiri su zavedene u `docs/AUDIT.md` kao otvorene. Stranica je do njih nepotpuna.
 */

const SECTIONS = [
  {
    n: '01',
    h: 'Our Role',
    p: `GROWTH.CO is operated by ${LEGAL_ENTITY}. GROWTH.CO acts strictly as a recruiting agency and intermediary between CDL-A drivers and motor carriers. We are not a motor carrier, broker, or employer. We do not guarantee employment, specific miles, pay, or home time; these terms are ultimately agreed upon directly between the driver and the hiring carrier.`,
  },
  {
    n: '02',
    h: 'User Information and Accuracy',
    p: 'By submitting an application, you certify that all information provided regarding your CDL status, experience, violations, and SAP program history is accurate and truthful. Falsifying information may result in immediate rejection or termination by a carrier.',
  },
  {
    n: '03',
    h: 'Free for Drivers',
    p: 'Our recruiting services are completely free for drivers. We are compensated directly by our carrier partners upon successful placement.',
  },
  {
    n: '04',
    h: 'Limitation of Liability',
    p: 'GROWTH.CO shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services, including disputes between drivers and carriers.',
  },
  {
    n: '05',
    h: 'Modifications',
    p: 'We reserve the right to modify or replace these Terms at any time. Continued use of the service constitutes acceptance of the new Terms.',
  },
];

export default function Terms() {
  return (
    <PageShell eyebrow="LEGAL" title="Terms of Service">
      <div className="prose prose--legal">
        <p>
          Welcome to GROWTH.CO. By accessing or using our website and services, you agree to be
          bound by these Terms of Service.
        </p>
        <p className="legal-updated">Last updated: {LEGAL_UPDATED}</p>

        {SECTIONS.map((s) => (
          <section key={s.n}>
            <h2>
              <span className="sub-num">{s.n}</span> {s.h}
            </h2>
            <p>{s.p}</p>
          </section>
        ))}

        <section>
          <h2>
            <span className="sub-num">06</span> Contact
          </h2>
          <p>
            Questions about these Terms can go to <a href={EMAIL_HREF}>{EMAIL}</a>, or call{' '}
            <a href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a>. For how we handle your information, see
            our <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </div>

      {/*
        Zavrsni blok. Stari sajt je imao `CallToAction` na dnu SVAKE podstranice; ovaj
        projekat ga je izgubio bas na `/truckers-lounge`, `/privacy` i `/terms`.
        Na pravnoj stranici je namerno tisi nego drugde — bez velikog naslova.
      */}
      <div className="contact-actions">
        <Link className="btn btn-primary" href="/apply">
          {APPLY_CTA} ↗
        </Link>
        <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </PageShell>
  );
}
