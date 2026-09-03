import type { Metadata } from 'next';
import Link from 'next/link';
import CarrierForm from '@/components/CarrierForm';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
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
    <main className="subpage">
      <header className="sub-header">
        <Link className="brand" href="/" aria-label="GROWTH home">
          <span className="brand-mark">G↗</span>
          <span>GROWTH</span>
        </Link>
        <a className="sub-call" href={PHONE_TEL_HREF}>
          {PHONE_DISPLAY}
        </a>
      </header>

      <section className="sub-hero">
        <p className="eyebrow">FOR CARRIERS</p>
        <h1>
          Road-ready drivers,
          <br />
          <em>matched to your lanes.</em>
        </h1>
        <p className="sub-lede">
          Qualified CDL-A drivers matched to your lanes. You pay only for successful placements.
        </p>
      </section>

      <section className="sub-body">
        <CarrierForm />
      </section>

      <footer className="sub-footer">
        <p>
          GROWTH.CO is a driver recruiting agency (intermediary), not a motor carrier or employer.
        </p>
        <p className="sub-legal">
          <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
        </p>
      </footer>
    </main>
  );
}
