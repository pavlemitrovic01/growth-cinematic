import type { Metadata } from 'next';
import Accordion from '@/components/Accordion';
import PageShell from '@/components/PageShell';
import { FAQ_ITEMS } from '@/lib/faq';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/faq',
  title: 'CDL-A Driver FAQ: Pay, Fees, SAP | GROWTH.CO',
  description:
    'Straight answers on pay, fees, violations, SAP, home time and how fast you can start driving.',
});

/**
 * ⚠️ Pitanja dolaze iz `lib/faq.js` — JEDAN izvor. U MAIN-u su naslovna i /faq nekad
 * drzale odvojene kopije istih pitanja, i taj razlaz je bio mehanizam kojim se lazna
 * tvrdnja („We've placed plenty of drivers…") uvukla samo na /faq. Ne duplirati tekst.
 *
 * FAQPage JSON-LD dolazi u koraku 4 (SEO), i ide SAMO ovde — naslovna prikazuje podskup
 * istih pitanja, pa bi ista Q&A stajala kao schema na dva URL-a.
 */
export default function FAQ() {
  return (
    <PageShell
      eyebrow="FAQ"
      title={
        <>
          Frequently
          <br />
          <em>Asked Questions</em>
        </>
      }
    >
      <Accordion items={FAQ_ITEMS} />
    </PageShell>
  );
}
