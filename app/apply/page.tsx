import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/apply',
  title: 'Apply — CDL-A Driver Recruiting | GROWTH.CO',
  description:
    'Apply in 2 minutes. A real recruiter usually calls you back within 15–20 minutes during business hours — free for drivers, always.',
});

/**
 * ⚠️ COPY JE PRENET IZ MAIN-a DOSLOVNO, ne prepisan. Svaka recenica ispod je prosla
 * kroz `docs/CLAIMS.md` registar i vise claims batch-eva:
 *  · „20+ partner carriers" — C10 zabranjuje „vetted"/„verified" kao goli pridev
 *  · „4 years in the industry" — C9; svaka formulacija koja implicira VOZNJU kamiona
 *    („in the seat", „behind the wheel", „on the road") je trajno zabranjena §2.4
 *  · „usually … during business hours" — C12, goli oblik „15–20 minuta" je zabranjen
 *  · „All 48 continental states" — C8 (pokrivenost), ne „now placing" (C41 je OPEN)
 * Ne parafrazirati bez provere protiv registra.
 */
export default function ApplyPage() {
  return (
    <PageShell
      eyebrow="ALL 48 CONTINENTAL STATES"
      title={
        <>
          Apply in 2 minutes.
          <br />
          <em>We usually call back within 15–20 minutes during business hours.</em>
        </>
      }
      lede="4 years in the industry. 20+ partner carriers. Free for drivers, always."
    >
      <div className="sub-trust">
        <span>No hidden fees</span>
        <span>Call or text us daily — weekends included</span>
      </div>
      <ApplyForm />
    </PageShell>
  );
}
