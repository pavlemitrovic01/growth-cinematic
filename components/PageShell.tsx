import type { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import MobileBar from './MobileBar';

/**
 * Omotac za sve podstranice: navigacija, sadrzaj, footer, mobilni akcioni bar.
 *
 * Naslovna (`app/page.tsx`) ga NE koristi — ona nosi sopstveni sticky stage i svoj
 * header preko scene. Spajanje ta dva ide uz preradu heroja, ne ovde.
 *
 * `eyebrow` / `title` / `lede` prave zaglavlje stranice; `title` prima ReactNode da
 * bi drugi red mogao da bude `<em>` (konturni tretman).
 */
export default function PageShell({
  eyebrow,
  title,
  lede,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="subpage">
      <Nav />
      <main>
        <section className="sub-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {lede ? <p className="sub-lede">{lede}</p> : null}
        </section>
        <section className={`sub-body${wide ? ' sub-body--wide' : ''}`}>{children}</section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
