import type { Metadata } from 'next';
import { IS_LIVE, SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE, description: SITE_DESCRIPTION,
  robots: { index: IS_LIVE, follow: IS_LIVE },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, siteName: 'GROWTH.CO', locale: 'en_US', type: 'website' },
  twitter: { card: 'summary', title: SITE_TITLE, description: SITE_DESCRIPTION },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased"><StructuredData />{children}</body></html>;
}
