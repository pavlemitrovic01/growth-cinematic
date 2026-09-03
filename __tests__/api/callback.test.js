import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/email', () => ({
  isEmailConfigured: () => true,
  sendLead: vi.fn(),
}));

import { POST } from '@/app/api/callback/route';
import { sendLead } from '@/lib/email';

function postJson(body) {
  return POST(
    new Request('http://localhost/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

// R2 nalaz: polje je preimenovano consent -> tcpaConsent. Stari kljuc mora ostati
// zatvoren, ne samo da novi radi.
describe('POST /api/callback — TCPA regression guard', () => {
  it('rejects the old "consent" key (renamed to tcpaConsent in R2)', async () => {
    const res = await postJson({ phone: '5551234567', consent: true });
    const body = await res.json();

    expect(res.status).toBe(400);
    // LEAD1/SEC-2b: ruta sada vraca `fields` kao i druge dve, da Chatbot moze da kaze
    // vozacu STA da popravi. Ranije `{error:'Consent required'}` — citljivo, ali ne kaze sta da radi.
    expect(body.fields).toEqual(['tcpaConsent']);
  });

  // LEAD1/SEC-2b: bez ovoga bi ruta mogla da vrati `fields` koji klijent ne ume da prevede,
  // pa bi vozac opet video generican tekst.
  it('names the phone field so the client can render a usable message', async () => {
    const res = await postJson({ phone: '   ', tcpaConsent: true });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.fields).toEqual(['phone']);
  });
});

// F1a: otkaz slanja mora da izadje kao 503, ne kao potvrda.
describe('POST /api/callback — slanje se ne sme lazno potvrditi', () => {
  const validRequest = { phone: '5551234567', tcpaConsent: true };

  beforeEach(() => {
    vi.mocked(sendLead).mockReset();
  });

  it('returns 503 without success when the send fails', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: false, error: 'Resend down' });

    const res = await postJson(validRequest);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.success).toBeUndefined();
  });

  it('returns success only after the send resolves ok', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: true, id: 'msg_1' });

    const res = await postJson(validRequest);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});
