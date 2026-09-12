'use client';

import { useEffect } from 'react';

/**
 * Otvara pitanje na koje pokazuje sidro u URL-u (`/faq#violations`).
 *
 * ⚠️ ZASTO UOPSTE TREBA. `<details>` se NE otvara sam kad sidro pokazuje na njega — browser
 * samo skroluje do zatvorenog pitanja. Bez ovoga bi deep-link dovodio do naslova pitanja, a ne
 * do odgovora.
 *
 * ⚠️ BEZ JAVASCRIPTA posetilac slece na ZATVORENO pitanje: vidi ga i otvara jednim klikom.
 * Svesna degradacija, ne propust — sadrzaj je u serverskom HTML-u i bez ovog fajla.
 *
 * ⚠️ MONTIRA SE SAMO NA `/faq`. Naslovna prikazuje isti spisak pitanja, ali bez sidara
 * (`Accordion` prop `anchors`), pa tamo ovaj kod ne bi imao sta da radi — i ne salje joj se.
 */
export default function FaqDeepLink() {
  useEffect(() => {
    const openTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      // Otvaranje menja visinu, pa se pozicija racuna TEK posle njega.
      target.scrollIntoView({ block: 'start' });
      target.querySelector('summary')?.focus({ preventScroll: true });
    };
    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, []);
  return null;
}
