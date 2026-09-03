'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

const LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/for-carriers', label: 'For carriers' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/truckers-lounge', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);
  return (
    <header className="nav" ref={header}>
      <Link className="brand" href="/" aria-label="GROWTH home"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" /><path d="M25 17a10 10 0 1 0 1 14v-7h-9" fill="none" stroke="currentColor" strokeWidth="3" /><path d="m29 20 8-8m-8 0h8v8" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg></span><span>GROWTH</span></Link>
      <nav ref={navigation} className={'nav-links' + (open ? ' is-open' : '')} id="nav-links" aria-label="Main">
        {LINKS.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(link.href + '/') ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>
      <div className="nav-actions">
        <a className="nav-call" href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a>
        <Link className="nav-cta" href="/apply" aria-current={pathname === '/apply' ? 'page' : undefined}>APPLY NOW</Link>
        <button ref={button} type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
      <noscript><style>{'@media(max-width:1200px){.nav-links{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 12px}.nav-links a{padding:10px 0;font-size:12px}.nav-toggle{display:none!important}}'}</style></noscript>
    </header>
  );
}
