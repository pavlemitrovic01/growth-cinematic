import { describe, it, expect } from 'vitest';
import {
  CATEGORIES,
  CONSENT_VERSION,
  REPROMPT_BLACKOUT_MS,
  applyGpc,
  effectiveConsent,
  emptyConsent,
  hasDenial,
  isDecided,
  migrateForward,
  parseStored,
  serialize,
  shouldPrompt,
} from '@/lib/consent';

// Pokriven je CIST deo lib/consent.js. Storage omotac (readStoredConsent /
// setConsent / detectGpc) NIJE ovde — vitest.config.js je environment:'node',
// nema `localStorage` ni `navigator`. Omotac se dokazuje u browseru; ne
// dodavati jsdom samo zbog ovih par funkcija (LESSONS L10 kontekst: znati sta
// gate stvarno pokriva, ne pretpostaviti).

describe('emptyConsent', () => {
  it('nista nije dozvoljeno i odluka ne postoji', () => {
    expect(emptyConsent()).toEqual({
      v: CONSENT_VERSION,
      analytics: false,
      advertising: false,
      decidedAt: null,
      gpc: false,
    });
  });

  it('svaka kategorija iz CATEGORIES je pokrivena i pocinje na false', () => {
    const empty = emptyConsent();
    for (const c of CATEGORIES) expect(empty[c]).toBe(false);
  });
});

describe('parseStored', () => {
  it('cita ispravan zapis', () => {
    const raw = JSON.stringify({ v: 1, analytics: true, advertising: false, decidedAt: 1000, gpc: false });
    expect(parseStored(raw)).toEqual({ v: 1, analytics: true, advertising: false, decidedAt: 1000, gpc: false });
  });

  it('vraca null na pokvaren JSON umesto da baci', () => {
    expect(parseStored('{ ne-json')).toBeNull();
  });

  it('vraca null na prazan string i na ne-string', () => {
    expect(parseStored('')).toBeNull();
    expect(parseStored(null)).toBeNull();
    expect(parseStored(undefined)).toBeNull();
  });

  it('vraca null na JSON koji nije objekat', () => {
    expect(parseStored('42')).toBeNull();
    expect(parseStored('"tekst"')).toBeNull();
    expect(parseStored('null')).toBeNull();
    expect(parseStored('[1,2]')).toBeNull();
  });

  it('vraca null kad verzija nije ceo pozitivan broj', () => {
    expect(parseStored(JSON.stringify({ v: 0, analytics: true }))).toBeNull();
    expect(parseStored(JSON.stringify({ v: '1', analytics: true }))).toBeNull();
    expect(parseStored(JSON.stringify({ analytics: true }))).toBeNull();
  });

  it('sve sto nije doslovno true tretira kao odbijeno — nema truthy provlacenja', () => {
    const raw = JSON.stringify({ v: 1, analytics: 'yes', advertising: 1, decidedAt: 5 });
    expect(parseStored(raw)).toMatchObject({ analytics: false, advertising: false });
  });

  it('nevalidan decidedAt pada na null', () => {
    const raw = JSON.stringify({ v: 1, analytics: true, decidedAt: 'juce' });
    expect(parseStored(raw).decidedAt).toBeNull();
  });
});

describe('serialize', () => {
  it('round-trip cuva odluku', () => {
    const record = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: 123, gpc: false };
    expect(parseStored(serialize(record))).toEqual(record);
  });

  it('normalizuje ne-boolean vrednosti pri upisu', () => {
    const out = JSON.parse(serialize({ v: 1, analytics: 'da', advertising: undefined, decidedAt: 1 }));
    expect(out.analytics).toBe(false);
    expect(out.advertising).toBe(false);
  });
});

describe('isDecided / hasDenial', () => {
  it('bez zapisa nema odluke', () => {
    expect(isDecided(null)).toBe(false);
  });

  it('zapis bez decidedAt se ne racuna kao odluka', () => {
    expect(isDecided(emptyConsent())).toBe(false);
  });

  it('zapis sa decidedAt je odluka', () => {
    expect(isDecided({ ...emptyConsent(), decidedAt: 1 })).toBe(true);
  });

  it('hasDenial hvata bilo koju odbijenu kategoriju', () => {
    expect(hasDenial({ v: 1, analytics: true, advertising: false })).toBe(true);
    expect(hasDenial({ v: 1, analytics: false, advertising: true })).toBe(true);
  });

  it('hasDenial je false samo kad je sve dozvoljeno', () => {
    expect(hasDenial({ v: 1, analytics: true, advertising: true })).toBe(false);
  });
});

describe('applyGpc', () => {
  it('bez signala zapis prolazi nedirnut', () => {
    const record = { v: 1, analytics: true, advertising: true, decidedAt: 1, gpc: false };
    expect(applyGpc(record, false)).toBe(record);
  });

  it('signal gasi oglasavanje i kad je zapis rekao true', () => {
    const record = { v: 1, analytics: true, advertising: true, decidedAt: 1, gpc: false };
    const out = applyGpc(record, true);
    expect(out.advertising).toBe(false);
    expect(out.gpc).toBe(true);
  });

  it('signal NE dira analitiku — GPC je opt-out iz deljenja, ne iz merenja', () => {
    const record = { v: 1, analytics: true, advertising: true, decidedAt: 1, gpc: false };
    expect(applyGpc(record, true).analytics).toBe(true);
  });

  it('radi i kad zapisa nema', () => {
    const out = applyGpc(null, true);
    expect(out.advertising).toBe(false);
    expect(out.analytics).toBe(false);
  });
});

