import { describe, it, expect } from 'vitest';
import {
  isValidPhone, isValidEmail, isConsentGranted, buildConsentRecord,
  isWithinLength, isOneOf, MAX_LENGTHS, CDL_CLASSES, EXPERIENCE, YES_NO,
} from '@/lib/validation';
import { CDL_CLASSES as FORM_CDL, EXPERIENCE_LEVELS as FORM_EXP, YES_NO as FORM_YESNO } from '@/lib/form-options';

describe('isValidPhone', () => {
  it('accepts plain digits', () => {
    expect(isValidPhone('5551234567')).toBe(true);
  });

  it('accepts formatted number with parens/dashes/spaces', () => {
    expect(isValidPhone('(555) 123-4567')).toBe(true);
  });

  it('rejects a number that is too short', () => {
    expect(isValidPhone('12345')).toBe(false);
  });

  it('rejects letters', () => {
    expect(isValidPhone('555-CALL-NOW')).toBe(false);
  });
});

/**
 * LEAD1/SEC-2 — do 2026-09-02 je regex proveravao SKUP ZNAKOVA i duzinu, ali nikad nije
 * trazio nijednu cifru: `"       "`, `"+++++++"` i `"()()()()"` su prolazili kao validni
 * brojevi. Ceo model stoji na uzvratnom pozivu, pa je to bio lead kome se ne moze uzvratiti.
 *
 * Ova dva bloka su acceptance #1 iz manifesta, doslovno. Oba smera su nosiva:
 * bez „mora proci" bi i regex koji odbija SVE prosao proveru iznad (klasa greske iz L5).
 */
describe('isValidPhone — D27 prag od 10 cifara', () => {
  const moraPasti = [
    ['sedam razmaka', '       '],
    ['samo plusevi', '+++++++'],
    ['samo zagrade', '()()()()'],
    ['samo crtice', '-------'],
    ['mesano bez cifara', '( ) - + '],
    ['sedmocifren, bez pozivnog', '555-1234'],
    ['prekratko', '555'],
    ['slova', 'abcdefg'],
    ['prazno', ''],
    ['predugacko', '12345678901234567890123456'],
  ];

  it.each(moraPasti)('odbija %s', (_naziv, unos) => {
    expect(isValidPhone(unos)).toBe(false);
  });

  const moraProci = [
    ['US sa crticama', '240-226-3786'],
    ['US sa +1 i zagradama', '+1 (240) 226-3786'],
    ['US sa tackama', '240.226.3786'],
    ['US sa razmacima', '(240) 226 3786'],
    ['gole cifre', '2402263786'],
    ['medjunarodni', '+387 63 123 456'],
    ['+1 sa crticama', '+1-240-226-3786'],
    ['vodeca jedinica', '1 240 226 3786'],
  ];

  it.each(moraProci)('prima %s', (_naziv, unos) => {
    expect(isValidPhone(unos)).toBe(true);
  });

  // Tacka je dodata u skup znakova u LEAD1 — `240.226.3786` je uobicajen americki zapis
  // koji je stari regex ODBIJAO. To je bio tih gubitak pravih leadova.
  it('prima tacku kao separator (stari regex ju je odbijao)', () => {
    expect(isValidPhone('240.226.3786')).toBe(true);
  });
});

describe('isWithinLength', () => {
  it('prima vrednost tacno na granici', () => {
    expect(isWithinLength('x'.repeat(MAX_LENGTHS.firstName), MAX_LENGTHS.firstName)).toBe(true);
  });

  it('odbija jedan znak preko granice', () => {
    expect(isWithinLength('x'.repeat(MAX_LENGTHS.firstName + 1), MAX_LENGTHS.firstName)).toBe(false);
  });

  // Granica mora biti VELIKODUSNA: vozac koji objasnjava svoj dosije mora imati prostora.
  it('pusta 2000 znakova objasnjenja o violations', () => {
    expect(isWithinLength('x'.repeat(2000), MAX_LENGTHS.violationsDetails)).toBe(true);
  });

  it('tretira nedostajucu vrednost kao dozvoljenu (opciono polje)', () => {
    expect(isWithinLength(undefined, 10)).toBe(true);
    expect(isWithinLength(null, 10)).toBe(true);
  });
});

