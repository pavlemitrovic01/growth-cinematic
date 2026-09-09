'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Pogon za `reveal`, `stagger` i `sweep` iz motion recnika (Faza 2).
 *
 * ⚠️ NE RENDERUJE NISTA. Cela svrha je da doda klasu `.is-in` elementima koje CSS drzi
 * skrivenim, i da na promenu rute pokrene jedan fade. Ako ova komponenta nikad ne
 * montira, sajt mora ostati citljiv — vidi „watchdog" nize.
 *
 * ⚠️ ZASTO NE framer-motion. Biblioteka pece pocetno stanje u SSR HTML kao inline
 * `opacity:0`, koji se bez JavaScripta nikad ne ponisti. Ovde je polaritet obrnut:
 * skriveno stanje zivi u CSS-u iza klase `html.js-motion` koju dodaje JS, pa bez JS-a
 * nikad ne postoji. Detalji u `app/globals.css`, blok MOTION.
 */
export default function Motion() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // ── reveal + stagger ───────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;

    /**
     * ⚠️ Ako `js-motion` nije na `<html>`, nista nije ni skriveno — inline skripta je
     * odustala (nema IntersectionObserver-a, ili korisnik trazi manje pokreta). Tada ovde
     * nema sta da se radi i ne sme se nista dirati.
     */
    if (!root.classList.contains('js-motion')) return;

    /**
     * ⚠️ WATCHDOG, DRUGA POLOVINA. Inline skripta je postavila tajmer koji sklanja
     * `js-motion` ako se ovaj atribut ne pojavi na vreme. Postavljanjem atributa
     * preuzimamo odgovornost: od ovog trenutka observer otkriva sadrzaj.
     *
     * Scenario zbog kog watchdog postoji: hidracija padne ili se ova komponenta iz bilo
     * kog razloga ne montira. Bez njega bi sadrzaj ostao skriven zauvek, a `verify-nojs`
     * to ne bi uhvatio jer gleda samo inline stilove.
     *
     * ⚠️ ZASTO SE CEKA VIDLJIVOST. Izmereno 2026-09-05: u tabu sa
     * `visibilityState === "hidden"` browser ne isporucuje IntersectionObserver callback-ove
     * uopste — provereno kontrolnim observer-om koji nema veze sa ovom komponentom, i ni on
     * se nije okinuo. Prva verzija je atribut postavljala odmah po montiranju i time
     * RAZORUZAVALA watchdog: komponenta je ziva, observer cuti, sadrzaj ostaje skriven.
     *
     * Realan scenario je otvaranje sajta u pozadinskom tabu (srednji klik, „open in new
     * tab"). Sada se odgovornost preuzima tek kad tab stvarno postane vidljiv; do tada
     * watchdog radi svoj posao i posle 3s otkriva sve bez animacije. Gore izgleda, ali se
     * vidi — a to je jedini ishod koji sme da postoji.
     */
    let claimWhenVisible: (() => void) | null = null;
    if (document.visibilityState === 'visible') {
      root.setAttribute('data-motion-ready', '1');
    } else {
      claimWhenVisible = () => {
        if (document.visibilityState !== 'visible') return;
        root.setAttribute('data-motion-ready', '1');
        if (claimWhenVisible) document.removeEventListener('visibilitychange', claimWhenVisible);
      };
      document.addEventListener('visibilitychange', claimWhenVisible);
    }

    // ⚠️ Jedan izlaz iz efekta odavde nadole: listener iznad mora da se skloni i kad meta
    // nema (promena rute na stranicu bez `data-reveal` elemenata), inace curi po navigaciji.
    const detach = () => {
      if (claimWhenVisible) document.removeEventListener('visibilitychange', claimWhenVisible);
    };

    /**
     * ⚠️ `[data-wipe]` i `[data-line]` dodati u `M1` (2026-09-09). Oba primitiva drze
     * skriveno pocetno stanje iza `:not(.is-in)`, pa im observer MORA dodeliti klasu —
     * bez ovog prosirenja bi ostali skriveni dok watchdog ne odradi svoje posle 3s.
     */
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal],[data-stagger],[data-wipe],[data-line]');
    if (!targets.length) return detach;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          // Otkriveno ostaje otkriveno — nema ponovnog skrivanja na skrol nazad.
          observer.unobserve(entry.target);
        }
      },
      // Blago uvuceno odozdo da sekcija krene tek kad stvarno ulazi u kadar, a ne dok je
      // jos jedan piksel visoka. Prag je nizak jer su mete cele sekcije, ne sitni elementi.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      detach();
    };
  }, [pathname]);

  // ── sweep: prelaz rute ─────────────────────────────────────────────────────
  useEffect(() => {
    // Prvi render se preskace: stranica je vec naslikana, pa bi fade bio bljesak.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const main = document.getElementById('main-content');
    if (!main) return;

    /**
     * ⚠️ Reflow izmedju uklanjanja i dodavanja klase je OBAVEZAN. Bez njega browser spoji
     * dve promene u isti frame, klasa nikad ne „ode", i animacija se ne pokrece drugi put
     * na istoj instanci `main`-a.
     */
    main.classList.remove('route-in');
    void main.offsetWidth;
    main.classList.add('route-in');
  }, [pathname]);

  return null;
}
