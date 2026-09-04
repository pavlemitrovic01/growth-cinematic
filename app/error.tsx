'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL_HREF, PHONE_SMS_HREF } from '@/lib/contact';

/**
 * Granica greske za rutni segment. Renderuje se UNUTAR root layout-a, pa je
 * `globals.css` ucitan i klase rade normalno.
 *
 * ⚠️ NAMERNO BEZ `PageShell`-a. Shell povlaci Nav + Footer + MobileBar; ako je pad
 * dosao bas iz nekog od njih, ekran greske bi pao zajedno sa stranicom koju treba da
 * spase. Manje zavisnosti ovde znaci manje nacina da i ovaj ekran otkaze.
 *
 * ⚠️ Vozac mora dobiti IZLAZ, ne samo poruku. Tri: pozovi, probaj ponovo, nazad na
 * pocetnu. Telefon je prvi jer je greska na `/apply` inace izgubljen lead.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Digest je jedino sto Next izlaze o serverskoj gresci u produkciji.
    console.error('[error-boundary]', error?.digest ?? '', error);
  }, [error]);

  return (
    <div className="subpage">
      <main className="error-page">
        <p className="eyebrow">SOMETHING BROKE</p>
        <h1>
          Something broke
          <br />
          <em>on our end.</em>
        </h1>
        <p className="sub-lede">
          Not you — us. Call or text and a real person will help, or try loading the page again.
        </p>
        <div className="error-actions">
          <a className="btn btn-primary" href={PHONE_TEL_HREF}>
            Call {PHONE_DISPLAY} ↗
          </a>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn-ghost" href="/">
            Back to homepage
          </Link>
        </div>
        <p className="error-alt">
          Prefer to text? <a href={PHONE_SMS_HREF}>Send us a message</a>.
        </p>
      </main>
    </div>
  );
}
