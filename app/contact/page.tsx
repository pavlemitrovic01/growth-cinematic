import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import {
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  PHONE_SMS_HREF,
  EMAIL,
  EMAIL_HREF,
} from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/contact',
  title: 'Contact a CDL-A Recruiter | GROWTH.CO',
  description:
    'Call, text, or email GROWTH.CO — or leave your number and a real recruiter usually calls you back within 15–20 minutes during business hours. Free for drivers, always.',
});

/**
 * ⚠️ Telefon i mejl idu ISKLJUCIVO kroz `lib/contact.js` — jedno mesto za oba. Promena
 * broja je jedna izmena, a provera je `grep` na nulu doslovnih pojava.
 */
export default function Contact() {
  return (
    <PageShell
      eyebrow="CONTACT"
      title={
        <>
          Talk to a
          <br />
          <em>real person.</em>
        </>
      }
      lede="No phone tree, no ticket number. We answer fast — usually within 15–20 minutes during business hours."
    >
      <div className="contact-actions">
        <a className="btn btn-primary" href={PHONE_TEL_HREF}>
          Call {PHONE_DISPLAY} ↗
        </a>
        <a className="btn btn-ghost" href={PHONE_SMS_HREF}>
          Text us
        </a>
      </div>
      <p className="contact-email">
        Prefer email? <a href={EMAIL_HREF}>{EMAIL}</a>
      </p>

      <h2 className="contact-h2">Or leave your number</h2>
      <p className="contact-sub">
        We&apos;ll call you back — no obligation, and it&apos;s free for drivers, always.
      </p>
      <div className="contact-quick">
        <ApplyForm variant="quick" />
      </div>
    </PageShell>
  );
}
