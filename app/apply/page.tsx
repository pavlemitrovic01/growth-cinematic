import type { Metadata } from 'next';
import { CALLBACK_SENTENCE } from '@/lib/contact';
import Link from 'next/link';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { FAQ_ITEMS } from '@/lib/faq';
import { pageMeta } from '@/lib/seo';

/**
 * ⚠️ Odgovor o prekrsajima i SAP-u se NE prepisuje ovde nego se cita iz `lib/faq.js`.
 * Forma pita „Moving violations in the last 3 years?" i „Currently in or completed a SAP
 * program?", a stranica do sada nigde nije govorila sta se desava ako vozac odgovori Yes —
 * sto je najskuplja tacka odustajanja na celoj strani. Odgovor je vec postojao u repou,
 * samo nije bio ovde.
 *
 * Citanje iz izvora umesto prekucavanja: taj tekst nosi C36 i C19 („A completed program
 * does not guarantee a job"), pa bi dve kopije znacile dve tvrdnje koje mogu da se raziju.
 */
const VIOLATIONS_ANSWER = FAQ_ITEMS.find((item) => item.id === 'violations')?.a ?? '';
export const metadata: Metadata = pageMeta({ path: '/apply', title: 'Apply — CDL-A Driver Recruiting | GROWTH.CO', description: 'Tell us about your CDL and driving experience. A GROWTH recruiter helps you compare carrier options. Free for drivers, with no obligation to accept an offer.' });
export default function ApplyPage() {
  return (
    <PageShell variant="form" eyebrow="DRIVER APPLICATION" title={<>Your next route.<br /><em>Starts here.</em></>} lede="About two minutes. No resume or account needed. Free for drivers, always.">
      {/*
        ⚠️ Pojas poverenja je VRACEN, ne izmisljen. Stara `/apply` je iznad forme imala cetiri
        signala (`C:/dev/growth/app/apply/page.jsx:19,32,36,37`); nova nije imala nijedan, iako
        je klasa `.sub-trust` za tacno tu namenu postojala i bila ostilizovana — koristila ju je
        samo `/how-it-works`. Svaka stavka ispod postoji drugde na sajtu i prosla je registar.
      */}
      <div className="sub-trust">
        <span>Free for drivers, always</span>
        <span>48 contiguous states</span>
        <span>Call or text daily, weekends included</span>
      </div>

      <div className="sub-grid">
        <section id="application" aria-labelledby="application-title">
          <div className="form-heading"><h2 id="application-title">Tell us about yourself</h2><p>All fields are required. Select the answer that matches where you are today.</p></div>
          <ApplyForm />
        </section>
        <aside className="sub-rail" aria-label="What happens after you apply">
          <div className="card card--cta">
            <p className="rail-eyebrow">WHAT HAPPENS NEXT</p>
            <h2>A conversation first.</h2>
            <ol className="rail-steps">
              <li>{CALLBACK_SENTENCE}</li>
              <li>We discuss pay, home time, equipment and your experience.</li>
              <li>You compare the options and decide. Applying does not commit you to a job.</li>
            </ol>
            <p>Prefer to talk before filling this out?</p>
            <a className="btn btn-ghost" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a>
          </div>
        </aside>
      </div>

      {/*
        Mikro-FAQ uz samu formu. Forma pita za prekrsaje i SAP; vozac koji na to odgovara
        „Yes" je do sada ostajao bez ijedne reci o tome sta se dalje desava — i odustajao
        je tu. Tekst dolazi iz `lib/faq.js`, ne prekucan.
      */}
      <section className="sub-section" aria-labelledby="apply-honest-title">
        <h2 id="apply-honest-title">
          <span className="sub-num">01</span> If you answered yes to violations or SAP
        </h2>
        <p>{VIOLATIONS_ANSWER}</p>
        <p className="contact-email">
          More of the questions drivers ask us: <Link href="/faq">read the FAQ</Link>, or see{' '}
          <Link href="/how-it-works">how the process works</Link>.
        </p>
      </section>
    </PageShell>
  );
}
