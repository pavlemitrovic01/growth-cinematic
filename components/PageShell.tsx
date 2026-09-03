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
      <main id="main-content" tabIndex={-1}>
        <header className="sub-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {lede ? <p className="sub-lede">{lede}</p> : null}
        </header>
        <div className={'sub-body' + (wide ? ' sub-body--wide' : '')}>{children}</div>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
