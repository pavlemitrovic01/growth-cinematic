export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
const origin = new URL(SITE_URL);
if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('NEXT_PUBLIC_SITE_URL must be an origin');
export const IS_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === 'true';
if (IS_LIVE && (origin.protocol !== 'https:' || origin.hostname === 'localhost')) throw new Error('A public HTTPS site origin is required before indexing');
export const SITE_TITLE = 'CDL-A Driver Recruiting — Free for Drivers | GROWTH.CO';
export const SITE_DESCRIPTION = 'Find your next route with GROWTH.CO. We connect CDL-A drivers with partner carriers and explain pay, home time and equipment. Free for drivers.';
export function pageMeta({ path, title = SITE_TITLE, description = SITE_DESCRIPTION, article = false }) {
  const url = new URL(path, SITE_URL).href;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'GROWTH.CO', locale: 'en_US', type: article ? 'article' : 'website' },
    twitter: { card: 'summary', title, description },
  };
}
