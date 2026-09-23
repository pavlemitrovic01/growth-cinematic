import type { Metadata } from 'next';
import { CALLBACK_SENTENCE } from '@/lib/contact';
import Link from 'next/link';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import { HAS_PHONE, PHONE_DISPLAY, PHONE_TEL_HREF, PHONE_SMS_HREF, EMAIL, EMAIL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/contact',
  title: 'Contact a CDL-A Recruiter | TTIrecruiting',
  description:
    'Email TTIrecruiting about your next driving job, or request a callback. Free for drivers.',
});

/**
 * ⚠️ Audit je ovu stranu ocenio 2/5 — najplica na sajtu. Dva nalaza su popravljena ovde:
 *
 * 1. IZGUBLJENA JEDINA DIFERENCIRAJUCA RECENICA. MAIN
 *    (`C:/dev/growth/app/contact/page.jsx:25`) nosi „No phone tree, no ticket number." —
 *    fraza koja u ovom repou nije postojala ni na jednom mestu (provereno grep-om, nula
 *    pogodaka). Vracena doslovno, sa „staffed" umesto „business" hours, u skladu sa C12
 *    dozvoljenom formulacijom i izmenom od 2026-09-05.
 *
 * 2. LEDE JE POMINJAO „hiring drivers", A STRANA NIJE IMALA IJEDAN LINK KA `/for-carriers`
 *    (fajl uopste nije uvozio `Link`). Carrier koji dodje na `/contact` je dobijao formu
 *    za vozace. Sada se publika grana pre nego sto stigne do forme.
 */
export default function Contact() {
  return (
    <PageShell
      variant="form"
      eyebrow="CONTACT"
      title={
        <>
          A real conversation.
          <br />
          <em>About your next move.</em>
        </>
      }
      lede="Questions about a job, your experience or hiring drivers? Let’s talk."
    >
      {HAS_PHONE ? (
      <div className="contact-direct">
        <div>
          <p className="rail-eyebrow">CALL OR TEXT</p>
          <a className="contact-number" href={PHONE_TEL_HREF}>
            {PHONE_DISPLAY}
          </a>
          <p>
            No phone tree, no ticket number. We answer fast — usually within 15–20 minutes during
            staffed hours. Reach out daily, including weekends.
          </p>
        </div>
        <div className="contact-actions">
          <a className="btn btn-primary" href={PHONE_TEL_HREF}>
            Call us ↗
          </a>
          <a className="btn btn-ghost" href={PHONE_SMS_HREF}>
            Send a text
          </a>
        </div>
      </div>
      ) : null}

      <p className="contact-email">
        {HAS_PHONE ? 'Prefer email?' : 'Email us:'} <a href={EMAIL_HREF}>{EMAIL}</a>
      </p>

      {/*
        Grananje po publici. Lede pominje tri razloga za dolazak, a strana je do sada nudila
        jednu stvar: formu za vozace. Carrier i vozac koji tek istrazuje su odlazili praznih
        ruku ili u futer.
      */}
      <div className="sub-3up" data-stagger>
        <section className="sub-section">
          <h2>
            <span className="sub-num">01</span> Looking for a driving job
          </h2>
          <p>
            {HAS_PHONE ? 'Call or text — that is the fastest way. If you would rather write it down, the full application' : 'The full application'}{' '}
            takes about two minutes and it is{' '}
            <Link href="/apply">right here</Link>.
          </p>
        </section>
        <section className="sub-section">
          <h2>
            <span className="sub-num">02</span> Hiring drivers for your fleet
          </h2>
          <p>
            Tell us about your lanes, equipment and requirements on{' '}
            <Link href="/for-carriers">the carrier page</Link>. You pay only for successful
            placements.
          </p>
        </section>
        <section className="sub-section">
          <h2>
            <span className="sub-num">03</span> Just looking around
          </h2>
          <p>
            Start with <Link href="/how-it-works">how it works</Link>, or the{' '}
            <Link href="/faq">questions drivers ask us most</Link>. No form required.
          </p>
        </section>
      </div>

      <section className="contact-callback" aria-labelledby="callback-title">
        <h2 id="callback-title">Want us to call you?</h2>
        <p>
          {CALLBACK_SENTENCE} No obligation,
          and it’s free for drivers, always.
        </p>
        <div className="contact-quick">
          <ApplyForm variant="quick" />
        </div>
      </section>
    </PageShell>
  );
}
