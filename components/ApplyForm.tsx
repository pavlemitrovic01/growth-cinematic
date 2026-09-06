'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import NoScriptContact from './NoScriptContact';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { PHONE_TEL_HREF, PHONE_SMS_HREF } from '@/lib/contact';
import {
  CDL_CLASSES,
  EXPERIENCE_LEVELS,
  YES_NO,
  messageForFields,
} from '@/lib/form-options';

/**
 * Prijava vozaca. Logika prenesena iz MAIN-a (`C:/dev/growth/components/ApplyForm.jsx`);
 * izgled je nov — cinematic jezik (forest/bone/clay), ne MAIN-ova krem paleta.
 *
 * variant="quick" — presretac ispod heroja: ime + telefon + pristanak. Vozac je najcesce
 *   na telefonu, na parkingu; dva polja su razlika izmedju leada i odustajanja. Ostalo se
 *   pokupi na pozivu, sto je ionako obecanje brenda.
 * variant="full"  — puna kvalifikaciona forma.
 */

const PHONE_PATTERN = '[0-9\\s\\(\\)\\.\\+\\-]{7,25}';
const PHONE_TITLE = 'Enter all 10 digits, including the area code.';
const PHONE_HINT = 'Include your area code';

/**
 * ⚠️ TCPA — PRAVNI TEKST, PRENET DOSLOVNO IZ MAIN-a. Ne parafrazirati, ne skracivati.
 * Pristanak je one-to-one (samo Capljinac LLC, bez „and partners"), nije uslov za uslugu,
 * i nosi opt-out. Svaka izmena formulacije trazi novu `CONSENT_TEXT_VERSION` u
 * `lib/validation.js`, jer se verzija upisuje uz svaki pristanak u bazu.
 *
 * ⚠️ PREFIKS "By checking this box," JE DEO OVOG STRINGA, ne poziva. Do 2026-09-06 je
 * stajao na pozivima -- dve od tri povrsine su ga imale, quick forma nije. Obe varijante
 * su se upisivale u bazu pod ISTOM `CONSENT_TEXT_VERSION`, a obe su `source: apply`, pa
 * se iz zapisa nije moglo razluciti sta je vozac stvarno video. Razlika vozac/carrier je
 * razluciva preko `source`; ova nije bila razluciva nicim. Unutar stringa razilazenje
 * postaje nemoguce -- isti obrazac kao `lib/form-options.js` i `lib/honeypot.js`.
 */
const CONSENT_TEXT = (
  <>
    By checking this box, I agree that <strong>Capljinac LLC</strong> may contact me by phone
    call, text message (SMS) and email at the number and address I provided — including by
    automated means — about driving opportunities. This consent is for Capljinac LLC only.
    Consent is not a condition of any service, and I can opt out at any time by replying STOP.
    Message and data rates may apply. See
    our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms</Link>.
  </>
);

/**
 * Honeypot.
 *
 * ⚠️ TRI ODLUKE PRENETE IZ MAIN-a, sve tri naucene a ne pretpostavljene:
 *  1. NIJE `display:none` — deo botova takva polja preskace, a autofill ume da ih popuni.
 *  2. NEMA `aria-hidden` — polje je fokusabilno, a fokusabilan element unutar `aria-hidden`
 *     kontejnera je axe povreda `aria-hidden-focus`. Uvela bi NOVU a11y gresku.
 *  3. Zato standardni pristupacan obrazac: van ekrana, van tab redosleda, uz labelu koja
 *     citacu ekrana kaze da polje ostavi prazno.
 *
 * Ime polja se UVOZI iz `lib/honeypot.js` — isti izvor koji server proverava.
 */
