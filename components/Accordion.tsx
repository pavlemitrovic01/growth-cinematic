'use client';

import { useState } from 'react';

/**
 * FAQ akordeon.
 *
 * ⚠️ `aria-expanded` + `aria-controls` na dugmetu, panel nosi `id` i `hidden`. To je
 * prenета a11y ispravka iz MAIN-a (F3.1) — bez njih citac ekrana ne zna da je sekcija
 * sklopiva ni koji panel dugme kontrolise.
 *
 * ⚠️ Panel se sakriva atributom `hidden`, ne `display:none` iz CSS-a. Razlog je prenет
 * nalaz iz MAIN-a (L4a/L42): sadrzaj skriven CSS svojstvom ne vidi ni provera no-JS
 * ugovora ni pretraga na stranici. `hidden` je semanticko stanje, ne stil.
 *
 * ⚠️ Prvi panel je otvoren po difoltu. MAIN je otkrio da sklopljeni akordeoni kriju
 * 8 odgovora na /faq i 4 na naslovnoj od svakog ko ne klikce — sto je za SEO i za
 * vozaca isto sto i da ih nema.
 */

export type FaqItem = { id: string; q: string; a: string };

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="faqlist">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div className="faq-item" key={item.id}>
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-btn-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.q}</span>
                <span className="faq-sign" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              className="faq-a"
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-btn-${item.id}`}
              hidden={!isOpen}
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
