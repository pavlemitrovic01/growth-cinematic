import type { Metadata } from 'next';
import Link from 'next/link';
import CarrierForm from '@/components/CarrierForm';
import PageShell from '@/components/PageShell';
import { HAS_PHONE, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/for-carriers',
  title: 'Hire CDL-A Drivers | TTIrecruiting',
  description:
    'Talk to TTIrecruiting about your lanes, equipment and hiring requirements. CDL-A driver recruiting, with payment only for successful placements.',
});

/**
 * ⚠️ OVO JE JEDINA STRANA PUBLIKE KOJA PLACA, i audit ju je ocenio 2/5 — najtanja na
 * sajtu. Stara verzija je bila hero + forma + tri recenice, bez ijednog potpornog bloka
 * i bez ijednog izlaza (fajl nije ni uvozio `Link`).
 *
 * ⚠️ SAV DODAT TEKST JE PRENET, NE NAPISAN. Svaka nova recenica dolazi sa mesta gde je
 * vec prosla registar tvrdnji:
 *   · model naknade — doslovno iz `components/CinematicHome.tsx` (C5 + dopuna L1)
 *   · pokrivenost — doslovno iz `lib/faq.js` (C8; „48 contiguous", ne „all 50")
 *   · pravni odnos — doslovno iz `components/Footer.tsx` (C18)
 * Lede je tvrdio „You pay only for successful placements" bez potpornog bloka; blok koji
 * to podupire postojao je na naslovnoj i samo nije bio ovde.
 *
 * ⚠️ STA NAMERNO NIJE DODATO: rok odgovora za carrier-a. Vozac ga dobija na cetiri mesta
 * (15–20 minuta, uz oba C12 hedza), carrier nijedan — i to je stvarna rupa. Ali MAIN-ova
 * formulacija („within 24 hours") je tvrdnja o vremenu odgovora BEZ ijednog reda u
 * registru, i ovaj projekat ju je svesno izbacio. Nov rok trazi Pavlov input, isto kao
 * radno vreme. Zavedeno u `docs/AUDIT.md`.
 */
export default function ForCarriersPage() {
  return (
    <PageShell
      variant="form"
      eyebrow="FOR CARRIERS"
      title={
        <>
          The right drivers.
          <br />
          <em>For your operation.</em>
        </>
      }
      lede="Tell us about your lanes, equipment and hiring requirements. You pay only for successful placements."
    >
      {/* `.sub-trust` je vec ostilizovan (globals.css) i koristi ga `/how-it-works`. */}
      <div className="sub-trust">
        <span>Payment only on successful placement</span>
        <span>48 contiguous states</span>
        <span>Recruiting agency, not a carrier</span>
      </div>

      <div className="sub-grid">
        <section aria-labelledby="carrier-title">
          <div className="form-heading">
            <h2 id="carrier-title">Let’s talk recruiting</h2>
            <p>Leave your contact details. All fields except email are required.</p>
          </div>
          <CarrierForm />
        </section>
        <aside className="sub-rail" aria-label="Our recruiting process">
          <div className="card card--cta">
            <p className="rail-eyebrow">HOW WE WORK</p>
            <h2>Start with the details.</h2>
            <ol className="rail-steps">
              <li>We discuss your hiring criteria, pay structure and available positions.</li>
              <li>We match driver experience and preferences to your requirements.</li>
              <li>Your team makes the hiring decision. We help coordinate the next steps.</li>
            </ol>
            {HAS_PHONE ? (
              <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
                Call {PHONE_DISPLAY}
              </a>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="sub-3up" data-stagger>
        <section className="sub-section">
          <h2>
            <span className="sub-num">01</span> How we get paid
          </h2>
          {/* Doslovno iz `CinematicHome.tsx` — C5 dozvoljava „100% free for drivers",
              dopuna L1 dozvoljava i negativno obecanje izvedeno iz modela. */}
          <p>
            We charge a flat placement fee to the carrier <em>only</em> after a driver
            successfully starts driving for you. We don’t get paid unless they actually start —
            which means we have no reason to send you someone who won’t stay.
          </p>
        </section>

        <section className="sub-section">
          <h2>
            <span className="sub-num">02</span> Where we recruit
          </h2>
          {/* Doslovno iz `lib/faq.js` — C8. „48 contiguous", nikad „all 50 states". */}
          <p>
            Our recruiting coverage includes the 48 contiguous US states. OTR, regional, local and
            dedicated placements depend on driver availability, qualifications and your own
            requirements.
          </p>
        </section>

        <section className="sub-section">
          <h2>
            <span className="sub-num">03</span> What we are
          </h2>
          {/* Doslovno iz `Footer.tsx` — C18. B2B posetiocu ovo ne sme biti sitan slog u futeru. */}
          <p>
            TTIrecruiting is a driver recruiting agency and acts as an intermediary. We are not a
            motor carrier or an employer. Hiring decisions, employment terms and pay are agreed
            between you and the driver.
          </p>
        </section>
      </div>

      <p className="contact-email">
        Curious how the driver side works? Read <Link href="/how-it-works">how it works</Link> or{' '}
        <Link href="/about">who we are</Link>.
      </p>
    </PageShell>
  );
}
