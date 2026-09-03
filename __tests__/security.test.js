import { describe, it, expect } from 'vitest';
import { securityHeaders, protectResponse, rejectCrossOrigin } from '../lib/security';
describe('security policy', () => {
  it('restricts production while loading scripts only from the same origin', () => {
    const h = securityHeaders(false, false);
    expect(h['Content-Security-Policy']).not.toContain('jsdelivr');
    expect(h['Content-Security-Policy']).not.toContain('unsafe-eval');
    expect(h['Content-Security-Policy']).not.toContain(' ws:');
    expect(h['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(h['X-Robots-Tag']).toBe('noindex, nofollow');
    expect(securityHeaders(false, true)['X-Robots-Tag']).toBeUndefined();
  });
  it('retains errors and headers while disabling API caching', async () => {
    const r = protectResponse(new Response('limited', { status: 429, headers: { 'Retry-After': '60' } }), { api: true });
    expect(r.status).toBe(429);
    expect(r.headers.get('Retry-After')).toBe('60');
    expect(r.headers.get('Cache-Control')).toBe('no-store');
    expect(await r.text()).toBe('limited');
  });
  it('rejects foreign and null origins, permits same-origin and non-browser callers', () => {
    const req = origin => new Request('https://preview.example/api/apply', { method: 'POST', headers: origin ? { origin } : {} });
    expect(rejectCrossOrigin(req('https://evil.example'))).toBe(true);
    expect(rejectCrossOrigin(req('null'))).toBe(true);
    expect(rejectCrossOrigin(req('https://preview.example'))).toBe(false);
    expect(rejectCrossOrigin(req())).toBe(false);
  });
});
