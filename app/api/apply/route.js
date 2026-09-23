import { NextResponse } from 'next/server';
import {
  isValidPhone, isValidEmail, isConsentGranted, buildConsentRecord,
  isWithinLength, isOneOf, MAX_LENGTHS, CDL_CLASSES, EXPERIENCE, YES_NO,
} from '@/lib/validation';
import { isEmailConfigured, sendLead } from '@/lib/email';
import { checkRateLimit, isHoneypotTripped, HONEYPOT_FIELD, clientIp } from '@/lib/rate-limit';
import { recordLead } from '@/lib/leads';
import { REACH_US } from '@/lib/contact';

// F1a: Resend slanje ukljuceno. Ruta vraca uspeh ISKLJUCIVO ako je mejl stvarno
// otisao — svaki drugi ishod je 503 "pozovite nas", nikad lazna potvrda.
// Ostaje za F1b: autoresponder vozacu (ceka verifikovan domen).

export async function POST(req) {
  try {
    // ⚠️ LEAD1/SEC-5 — KOCNICA JE SADA STVARNO PRVA.
    // Do 2026-09-02 je iznad nje stajao `await req.json()`, pa je zahtev sa pokvarenim telom
    // bacao u `catch` PRE nego sto limiter bude pozvan — i nije se brojao. Napadac je time
    // mogao slati neograniceno takvih zahteva sa istog IP-a. Komentar na tom mestu je tvrdio
    // „kocnica PRE validacije", sto je bilo tacno za validaciju a netacno za parsiranje.
    const limit = await checkRateLimit(req, 'apply');
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Too many requests. Please try again later, or ${REACH_US}.` },
        { status: 429 }
      );
    }

    // Pokvareno telo je klijentska greska (400), ne serverska (500) — i sada je vec izbrojano.
    let data;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    // SEC2 — honeypot. Provera je "PRISUTAN I NIJE PRAZAN", nikad "mora postojati":
    // Chatbot gadja /api/callback i polje moze izostati kod starijeg keširanog klijenta.
    // Vraca 400 a ne lazni 200 — repo nosi pravilo da uspeh znaci da je mejl stvarno otisao.
    if (isHoneypotTripped(data)) {
      console.warn('[apply] Honeypot popunjen — zahtev odbijen.', { field: HONEYPOT_FIELD });
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const {
      firstName, lastName, phone, email, cdlClass, experience,
      hasViolations, violationsDetails, hasSAP, sapDetails, tcpaConsent,
      leadType,
    } = data;

    // "quick" = presretac ispod heroja (ime + telefon). Ostalo se pokupi na pozivu.
    // "full"  = kvalifikaciona forma na dnu stranice.
    const isQuick = leadType === 'quick';

    // --- Validacija ---
    // ⚠️ LEAD1/SEC-1 — do sada je ovde stajala samo provera ISTINITOSTI. `firstName` od 4 MB
    // je prolazio i ulazio u telo mejla; `cdlClass: "banana"` isto. Granice su namerno
    // velikodusne (vidi MAX_LENGTHS) — cilj je zaustaviti napad, ne oterati vozaca.
    const errors = [];
    if (!firstName?.trim() || !isWithinLength(firstName, MAX_LENGTHS.firstName)) errors.push('firstName');
    if (!isValidPhone(phone) || !isWithinLength(phone, MAX_LENGTHS.phone)) errors.push('phone');

    if (!isQuick) {
      if (!lastName?.trim() || !isWithinLength(lastName, MAX_LENGTHS.lastName)) errors.push('lastName');
      if (!isValidEmail(email) || !isWithinLength(email, MAX_LENGTHS.email)) errors.push('email');
      // Whitelist umesto provere istinitosti. Lista dolazi iz `lib/form-options.js`, koji
      // uvozi i sama forma — pa nova opcija u formi ne moze tiho poceti da pada na serveru.
      if (!isOneOf(cdlClass, CDL_CLASSES)) errors.push('cdlClass');
      if (!isOneOf(experience, EXPERIENCE)) errors.push('experience');
      if (!isOneOf(hasViolations, YES_NO)) errors.push('hasViolations');
      if (!isOneOf(hasSAP, YES_NO)) errors.push('hasSAP');
      if (hasViolations === 'Yes' && (!violationsDetails?.trim() || !isWithinLength(violationsDetails, MAX_LENGTHS.violationsDetails))) errors.push('violationsDetails');
      if (hasSAP === 'Yes' && (!sapDetails?.trim() || !isWithinLength(sapDetails, MAX_LENGTHS.sapDetails))) errors.push('sapDetails');
    }

    // TCPA: pristanak mora biti eksplicitan boolean true — string "true"/"on" vise ne prolazi (R2).
    if (!isConsentGranted(tcpaConsent)) errors.push('tcpaConsent');

    if (errors.length) {
      // `fields` je jedini nacin na koji klijent moze da kaze vozacu STA da popravi.
      // Do LEAD1 ga je klijent dobijao i bacao, pa je vozac video „Validation failed" (SEC-2b).
      return NextResponse.json(
        { error: 'Validation failed', fields: errors },
        { status: 400 }
      );
    }

    // Zapis o pristanku — belezi se STVARNA vrednost, trenutak i IP, ne hardkodovano "Yes".
    const consentRecord = buildConsentRecord('TTIrecruiting only (one-to-one)', clientIp(req));

    // ⚠️ Upis IDE I OVDE, pre 503-a. Bez ovoga baza ne pokriva bas slucaj zbog kojeg
    // postoji: mejl nije podesen -> ruta izlazi rano -> lead nestaje bez traga.
    // Vozac i dalje dobija 503 "pozovite nas" — pravilo da uspeh znaci poslat mejl
    // ostaje netaknuto; ovo menja samo da li je prijava povratljiva.
    if (!isEmailConfigured()) {
      await recordLead({
        source: 'apply',
        payload: data,
        consent: consentRecord,
        emailDelivered: false,
        userAgent: req.headers.get('user-agent'),
      });
      console.error('[apply] RESEND_API_KEY / LEAD_NOTIFICATION_EMAIL nisu podeseni — lead NIJE poslat.', {
        leadType: isQuick ? 'quick' : 'full',
        name: `${firstName} ${lastName || ''}`.trim(),
        phone,
      });
      return NextResponse.json(
        { error: `Applications are temporarily unavailable. Please ${REACH_US} instead.` },
        { status: 503 }
      );
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();
    const sent = await sendLead({
      subject: `New driver lead — ${fullName} — ${phone}`,
      fields: [
        ['Lead type', isQuick ? 'Quick (hero band)' : 'Full application'],
        ['Name', fullName],
        ['Phone', phone, 'phone'],
        ['Email', email],
        ['CDL class', cdlClass],
        ['Experience', experience],
        ['Violations', hasViolations],
        ['Violation details', violationsDetails],
        ['SAP program', hasSAP],
        ['SAP details', sapDetails],
      ],
      consent: consentRecord,
      // Odgovori u mejlu ide pravo vozacu, bez prekucavanja adrese.
      replyTo: isValidEmail(email) ? email : undefined,
    });

    // Trajni zapis u D1. Ide i kad mejl padne — tada je jedini zapis koji ostaje.
    // Nikad ne baca i nikad ne menja odgovor vozacu (vidi lib/leads.js).
    await recordLead({
      source: 'apply',
      payload: data,
      consent: consentRecord,
      emailDelivered: sent.ok,
      userAgent: req.headers.get('user-agent'),
    });

    if (!sent.ok) {
      // Backup zapis: lead u log da je povratljiv iz Vercel logova i kad Resend
      // padne. Slabije od baze, ali je razlika izmedju "kasni" i "nestao".
      //
      // violations/SAP tekst se NE upisuje: to su osetljive izjave (SAP je
      // program za zloupotrebu supstanci), Vercel logove cita svako sa pristupom
      // projektu, a privacy stranica ne pominje cuvanje u logovima. Za povracaj
      // je dovoljno ime + telefon — detalji se na pozivu ionako prikupljaju
      // ponovo. Cuva se samo DA LI ih ima.
      console.error('[apply] Resend nije poslao lead — vozacu NIJE potvrdjeno.', {
        error: sent.error,
        lead: {
          leadType, firstName, lastName, phone, email, cdlClass, experience,
          hasViolations, hasSAP,
          violationsDetails: violationsDetails ? '[redigovano]' : undefined,
          sapDetails: sapDetails ? '[redigovano]' : undefined,
        },
        consentRecord,
      });
      return NextResponse.json(
        { error: `Applications are temporarily unavailable. Please ${REACH_US} instead.` },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[apply] API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
