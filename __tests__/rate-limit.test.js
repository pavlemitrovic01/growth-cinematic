import { describe, it, expect, beforeEach } from 'vitest';
import { HONEYPOT_FIELD as HONEYPOT_FIELD_SOURCE } from '../lib/honeypot.js';
import {
  checkRateLimit,
  isHoneypotTripped,
  clientIp,
  HONEYPOT_FIELD,
  LIMIT,
  WINDOW_SECONDS,
  __resetMemoryForTests,
} from '../lib/rate-limit.js';

// Bez `RATELIMIT_REDIS_URL` u test okruzenju modul pada na in-memory sloj — sto je tacno
// ono sto ovde i hocemo da testiramo. Redis putanja se meri uzivo, protiv prave baze.
function req(ip, headerName = 'x-forwarded-for') {
  return { headers: { get: (h) => (h === headerName ? ip : null) } };
}

beforeEach(() => __resetMemoryForTests());

describe('honeypot', () => {
  it('prazno polje prolazi', () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '' })).toBe(false);
  });

  it('polje koje UOPSTE ne postoji prolazi — Chatbot putanja', () => {
    // Chatbot gadja /api/callback a nije forma; da provera trazi prisustvo, pukao bi.
    expect(isHoneypotTripped({})).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });

  it('samo razmaci prolaze — autofill ume da ubaci prazan string', () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: '   ' })).toBe(false);
  });

  it('popunjeno polje se hvata', () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 'http://spam.example' })).toBe(true);
  });

  it('rate-limit i honeypot modul nose ISTU vrednost — jedan izvor, dva ulaza', () => {
    // ⚠️ ZAMENJEN TEST. Original je citao `components/ApplyForm.jsx` i `CarrierForm.jsx`
    // kao TEKST i trazio `name="company_website"` u njima, jer je ime polja u formama bilo
    // literal — import iz `lib/rate-limit.js` bi povukao `ioredis` u klijentski bundle.
    //
    // Ovde forme uvoze `HONEYPOT_FIELD` iz `lib/honeypot.js` (modul bez zavisnosti), pa
    // razilazenje koje je original cuvao vise nije moguce — nema dve vrednosti da se raziju.
    // Test nad tekstom fajla je uz to bio krhak: preimenovanje `.jsx` u `.tsx` ga obara
    // iako je ugovor netaknut. Ostaje provera da re-export nije slucajno prekinut.
    expect(HONEYPOT_FIELD).toBe(HONEYPOT_FIELD_SOURCE);
    expect(typeof HONEYPOT_FIELD).toBe('string');
    expect(HONEYPOT_FIELD.length).toBeGreaterThan(0);
  });
});

describe('clientIp', () => {
  it('uzima PRVI unos iz x-forwarded-for — to je klijent, ostalo su proksiji', () => {
    expect(clientIp(req('203.0.113.7, 70.41.3.18, 150.172.238.178'))).toBe('203.0.113.7');
  });

  it('pada na x-real-ip kad x-forwarded-for ne postoji', () => {
    expect(clientIp(req('198.51.100.4', 'x-real-ip'))).toBe('198.51.100.4');
  });

  it('bez ijednog zaglavlja vraca "unknown" umesto da baci', () => {
    expect(clientIp({ headers: { get: () => null } })).toBe('unknown');
  });
});

describe('rate limit — in-memory sloj', () => {
  it(`propusta tacno ${LIMIT} pa blokira ${LIMIT + 1}.`, async () => {
    const r = req('203.0.113.10');
    for (let i = 1; i <= LIMIT; i += 1) {
      const res = await checkRateLimit(r, 'apply');
      expect(res.ok, `zahtev ${i} je trebalo da prodje`).toBe(true);
    }
    const blocked = await checkRateLimit(r, 'apply');
    expect(blocked.ok).toBe(false);
    expect(blocked.layer).toBe('memory');
  });

  it('broji po IP-u — jedan napadac ne blokira drugog vozaca', async () => {
    for (let i = 0; i <= LIMIT; i += 1) await checkRateLimit(req('203.0.113.20'), 'apply');
    const drugi = await checkRateLimit(req('203.0.113.21'), 'apply');
    expect(drugi.ok).toBe(true);
  });

  it('broji po ruti — potroseni apply ne zatvara callback', async () => {
    const r = req('203.0.113.30');
    for (let i = 0; i <= LIMIT; i += 1) await checkRateLimit(r, 'apply');
    const callback = await checkRateLimit(r, 'callback');
    expect(callback.ok).toBe(true);
  });

  it('remaining opada i ne ide ispod nule', async () => {
    const r = req('203.0.113.40');
    const prvi = await checkRateLimit(r, 'apply');
    expect(prvi.remaining).toBe(LIMIT - 1);
    for (let i = 0; i < LIMIT + 5; i += 1) await checkRateLimit(r, 'apply');
    const posle = await checkRateLimit(r, 'apply');
    expect(posle.remaining).toBe(0);
  });

  it('bez Redisa NE baca nego vraca in-memory rezultat — fail-open ugovor (D25)', async () => {
    const res = await checkRateLimit(req('203.0.113.50'), 'carrier');
    expect(res).toHaveProperty('ok');
    expect(res.layer).toBe('memory');
  });
});

describe('konfiguracija', () => {
  it('limit je velikodusan zbog CGNAT-a — vozaci dele IP na truck stop wi-fi-ju', () => {
    expect(LIMIT).toBeGreaterThanOrEqual(10);
  });

  it('prozor je jedan sat', () => {
    expect(WINDOW_SECONDS).toBe(3600);
  });
});
