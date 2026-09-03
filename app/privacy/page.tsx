import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { EMAIL, EMAIL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/privacy',
  title: 'Privacy Policy | GROWTH.CO',
  description: 'How GROWTH.CO collects, uses, stores and shares your personal information.',
});

/**
 * ⚠️ NACRT ZA PRAVNU PROVERU. Isti rezim koji MAIN drzi za TCPA tekst.
 *
 * ⚠️ SEKCIJE 01–04 I „Cookies" SU PRENETE DOSLOVNO iz MAIN-a. Ne parafrazirati —
 * MAIN nosi zapisano pravilo da se privacy stranica i marketinske tvrdnje moraju
 * poklapati, jer su jednom protivrecile.
 *
 * ⚠️ SEKCIJA 05 („Where your information is stored") JE NOVA I MORA POSTOJATI.
 * MAIN je nema zato sto tamo prijava zivi ISKLJUCIVO u telu notifikacionog mejla —
 * baza nikad nije provisionovana (F1c parkiran). Ovaj sajt prijave UPISUJE u bazu
 * (`lib/leads.js` -> D1), pa privacy stranica koja o tome cuti ne bi bila tacna.
 * Tekst opisuje tacno ono sto kod radi, ukljucujuci sta se NE upisuje.
 *
 * ⚠️ Sekcija „Cookies" je namerno tacna I PRE I POSLE uvodjenja analitike:
 * „ne postavljamo dok ne ukljucis" ostaje istinito u oba stanja. Ne prepravljati u
 * „we use cookies" — to bi bila tvrdnja bez pokrica.
 */

const SECTIONS = [
  {
    n: '01',
    h: 'Information We Collect',
    body: [
      'When you apply for a driving position through our platform, we collect personal information you provide, including but not limited to: your name, phone number, email address, CDL class, driving experience, violation history, and SAP program status.',
    ],
  },
  {
    n: '02',
    h: 'How We Use Your Information',
    body: [
      'We use this information exclusively to evaluate your qualifications and match you with carriers. By submitting the application, you consent to us sharing your details only with the specific carriers we are actively matching you to, for the sole purpose of finding you a driving job. We do not broadcast your application to our whole network, and we never sell it.',
    ],
  },
  {
    n: '03',
    h: 'TCPA Consent and Communications',
    body: [
      'By opting in on our application form, you provide express written consent under the Telephone Consumer Protection Act (TCPA) to receive SMS messages and phone calls — including by automated means — from Capljinac LLC only. We do not obtain this consent on behalf of any other company, and carriers we introduce you to must obtain their own consent to contact you. Consent is not a condition of any service. You may opt out at any time by replying STOP to an SMS or telling us during a phone call.',
    ],
  },
  {
    n: '04',
    h: 'Data Security',
    body: [
      'We implement appropriate security measures to protect your personal information. We never sell your data — not to marketers, lead brokers, or anyone else. Sensitive details you provide (violation history, SAP status) are shared only with a carrier when it is relevant to a match we are actively working on for you.',
    ],
  },
  {
    n: '05',
    h: 'Where Your Information Is Stored',
    body: [
      'When you submit an application, two things happen. Your details are emailed to our recruiting team so a person can call you back, and a copy is saved to our own database so your application is not lost if that email fails to send.',
      'The saved copy includes your name, contact details, CDL class, experience, and whether you answered yes or no to the questions about violations and SAP. It also includes a record of your consent — what the consent text said, when you agreed, and the IP address and browser you agreed from — so that we can show your permission was given.',
      'The free-text notes you write about violations or SAP status are deliberately not saved to that database. They are sent to our recruiting team by email and discussed with you on the call, and nowhere else.',
      'You can ask us to delete any of this at any time. See "Your state privacy rights" below.',
    ],
  },
];

export default function Privacy() {
  return (
    <PageShell eyebrow="LEGAL" title="Privacy Policy">
      <div className="prose prose--legal">
        <p>
          This Privacy Policy describes how GROWTH.CO (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, and shares your personal information when you use our
          website or services.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.n}>
            <h2>
              <span className="sub-num">{s.n}</span> {s.h}
            </h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        {/* ⚠️ `id="cookies"` MORA ostati na h2 — footer i `/privacy#cookies` cilja na njega. */}
        <section>
          <h2 id="cookies">Cookies, Analytics, and Your Privacy Choices</h2>
          <p>
            We do not set analytics or advertising cookies unless you turn them on. The site, and
            your application, work with everything off.
          </p>
          <p>These are two separate choices, because they are not the same thing:</p>
          <ul>
            <li>
              <strong>Analytics</strong> — aggregate measurement of which pages drivers actually
              use, so we can fix what is confusing. Not sold, and not shared with advertising
              platforms.
            </li>
            <li>
              <strong>Advertising</strong> — lets ad platforms such as Meta or TikTok recognize
              your browser away from our site. Under California law this counts as{' '}
              <strong>sharing</strong> personal information for cross-context behavioral
              advertising. It is off unless you turn it on.
            </li>
          </ul>
          <p>
            <strong>We do not sell your personal information</strong> — not for money, and not for
            anything else of value.
          </p>
          <p>
            <strong>Global Privacy Control.</strong> If your browser or an extension sends a GPC
            signal, we treat it as a binding opt-out of advertising and turn that category off
            automatically. You do not have to do anything.
          </p>
          <p>
            <strong>Changing your mind.</strong> You can change or withdraw either choice at any
            time. We remember what you picked and will not ask again unless we add a new category.
          </p>
          <p>
            <strong>Your state privacy rights.</strong> Depending on where you live, you may have
            the right to know what personal information we hold about you, to get a copy of it, to
            ask us to correct or delete it, and to opt out of targeted advertising. Email{' '}
            <a href={EMAIL_HREF}>{EMAIL}</a> and we will respond. We will not treat you differently
            for exercising any of these rights.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href={EMAIL_HREF}>{EMAIL}</a>.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
