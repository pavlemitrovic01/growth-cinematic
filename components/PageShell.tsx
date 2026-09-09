import type { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import MobileBar from './MobileBar';

export default function PageShell({ eyebrow, title, lede, children, wide = false, variant = 'default' }: {
  eyebrow: string; title: ReactNode; lede?: ReactNode; children: ReactNode;
  wide?: boolean; variant?: 'default' | 'form' | 'article';
}) {
  return (
    <div className={'subpage subpage--' + variant}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav />
      {/* ⚠️ suppressHydrationWarning -- vidi `components/CinematicHome.tsx`: `route-in` stize
          imperativno iz `Motion.tsx`, van React-ovog rendera. */}
      <main id="main-content" tabIndex={-1} suppressHydrationWarning>
        <header className="sub-hero">
          <p className="eyebrow">{eyebrow}</p>
          {/* ⚠️ `data-wipe` dodat u `M2` (2026-09-09) — JEDNA linija koja stize na SVE
              povrsine koje `PageShell` renderuje: **11 poziva, 13 povrsina** — devet
              podstranica, `/404` (`not-found.tsx`) i tri clanka. Bas zato je `G2` prosirio
              `G1/A` sa 10 na 14 ruta (13 ovih + `/`, koja ide kroz `CinematicHome`).

              ⚠️ `app/error.tsx` NIJE medju njima i NE nosi ovaj atribut. On namerno ne koristi
              shell — razlog stoji u njegovom zaglavlju. Prva verzija ovog komentara ga je
              nabrajala, jer je `grep -l PageShell` uhvatio bas tu recenicu IZ KOMENTARA.
              Isti obrazac zbog kog `G1` meri renderovan HTML a ne izvor (`LESSONS` L18).

              ⚠️ `<h1>` je na `WIPE_ALLOWED` listi (`tests/rendered-html.test.mjs`) i nema
              nijednog `position:fixed`/`absolute` potomka — `.mobar`, `.consent-bar`,
              `.route-loading` i `.skip-link` svi stoje van njega. Vidi `app/globals.css:908`.

              ⚠️ `.sub-hero` NAMERNO ne dobija ni `data-line` ni `data-stagger`. `CRTA` bi pala
              tacno na Nav-ovu ivicu, a stagger bi ovaj `<h1>` pretvorio u direktno dete — pa bi
              `[data-stagger]>*:nth-child(n)` (0,2,0) pregazio `[data-wipe]` (0,1,0) i
              `--wipe-lead` bi tiho nestao. */}
          <h1 data-wipe>{title}</h1>
          {lede ? <p className="sub-lede">{lede}</p> : null}
        </header>
        <div className={'sub-body' + (wide ? ' sub-body--wide' : '')}>{children}</div>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
