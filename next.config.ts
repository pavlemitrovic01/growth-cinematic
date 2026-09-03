import type { NextConfig } from 'next';
import { securityHeaders } from './lib/security';
import { IS_LIVE } from './lib/seo';
const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: Object.entries(securityHeaders(process.env.NODE_ENV === 'development', IS_LIVE)).map(([key, value]) => ({ key, value })) },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};
export default nextConfig;
