import Link from 'next/link';
import { PHONE_TEL_HREF, PHONE_SMS_HREF } from '@/lib/contact';

/**
 * Sticky akcioni bar na dnu, samo na mobilnom.
 *
 * `docs/SITEMAP.md` §3 ga imenuje kao „najveci pojedinacni boost konverzije" — 90%
 * saobracaja je mobilni, a vozac je najcesce na parkingu sa telefonom u ruci.
 *
 * Server komponenta: tri linka, nula JS-a. Vidljivost je ciste CSS media query.
 */
export default function MobileBar() {
  return (
    <div className="mobar" aria-label="Quick actions">
      <a href={PHONE_TEL_HREF}>Call</a>
      <a href={PHONE_SMS_HREF}>Text</a>
      <Link className="mobar-cta" href="/apply">
        Apply ↗
      </Link>
    </div>
  );
}
