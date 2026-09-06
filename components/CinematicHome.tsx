import Link from 'next/link';
import { CALLBACK_SENTENCE } from '@/lib/contact';
import { APPLY_CTA } from '@/lib/cta';
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
          <article className="journey-beat" data-beat>
            <p className="journey-eyebrow">03 / THE NEXT MILE</p>
            <h2>A better route<br /><em>starts with a call.</em></h2>
            <p className="journey-lede">One conversation about what matters to you. Clear options. The decision stays yours.</p>
            <ApplyLink>{APPLY_CTA}</ApplyLink>
          </article>
        </HeroExperience>

        <section className="home-callback" id="get-started" aria-labelledby="callback-heading">
          <div className="home-section-top"><span className="home-kicker">YOUR NEXT STEP</span><h2 id="callback-heading">Let’s talk about your next route.</h2></div>
          <ApplyForm variant="quick" />
        </section>

        {/*
          Transparentnost naknade. Prenето iz MAIN-a doslovno — `docs/CLAIMS.md` C5 izricito
          dozvoljava „100% free for drivers", a dopuna L1 dozvoljava i negativno obecanje
          izvedeno iz modela („we don't get paid unless you actually start").
          Stoji odmah ispod forme jer podupire `$0` tvrdnju iz heroja; nema broj sekcije
          zato sto je potporni blok, ne poglavlje.
        */}
        <section data-reveal className="home-pay home-section" aria-labelledby="pay-heading">
          <span className="home-kicker">100% FREE FOR DRIVERS</span>
          <div className="home-editorial">
            <h2 id="pay-heading">How we<br /><em>get paid.</em></h2>
            <div>
              <p>
                We make our money by charging a flat placement fee to the carrier <em>only</em>{' '}
                after you successfully start driving for them. Our incentives are aligned with
                yours: we don’t get paid unless you actually start. No hidden cuts from your
                paycheck. Just straightforward recruiting.
              </p>
              <Link className="home-text-link" href="/how-it-works">How it works ↗</Link>
            </div>
          </div>
        </section>

        <section data-reveal className="home-process home-section" aria-labelledby="process-heading">
          <div className="home-section-top"><span className="home-kicker">01 / HOW IT WORKS</span><span className="home-kicker">FROM FIRST CALL TO NEXT MILE</span></div>
          <div className="home-editorial">
            <div><h2 id="process-heading">The details<br />make the<br /><em>difference.</em></h2><Link className="home-text-link" href="/how-it-works">See the whole process ↗</Link></div>
            <ol data-stagger className="home-steps">
              <li><span>01</span><div><h3>Tell us what matters.</h3><p>Apply online or call. Start with your experience, home base and the kind of driving you want.</p></div></li>
              <li><span>02</span><div><h3>Have a real conversation.</h3><p>{CALLBACK_SENTENCE} We go through your priorities and qualifications.</p></div></li>
              <li><span>03</span><div><h3>Compare the details.</h3><p>Pay rates, home time schedule, equipment models, and average weekly miles — we give you the real deal up front, not after you sign. Ask about deductions before choosing a carrier.</p></div></li>
              <li><span>04</span><div><h3>Choose your next route.</h3><p>We help with the next steps. Start dates depend on your paperwork and the carrier’s requirements.</p></div></li>
            </ol>
          </div>
        </section>

        <section data-reveal className="home-values home-section" aria-labelledby="values-heading">
          <span className="home-kicker">02 / KNOW BEFORE YOU GO</span>
          <h2 id="values-heading">A bigger number isn’t<br /><em>the whole offer.</em></h2>
          <div data-stagger className="home-value-grid">
            <article><span>01 — PAY</span><h3>What reaches your paycheck?</h3><p>Ask how pay is calculated, which miles count and what deductions apply.</p></article>
            <article><span>02 — HOME TIME</span><h3>What does the schedule mean?</h3><p>Get the actual time out and time home. Make sure it works with your life.</p></article>
            <article><span>03 — EQUIPMENT</span><h3>What will you be driving?</h3><p>Ask about equipment, maintenance and the support available when plans change.</p></article>
          </div>
        </section>

        {/*
          „What we don't do." — pet obecanja, prenета doslovno iz MAIN-a (L3).
          Svako je par: sta NE radimo, pa sta radimo umesto toga. Zato lista sa labelama
          u koloni umesto mreze — labela nosi znacenje, nije ukras, i pet stavki popunjava
          redove bez usamljene celije.
        */}
        <section data-reveal className="home-guard home-section" aria-labelledby="guard-heading">
          <div className="home-section-top">
            <span className="home-kicker">03 / STRAIGHT FROM US</span>
            <span className="home-kicker">WHAT YOU WON’T HEAR FROM US</span>
          </div>
          <h2 id="guard-heading">What we<br /><em>don’t do.</em></h2>
          <ol data-stagger className="home-steps home-guard-list">
            <li>
              <span>WE DON’T</span>
              <div>
                <h3>Sell you a lease as a shortcut</h3>
                <p>A lease-purchase is not a shortcut to owning a truck, and we won’t present it as one.</p>
              </div>
            </li>
            <li>
              <span className="is-do">WE DO</span>
              <div>
                <h3>Go through the lease with you</h3>
                <p>The weekly payment, the deductions, and what you’re left with if you walk away.</p>
              </div>
            </li>
            <li>
              <span>WE DON’T</span>
              <div>
                <h3>Quote best-case miles</h3>
                <p>A best-case mileage number is not a typical week, and we won’t hand it to you as one.</p>
              </div>
            </li>
            <li>
              <span className="is-do">WE DO</span>
              <div>
                <h3>Ask for the real average</h3>
                <p>We ask the carrier for a recent account average and a slower-week example. If that data isn’t available, we tell you that.</p>
              </div>
            </li>
            <li>
              <span className="is-do">WE DO</span>
              <div>
                <h3>Go through the deduction list</h3>
                <p>Line by line, with you, before you sign anything.</p>
              </div>
            </li>
          </ol>
        </section>

        <section data-reveal className="home-founder home-section" aria-labelledby="founder-heading">
          <span className="home-kicker">04 / WHY GROWTH</span>
          <div className="home-editorial">
            <h2 id="founder-heading">Built around<br /><em>the honest part.</em></h2>
            <div><blockquote>“You get the real numbers before you commit — including the ones that don’t help us — and then you decide for yourself.”</blockquote><p className="home-signature">Nate Mikic / Founder</p><p>Four years in CDL-A recruiting taught our founder where the details get lost. GROWTH is built around that gap.</p><Link href="/about" className="home-text-link">Read our story ↗</Link></div>
          </div>
        </section>

        {/*
          Posten placeholder umesto izmisljenih testimonijala. `docs/CLAIMS.md` ga u
          audit tabeli imenuje kao UZORAN primer (C16) — zato prelazi doslovno.
          Sekcija nestaje tek kad stignu prave price, sa imenima i dozvolom.
        */}
        <section data-reveal className="home-stories home-section" aria-labelledby="stories-heading">
          <span className="home-kicker">05 / DRIVER STORIES</span>
          <div className="home-editorial">
            <h2 id="stories-heading">Be one of<br /><em>the first.</em></h2>
            <div>
              <p>
                GROWTH is new. That means the drivers we place right now get our full attention —
                and their stories land here, with their names and their permission, as they roll in.
              </p>
              <p>
                No stock photos. No invented reviews. When this section fills up, every word in it
                will be real — because in this industry that’s the whole point.
              </p>
              <Link className="home-text-link" href="/apply">{APPLY_CTA} ↗</Link>
            </div>
          </div>
        </section>

        <section data-reveal className="home-faq home-section" aria-labelledby="faq-heading">
          <div className="home-section-top"><span className="home-kicker">06 / STRAIGHT ANSWERS</span><Link className="home-text-link" href="/faq">All questions ↗</Link></div>
          <h2 id="faq-heading">Before you<br /><em>take the next step.</em></h2>
          <Accordion items={homeFaqItems()} />
        </section>

        <section data-reveal className="home-close home-section" aria-labelledby="close-heading">
          <span className="home-kicker">THE NEXT MILE IS YOURS</span>
          <h2 id="close-heading">Ready for<br /><em>your next route?</em></h2>
          <div className="journey-actions"><ApplyLink>{APPLY_CTA}</ApplyLink><a className="journey-call" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a></div>
          {/*
            CLAIMS C13, kanonska dozvoljena formulacija, doslovno. Do 2026-09-05 je zivela na
            tacno jednom mestu (`app/how-it-works`, i to skracena na prvu polovinu) — a pripada
            ovde, uz sam broj telefona, jer opisuje bas taj poziv.

            ⚠️ Druga recenica NIJE ukras nego granica. C13 je ALLOWED za ovaj oblik i
            PROHIBITED za „Available 24/7", „around the clock" i sve sto implicira garantovan
            odgovor van radnih sati. Tim je dostupan svaki dan do kasno, pa je iskusenje da se
            to napise jace — ali vozac koji posalje poruku u 4 ujutru odgovor nece dobiti.
            „Daily — weekends included" nosi ceo adut; „staffed hours" cuva istinu.

            Bez objavljenog rasporeda namerno: raspored bi suzio ono sto je stvarno tacno.
          */}
          <p>Call or text us daily — weekends included. We typically respond quickly during staffed hours.</p>
          <p>Hiring for your fleet? <Link href="/for-carriers">Let’s talk drivers ↗</Link></p>
          <Link className="home-text-link" href="/truckers-lounge">Explore the Truckers Lounge ↗</Link>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
