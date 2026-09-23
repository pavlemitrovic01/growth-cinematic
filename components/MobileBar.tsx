import Link from 'next/link';
import { EMAIL_HREF, HAS_PHONE, PHONE_TEL_HREF, PHONE_SMS_HREF } from '@/lib/contact';

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
    <nav className={'mobar' + (HAS_PHONE ? '' : ' mobar--two')} aria-label="Quick actions">
      {HAS_PHONE ? (
        <>
          <a href={PHONE_TEL_HREF}>Call</a>
          <a href={PHONE_SMS_HREF}>Text</a>
        </>
      ) : (
        <a href={EMAIL_HREF}>Email</a>
      )}
      <Link className="mobar-cta" href="/apply">
        Apply ↗
      </Link>
    </nav>
  );
}
