import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ide pre importa rute — vitest die vi.mock na vrh fajla.
vi.mock('@/lib/email', () => ({
  isEmailConfigured: () => true,
  sendLead: vi.fn(),
}));

import { POST } from '@/app/api/apply/route';
import { sendLead } from '@/lib/email';

function postJson(body) {
  return POST(
    new Request('http://localhost/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

// R2 nalaz: string "true" je ranije prolazio kao pristanak (F0-klasa bug, string
// umesto boolean-a). Ostala polja su namerno validna da 400 dodje SAMO od tcpaConsent.
describe('POST /api/apply — TCPA regression guard', () => {
  it('rejects a quick lead where tcpaConsent is the string "true"', async () => {
    const res = await postJson({
      leadType: 'quick',
      firstName: 'Test',
      phone: '5551234567',
      tcpaConsent: 'true',
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.fields).toEqual(['tcpaConsent']);
  });
});

// F1a: cela poenta batcha. Ako Resend padne, vozac NE SME da vidi potvrdu —
// to je bug zbog kojeg je F0 uveo 503 i koji se vratio cim su env varijable
// postavljene a slanje jos nije bilo prikljuceno.
describe('POST /api/apply — slanje se ne sme lazno potvrditi', () => {
  const validLead = {
    leadType: 'quick',
    firstName: 'Test',
    phone: '5551234567',
    tcpaConsent: true,
  };

  beforeEach(() => {
    vi.mocked(sendLead).mockReset();
  });

  it('returns 503 without success when the send fails', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: false, error: 'Resend down' });

    const res = await postJson(validLead);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.success).toBeUndefined();
  });

  it('returns success only after the send resolves ok', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: true, id: 'msg_1' });

    const res = await postJson(validLead);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('never calls the sender when validation fails', async () => {
    await postJson({ ...validLead, tcpaConsent: 'true' });

    expect(vi.mocked(sendLead)).not.toHaveBeenCalled();
  });

  // Backup log sme da nosi ono sto treba za povracaj leada, ali ne i izjave o
  // violations/SAP — Vercel logove cita svako sa pristupom projektu.
  // Tvrdi OBA smera: osetljivo napolje, povratljivo unutra (inace bi prazan log
  // takodje prosao, ista klasa greske kao LESSONS L5).
  it('keeps violation and SAP disclosures out of the failure log', async () => {
    vi.mocked(sendLead).mockResolvedValue({ ok: false, error: 'Resend down' });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await postJson({
      leadType: 'full',
      firstName: 'Test',
      lastName: 'Driver',
      phone: '5551234567',
      email: 'driver@example.com',
      // ⚠️ LEAD1: bilo je 'Class A' — to je LABELA, a forma salje VREDNOST 'A'.
      // Stara provera istinitosti (`if (!cdlClass)`) je propustala bilo koji neprazan
      // string, pa je ovaj test godinama tvrdio nesto na podacima koje forma ne moze
      // da proizvede. Whitelist iz `lib/form-options.js` ga je otkrio.
      cdlClass: 'A',
      experience: '1-2 years',
      hasViolations: 'Yes',
      violationsDetails: 'SENSITIVE-VIOLATION-TEXT',
      hasSAP: 'Yes',
      sapDetails: 'SENSITIVE-SAP-TEXT',
      tcpaConsent: true,
    });

    const logged = JSON.stringify(spy.mock.calls);
    spy.mockRestore();

    expect(logged).not.toContain('SENSITIVE-VIOLATION-TEXT');
    expect(logged).not.toContain('SENSITIVE-SAP-TEXT');
    // Bez ovoga bi i prazan log prosao provere iznad.
    expect(logged).toContain('5551234567');
    expect(logged).toContain('redigovano');
  });
});
