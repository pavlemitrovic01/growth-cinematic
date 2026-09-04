import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rejectCrossOrigin, securityHeaders } from './lib/security';
import { IS_LIVE } from './lib/seo';

/**
 * Zamena za jedini deo `worker/index.ts` koji nije bio Cloudflare vodoinstalaterski posao.
 *
 * ⚠️ Bez ovog fajla migracija bi tiho skinula zastitu: `rejectCrossOrigin` se u celom
 * projektu zvao ISKLJUCIVO iz workera (`grep` potvrdio), pa bi brisanje workera ostavilo
 * javne POST rute otvorene za cross-origin zahteve. Zaglavlja su druga prica — njih
 * `next.config.ts` vec postavlja na `/:path*`, tako da ih ovde ne treba ponavljati za
 * normalan saobracaj.
 *
 * Zasto se zaglavlja ipak rucno pecate na 403: odgovor koji nastane U middleware-u kratko
 * spaja lanac i ne prolazi kroz `headers()` iz `next.config.ts`. Bez ovoga bi bas odbijeni
 * zahtev bio jedini odgovor sajta bez CSP-a i bez `noindex`-a.
 */
export function middleware(request: NextRequest) {
  if (request.method !== 'POST') return NextResponse.next();
  if (!rejectCrossOrigin(request, request.nextUrl.origin)) return NextResponse.next();

  const response = NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
  const headers = securityHeaders(process.env.NODE_ENV === 'development', IS_LIVE);
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = { matcher: '/api/:path*' };
