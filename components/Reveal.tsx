'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * TTI2 (2026-09-23): blag pokret pri skrolu -- delovi strane ISPOD prvog ekrana se lagano podignu kad udju u kadar.
 *
 * ⚠️ Bez JS-a nista nije sakriveno: klasu `rv` dodaje ovaj efekat, POSLE hidracije, a samo elementima koji su u tom
 * trenutku ispod prvog ekrana -- ono sto posetilac vec vidi se nikad ne sakriva, pa nema treptaja. Uz
 * `prefers-reduced-motion: reduce` efekat ne radi nista. Zaglavlje strane ima svoj CSS ulaz (`globals.css`, TTI2).
 */
const TARGETS = '.sub-trust, .sub-head, .step, .card, .sub-section > p, .kbyg-lead, .kbyg-mod, .sub-caveat, .faq-item, .post-card, .contact-direct, .contact-callback, .sub-3up > .sub-section, .page-next, .home-section-top, .home-section h2, .home-steps > li, .home-founder blockquote';

export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: no-preference)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('rv-in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of document.querySelectorAll<HTMLElement>(TARGETS)) {
      if (el.getBoundingClientRect().top < innerHeight) continue;
      el.classList.add('rv');
      io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
