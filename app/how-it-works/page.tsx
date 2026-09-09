import type { Metadata } from 'next';
import { CALLBACK_SENTENCE } from '@/lib/contact';
import { APPLY_CTA } from '@/lib/cta';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { PHONE_TEL_HREF } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/how-it-works',
  title: 'How CDL-A Driver Placement Works | GROWTH.CO',
  description:
    'The whole process, start to finish: apply in 2 minutes, usually get a callback within 15–20 minutes during staffed hours. No fees for drivers.',
});

const STEPS = [
  {
    n: '01',
    h: 'Apply',
    p: "Two minutes: CDL class, experience, and what you're looking for. No resume, no account to create. If you'd rather talk first, call us instead.",
  },
  {
    n: '02',
    h: 'We call you',
    p: 'Usually within 15–20 minutes during staffed hours. A real recruiter walks through your priorities — pay, home time, equipment, lanes. Nothing is decided on this call.',
  },
  {
    n: '03',
    h: 'We match you',
    p: 'We look for carriers that fit your experience and priorities. We explain the offers, including pay and deductions. You decide whether any of them work for you.',
  },
  {
    n: '04',
    h: "You're rolling",
    p: 'Paperwork, DOT physical, and drug test happen here — we help you through them. Ready drivers can start in as little as 3–5 days.',
  },
];

/**
 * „Know before you go" — preneto iz izvornog projekta (`components/KnowBeforeYouGo.jsx`).
 *
 * ⚠️ ZASTO OVDE, A NE NA NASLOVNOJ. Naslovna je do 2026-09-06 nosila naslov
 * „02 / KNOW BEFORE YOU GO" nad tri genericke kartice — isti naslov sa ispraznjenim sadrzajem,
 * sto se cita kao propust a ne kao odluka o obimu. Jedanaest redova registra sa citiranim
 * FMCSA obavezama trazi stranicu na kojoj se cita; naslovna sada tease-uje i linkuje ovamo.
 *
 * ⚠️ COPY JE POD CLAIMS UGOVOROM — svaka trampa nosi hedz koji NE SME nestati pri skracivanju.
 * Redovi: C23–C25 (home time) · C27, C40 (milje i plata) · C30–C33 (teret) · C34 (nov CDL) ·
 * C35 (iskustvo) · C37 (violations/SAP). Prenet je doslovno; jedina izmena su tipografski
 * apostrofi, po konvenciji ovog projekta (Faza 4, `41e277c`).
 *
 * ⚠️ NEMA obecanja da se odgovori prenose u prijavu. Bez tehnickog prenosa to bi bilo lazno
 * UI obecanje. Zato su pitanja za vozaca — ne polja forme.
 *
 * ⚠️ CTA iz izvora („Review your choices" → `#apply`) NIJE prenet: stranica vec nosi CTA u
 * bocnoj traci, a nov natpis bi vratio varijantu koju je Faza 4 upravo svela na `APPLY_CTA`.
 */
const TRADEOFFS = [
  {
    title: 'Home time',
    tradeoff:
      'Home daily is realistic. It usually comes with fewer weekly miles than long-haul, and a smaller pool of carriers depending on where you live.',
    questions: [
      'How many miles per week — realistically, not best case?',
      'Is the lane fixed, or does it change week to week?',
      'What happens on a week the lane falls through?',
    ],
  },
  {
    title: 'Miles & pay',
    tradeoff:
      'Comparing offers is harder: cents per mile, hourly, and percentage of revenue don’t measure the same thing, and neither do the route miles they count.',
    questions: [
      'Is this cents per mile, hourly, or a percentage — and a percentage of what?',
      'Are those practical-route miles or shortest-route miles?',
      'What did drivers on this account average last month — not the top earner?',
    ],
  },
  {
    title: 'Type of freight',
    tradeoff:
      'Dry van, reefer, and flatbed come with different operating demands. Some temperature-controlled food loads add temperature, sanitation, training, and record procedures. Flatbed work requires close attention to cargo securement; the driver may need to inspect or adjust it.',
    questions: [
      'Is this no-touch, drop and hook, or live load?',
      'What year is the equipment, and who handles maintenance and breakdowns?',
      'How much of this account is actually the freight you just described?',
    ],
  },
];

const MODIFIERS = [
  {
    label: 'New CDL',
    body: 'After truck-driving school and hiring, drivers normally receive several weeks of on-the-job training. Ask how the carrier’s program works, what it pays, and what happens before solo release.',
  },
  {
    label: '1+ year',
    body: 'Use your experience to ask harder questions before you sign.',
  },
  {
    label: 'Violations or SAP',
    body: 'Expect carriers to review your state driving record and prior safety history. FMCSA-regulated employers must also check the Clearinghouse before hiring for safety-sensitive CDL work.',
  },
];

