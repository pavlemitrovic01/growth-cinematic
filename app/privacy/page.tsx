import type { Metadata } from 'next';
import { APPLY_CTA } from '@/lib/cta';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import ConsentSettingsButton from '@/components/ConsentSettingsButton';
import { isConsentRequired } from '@/lib/consent';
import { EMAIL, EMAIL_HREF, HAS_PHONE, LEGAL_UPDATED, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/privacy',
  title: 'Privacy Policy | TTIrecruiting',
  description: 'How TTIrecruiting collects, uses, stores and shares your personal information.',
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
 * (`lib/leads.js` -> Neon), pa privacy stranica koja o tome cuti ne bi bila tacna.
 * Tekst opisuje tacno ono sto kod radi, ukljucujuci sta se NE upisuje.
 *
 * ⚠️ IME PROCESORA SE MENJA KAD SE MENJA STACK, I TO JE OVDE VEC JEDNOM PROPUSTENO.
 * Prelazak sa Cloudflare D1 na Neon (2026-09-05) je azurirao STATUS i README, a ovu
 * stranicu ne — pa je ovde jedan dan stajalo da podaci vozaca, ukljucujuci odgovore o
 * prekrsajima i SAP statusu, stoje kod procesora kod kog vise ne stoje. Kad se sledeci
 * put menja gde podaci zive, ovaj fajl ide u istom commitu, ne posle.
 *
 * ⚠️ Sekcija „Cookies" je namerno tacna I PRE I POSLE uvodjenja analitike:
 * „ne postavljamo dok ne ukljucis" ostaje istinito u oba stanja. Ne prepravljati u
 * „we use cookies" — to bi bila tvrdnja bez pokrica.
 */

// Kapija se cita jednom, na build-u — ista vrednost koju vide baner i footer.
const CONSENT_ON = isConsentRequired();

const SECTIONS = [
  {
    n: '01',
    h: 'Information We Collect',
    body: [
      'For a carrier inquiry, we collect your company name, contact name, phone number, optional email address and communication consent. We use these details to respond about recruiting services.',
      'When you apply for a driving position through our platform, we collect personal information you provide, including but not limited to: your name, phone number, email address, CDL class, driving experience, violation history, and SAP program status.',
    ],
  },
  {
    n: '02',
    h: 'How We Use Your Information',
    /**
     * ⚠️ „only with the specific carriers" je uklonjeno, i to je faktička ispravka.
     * Sekcija 05 ispod imenuje Neon i Resend kao procesore — dakle podaci idu i njima,
     * pa je „samo sa carrier-ima" bilo netačno u istom dokumentu koji dva pasusa nize
     * tacno nabraja data-flow. CLAIMS C15 tu protivrecnost izricito predvidja i nosi
     * unapred odobrenu privremenu formulaciju; ovo je ona, uklopljena u glas stranice.
     *
     * ⚠️ „we never sell it" OSTAJE — C15 to izricito dozvoljava. Ono sto C15 zabranjuje
     * je apsolutna tvrdnja da se podaci ne dele NI SA KIM, jer se dele: sa carrier-ima
     * i sa operativnim servisima.
     */
    body: [
      'We use this information exclusively to evaluate your qualifications and match you with carriers. By submitting the application, you consent to us sharing your details with the specific carriers we are actively matching you to, for the sole purpose of finding you a driving job, and with the services we need to operate — for example email delivery and secure storage — always with appropriate consent. We do not broadcast your application to our whole network, and we never sell it.',
    ],
  },
  {
    n: '03',
    h: 'TCPA Consent and Communications',
    body: [
      'By opting in on our application form, you provide express written consent under the Telephone Consumer Protection Act (TCPA) to receive SMS messages and phone calls — including by automated means — from TTIrecruiting only. We do not obtain this consent on behalf of any other company, and carriers we introduce you to must obtain their own consent to contact you. Consent is not a condition of any service. You may opt out at any time by replying STOP to an SMS or telling us during a phone call.',
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
      'Validated submissions are saved to our database hosted on Neon, and the site itself runs on Vercel. When email delivery is configured, we also send a notification to our recruiting team through Resend. If delivery is unavailable, the form displays an error; a database copy may still have been saved.',
      'The saved copy includes your name, contact details, CDL class, experience, and whether you answered yes or no to the questions about violations and SAP. It also includes a record of your consent — the consent scope and text version, the submission time, and the IP address and browser you agreed from — so that we can show your permission was given.',
      'The free-text notes you write about violations or SAP status are deliberately not saved to that database. When email delivery is available, those notes are included in the recruiting notification. If it is unavailable, please discuss those details with your recruiter.',
      'You can ask us to delete any of this at any time. See "Your state privacy rights" below.',
    ],
  },
];

export default function Privacy() {
  return (
    <PageShell eyebrow="LEGAL" title="Privacy Policy">
      <div className="prose prose--legal">
        <p>
          This Privacy Policy describes how TTIrecruiting (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, and shares your personal information when you use our
          website or services.
        </p>
        {/* Do 2026-09-05 nijedna od dve pravne stranice nije imala datum stupanja na snagu,
            iako ga MAIN ima na obe. Izvor je zajednicki (`LEGAL_UPDATED`) da se ne raziju. */}
        <p className="legal-updated">Last updated: {LEGAL_UPDATED}</p>

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
          {/* ⚠️ `id="cookies"` MORA ostati na h2 — footer i `/privacy#cookies` cilja na njega.
              Broj sekcije je dodat 2026-09-05: niz 01–05 se ovde prekidao, pa su poslednje
              dve sekcije stajale bez broja usred numerisanog dokumenta. */}
          <h2 id="cookies">
            <span className="sub-num">06</span> Cookies, Analytics, and Your Privacy Choices
          </h2>
          {/*
            ⚠️ TEKST SE GRANA NA ISTU KAPIJU KOJA GATUJE BANER. Dok je consent ugasen, sajt
            stvarno ne ucitava nijedan tracker i prva varijanta je tacna. U trenutku kad se
            kapija upali, ta recenica bi postala LAZ — zato se menja zajedno sa njom, a ne
            rucno posle. Isto pravilo koje original nosi zapisano: privacy stranica i ono sto
            sajt radi moraju se poklapati.
          */}
          {CONSENT_ON ? (
            <>
              <p>
                We do not set analytics or advertising cookies unless you turn them on. The site,
                and your application, work with everything off.
              </p>
              <p>These are two separate choices, because they are not the same thing:</p>
              <ul>
                <li>
                  <strong>Analytics</strong> — aggregate measurement of which pages drivers
                  actually use, so we can fix what is confusing. Not sold, and not shared with
                  advertising platforms.
                </li>
                <li>
                  <strong>Advertising</strong> — lets ad platforms such as Meta or TikTok recognize
                  your browser away from our site. Under California law this counts as{' '}
                  <strong>sharing</strong> personal information for cross-context behavioral
                  advertising. It is off unless you turn it on.
                </li>
              </ul>
              <p>
                <strong>We do not sell your personal information</strong> — not for money, and not
                for anything else of value.
              </p>
              <p>
                <strong>Global Privacy Control.</strong> If your browser or an extension sends a
                GPC signal, we treat it as a binding opt-out of advertising and turn that category
                off automatically. You do not have to do anything.
              </p>
              <p>
                <strong>Changing your mind.</strong> You can change or withdraw either choice at
                any time. We remember what you picked and will not ask again unless we add a new
                category.
              </p>
              {/* Dugme u sopstvenom pasusu — vidi napomenu u Footer.tsx. */}
              <p>
                <ConsentSettingsButton />
              </p>
            </>
          ) : (
            <>
              <p>This version of the site does not run analytics or advertising trackers. You do not need to enable tracking to read the site or submit a form.</p>
              <p>If optional tracking is introduced, this policy and the available privacy controls will be updated before it is enabled.</p>
            </>
          )}
          <p>
            <strong>Your state privacy rights.</strong> Depending on where you live, you may have
            the right to know what personal information we hold about you, to get a copy of it, to
            ask us to correct or delete it, and to opt out of targeted advertising. Email{' '}
            <a href={EMAIL_HREF}>{EMAIL}</a> and we will respond. We will not treat you differently
            for exercising any of these rights.
          </p>
        </section>

        <section>
          <h2>
            <span className="sub-num">07</span> Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href={EMAIL_HREF}>{EMAIL}</a>
            {HAS_PHONE ? <>, or call <a href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a></> : null}. The terms that govern use of the site
            are in our <Link href="/terms">Terms of Service</Link>.
          </p>
        </section>
      </div>

      {/* Zavrsni blok — stari sajt ga je imao na svakoj podstranici, ovaj projekat ga je
          izgubio bas na tri: `/truckers-lounge`, `/privacy` i `/terms`. */}
      <div className="contact-actions">
        <Link className="btn btn-primary" href="/apply">
          {APPLY_CTA} ↗
        </Link>
        {HAS_PHONE ? (
          <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
            Call {PHONE_DISPLAY}
          </a>
        ) : null}
      </div>
    </PageShell>
  );
}
