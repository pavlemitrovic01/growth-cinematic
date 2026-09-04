import type { Metadata } from 'next';
import { IS_LIVE, SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SOCIAL_IMAGE } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE, description: SITE_DESCRIPTION,
  robots: { index: IS_LIVE, follow: IS_LIVE },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, siteName: 'GROWTH.CO', locale: 'en_US', type: 'website', images: [SOCIAL_IMAGE] },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION, images: [SOCIAL_IMAGE.url] },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased"><StructuredData />{children}<CookieBanner /></body></html>;
}