describe('isOneOf', () => {
  it('prima vrednost iz liste', () => {
    expect(isOneOf('A', CDL_CLASSES)).toBe(true);
    expect(isOneOf('2+ years', EXPERIENCE)).toBe(true);
    expect(isOneOf('Yes', YES_NO)).toBe(true);
  });

  it('odbija proizvoljan string', () => {
    expect(isOneOf('banana', CDL_CLASSES)).toBe(false);
  });

  // ⚠️ Ovo je bio STVARAN nalaz: `__tests__/api/apply.test.js` je slao 'Class A' — LABELU
  // umesto VREDNOSTI — i prolazio, jer je stara provera bila samo `if (!cdlClass)`.
  it('odbija labelu poslatu umesto vrednosti', () => {
    expect(isOneOf('Class A', CDL_CLASSES)).toBe(false);
  });

  it('odbija prazno i nedostajuce', () => {
    expect(isOneOf('', CDL_CLASSES)).toBe(false);
    expect(isOneOf(undefined, CDL_CLASSES)).toBe(false);
  });
});

/**
 * Whitelist na serveru vredi samo ako je ISTA lista koju forma renderuje. Rucno prepisan
 * whitelist bi se razisao pri prvoj izmeni forme i tiho poceo da odbija PRAVE prijave —
 * kvar koji niko ne bi primetio jer forma i dalje izgleda ispravno.
 */
describe('forma i validator dele isti izvor opcija', () => {
  it('cdlClass', () => {
    expect(CDL_CLASSES).toEqual(FORM_CDL.map((o) => o.value));
  });

  it('experience', () => {
    expect(EXPERIENCE).toEqual(FORM_EXP.map((o) => o.value));
  });

  it('yes/no', () => {
    expect(YES_NO).toEqual(FORM_YESNO.map((o) => o.value));
  });
});

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('driver@example.com')).toBe(true);
  });

  it('rejects an email missing @', () => {
    expect(isValidEmail('driver.example.com')).toBe(false);
  });

  it('rejects an email missing a TLD', () => {
    expect(isValidEmail('driver@example')).toBe(false);
  });
});

// TCPA kapija — ovo je tacna povrsina koju je R2 popravio (string "true"/"on" je
// ranije prolazio kao pristanak). Najgusce pokriveno namerno.
describe('isConsentGranted', () => {
  it('grants only on boolean true', () => {
    expect(isConsentGranted(true)).toBe(true);
  });

  it('rejects the string "true"', () => {
    expect(isConsentGranted('true')).toBe(false);
  });

  it('rejects the string "on" (raw checkbox value)', () => {
    expect(isConsentGranted('on')).toBe(false);
  });

  it('rejects boolean false', () => {
    expect(isConsentGranted(false)).toBe(false);
  });

  it('rejects undefined (missing field)', () => {
    expect(isConsentGranted(undefined)).toBe(false);
  });
});

describe('buildConsentRecord', () => {
  it('returns the expected shape with the given scope', () => {
    const before = Date.now();
    const record = buildConsentRecord('Capljinac LLC only (one-to-one)');
    const after = Date.now();

    expect(record.granted).toBe(true);
    expect(record.scope).toBe('Capljinac LLC only (one-to-one)');
    // ⚠️ LEAD1 je podigao verziju sa '2026-07-30' jer je LEG-1 promenio Chatbot consent
    // tekst. `textVersion` identifikuje TEKST koji je vozac video — da je ostala stara,
    // zapis bi tvrdio da je prikazan stari tekst, tj. isti kvar koji LEG-1 popravlja.
    expect(record.textVersion).toBe('2026-09-02');

    const grantedAtMs = new Date(record.grantedAt).getTime();
    expect(record.grantedAt).toBe(new Date(grantedAtMs).toISOString());
    expect(grantedAtMs).toBeGreaterThanOrEqual(before);
    expect(grantedAtMs).toBeLessThanOrEqual(after);
  });

  // LEAD1/SEC-3 — standardni TCPA dokazni zapis nosi i adresu sa koje je pristanak stigao.
  it('belezi IP kada je prosledjen', () => {
    const record = buildConsentRecord('Capljinac LLC only (one-to-one)', '203.0.113.7');
    expect(record.ip).toBe('203.0.113.7');
  });

  // Bolje zapis bez adrese nego izostanak zapisa ako `clientIp` ne vrati vrednost.
  it('pada na "unknown" umesto da izostavi polje', () => {
    expect(buildConsentRecord('scope').ip).toBe('unknown');
    expect(buildConsentRecord('scope', '').ip).toBe('unknown');
  });
});
