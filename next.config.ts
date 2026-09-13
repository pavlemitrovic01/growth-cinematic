import type { NextConfig } from 'next';
import { securityHeaders } from './lib/security';
import { IS_LIVE } from './lib/seo';
const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: Object.entries(securityHeaders(process.env.NODE_ENV === 'development', IS_LIVE)).map(([key, value]) => ({ key, value })) },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      // Namera iz nekadasnjeg Cloudflare `public/_headers` (B1). Imena u `public/` nisu hesirana, pa
      // sat vremena, ne `immutable`: izmenjena slika na istoj putanji inace bi ostala zaglavljena.
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
      { source: '/og.jpg', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
    ];
  },
};
export default nextConfig;
