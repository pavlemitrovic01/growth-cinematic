'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

const LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/for-carriers', label: 'For Carriers' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/truckers-lounge', label: 'Resources' },
];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  return (
    <header className="nav">
      <Link className="brand" href="/" aria-label="GROWTH home"><span className="brand-mark">G↗</span><span>GROWTH</span></Link>
      <nav className={`nav-links${open ? ' is-open' : ''}`} id="nav-links" aria-label="Main">
        {LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>
      <div className="nav-actions">
        <a className="nav-call" href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a>
        <Link className="nav-cta" href="/apply">APPLY NOW</Link>
        <button ref={button} type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
      <noscript><style>{'@media(max-width:1100px){.nav-links{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 12px}.nav-links a{padding:8px 0;font-size:12px}.nav-toggle{display:none!important}}'}</style></noscript>
    </header>
  );
}
