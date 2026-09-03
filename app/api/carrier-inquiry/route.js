import { NextResponse } from 'next/server';
import { isValidPhone, isValidEmail, isConsentGranted, buildConsentRecord, isWithinLength, MAX_LENGTHS } from '@/lib/validation';
import { isEmailConfigured, sendLead } from '@/lib/email';
import { checkRateLimit, isHoneypotTripped, HONEYPOT_FIELD, clientIp } from '@/lib/rate-limit';
import { recordLead } from '@/lib/leads';

// F1a: Resend slanje ukljuceno. Uspeh se vraca samo ako je mejl stvarno otisao.

export async function POST(req) {
  try {
    // ⚠️ LEAD1/SEC-5 — kocnica pre parsiranja. Vidi obrazlozenje u `apply/route.js`.
    const limit = await checkRateLimit(req, 'carrier');
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

    const { companyName, contactName, phone, email, tcpaConsent } = body;

    // SEC2 — honeypot. Provera je "PRISUTAN I NIJE PRAZAN", nikad "mora postojati".
    if (isHoneypotTripped(body)) {
      console.warn('[carrier-inquiry] Honeypot popunjen — zahtev odbijen.', { field: HONEYPOT_FIELD });
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const errors = [];
    if (!companyName?.trim() || !isWithinLength(companyName, MAX_LENGTHS.companyName)) errors.push('companyName');
    if (!contactName?.trim() || !isWithinLength(contactName, MAX_LENGTHS.contactName)) errors.push('contactName');
    if (!isValidPhone(phone) || !isWithinLength(phone, MAX_LENGTHS.phone)) errors.push('phone');
    // ⚠️ Email OSTAJE OPCION. Ruta ga je oduvek tako tretirala, a LEAD1/PRD-1 tek sada dodaje
    // polje u formu — obavezno polje bi bilo novo trenje na jedinoj B2B tacki ulaza.
    if (email && (!isValidEmail(email) || !isWithinLength(email, MAX_LENGTHS.email))) errors.push('email');
    // TCPA: ovo polje uzima telefon, mora imati pristanak (CONTEXT.md pravilo — nadjeno pri R2 planu).
    if (!isConsentGranted(tcpaConsent)) errors.push('tcpaConsent');

    if (errors.length) {
      return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 });
    }

    const consentRecord = buildConsentRecord('Capljinac LLC only (one-to-one)', clientIp(req));

    if (!isEmailConfigured()) {
      console.error('[carrier-inquiry] Email nije podesen — upit NIJE poslat.', { companyName });
      return NextResponse.json(
        { error: 'Inquiries are temporarily unavailable. Please email us directly.' },
        { status: 503 }
      );
    }

    const sent = await sendLead({
      subject: `New carrier inquiry — ${companyName}`,
      fields: [
        ['Lead type', 'Carrier inquiry'],
        ['Company', companyName],
        ['Contact', contactName],
        ['Phone', phone, 'phone'],
        ['Email', email],
      ],
      consent: consentRecord,
      replyTo: isValidEmail(email) ? email : undefined,
    });

    // Trajni zapis u D1. Ide i kad mejl padne — tada je jedini zapis koji ostaje.
    // Nikad ne baca i nikad ne menja odgovor vozacu (vidi lib/leads.js).
    await recordLead({
      source: 'carrier-inquiry',
      payload: body,
      consent: consentRecord,
      emailDelivered: sent.ok,
      userAgent: req.headers.get('user-agent'),
    });

    if (!sent.ok) {
      console.error('[carrier-inquiry] Resend nije poslao upit — posiljaocu NIJE potvrdjeno.', {
        error: sent.error,
        lead: { companyName, contactName, phone, email },
        consentRecord,
      });
      return NextResponse.json(
        { error: 'Inquiries are temporarily unavailable. Please email us directly.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[carrier-inquiry] API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