export default function HowItWorks() {
  return (
    <PageShell
      eyebrow="HOW IT WORKS"
      title={
        <>
          Here&apos;s exactly how it works
          <br />
          <em>— no surprises.</em>
        </>
      }
      lede="From the first conversation to onboarding: here is what we do, what you decide and what depends on the carrier."
    >
      <div className="sub-trust">
        <span>Call or text us daily — weekends included</span>
        <span>Free for drivers, always</span>
        <span>One recruiter, start to finish</span>
      </div>

      <div className="sub-grid">
        <div className="sub-main">
          <section className="sub-section">
            <div className="sub-head">
              <span className="sub-num">01</span>
              <h2>Four steps, start to finish</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li className="step" key={s.n}>
                  <span className="step-n">{s.n}</span>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="sub-section">
            <div className="sub-head">
              <span className="sub-num">02</span>
              <h2>What to expect from us</h2>
            </div>
            {/* ⚠️ `data-stagger` dodat u `M2`. Atribut stoji na OMOTACU — tekst unutar kartica
                se ne dira, jer je donja kartica ziva povrsina reda `C52`, koji je jos OPEN. */}
            <div className="sub-2up" data-stagger>
              {/*
                ⚠️ CLAIMS C52 JE **OPEN** I OVA KARTICA JE BILA NJEGOVA ZIVA POVRSINA.
                Do 2026-09-05 je spisak glasio: „A valid CDL-A · documents showing you're
                authorized to work in the US · enough English to handle dispatch and DOT ·
                a record that's clean… · genuine readiness to start."

                C52 zabranjuje „svaku listu uslova za zaposlenje po nacionalnosti,
                imigracionom statusu ili jeziku". Dodirna povrsina je federalno i drzavno
                anti-diskriminaciono pravo i I-9 pravila. Dve stavke su bile tacno na te dve
                ose i uklonjene su; preostale tri (CDL-A, voznja, spremnost) nisu ni na
                jednoj od zabranjenih osa i ostaju.

                Poslednja recenica je propisani BEZBEDAN OBLIK dok je C52 OPEN: ne iznositi
                kriterijume podobnosti na sajtu, uputiti na razgovor.

                ⚠️ OVO NE ZATVARA C52. Vlasnik reda je kvalifikovan americki advokat i samo
                on sme doneti taj zakljucak; ovde je uklonjena zabranjena povrsina, nije
                doneta odluka. Status ostaje OPEN do pravnog pregleda.

                ⚠️ ISTI TEKST STOJI I U MAIN-u (`app/how-it-works/page.jsx:129-130`), na
                sajtu koji je indeksiran i prima prave prijave. MAIN se ne dira iz ovog
                projekta — ali izlozenost tamo postoji i zavedena je u `docs/AUDIT.md`.
              */}
              <article className="card">
                <h3>What we need from you</h3>
                <p>Straight list, so nobody wastes a week finding out:</p>
                <p>
                  A valid CDL-A · a record that&apos;s clean or that you can explain honestly ·
                  and genuine readiness to start.
                </p>
                <p>
                  Carrier requirements vary. Anything else that matters for a specific carrier,
                  we go through with you on the call.
                </p>
              </article>
              <article className="card">
                <h3>What we handle</h3>
                <p>Everything between your application and your first load:</p>
                <p>
                  Finding carriers · matching you to lanes that fit · help with the paperwork ·
                  chasing recruiters and onboarding on your behalf · and staying reachable after
                  you&apos;re placed.
                </p>
              </article>
            </div>
          </section>

          {/*
            ⚠️ SEKCIJA 03 JE DODATA 2026-09-05 JER JE LINK VEC OBECAVAO. Naslovna
            (`components/CinematicHome.tsx`) ispod sekcije „How we get paid" nosi link
            „How it works ↗" ka ovoj stranici — a stranica model naknade NIGDE nije
            objasnjavala. Obecanje i odrediste su stajali razdvojeni.

            Tekst je prenet doslovno sa naslovne, gde je vec prosao registar: C5 izricito
            dozvoljava „100% free for drivers", a dopuna L1 dozvoljava i negativno obecanje
            izvedeno iz modela („we don't get paid unless you actually start").
          */}
          <section className="sub-section">
            <div className="sub-head">
              <span className="sub-num">03</span>
              <h2>How we get paid</h2>
            </div>
            <p>
              We make our money by charging a flat placement fee to the carrier <em>only</em>{' '}
              after you successfully start driving for them. Our incentives are aligned with
              yours: we don&apos;t get paid unless you actually start. No hidden cuts from your
              paycheck. Just straightforward recruiting.
            </p>
            <p>
              That is the whole model. It is also why applying costs you nothing and why nobody
              here is paid to talk you into a truck you don&apos;t want.
            </p>
          </section>

          <section className="sub-section" id="know-before-you-go">
            <div className="sub-head">
              <span className="sub-num">04</span>
              <h2>Know before you go</h2>
            </div>
            <p className="kbyg-lead">
              Three trade-offs nobody explains until after you&apos;ve signed.
            </p>
            {/* ⚠️ `data-stagger` dodat u `M2`, isti raspored koji `/about`, `/contact` i
                `/for-carriers` vec nose na svom `.sub-3up`. Deca su `.card` — kombinacija je
                dokazana u produkciji od Faze 2, pa nema novog CSS-a. */}
            <div className="sub-3up" data-stagger>
              {TRADEOFFS.map((t) => (
                <article className="card" key={t.title}>
                  <h3>{t.title}</h3>
                  <p>{t.tradeoff}</p>
                  <p className="kbyg-ask">Ask the carrier</p>
                  <ol className="kbyg-questions">
                    {t.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
            <div className="kbyg-mods">
              <p className="kbyg-mods-lead">Where you are right now changes the answers:</p>
              <dl>
                {MODIFIERS.map((m) => (
                  <div className="kbyg-mod" key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ⚠️ Ovaj pasus je kanonski C11 caveat. Ne brisati — bez njega „3–5 days"
              u koraku 04 postaje gola, zabranjena tvrdnja. */}
          <p className="sub-caveat">
            <strong>One honest caveat:</strong> we can&apos;t promise a 3–5 day start to a driver
            who isn&apos;t ready — paperwork, physicals, and drug tests move at their own pace. We help you track the next steps, but a start date is not guaranteed.
          </p>
        </div>

        <aside className="sub-rail">
          <div className="card card--cta">
            <h2>Ready when you are</h2>
            <p>
              Two minutes to apply. {CALLBACK_SENTENCE}
            </p>
            <Link className="btn btn-primary" href="/apply">
              {APPLY_CTA} ↗
            </Link>
            <a className="btn btn-ghost" href={PHONE_TEL_HREF}>
              Call us
            </a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
