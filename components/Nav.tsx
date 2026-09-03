'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

/**
 * Globalna navigacija. Struktura je iz `docs/SITEMAP.md` §3 — `Apply Now` je primarno
 * dugme i uvek vidljivo, `Call` nosi broj.
 *
 * ⚠️ Ruta je `/truckers-lounge`, a LABELA je „Resources". To nije nedoslednost nego
 * prenета odluka (MAIN, D11): ime rute je na brend-glasu i vec je indeksirano, pa se
 * nejasnoca imena resava labelom u navigaciji, ne 301 redirectom.
 *
 * ⚠️ Klijentska komponenta je SAMO zbog mobilnog menija. Bez JS-a `<nav>` ostaje
 * otvoren i citljiv (vidi `.nav-links` u globals.css — `display:flex` je default, a
 * sakriva se tek u media query-ju gde dugme postoji da ga vrati).
 */

const LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/for-carriers', label: 'For Carriers' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/truckers-lounge', label: 'Resources' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <Link className="brand" href="/" aria-label="GROWTH home">
        <span className="brand-mark">G↗</span>
        <span>GROWTH</span>
      </Link>

      <nav className={`nav-links${open ? ' is-open' : ''}`} id="nav-links" aria-label="Main">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <a className="nav-call" href={PHONE_TEL_HREF}>
          {PHONE_DISPLAY}
        </a>
        <Link className="nav-cta" href="/apply">
          APPLY NOW
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
    </header>
  );
}
