import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/about',
  title: 'About GROWTH.CO — CDL-A Recruiting',
  description:
    'Why GROWTH.CO exists, who runs it, and how we work with CDL-A drivers. No fees, no fine print.',
});

/**
 * ⚠️ FOUNDER TEKST PRENET DOSLOVNO. Prethodna verzija u MAIN-u nosila je DVE zive
 * povrede koje je L3 uklonio 2026-08-24:
 *  · „people who mostly scam and cheat in this business" — negativna univerzalna
 *    tvrdnja o industriji, trajna zabrana §2.3
 *  · „We promise stable and secure earnings" — garancija zarade, C19 PROHIBITED
 * Ova verzija opisuje JAZ, bez izvrsioca i bez obecanog ishoda. Ne „popravljati" je
 * nazad ka jacoj formulaciji.
 *
 * ⚠️ C9: „four years in CDL-A recruiting" je founderova licna tvrdnja, NE starost
 * firme (GROWTH je nova). I: Nate Mikic NIKAD NIJE VOZIO KAMION — svaka formulacija
 * koja implicira voznju („in the seat", „behind the wheel", „on the road", „from the
 * cab") je trajna zabrana §2.4, ne evidenciona rupa.
 *
 * ⚠️ Potpis foundera stoji JEDNOM, na kraju price. MAIN ga je nosio dvaput dok ga L7
 * nije uklonio — ispod kartica nije potpisivao nista.
 */

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
    p: 'What we tell you is what you get. No fine print, no surprises after orientation.',
  },
  {
    h: 'Speed',
    p: 'Ready drivers can start in as little as 3–5 days. Paperwork, physicals, and drug tests move at their own pace. We move fast because you need to.',
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
            <h3>{v.h}</h3>
            <p>{v.p}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
