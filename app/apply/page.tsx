import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';
import PageShell from '@/components/PageShell';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';
export const metadata: Metadata = pageMeta({ path: '/apply', title: 'Apply — CDL-A Driver Recruiting | GROWTH.CO', description: 'Tell us about your CDL and driving experience. A GROWTH recruiter helps you compare carrier options. Free for drivers, with no obligation to accept an offer.' });
export default function ApplyPage() {
  return (
    <PageShell variant="form" eyebrow="DRIVER APPLICATION" title={<>Your next route.<br /><em>Starts here.</em></>} lede="About two minutes. No resume or account needed. Free for drivers, always.">
      <div className="sub-grid form-layout">
        <section id="application" aria-labelledby="application-title">
          <div className="form-heading"><h2 id="application-title">Tell us about yourself</h2><p>All fields are required. Select the answer that matches where you are today.</p></div>
          <ApplyForm />
        </section>
        <aside className="sub-rail" aria-label="What happens after you apply">
          <div className="card card--cta">
            <p className="rail-eyebrow">WHAT HAPPENS NEXT</p>
            <h2>A conversation first.</h2>
            <ol className="rail-steps">
              <li>A recruiter usually calls within 15–20 minutes during staffed hours.</li>
              <li>We discuss pay, home time, equipment and your experience.</li>
              <li>You compare the options and decide. Applying does not commit you to a job.</li>
            </ol>
            <p>Prefer to talk before filling this out?</p>
            <a className="btn btn-ghost" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
