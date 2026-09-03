import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/email', () => ({
  isEmailConfigured: () => true,
  sendLead: vi.fn(),
}));

import { POST } from '@/app/api/carrier-inquiry/route';
import { sendLead } from '@/lib/email';

function postJson(body) {
  return POST(
    new Request('http://localhost/api/carrier-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

// R2 nalaz: ova ruta uopste nije imala consent polje, iako uzima telefon.
// Ostala polja su namerno validna da 400 dodje SAMO od tcpaConsent.
describe('POST /api/carrier-inquiry — TCPA regression guard', () => {
  it('rejects a request with tcpaConsent omitted entirely', async () => {
    const res = await postJson({
      companyName: 'Test Carrier LLC',
      contactName: 'Test Contact',
      phone: '5551234567',
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.fields).toEqual(['tcpaConsent']);
  });
});

// F1a: otkaz slanja mora da izadje kao 503, ne kao potvrda.
describe('POST /api/carrier-inquiry — slanje se ne sme lazno potvrditi', () => {
  const validInquiry = {
    companyName: 'Test Carrier LLC',
    contactName: 'Test Contact',
    phone: '5551234567',
    tcpaConsent: true,
  };

  beforeEach(() => {
    vi.mocked(sendLead).mockReset();
  });

  it('returns 503 without success when the send fails', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: false, error: 'Resend down' });

    const res = await postJson(validInquiry);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.success).toBeUndefined();
  });

  it('returns success only after the send resolves ok', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: true, id: 'msg_1' });

    const res = await postJson(validInquiry);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});

/**
 * LEAD1/PRD-1 — forma NIJE imala email polje iako ga ruta u potpunosti podrzava. Posledica:
 * svaki carrier upit je stizao bez ijedne adrese i `replyTo` je uvek bio `undefined`, pa
 * „Reply" u inboxu nije vodio nigde — a carrier je jedina publika koja placa.
 *
 * Polje je OPCIONO. Oba smera su nosiva: bez „prazan prolazi" bi obavezno polje proslo ove
 * provere, a bez „popunjen ide u replyTo" bi polje moglo postojati a nikad ne stici do mejla.
 */
describe('POST /api/carrier-inquiry — email je opcion ali se koristi', () => {
  const base = {
    companyName: 'Test Carrier LLC',
    contactName: 'Test Contact',
    phone: '5551234567',
    tcpaConsent: true,
  };

  beforeEach(() => {
    vi.mocked(sendLead).mockReset();
    vi.mocked(sendLead).mockResolvedValue({ ok: true, id: 'msg_1' });
  });

  it('prolazi kada email uopste nije poslat', async () => {
    const res = await postJson(base);
    expect(res.status).toBe(200);
    expect(vi.mocked(sendLead).mock.calls[0][0].replyTo).toBeUndefined();
  });

  it('prolazi kada je email prazan string', async () => {
    const res = await postJson({ ...base, email: '' });
    expect(res.status).toBe(200);
  });

  it('stavlja validan email u replyTo i u telo mejla', async () => {
    const res = await postJson({ ...base, email: 'dispatch@carrier.example' });
    expect(res.status).toBe(200);

    const arg = vi.mocked(sendLead).mock.calls[0][0];
    expect(arg.replyTo).toBe('dispatch@carrier.example');
    expect(arg.fields).toContainEqual(['Email', 'dispatch@carrier.example']);
  });

  it('odbija pokvaren email umesto da ga tiho ignorise', async () => {
    const res = await postJson({ ...base, email: 'nije-email' });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.fields).toEqual(['email']);
    expect(vi.mocked(sendLead)).not.toHaveBeenCalled();
  });
});
