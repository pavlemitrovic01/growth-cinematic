import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/how-it-works',
  title: 'How CDL-A Driver Placement Works | GROWTH.CO',
  description:
    'The whole process, start to finish: apply in 2 minutes, usually get a callback within 15–20 minutes during staffed hours. No fees for drivers.',
});

const STEPS = [
  {
    n: '01',
    h: 'Apply',
    p: "Two minutes: CDL class, experience, and what you're looking for. No resume, no account to create. If you'd rather talk first, call us instead.",
  },
  {
    n: '02',
    h: 'We call you',
    p: 'Usually within 15–20 minutes during staffed hours. A real recruiter walks through your priorities — pay, home time, equipment, lanes. Nothing is decided on this call.',
  },
  {
    n: '03',
    h: 'We match you',
    p: 'We look for carriers that fit your experience and priorities. We explain the offers, including pay and deductions. You decide whether any of them work for you.',
  },
  {
    n: '04',
    h: "You're rolling",
    p: 'Paperwork, DOT physical, and drug test happen here — we help you through them. Ready drivers can start in as little as 3–5 days.',
  },
];

export default function HowItWorks() {
  return (
    <PageShell
      eyebrow="HOW IT WORKS"
      title={
        <>
          Here&apos;s exactly how it works
          <br />
          <em>— no surprises.</em>
        </>
      }
      lede="From the first conversation to onboarding: here is what we do, what you decide and what depends on the carrier."
    >
      <div className="sub-trust">
        <span>Call or text us daily — weekends included</span>
        <span>Free for drivers, always</span>
        <span>One recruiter, start to finish</span>
      </div>

      <div className="sub-grid">
        <div className="sub-main">
          <section className="sub-section">
            <div className="sub-head">
              <span className="sub-num">01</span>
              <h2>Four steps, start to finish</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.n}>
                  <span className="step-n">{s.n}</span>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="sub-section">
            <div className="sub-head">
              <span className="sub-num">02</span>
              <h2>What to expect from us</h2>
            </div>
            <div className="sub-2up">
              <article className="card">
                <h3>What we need from you</h3>
                <p>Straight list, so nobody wastes a week finding out:</p>
                <p>
                  A valid CDL-A · documents showing you&apos;re authorized to work in the US ·
                  enough English to handle dispatch and DOT · a record that&apos;s clean or that
                  you can explain honestly · and genuine readiness to start.
                </p>
              </article>
              <article className="card">
                <h3>What we handle</h3>
                <p>Support from your application through onboarding:</p>
                <p>
                  Finding carriers · matching you to lanes that fit · help with the paperwork ·
                  chasing recruiters and onboarding on your behalf · and staying reachable after
                  you&apos;re placed.
                </p>
              </article>
            </div>
          </section>

          {/* ⚠️ Ovaj pasus je kanonski C11 caveat. Ne brisati — bez njega „3–5 days"
              u koraku 04 postaje gola, zabranjena tvrdnja. */}
          <p className="sub-caveat">
            <strong>One honest caveat:</strong> we can&apos;t promise a 3–5 day start to a driver
            who isn&apos;t ready — paperwork, physicals, and drug tests move at their own pace. We help you track the next steps, but a start date is not guaranteed.
          </p>
        </div>

        <aside className="sub-rail">
          <div className="card card--cta">
            <h2>Ready when you are</h2>
            <p>
              Two minutes to apply. A real recruiter usually calls back within 15–20 minutes during
              staffed hours.
            </p>
            <Link className="btn btn-primary" href="/apply">
              Apply now ↗
            </Link>
            <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
              Call us
            </a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
