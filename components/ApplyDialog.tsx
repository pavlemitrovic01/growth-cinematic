'use client';

import { useRef } from 'react';
import ApplyForm from './ApplyForm';
import { APPLY_CTA } from '@/lib/cta';

/**
 * Glavno dugme heroja: otvara prozor sa PUNOM prijavom, pa vozac aplicira bez napustanja naslovne (Pavle 2026-09-24,
 * `TTI5-LOOK`: *„da mozes da kliknes i odma tu da apliciras"*, pa *„premalo informacija se dobija iz quick apply"*).
 *
 * ⚠️ ZASTO PUNA A NE BRZA FORMA. Server brzu prijavu proverava samo po imenu i telefonu; dodata polja bi stizala
 * neproverena (`LEAD1/SEC-1` whitelist vazi samo za punu). Puna forma je vec potpuno proverena, pa `ApplyForm`, API i
 * tekst pristanka ostaju netaknuti. Na naslovnoj je puna forma samo ovde, pa se `id`-jevi (`af-*`) ne ponavljaju; brza
 * forma na dnu (`qa-*`) je druga varijanta.
 *
 * Bez JS-a dugme je obican link na `/apply` -- ista forma, na svojoj stranici. Tekst u prozoru je doslovno sa `/apply`.
 * `<dialog>` + `showModal()` daje fokus u prozoru, Esc i `inert` ostatka strane bez sopstvenog koda.
 */
export default function ApplyDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a
        className="journey-cta"
        href="/apply"
        onClick={(e) => {
          e.preventDefault();
          dialog.current?.showModal();
        }}
      >
        <span>{APPLY_CTA}</span>
        <b aria-hidden="true">↗</b>
      </a>
      <dialog
        ref={dialog}
        className="apply-dialog"
        aria-labelledby="apply-dialog-title"
        onClick={(e) => {
          // klik na zatamnjenu pozadinu (sam <dialog>, ne njegov sadrzaj) zatvara prozor
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <button type="button" className="apply-dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>
          ×
        </button>
        <p className="apply-dialog-eyebrow">DRIVER APPLICATION</p>
        <h2 id="apply-dialog-title">
          Your next route. <em>Starts here.</em>
        </h2>
        <p className="apply-dialog-lede">About two minutes. No resume or account needed. Free for drivers, always.</p>
        <ApplyForm variant="full" />
      </dialog>
    </>
  );
}