describe('shouldPrompt', () => {
  it('pita kad zapisa nema', () => {
    expect(shouldPrompt(null)).toBe(true);
  });

  it('ne pita kad zapis ima tekucu verziju — odluka stoji', () => {
    const record = { ...emptyConsent(), decidedAt: 1000 };
    expect(shouldPrompt(record, 1000 + REPROMPT_BLACKOUT_MS * 5)).toBe(false);
  });

  it('ne pita ni kad je sve dozvoljeno na tekucoj verziji', () => {
    const record = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: 1000, gpc: false };
    expect(shouldPrompt(record, 2000)).toBe(false);
  });

  it('stara verzija + odbijanje unutar 12 meseci -> NE pita (CCPA prozor)', () => {
    const record = { v: CONSENT_VERSION + 1000, analytics: false, advertising: false, decidedAt: 1_000_000, gpc: false };
    const now = 1_000_000 + REPROMPT_BLACKOUT_MS - 1;
    expect(shouldPrompt(record, now)).toBe(false);
  });

  it('stara verzija + odbijanje posle 12 meseci -> pita', () => {
    const record = { v: CONSENT_VERSION + 1000, analytics: false, advertising: false, decidedAt: 1_000_000, gpc: false };
    const now = 1_000_000 + REPROMPT_BLACKOUT_MS + 1;
    expect(shouldPrompt(record, now)).toBe(true);
  });

  it('stara verzija bez ijednog odbijanja -> pita odmah, prozor se ne primenjuje', () => {
    const record = { v: CONSENT_VERSION + 1000, analytics: true, advertising: true, decidedAt: 1_000_000, gpc: false };
    expect(shouldPrompt(record, 1_000_001)).toBe(true);
  });

  it('stara verzija sa odbijanjem ali bez decidedAt -> pita (nema od cega meriti prozor)', () => {
    const record = { v: CONSENT_VERSION + 1000, analytics: false, advertising: false, decidedAt: null, gpc: false };
    expect(shouldPrompt(record, 999_999_999)).toBe(true);
  });

  it('TEKUCA verzija ali bez decidedAt -> pita; zapis bez odluke nije odluka', () => {
    // Pre popravke je ovo vracalo false: pokvaren zapis {v:1, analytics:true}
    // je zauvek utisavao baner a citao se kao dozvola.
    const record = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: null, gpc: false };
    expect(shouldPrompt(record, 999_999_999)).toBe(true);
  });
});

describe('effectiveConsent', () => {
  it('bez zapisa sve je odbijeno', () => {
    expect(effectiveConsent(null, false)).toEqual(emptyConsent());
  });

  it('zapis bez decidedAt se NE cita kao pristanak', () => {
    const stored = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: null, gpc: false };
    const out = effectiveConsent(stored, false);
    expect(out.analytics).toBe(false);
    expect(out.advertising).toBe(false);
  });

  it('odluka tekuce verzije prolazi kroz', () => {
    const stored = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: 1000, gpc: false };
    expect(effectiveConsent(stored, false)).toMatchObject({ analytics: true, advertising: true });
  });

  it('stara verzija se podize i kategorije koje u njoj nisu postojale su false, ne undefined', () => {
    const stored = { v: CONSENT_VERSION + 1000, analytics: true, decidedAt: 1000 };
    const out = effectiveConsent(stored, false);
    expect(out.v).toBe(CONSENT_VERSION);
    expect(out.analytics).toBe(true);
    for (const c of CATEGORIES) expect(typeof out[c]).toBe('boolean');
  });

  it('GPC gasi oglasavanje i preko zapisa koji ga dozvoljava', () => {
    const stored = { v: CONSENT_VERSION, analytics: true, advertising: true, decidedAt: 1000, gpc: false };
    const out = effectiveConsent(stored, true);
    expect(out.advertising).toBe(false);
    expect(out.analytics).toBe(true);
    expect(out.gpc).toBe(true);
  });
});

describe('migrateForward', () => {
  it('podize verziju a prenosi odbijanja', () => {
    const old = { v: CONSENT_VERSION + 1000, analytics: true, advertising: false, decidedAt: 50, gpc: false };
    const out = migrateForward(old);
    expect(out.v).toBe(CONSENT_VERSION);
    expect(out.analytics).toBe(true);
    expect(out.advertising).toBe(false);
    expect(out.decidedAt).toBe(50);
  });

  it('nova kategorija koja nije bila u starom zapisu pocinje na false', () => {
    const old = { v: CONSENT_VERSION + 1000, decidedAt: 50 };
    const out = migrateForward(old);
    for (const c of CATEGORIES) expect(out[c]).toBe(false);
  });

  it('radi i bez zapisa', () => {
    expect(migrateForward(null)).toEqual(emptyConsent());
  });
});
