'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HAS_PHONE, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

const LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/for-carriers', label: 'For carriers' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/truckers-lounge', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];
const shown = (el: HTMLElement | null) => !!el && el.getClientRects().length > 0;
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const escape = (event: KeyboardEvent) => {
      // Dva dugmeta dele isto stanje: `nav-toggle` na telefonu, `nav-pill` na >= 1025 px. Fokus ide na ono koje se vidi.
      if (event.key === 'Escape') { setOpen(false); (shown(pill.current) ? pill : button).current?.focus(); }
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
  /* RD4 (>= 1025 px): zatvorena pilula menja boju po pozadini ispod sebe (`RD4-LOOK`). Uzima se prva neprovidna
     pozadina ispod tacke gde pilula stoji zatvorena (desna ivica, sredina ekrana), pa merenje ne zavisi od toga da li je
     panel trenutno otvoren. Bez JS-a atributa nema i CSS ostaje na kremu — heroj i zaglavlja podstranica su tamni.
     Atribut ide na `<header>`: nosi ga i pilula i panel, a na telefonu se nikad ne postavlja. */
  useEffect(() => {
    const wide = matchMedia('(min-width: 1025px)');
    let frame = 0;
    const luminance = (x: number, y: number) => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (header.current?.contains(el)) continue;
        for (let node: Element | null = el; node; node = node.parentElement) {
          const rgba = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
          if (rgba && (rgba.length < 4 || Number(rgba[3]) > 0.5)) return (0.2126 * +rgba[0] + 0.7152 * +rgba[1] + 0.0722 * +rgba[2]) / 255;
        }
      }
      return 0;
    };
    const check = () => {
      frame = 0;
      if (!header.current || !pill.current || !wide.matches) return;
      const edge = pill.current.getBoundingClientRect().right;
      header.current.dataset.tone = luminance(edge - 24, innerHeight / 2) > 0.5 ? 'light' : 'dark';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return (
    <header className="nav" ref={header}>
      <Link className="brand" href="/" aria-label="TTIrecruiting home"><Image className="brand-logo" src="/logo-96.png" width={44} height={44} alt="" priority /><span>TTIrecruiting</span></Link>
      {/* RD4: pilula je dugme ODMAH ispred `<nav>`, bez omotaca. Na telefonu je skrivena. ⚠️ Omotac sa
          `display:contents` je izmereno menjao zagladjivanje zaglavlja na telefonu (raspored isti, pikseli ne), pa ga nema. */}
      <button ref={pill} type="button" className="nav-pill" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
        <span aria-hidden="true">☰</span><span>Menu</span>
      </button>
      <nav ref={navigation} className={'nav-links' + (open ? ' is-open' : '')} id="nav-links" aria-label="Main">
        {LINKS.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href || pathname.startsWith(link.href + '/') ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>
      <div className="nav-actions">
        {HAS_PHONE ? <a className="nav-call" href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a> : null}
        <Link className="nav-cta" href="/apply" aria-current={pathname === '/apply' ? 'page' : undefined}>APPLY NOW</Link>
        <button ref={button} type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
      <noscript><style>{'@media(max-width:1024px){.nav-links{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 12px}.nav-links a{padding:10px 0;font-size:12px}.nav-toggle{display:none!important}}'}</style></noscript>
    </header>
  );
}
