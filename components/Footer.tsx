import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL_HREF, EMAIL, EMAIL_HREF } from '@/lib/contact';

/**
 * Footer. Struktura i tekst preneti iz MAIN-a (`components/Footer.jsx`).
 *
 * ⚠️ DISCLAIMER JE PRAVNI TEKST, PRENET DOSLOVNO. U MAIN-u je footer disclaimer u lock
 * zoni — izmene samo kroz STRICT batch. Ovde te ceremonije nema, ali razlog za oprez
 * ostaje isti: recenica razdvaja agenciju od prevoznika i poslodavca, sto je tvrdnja
 * o pravnom odnosu, ne marketinski tekst.
 *
 * ⚠️ Ime firme je „Capljinac LLC" (MAIN D17, Pavlova direktna potvrda), ne
 * „GROWTH.CO Recruiting Group LLC" — ta druga varijanta je bila halucinacija koju je
 * CL2 uklonio sa 8 mesta.
 *
 * ⚠️ FMCSA/USDOT/MC red NE POSTOJI namerno. U MAIN-u je uklonjen iz footera dok se ne
 * potvrdi sta firma zaista poseduje — nikad ne izmisljati legal brojeve.
 */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-brand">
          <Link className="brand" href="/" aria-label="GROWTH home">
            <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" /><path d="M25 17a10 10 0 1 0 1 14v-7h-9" fill="none" stroke="currentColor" strokeWidth="3" /><path d="m29 20 8-8m-8 0h8v8" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg></span>
            <span>GROWTH</span>
          </Link>
          <p className="foot-tag">
            Honest CDL-A driver recruiting. We match drivers with partner carriers across the 48
            contiguous states — free for drivers, always.
          </p>
        </div>

        <div>
          <h2>Drivers</h2>
          <ul>
            <li>
              <Link href="/how-it-works">How it works</Link>
            </li>
            <li>
              <Link href="/truckers-lounge">Truckers Lounge</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/apply">Apply</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Company</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/for-carriers">For carriers</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Get in touch</h2>
          <ul>
            <li>
              <a href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={EMAIL_HREF}>{EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot-legal">
        <p>
          GROWTH.CO is a driver recruiting agency and acts as an intermediary. We are not a motor
          carrier or an employer.
        </p>
        <p>
          © {new Date().getFullYear()} Capljinac LLC. All rights reserved. ·{' '}
          <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
