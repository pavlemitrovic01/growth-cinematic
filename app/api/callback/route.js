import { NextResponse } from 'next/server';
import { isValidPhone, isConsentGranted, buildConsentRecord, isWithinLength, MAX_LENGTHS } from '@/lib/validation';
import { isEmailConfigured, sendLead } from '@/lib/email';
import { checkRateLimit, isHoneypotTripped, HONEYPOT_FIELD, clientIp } from '@/lib/rate-limit';
import { recordLead } from '@/lib/leads';

// F1a: Resend slanje ukljuceno. Uspeh se vraca samo ako je mejl stvarno otisao.

export async function POST(req) {
  try {
    // ⚠️ LEAD1/SEC-5 — kocnica pre parsiranja. Vidi obrazlozenje u `apply/route.js`.
    const limit = await checkRateLimit(req, 'callback');
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later, or call us directly.' },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const { phone, tcpaConsent } = body;

    // SEC2 — honeypot. Provera je "PRISUTAN I NIJE PRAZAN", nikad "mora postojati".
    // ⚠️ LEAD1/SEC-4: Chatbot OD SADA salje ovo polje. Provera svejedno ostaje popustljiva
    // jer stariji kesiran klijent moze jos uvek slati stari oblik — a odbiti pravog vozaca
    // zbog nedostajuceg skrivenog polja bi bilo tacno ono sto ovaj batch sprecava.
    if (isHoneypotTripped(body)) {
      console.warn('[callback] Honeypot popunjen — zahtev odbijen.', { field: HONEYPOT_FIELD });
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    // ⚠️ LEAD1/SEC-2b — odgovor nosi `fields` kao i druge dve rute, da Chatbot moze da kaze
    // vozacu STA da popravi. Ranije je vracao `{error:'Invalid phone number'}`, sto je
    // citljivo ali ne kaze sta da se uradi.
    const errors = [];
    if (!isValidPhone(phone) || !isWithinLength(phone, MAX_LENGTHS.phone)) errors.push('phone');
    // TCPA: bez pristanka nema poziva ni SMS-a na ovaj broj.
    if (!isConsentGranted(tcpaConsent)) errors.push('tcpaConsent');

    if (errors.length) {
      return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 });
    }

    const consentRecord = buildConsentRecord('Capljinac LLC only (one-to-one)', clientIp(req));

    if (!isEmailConfigured()) {
      console.error('[callback] Email nije podesen — callback zahtev NIJE poslat.', { phone });
      return NextResponse.json(
        { error: 'Callback requests are temporarily unavailable. Please call us directly.' },
        { status: 503 }
      );
    }

    const sent = await sendLead({
      subject: `Callback request — ${phone}`,
      fields: [
        ['Lead type', 'Callback request'],
        ['Phone', phone, 'phone'],
      ],
      consent: consentRecord,
    });

    // Trajni zapis u D1. Ide i kad mejl padne — tada je jedini zapis koji ostaje.
    // Nikad ne baca i nikad ne menja odgovor vozacu (vidi lib/leads.js).
    await recordLead({
      source: 'callback',
      payload: body,
      consent: consentRecord,
      emailDelivered: sent.ok,
      userAgent: req.headers.get('user-agent'),
    });

    if (!sent.ok) {
      console.error('[callback] Resend nije poslao zahtev — vozacu NIJE potvrdjeno.', {
        error: sent.error,
        lead: { phone },
        consentRecord,
      });
      return NextResponse.json(
        { error: 'Callback requests are temporarily unavailable. Please call us directly.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[callback] API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
