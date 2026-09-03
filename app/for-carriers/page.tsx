import type { Metadata } from 'next';
import CarrierForm from '@/components/CarrierForm';
import PageShell from '@/components/PageShell';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';
export const metadata: Metadata = pageMeta({ path: '/for-carriers', title: 'Hire CDL-A Drivers | GROWTH.CO', description: 'Talk to GROWTH about your lanes, equipment and hiring requirements. CDL-A driver recruiting, with payment only for successful placements.' });
export default function ForCarriersPage() {
  return (
    <PageShell variant="form" eyebrow="FOR CARRIERS" title={<>The right drivers.<br /><em>For your operation.</em></>} lede="Tell us about your lanes, equipment and hiring requirements. You pay only for successful placements.">
      <div className="sub-grid form-layout">
        <section aria-labelledby="carrier-title">
          <div className="form-heading"><h2 id="carrier-title">Let’s talk recruiting</h2><p>Leave your contact details. All fields except email are required.</p></div>
          <CarrierForm />
        </section>
        <aside className="sub-rail" aria-label="Our recruiting process">
          <div className="card card--cta">
            <p className="rail-eyebrow">HOW WE WORK</p><h2>Start with the details.</h2>
            <ol className="rail-steps">
              <li>We discuss your hiring criteria, pay structure and available positions.</li>
              <li>We match driver experience and preferences to your requirements.</li>
              <li>Your team makes the hiring decision. We help coordinate the next steps.</li>
            </ol>
            <a className="btn btn-ghost" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
