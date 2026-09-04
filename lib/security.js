export function securityHeaders(dev = false, live = false) {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'" + (dev ? " 'unsafe-eval'" : ''),
      "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
      "font-src 'self'", "connect-src 'self'" + (dev ? ' ws: wss:' : ''),
      "form-action 'self'", "frame-ancestors 'none'", "base-uri 'self'", "object-src 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    ...(!live ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
  };
}
export function protectResponse(response, { dev = false, live = false, api = false } = {}) {
  if (response.status === 101) return response;
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders(dev, live))) headers.set(key, value);
  if (api) headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
/**
 * @param {Request} request
 * @param {string=} expectedOrigin  Origin protiv kog se poredi `Origin` zaglavlje.
 *
 * ⚠️ Parametar postoji zbog obrnutog proxyja. Na Cloudflare-u je ovo zvao `worker/index.ts`,
 * gde je `request.url` bio stvarni spoljni URL. Na Vercelu poziv dolazi iz `middleware.ts`,
 * iza platformskog proxyja — tamo se prosledjuje `request.nextUrl.origin`, jer Next sam
 * razresava `x-forwarded-*` i zna pravi spoljni origin. Difolt je netaknut da poziv sa
 * obicnim `Request`-om (i cetiri postojeca testa) radi kao i pre.
 */
export function rejectCrossOrigin(request, expectedOrigin = undefined) {
  const origin = request.headers.get('origin');
  const self = expectedOrigin ?? new URL(request.url).origin;
  return request.headers.get('sec-fetch-site') === 'cross-site' ||
    (origin !== null && origin !== self);
}
