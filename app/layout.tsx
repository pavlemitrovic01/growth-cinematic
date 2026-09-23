import type { Metadata } from 'next';
import { IS_LIVE, SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SOCIAL_IMAGE } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';

/*
 * TTI1 (2026-09-23): recnik pokreta (`Motion.tsx` + `MOTION_GATE`) je uklonjen -- sajt je obican, sadrzaj se
 * vidi odmah. Bez `js-motion` klase nijedno pravilo iz `globals.css` iza nje se ne primenjuje.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE, description: SITE_DESCRIPTION,
  robots: { index: IS_LIVE, follow: IS_LIVE },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, siteName: 'TTIrecruiting', locale: 'en_US', type: 'website', images: [SOCIAL_IMAGE] },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION, images: [SOCIAL_IMAGE.url] },
  icons: {
    icon: [{ url: '/icon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/logo-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: '/icon-32.png',
    apple: '/apple-touch-icon.png',
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * ⚠️ `data-scroll-behavior="smooth"` je POTVRDA Next-u, ne stil. `globals.css:20` ima
     * `html{scroll-behavior:smooth}`; bez ovog atributa Next pri promeni rute pusti browser
     * da GLATKO skroluje kroz celu stranicu do vrha umesto da skoci. Sa njim Next privremeno
     * iskljuci glatko skrolovanje za prelaz rute, a sidra u stranici ga zadrze.
     */
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <StructuredData />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
