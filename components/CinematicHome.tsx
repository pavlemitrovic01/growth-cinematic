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

function ApplyLink({ children = APPLY_CTA }: { children?: React.ReactNode }) {
  return <Link className="journey-cta" href="/apply"><span>{children}</span><b aria-hidden="true">↗</b></Link>;
}

export default function CinematicHome() {
  return (
    <div className="home subpage">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav />
      {/*
        ⚠️ suppressHydrationWarning -- isti razlog kao na <html> u `app/layout.tsx`, drugo
        mesto. `Motion.tsx:111-113` dodaje `route-in` na ovaj element IMPERATIVNO pri
        promeni rute (fade prelaza), dakle van React-ovog rendera. React zato pri sledecoj
        hidraciji zatice klasu koju njegovo stablo ne deklarise i prijavljuje nesklad.
        Deluje samo na ovaj element, ne na stablo ispod.
      */}
      <main id="main-content" suppressHydrationWarning>
        <HeroExperience>
          <article className="journey-beat journey-intro" data-beat>
            <p className="journey-eyebrow">CDL-A RECRUITING / YOUR ROAD FORWARD</p>
            <h1>Your next route.<br /><em>Straight answers.</em></h1>
            <p className="journey-lede">Pay, home time, equipment. Know the details before you commit. We connect CDL-A drivers with partner carriers — free for drivers, always.</p>
            <div className="journey-actions"><ApplyLink /><a className="journey-call" href={PHONE_TEL_HREF}>Or call {PHONE_DISPLAY}</a></div>
            {/*
              PRENETO iz `app/apply/page.tsx:49`, gde je stajalo u bocnoj traci -- dakle vozac
              ga je video TEK POSTO klikne. C53 zabranjuje da dugme obecava bilo sta osim onoga
              sto radi („Start your application"), pa mekoca ide PORED dugmeta, ne u njega.
              Nije konstanta: obicna recenica bez reda u registru, i u izvoru stoji kao deo
              duze recenice, pa bi izdvajanje dodalo indirekciju bez zastite.
            */}
            <p className="journey-reassure">Applying does not commit you to a job.</p>
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
            <ApplyLink />
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

          ⚠️ OBLIK PROMENJEN 2026-09-09 — `D1`, prva sekcija koja iz **editorial** prelazi u
          **utility**. Do tada je nosila `home-editorial`: naslov levo, jedan pasus proze desno
          — isti raspored kao `process`, `founder` i `stories`. To je bio ceo nalaz `MOTION.md`:
          osam sekcija istog oblika.

          ⚠️ STA UTILITY OVDE ZNACI, KONKRETNO. U editorial sekciji je **naslov** display
          element; ovde je **broj**. `h2` zato pada sa `clamp(40px,5.4vw,82px)` na caption
          skalu, a `$0` uzima mesto koje je naslov imao. Pasus se raspada na tri para
          labela/vrednost, jer su to i bila tri podatka zapakovana u prozu: ko placa, kada,
          i sta ide sa vozacevog ceka.

          ⚠️ COPY SE NE PISE OVDE — SVAKA VREDNOST JE PRENETA. Ista disciplina kao Faza 4:
            `$0` / „Cost to drivers, always"     -> C5 dozvoljena formulacija („$0 cost to
                                                    drivers. Ever.", „Free for drivers, always")
            „The carrier" / „A flat placement fee." -> zatecena proza, doslovno
            „After you start driving"           -> zatecena proza („only after you successfully
                                                    start driving for them")
            „We don't get paid unless you actually start." -> zatecena proza; L1 dozvoljava bas
                                                    ovo negativno obecanje
            „Nothing" / „No hidden cuts."       -> zatecena proza („No hidden cuts from your
                                                    paycheck."); „from your paycheck" nosi labela

          ⚠️ DVE RECENICE SU ISPALE, i to je namerno, ne previd:
            „Our incentives are aligned with yours:" — red „When" to sada POKAZUJE podatkom;
              zadrzati je znacilo bi reci ono sto tabela vec dokazuje.
            „Just straightforward recruiting."      — zatvaranje pasusa koji vise ne postoji.
          Nijedna nema red u registru; obe su Pavlove da ih vrati ako ih hoce.

          ⚠️ Naslov je izgubio `<em>` outline tretman — namerno, po `D2` („outline tipografija
          svedena na 2-3 mesta"). U utility bloku bi outline takmicio sa brojem.
        */}
        <section data-reveal className="home-pay home-section" aria-labelledby="pay-heading">
          <div className="home-section-top">
            <span className="home-kicker">100% FREE FOR DRIVERS</span>
            <Link className="home-text-link" href="/how-it-works">How it works ↗</Link>
          </div>
          <h2 id="pay-heading">How we get paid.</h2>
          <div className="pay-ledger">
            <p className="pay-figure">
              <strong>$0</strong>
              <span>Cost to drivers, always</span>
            </p>
            {/*
              `<dl>` sa `<div>` omotacima je validan HTML5 i jedini nacin da par ostane par u
              gridu. `data-stagger` gadja `>*`, dakle bas te omotace — isti mehanizam koji
              `process` vec koristi na `<ol>`.
            */}
            <dl data-stagger className="pay-rows">
              <div>
                <dt>Who pays</dt>
                <dd><b>The carrier</b><span>A flat placement fee.</span></dd>
              </div>
              <div>
                <dt>When</dt>
                <dd><b>After you start driving</b><span>We don’t get paid unless you actually start.</span></dd>
              </div>
              <div>
                <dt>From your paycheck</dt>
                <dd><b>Nothing</b><span>No hidden cuts.</span></dd>
              </div>
            </dl>
          </div>
        </section>

        <section data-reveal className="home-process home-section" aria-labelledby="process-heading">
          <div className="home-section-top"><span className="home-kicker">01 / HOW IT WORKS</span><span className="home-kicker">FROM FIRST CALL TO NEXT MILE</span></div>
          <div className="home-editorial">
            <div className="process-lede"><h2 id="process-heading">The details<br />make the<br /><em>difference.</em></h2><Link className="home-text-link" href="/how-it-works">See the whole process ↗</Link></div>
            <ol data-stagger className="home-steps">
              <li><span>01</span><div><h3>Tell us what matters.</h3><p>Apply online or call. Start with your experience, home base and the kind of driving you want.</p></div></li>
              <li><span>02</span><div><h3>Have a real conversation.</h3><p>{CALLBACK_SENTENCE} We go through your priorities and qualifications.</p></div></li>
              <li><span>03</span><div><h3>Compare the details.</h3><p>Pay rates, home time schedule, equipment models, and average weekly miles — we give you the real deal up front, not after you sign. Ask about deductions before choosing a carrier.</p></div></li>
              <li><span>04</span><div><h3>Choose your next route.</h3><p>We help with the next steps. Start dates depend on your paperwork and the carrier’s requirements.</p></div></li>
            </ol>
          </div>
        </section>

        {/*
            ⚠️ `data-reveal` UKLONJEN u `M1` (2026-09-09) — jedina sekcija na sajtu koja ga
            nema. Nije previd: ovo je dokazna primena novog recnika. Sadrzaj je prosto tu,
            akter je LINIJA (`CRTA`), pa imena osa (`OTKRIVANJE`) 90 ms iza svoje linije.
            Fade-up ostaje na preostalih sest sekcija dok ih `M2` ne prevede.
          */}
        <section className="home-values home-section" aria-labelledby="values-heading">
          {/*
            ⚠️ NASLOV JE PREIMENOVAN 2026-09-06, SADRZAJ PRESELJEN. Do tada je ovde stajalo
            „02 / KNOW BEFORE YOU GO" nad tri genericke kartice, dok pun sadrzaj te sekcije —
            tri trampe, devet „Ask the carrier" pitanja i tri modifikatora, ukupno jedanaest
            redova registra — nije postojao nigde na sajtu. Isti naslov sa ispraznjenim
            sadrzajem cita se kao propust, ne kao odluka o obimu.

            Pun sadrzaj sada zivi na `/how-it-works#know-before-you-go`. Kartice ispod OSTAJU
            jer rade svoj posao na naslovnoj — tri pitanja koja otvaraju temu — ali naslov vise
            ne obecava ono sto nije tu, a link vodi na ono sto jeste. Obecanje i odrediste su
            ovim spojeni; razdvojeni su vec jednom kostali (vidi `app/how-it-works` sekciju 03).
          */}
          <div className="home-section-top">
            <span className="home-kicker">02 / WHAT TO COMPARE</span>
            <Link className="home-text-link" href="/how-it-works#know-before-you-go">
              Know before you go ↗
            </Link>
          </div>
          {/*
            ⚠️ OBLIK PROMENJEN 2026-09-09 — `D1`, druga sekcija iz **editorial** u **utility**,
            posle `pay`. Do tada: naslov 82px sa outline `<em>`, pa tri kartice u kojima je
            osa bila 12px labela a pitanje 24px naslov. Nosivi sadržaj — *da postoje tačno
            TRI ose poređenja* — bio je najmanje vidljiva stvar na ekranu, a naslov je nosio
            isti tretman kao `What we don't do.` odmah ispod njega.

            ⚠️ DISPLAY ELEMENT NIJE BROJ, I TO NIJE PROPUST NEGO JEDINI TAČAN ODGOVOR.
            `pay` je utility nosila brojem (`$0`). Ovde bi veliki broj **oborio sopstvenu
            rečenicu**: sekcija tvrdi *„A bigger number isn't the whole offer."* Display element
            su zato **imena osa** — podatak je sama taksonomija: ovo troje se poredi, i ništa
            drugo. Hijerarhija unutar ćelije je obrnuta, ne raspored sekcije.

            ⚠️ COPY JE NEPROMENJEN, do slova. Menja se koji element nosi koji tekst:
            `<h3>` prelazi sa pitanja na ime ose (bolji outline — „Pay" je podnaslov, pitanje
            nije), pitanje ostaje vidljivo kao telo. Iz naslova ispada samo `<br />` i outline
            `<em>` — po `D2`, i zato što outline na caption skali daje mutnu liniju.

            ⚠️ VELIKA SLOVA IDU U CSS, NE U IZVOR. Do sada je u izvoru stajalo `01 — PAY`.
            Faza 4 je već jednom platila to što su verzali bili u tekstu: natpis se nije mogao
            deliti bez promene izgleda (`.journey-cta`, `3ece835`). Ovde stoji `Pay`, a
            `text-transform` radi ostalo.
          */}
          <h2 id="values-heading">A bigger number isn’t the whole offer.</h2>
          {/*
            `data-stagger` OSTAJE na `<ol>`-u — nosi stepenicu (0/70/140 ms) koju nova pravila
            citaju kroz `--crta-delay`. Ali `<li>` vise NE dobija fade-up: pravilo u MOTION bloku
            nosi `:not([data-line])`, jer bi inace dve mehanike isle preko iste stvari.
          */}
          <ol data-stagger className="value-axes">
            <li data-line>
              <span className="value-num">01</span>
              <h3 data-wipe>Pay</h3>
              <p className="value-q">What reaches your paycheck?</p>
              <p>Ask how pay is calculated, which miles count and what deductions apply.</p>
            </li>
            <li data-line>
              <span className="value-num">02</span>
              <h3 data-wipe>Home time</h3>
              <p className="value-q">What does the schedule mean?</p>
              <p>Get the actual time out and time home. Make sure it works with your life.</p>
            </li>
            <li data-line>
              <span className="value-num">03</span>
              <h3 data-wipe>Equipment</h3>
              <p className="value-q">What will you be driving?</p>
              <p>Ask about equipment, maintenance and the support available when plans change.</p>
            </li>
          </ol>
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
          ⚠️ `stories` JE OBRISANA 2026-09-09 — `D1`, uz Pavlov override same odluke.

          `D1` je propisao brisanje sekcije ALI selidbu njene najjace recenice („No stock
          photos. No invented reviews.") u `guard`, kao `what we don't do` tvrdnju. Pavlova
          odluka je da ni to ne ide nigde: **„nemamo potrebe da se igde pravdamo sto se toga
          tice."**

          ⚠️ Razlog stoji, i jaci je od plana: obecanje da nema izmisljenih recenzija
          PRETPOSTAVLJA optuzbu. Sajt koji to eksplicitno negira sam uvodi sumnju koju niko
          nije izneo. Brisanje je jace od selidbe.

          Sta je nestalo: naslov „Be one of the first." (koji se citao kao „nemamo klijente,
          vi ste test"), pasus o prvim vozacima — duplikat tvrdnje koju `founder` vec nosi —
          i obecanje o recenzijama. `founder` NE prima nista; ostaje nepromenjen.

          ⚠️ U ovom batch-u nije napisana nijedna nova rec. Samo je brisano, pa je registarski
          rizik nula: `verify-claims` moze samo da bude sigurniji nego pre.

          Numeracija: `faq` je time presao sa `06` na `05`.
        */}
        <section data-reveal className="home-faq home-section" aria-labelledby="faq-heading">
          <div className="home-section-top"><span className="home-kicker">05 / STRAIGHT ANSWERS</span><Link className="home-text-link" href="/faq">All questions ↗</Link></div>
          <h2 id="faq-heading">Before you<br /><em>take the next step.</em></h2>
          <Accordion items={homeFaqItems()} />
        </section>

        <section data-reveal className="home-close home-section" aria-labelledby="close-heading">
          <span className="home-kicker">THE NEXT MILE IS YOURS</span>
          <h2 id="close-heading">Ready for<br /><em>your next route?</em></h2>
          <div className="journey-actions"><ApplyLink /><a className="journey-call" href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a></div>
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