function Honeypot({ id }: { id: string }) {
  return (
    <div className="hp-field">
      <label htmlFor={id}>Company website (leave empty)</label>
      <input
        type="text"
        id={id}
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplyForm({ variant = 'full' }: { variant?: 'quick' | 'full' }) {
  const isQuick = variant === 'quick';
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const feedback = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  const [hasViolations, setHasViolations] = useState(false);
  const [hasSAP, setHasSAP] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(formData);
    // Checkbox stize kao "on" ili izostaje — server trazi EKSPLICITAN boolean.
    data.tcpaConsent = formData.get('tcpaConsent') === 'on';
    data.leadType = variant;

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      // Oblik koji rute stvarno vracaju: `error` uvek, `fields` samo na validaciji.
      const payload = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        fields?: string[];
      };
      if (!res.ok || payload.success !== true) {
        // ⚠️ Prenet fix iz MAIN-a (LEAD1/SEC-2b) — najveci pojedinacni gubitak leadova koji
        // je taj projekat imao. Server VEC salje `fields` sa imenom polja koje je palo, a
        // klijent je tu informaciju bacao i prikazivao doslovno „Validation failed".
        // `messageForFields` je pretvara u recenicu koja kaze STA da se popravi.
        const fallback = payload.error || 'Something went wrong. Please call or text us instead.';
        setErrorMsg(messageForFields(payload.fields, fallback));
        setStatus('error');
        requestAnimationFrame(() => feedback.current?.focus());
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('We could not reach our server. Please call or text us instead.');
      setStatus('error');
      requestAnimationFrame(() => feedback.current?.focus());
    } finally {
      submitting.current = false;
    }
  }

  const errorBlock = status === 'error' && (
    <div ref={feedback} tabIndex={-1} role="alert" className="form-error">
      {errorMsg}
      <br />
      <a href={PHONE_TEL_HREF}>Call us</a>
      {' · '}
      <a href={PHONE_SMS_HREF}>Text us</a>
    </div>
  );

  /**
   * ⚠️ CLAIMS C12 — „15–20 minuta" je CONDITIONAL i goli oblik je trajno zabranjen.
   * Dozvoljen je samo sa OBA hedza zajedno: ucestalost („usually") + vremenski okvir.
   * Registar za drugi hedz priznaje „business/staffed hours"; ovaj projekat koristi
   * „staffed" jer tim ne radi po objavljenom radnom vremenu (vidi C13). Ne skracivati —
   * ista recenica stoji u MAIN-u i tamo je prosla cetiri claims batch-a.
   *
   * ⚠️ Ovo je JEDINI izvor te recenice u formama, ali ne i na sajtu: ista tvrdnja je
   * prekucana jos na pet mesta (`app/apply`, `app/contact`, `app/how-it-works` ×2,
   * `components/CinematicHome`, `lib/faq.js`) u tri varijante glagola. Zaveden nalaz u
   * `docs/AUDIT.md` § Faza 4 — recenica sa sopstvenim redom u registru treba da ima
   * jedan izvor.
   */
  const successNote = (
    <>
      A recruiter <strong>usually</strong> calls you back within 15–20 minutes{' '}
      <strong>during staffed hours</strong>.
    </>
  );

  // ---------- QUICK ----------
  if (isQuick) {
    if (status === 'success') {
      return (
        <div className="qa qa--done" role="status">
          <span className="qa-check">
            <CheckMark />
          </span>
          <p>
            <strong>Got your number.</strong> {successNote}
          </p>
        </div>
      );
    }

    return (
      <><NoScriptContact /><form method="post" action="/api/apply" className="qa" aria-busy={status === 'submitting'} onSubmit={handleSubmit} noValidate={false}>
        <Honeypot id="hp_apply_quick" />

        <div className="qa-copy">
          <p className="qa-eyebrow">FAST LANE</p>
          <p className="qa-lede">Two fields. We call you back — you decide after that.</p>
        </div>

        <div className="qa-field">
          <label htmlFor="qa-first">First name</label>
          <input
            id="qa-first"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            maxLength={100}
          />
        </div>

        <div className="qa-field">
          <label htmlFor="qa-phone">Phone</label>
          <input
            id="qa-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            title={PHONE_TITLE}
            aria-describedby="qa-phone-hint"
          />
          {/* Hint postoji da vozac ispravi broj PRE slanja, umesto da dobije odbijenicu
              posle. `aria-describedby` ga vezuje za polje, pa ga citac ekrana procita. */}
          <span className="field-hint" id="qa-phone-hint">
            {PHONE_HINT}
          </span>
        </div>

        <label className="consent consent--compact">
          <input required type="checkbox" name="tcpaConsent" />
          <span>{CONSENT_TEXT}</span>
        </label>

        <button className="qa-submit" type="submit" disabled={status === 'submitting'}>
          <span>{status === 'submitting' ? 'SENDING…' : 'GET MY CALLBACK'}</span>
          <b aria-hidden="true">↗</b>
        </button>

        {errorBlock}
      </form></>
    );
  }

  // ---------- FULL ----------
  if (status === 'success') {
    return (
      <div className="form-done" role="status">
        <span className="qa-check">
          <CheckMark />
        </span>
        <h2>Application received.</h2>
        <p>{successNote}</p>
      </div>
    );
  }

  return (
    <><NoScriptContact /><form method="post" action="/api/apply" className="af" aria-busy={status === 'submitting'} onSubmit={handleSubmit}>
      <Honeypot id="hp_apply_full" />

      <div className="af-row">
        <div className="af-field">
          <label htmlFor="af-first">First name</label>
          <input
            id="af-first"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            maxLength={100}
          />
        </div>
        <div className="af-field">
          <label htmlFor="af-last">Last name</label>
          <input
            id="af-last"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            maxLength={100}
          />
        </div>
      </div>

      <div className="af-row">
        <div className="af-field">
          <label htmlFor="af-phone">Phone</label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            title={PHONE_TITLE}
            aria-describedby="af-phone-hint"
          />
          <span className="field-hint" id="af-phone-hint">
            {PHONE_HINT}
          </span>
        </div>
        <div className="af-field">
          <label htmlFor="af-email">Email</label>
          <input
            id="af-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
          />
        </div>
      </div>

      <div className="af-row">
        {/* ⚠️ Opcije se RENDERUJU iz `lib/form-options.js`, iste liste protiv kojih server
            validira. Prepisivanje rukom je zamka: promeni se <option>, server pocne da
            odbija PRAVE prijave, a forma i dalje izgleda ispravno. */}
        <div className="af-field">
          <label htmlFor="af-cdl">CDL class</label>
          <select id="af-cdl" name="cdlClass" required defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {CDL_CLASSES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="af-field">
          <label htmlFor="af-exp">Driving experience</label>
          <select id="af-exp" name="experience" required defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {EXPERIENCE_LEVELS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="af-row">
        <div className="af-field">
          <label htmlFor="af-viol">Moving violations in the last 3 years?</label>
          <select
            id="af-viol"
            name="hasViolations"
            required
            defaultValue=""
            onChange={(e) => setHasViolations(e.target.value === 'Yes')}
          >
            <option value="" disabled>
              Select…
            </option>
            {YES_NO.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="af-field">
          <label htmlFor="af-sap">Currently in or completed a SAP program?</label>
          <select
            id="af-sap"
            name="hasSAP"
            required
            defaultValue=""
            onChange={(e) => setHasSAP(e.target.value === 'Yes')}
          >
            <option value="" disabled>
              Select…
            </option>
            {YES_NO.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasViolations && (
        <div className="af-field">
          <label htmlFor="af-viol-d">Tell us briefly about the violations</label>
          <textarea id="af-viol-d" name="violationsDetails" rows={3} required maxLength={2000} />
        </div>
      )}

      {hasSAP && (
        <div className="af-field">
          <label htmlFor="af-sap-d">Tell us briefly about your SAP status</label>
          <textarea id="af-sap-d" name="sapDetails" rows={3} required maxLength={2000} />
        </div>
      )}

      <label className="consent">
        <input required type="checkbox" name="tcpaConsent" />
        <span>{CONSENT_TEXT}</span>
      </label>

      <button className="af-submit" type="submit" disabled={status === 'submitting'}>
        <span>{status === 'submitting' ? 'SENDING…' : 'SUBMIT APPLICATION'}</span>
        <b aria-hidden="true">↗</b>
      </button>

      {errorBlock}
    </form></>
  );
}
