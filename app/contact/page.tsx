import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import { PHONE_DISPLAY, PHONE_TEL_HREF, PHONE_SMS_HREF, EMAIL, EMAIL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';
export const metadata: Metadata = pageMeta({ path: '/contact', title: 'Contact a CDL-A Recruiter | GROWTH.CO', description: 'Call, text or email GROWTH about your next driving job. You can also request a callback. Free for drivers.' });
export default function Contact() {
  return (
    <PageShell variant="form" eyebrow="CONTACT" title={<>A real conversation.<br /><em>About your next move.</em></>} lede="Questions about a job, your experience or hiring drivers? Let’s talk.">
      <div className="contact-direct">
        <div><p className="rail-eyebrow">CALL OR TEXT</p><a className="contact-number" href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a><p>Reach out daily, including weekends.</p></div>
        <div className="contact-actions"><a className="btn btn-primary" href={PHONE_TEL_HREF}>Call us ↗</a><a className="btn btn-ghost" href={PHONE_SMS_HREF}>Send a text</a></div>
      </div>
      <p className="contact-email">Prefer email? <a href={EMAIL_HREF}>{EMAIL}</a></p>
      <section className="contact-callback" aria-labelledby="callback-title">
        <h2 id="callback-title">Want us to call you?</h2>
        <p>A recruiter usually calls back within 15–20 minutes during staffed hours. No obligation.</p>
        <div className="contact-quick"><ApplyForm variant="quick" /></div>
      </section>
    </PageShell>
  );
}
