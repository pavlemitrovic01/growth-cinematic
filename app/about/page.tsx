import Link from 'next/link';
import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/about',
  title: 'About GROWTH.CO — CDL-A Recruiting',
  description:
    'Why GROWTH.CO exists, who runs it, and how we work with CDL-A drivers. Free for drivers, with the details explained before you decide.',
});

const STORY = [
  <>
    <strong>Four years in this industry taught me where it breaks.</strong>
  </>,
  <>
    I spent four years in CDL-A recruiting. You learn the business quickly — the carriers, the
    paperwork, how an offer gets put together.
  </>,
  <>
    You also learn what drivers tell you when a job doesn&apos;t match the description they were
    given. Miles that came in lower. A deduction nobody had explained. A lease that read
    differently three months in than it did on the phone.
  </>,
  <>I heard those calls often enough to stop being surprised by them.</>,
  <>
    <strong>GROWTH is built around that gap.</strong> You get the real numbers before you commit —
    including the ones that don&apos;t help us — and then you decide for yourself.
  </>,
  <>That&apos;s the whole company. There isn&apos;t a second idea.</>,
];

const VALUES = [
  {
    h: 'Transparency',
    p: 'We explain pay structure, deductions and the details of an offer before you make a decision.',
  },
  {
    h: 'Speed',
    p: 'Ready drivers can start in as little as 3–5 days. Paperwork, physicals, and drug tests move at their own pace. We help you understand what is ready and what still needs to happen.',
  },
  {
    h: 'Honesty',
    p: "If a carrier isn't right for you, we'll say so. Our job is to find the right fit, not the fastest placement.",
  },
];

export default function About() {
  return (
    <PageShell
      eyebrow="ABOUT US"
      title={
        <>
          Built on
          <br />
          <em>honesty.</em>
        </>
      }
    >
      <div className="prose">
        {STORY.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="signature">— Nate Mikic, Founder, GROWTH.CO</p>
      </div>

      <div className="sub-3up">
        {VALUES.map((v) => (
          <article className="card" key={v.h}>
            <h2>{v.h}</h2>
            <p>{v.p}</p>
          </article>
        ))}
      </div>
      <div className="page-next"><p>Want to see how we work?</p><Link className="btn btn-primary" href="/how-it-works">See the process ↗</Link></div>
    </PageShell>
  );
}
