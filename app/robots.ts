import type { MetadataRoute } from 'next';
import { IS_LIVE, SITE_URL } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return IS_LIVE ? {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  } : { rules: { userAgent: '*', disallow: '/' } };
}
