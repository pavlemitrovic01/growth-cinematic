import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

/**
 * 404 u tonu brenda (`docs/SITEMAP.md` §5). Vozac koji je pogresio URL ne sme da
 * zavrsi u slepoj ulici — daje mu se i put nazad i broj telefona.
 */
export default function NotFound() {
  return (
    <PageShell
      eyebrow="404"
      title={
        <>
          Wrong exit.
          <br />
          <em>Let&apos;s get you back on route.</em>
        </>
      }
      lede="That page doesn't exist — or it moved. Here's where most drivers are headed."
    >
      <div className="contact-actions">
        <Link className="btn btn-primary" href="/apply">
          Apply in 2 minutes ↗
        </Link>
        <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
      <p className="contact-email">
        Or start over from the <Link href="/">home page</Link>.
      </p>
    </PageShell>
  );
}
