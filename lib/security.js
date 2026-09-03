// Temporary exact CDN exception until the hero is bundled in step 5.
export const HERO_SCRIPT = 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js';
export function securityHeaders(dev = false, live = false) {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' " + HERO_SCRIPT + (dev ? " 'unsafe-eval'" : ''),
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
export function rejectCrossOrigin(request) {
  const origin = request.headers.get('origin');
  return request.headers.get('sec-fetch-site') === 'cross-site' ||
    (origin !== null && origin !== new URL(request.url).origin);
}
