import Link from 'next/link';
import { APPLY_CTA } from '@/lib/cta';
import PageShell from '@/components/PageShell';
import { HAS_PHONE, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

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
        {/*
          ⚠️ CLAIMS C53. Ovde je do 2026-09-05 stajalo „Apply in 2 minutes ↗", sto je
          krsenje: C53 dozvoljava „2 minutes" ISKLJUCIVO kao opisni tekst uz samu formu ili
          u meta opisu stranice na kojoj je forma, a na dugmetu je izricito zabranjeno —
          obecanje i odrediste stoje razdvojeno, sto je palo kao acceptance FAIL na F5c
          prototipu. Dugme kaze STA RADI, ne koliko traje.

          Regresija, ne nasledje: stari sajt na istom mestu kaze „Apply for a job".
          Ostalih pet pojava „2 minutes" u projektu je ispravno — sve su uz formu.

          ⚠️ Automatska kapija ovo NE HVATA. `verify-claims.mjs` nema C53 pravilo, pa je
          nalaz dosao iz rucnog audita. Predlog za mehanizaciju je u `docs/AUDIT.md`.
        */}
        <Link className="btn btn-primary" href="/apply">
          {APPLY_CTA} ↗
        </Link>
        {HAS_PHONE ? (
          <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
            Call {PHONE_DISPLAY}
          </a>
        ) : null}
      </div>
      <p className="contact-email">
        Or start over from the <Link href="/">home page</Link>.
      </p>
    </PageShell>
  );
}
