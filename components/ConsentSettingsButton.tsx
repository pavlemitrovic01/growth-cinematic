'use client';

import { CONSENT_OPEN_EVENT, isConsentRequired } from '@/lib/consent';

/**
 * „Your privacy choices" — CPRA-stil kontrola kojom se odluka menja posle donosenja.
 *
 * ⚠️ Vraca `null` dok `NEXT_PUBLIC_CONSENT_REQUIRED` nije `true`, iz istog razloga kao
 * `CookieBanner`: nema opt-out linka za deljenje koje se ne desava. Link koji otvara prazan
 * panel je gori od nepostojeceg — obecava kontrolu nad necim cega nema.
 *
 * Ne drzi stanje: samo emituje dogadjaj koji `CookieBanner` slusa. Tako postoji jedan panel
 * i jedan izvor istine, ma sa koliko mesta bio pozvan.
 */
export default function ConsentSettingsButton({ className }: { className?: string }) {
  if (!isConsentRequired()) return null;

  return (
    <button
      type="button"
      className={className ?? 'consent-settings'}
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))}
    >
      Your privacy choices
    </button>
  );
}
