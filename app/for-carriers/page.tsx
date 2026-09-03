import type { Metadata } from 'next';
import CarrierForm from '@/components/CarrierForm';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/for-carriers',
  title: 'Hire CDL-A Drivers | GROWTH.CO',
  description:
    'Qualified, road-ready CDL-A drivers matched to your lanes. You pay only for successful placements.',
});

/**
 * ⚠️ Server komponenta koja renderuje klijentsku formu — `CarrierForm.tsx` nosi
 * `'use client'` (state, fetch). Next App Router ne dozvoljava `metadata` export iz
 * klijentske komponente, pa je ovaj rez neophodan, ne stilski izbor.
 *
 * Copy prenet iz MAIN-a. „You pay only for successful placements" je poslovni uslov,
 * ne tvrdnja o ucinku — ne trazi hedz kao C11/C12.
 */
export default function ForCarriersPage() {
  return (
    <PageShell
      eyebrow="FOR CARRIERS"
      title={
        <>
          Road-ready drivers,
          <br />
          <em>matched to your lanes.</em>
        </>
      }
      lede="Qualified CDL-A drivers matched to your lanes. You pay only for successful placements."
    >
      <CarrierForm />
    </PageShell>
  );
}
