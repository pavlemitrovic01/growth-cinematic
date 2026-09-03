'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import NoScriptContact from './NoScriptContact';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import { PHONE_TEL_HREF, PHONE_SMS_HREF } from '@/lib/contact';
import { messageForFields } from '@/lib/form-options';

/**
 * Carrier upit (B2B tok). Logika prenesena iz MAIN-a
 * (`C:/dev/growth/components/CarrierForm.jsx`), izgled nov.
 *
 * ⚠️ Polja se poklapaju sa `app/api/carrier-inquiry/route.js`: companyName, contactName,
 * phone su obavezni; email je OPCION i ruta ga eksplicitno prihvata prazan ili izostao
 * (tri testa u `__tests__/api/carrier-inquiry.test.js` cuvaju bas to).
 */

const PHONE_PATTERN = '[0-9\\s\\(\\)\\.\\+\\-]{7,25}';
const PHONE_TITLE = 'Enter all 10 digits, including the area code.';

/**
 * ⚠️ TCPA — pravni tekst, prenet doslovno. Isti one-to-one pristanak kao u `ApplyForm`,
 * sa „driver recruiting services" umesto „driving opportunities" jer je druga publika.
 * Ne parafrazirati.
 */
const CONSENT_TEXT = (
  <>
    I agree that <strong>Capljinac LLC</strong> may contact me by phone call, text message (SMS)
    and email at the number and address I provided — including by automated means — about driver
    recruiting services. This consent is for Capljinac LLC only. Consent is not a condition of any
    service, and I can opt out at any time by replying STOP. Message and data rates may apply. See
    our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms</Link>.
  </>
);

/** Vidi `components/ApplyForm.tsx` — tri a11y odluke oko honeypota su tamo obrazlozene. */
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

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function CarrierForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const feedback = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(formData);
    data.tcpaConsent = formData.get('tcpaConsent') === 'on';

    try {
      const res = await fetch('/api/carrier-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      // Oblik koji ruta stvarno vraca: `error` uvek, `fields` samo na validaciji.
      const payload = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        fields?: string[];
      };
      if (!res.ok || payload.success !== true) {
        // Isti SEC-2b fix kao u ApplyForm — server salje `fields`, klijent ih prevodi
        // u recenicu umesto da prikaze doslovno „Validation failed".
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

  if (status === 'success') {
    return (
      <div className="form-done" role="status">
        <h2>Inquiry received.</h2>
        <p>We&apos;ll be in touch to talk through what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <><NoScriptContact /><form method="post" action="/api/carrier-inquiry" className="af" aria-busy={status === 'submitting'} onSubmit={handleSubmit}>
      <Honeypot id="hp_carrier" />

      <div className="af-row">
        <div className="af-field">
          <label htmlFor="cf-company">Company name</label>
          <input
            id="cf-company"
            name="companyName"
            type="text"
            required
            autoComplete="organization"
            maxLength={200}
          />
        </div>
        <div className="af-field">
          <label htmlFor="cf-contact">Contact name</label>
          <input
            id="cf-contact"
            name="contactName"
            type="text"
            required
            autoComplete="name"
            maxLength={200}
          />
        </div>
      </div>

      <div className="af-row">
        <div className="af-field">
          <label htmlFor="cf-phone">Phone</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            title={PHONE_TITLE}
            aria-describedby="cf-phone-hint"
          />
          <span className="field-hint" id="cf-phone-hint">
            Include your area code
          </span>
        </div>
        <div className="af-field">
          {/* Email je OPCION — ruta ga izricito prihvata prazan. Labela to i kaze,
              da niko ne odustane misleci da mora. */}
          <label htmlFor="cf-email">
            Email <span className="label-optional">(optional)</span>
          </label>
          <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={200} />
        </div>
      </div>

      <label className="consent">
        <input required type="checkbox" name="tcpaConsent" />
        <span>By checking this box, {CONSENT_TEXT}</span>
      </label>

      <button className="af-submit" type="submit" disabled={status === 'submitting'}>
        <span>{status === 'submitting' ? 'SENDING…' : 'SEND INQUIRY'}</span>
        <b aria-hidden="true">↗</b>
      </button>

      {status === 'error' && (
        <div ref={feedback} tabIndex={-1} role="alert" className="form-error">
          {errorMsg}
          <br />
          <a href={PHONE_TEL_HREF}>Call us</a>
          {' · '}
          <a href={PHONE_SMS_HREF}>Text us</a>
        </div>
      )}
    </form></>
  );
}
