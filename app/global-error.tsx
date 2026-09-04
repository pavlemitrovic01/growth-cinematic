'use client';

import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

/**
 * Hvata pad SAMOG root layout-a — zato mora imati sopstvene `<html>` i `<body>`.
 *
 * ⚠️ NAMERNO BEZ IJEDNE CSS KLASE. Prenета merena cinjenica iz izvornog projekta: kad
 * root layout padne, `document.styleSheets.length === 0` — stylesheet se ne stigne
 * ucitati. Ovaj ekran mora biti citljiv i bez CSS pipeline-a, pa su sve boje inline
 * literali prepisani iz `globals.css` (`--forest`, `--bone`, `--clay`), a ne
 * `var(--...)` koji bi se ovde razresio u nista.
 *
 * ⚠️ RAZLIKA U ODNOSU NA IZVORNI PROJEKAT: tamo je broj telefona hardkodovan ovde, i
 * to je bio JEDINI takav slucaj — pa je kasnija promena broja morala da se seti bas
 * ovog fajla. Ovde se uvozi iz `lib/contact`, sto je bezbedno: to je JS modul sa dve
 * konstante, ne CSS, i pad stylesheet-a ga ne dodiruje. Jedan izvor ostaje jedan.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#08110d',
          color: '#f1e7d5',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '460px' }}>
          <p
            style={{
              margin: '0 0 18px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.28em',
              color: '#d5a06d',
            }}
          >
            SOMETHING BROKE
          </p>
          <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.12, fontWeight: 800, letterSpacing: '-.03em' }}>
            Something broke on our end.
          </h1>
          <p style={{ margin: '18px 0 30px', fontSize: '16px', lineHeight: 1.6, color: 'rgba(241,231,213,.75)' }}>
            Not you — us. Call or text and a real person will help.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={PHONE_TEL_HREF}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '15px 24px',
                borderRadius: '999px',
                background: '#f1e7d5',
                color: '#162019',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '.12em',
                textDecoration: 'none',
              }}
            >
              CALL {PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '15px 24px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#f1e7d5',
                border: '1px solid rgba(241,231,213,.5)',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '.12em',
                cursor: 'pointer',
              }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
