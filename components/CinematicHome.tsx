import Link from 'next/link';
import HeroExperience from './HeroExperience';
import Nav from './Nav';
import Footer from './Footer';
import MobileBar from './MobileBar';
import ApplyForm from './ApplyForm';
import Accordion from './Accordion';
import { homeFaqItems } from '@/lib/faq';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';

function ApplyLink({ children = 'FIND MY NEXT ROUTE' }: { children?: React.ReactNode }) {
  return <Link className="journey-cta" href="/apply"><span>{children}</span><b aria-hidden="true">↗</b></Link>;
}

export default function CinematicHome() {
  return (
    <div className="home subpage">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav />
      <main id="main-content">
        <HeroExperience>
          <article className="journey-beat journey-intro" data-beat>
            <p className="journey-eyebrow">CDL-A RECRUITING / YOUR ROAD FORWARD</p>
            <h1>Your next route.<br /><em>Straight answers.</em></h1>
            <p className="journey-lede">Pay, home time, equipment. Know the details before you commit. We connect CDL-A drivers with partner carriers — free for drivers, always.</p>
            <div className="journey-actions"><ApplyLink /><a className="journey-call" href={PHONE_TEL_HREF}>Or call {PHONE_DISPLAY}</a></div>
          </article>
          <article className="journey-beat" data-beat>
            <p className="journey-eyebrow">01 / THE PEOPLE</p>
            <h2><strong className="journey-number">20+</strong> Partner carriers.<br /><em>Your priorities first.</em></h2>
            <p className="journey-lede">Tell us where you live, the routes you want and when you need to be home. We work from there. Opportunities depend on carrier availability and requirements.</p>
          </article>
          <article className="journey-beat" data-beat>
            <p className="journey-eyebrow">02 / THE DEAL</p>
            <h2><strong className="journey-number">$0</strong> Cost to drivers.<br /><em>Always.</em></h2>
            <p className="journey-lede">Carriers pay our placement fee. You pay nothing to apply, talk to us or get matched. It never comes out of your paycheck.</p>
          </article>
          <article className="journey-beat journey-final" data-beat>
            <p className="journey-eyebrow">03 / THE NEXT MILE</p>
            <h2>A better route<br /><em>starts with a call.</em></h2>
            <p className="journey-lede">One conversation about what matters to you. Clear options. The decision stays yours.</p>
            <ApplyLink>LET’S FIND YOUR NEXT ROUTE</ApplyLink>
          </article>
        </HeroExperience>

        <section className="home-callback" id="get-started" aria-labelledby="callback-heading">
          <div className="home-section-top"><span className="home-kicker">YOUR NEXT STEP</span><h2 id="callback-heading">Let’s talk about your next route.</h2></div>
          <ApplyForm variant="quick" />
        </section>

        <section className="home-process home-section" aria-labelledby="process-heading">
          <div className="home-section-top"><span className="home-kicker">01 / HOW IT WORKS</span><span className="home-kicker">FROM FIRST CALL TO NEXT MILE</span></div>
          <div className="home-editorial">
            <div><h2 id="process-heading">The details<br />make the<br /><em>difference.</em></h2><Link className="home-text-link" href="/how-it-works">See the whole process ↗</Link></div>
            <ol className="home-steps">
              <li><span>01</span><div><h3>Tell us what matters.</h3><p>Apply online or call. Start with your experience, home base and the kind of driving you want.</p></div></li>
              <li><span>02</span><div><h3>Have a real conversation.</h3><p>A recruiter usually calls back within 15–20 minutes during business hours. We go through your priorities and qualifications.</p></div></li>
              <li><span>03</span><div><h3>Compare the details.</h3><p>Pay structure, deductions, home-time schedule, equipment and miles. Ask your questions before choosing a carrier.</p></div></li>
              <li><span>04</span><div><h3>Choose your next route.</h3><p>We help with the next steps. Start dates depend on your paperwork and the carrier’s requirements.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="home-values home-section" aria-labelledby="values-heading">
          <span className="home-kicker">02 / KNOW BEFORE YOU GO</span>
          <h2 id="values-heading">A bigger number isn’t<br /><em>the whole offer.</em></h2>
          <div className="home-value-grid">
            <article><span>01 — PAY</span><h3>What reaches your paycheck?</h3><p>Ask how pay is calculated, which miles count and what deductions apply.</p></article>
            <article><span>02 — HOME TIME</span><h3>What does the schedule mean?</h3><p>Get the actual time out and time home. Make sure it works with your life.</p></article>
            <article><span>03 — EQUIPMENT</span><h3>What will you be driving?</h3><p>Ask about equipment, maintenance and the support available when plans change.</p></article>
          </div>
        </section>

        <section className="home-founder home-section" aria-labelledby="founder-heading">
          <span className="home-kicker">03 / WHY GROWTH</span>
          <div className="home-editorial">
            <h2 id="founder-heading">Built around<br /><em>the honest part.</em></h2>
            <div><blockquote>“You get the real numbers before you commit — including the ones that don’t help us — and then you decide for yourself.”</blockquote><p className="home-signature">Nate Mikic / Founder</p><p>Four years in CDL-A recruiting taught our founder where the details get lost. GROWTH is built around that gap.</p><Link href="/about" className="home-text-link">Read our story ↗</Link></div>
          </div>
        </section>

        <section className="home-faq home-section" aria-labelledby="faq-heading">
          <div className="home-section-top"><span className="home-kicker">04 / STRAIGHT ANSWERS</span><Link className="home-text-link" href="/faq">All questions ↗</Link></div>
          <h2 id="faq-heading">Before you<br /><em>take the next step.</em></h2>
          <Accordion items={homeFaqItems()} />
        </section>

        <section className="home-close home-section" aria-labelledby="close-heading">
          <span className="home-kicker">THE NEXT MILE IS YOURS</span>
          <h2 id="close-heading">Ready for<br /><em>your next route?</em></h2>
          <div className="journey-actions"><ApplyLink>START MY APPLICATION</ApplyLink><a className="journey-call" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a></div>
          <p>Hiring for your fleet? <Link href="/for-carriers">Let’s talk drivers ↗</Link></p>
          <Link className="home-text-link" href="/truckers-lounge">Explore the Truckers Lounge ↗</Link>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
