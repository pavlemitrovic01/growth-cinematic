import type { Metadata } from 'next';
import { IS_LIVE, SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SOCIAL_IMAGE } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import CookieBanner from '@/components/CookieBanner';
import Motion from '@/components/Motion';
import './globals.css';

/**
 * Kapija za motion recnik (Faza 2). Ide kao PRVO dete `<body>`-ja, sinhrono, pre nego sto
 * browser naslika ijednu sekciju ispod — klasa iz `useEffect`-a bi stigla tek posle
 * hidracije, dakle posle bljeska u kom bi se sadrzaj video pa nestao.
 *
 * ⚠️ Skripta SAMO dodaje klasu. Sve sto se skriva zivi u CSS-u iza `html.js-motion` i iza
 * `prefers-reduced-motion:no-preference`. Bez JS-a klasa ne postoji i nista nije skriveno —
 * zato sajt bez JavaScripta ostaje citljiv, sto `npm run verify` proverava na 11 ruta.
 *
 * ⚠️ WATCHDOG. Tajmer sklanja `js-motion` ako `components/Motion.tsx` ne postavi
 * `data-motion-ready` u roku od 3 sekunde. Scenario: hidracija padne ili se komponenta ne
 * montira — bez ovoga bi sadrzaj ostao skriven zauvek, a `verify-nojs` to NE BI uhvatio
 * jer gleda samo inline stilove, ne klase. Ovo je jedina odbrana od tog ishoda.
 *
 * ⚠️ Provera `IntersectionObserver`-a je pre dodavanja klase, ne posle: bez observer-a
 * niko ne bi vratio sadrzaj, pa je ispravno ni ne sakriti ga.
 */
const MOTION_GATE = `(function(){try{
var d=document.documentElement;
if(!('IntersectionObserver' in window))return;
if(!window.matchMedia||!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
d.classList.add('js-motion');
setTimeout(function(){if(!d.hasAttribute('data-motion-ready'))d.classList.remove('js-motion')},3000);
}catch(e){}})();`;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE, description: SITE_DESCRIPTION,
  robots: { index: IS_LIVE, follow: IS_LIVE },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, siteName: 'GROWTH.CO', locale: 'en_US', type: 'website', images: [SOCIAL_IMAGE] },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION, images: [SOCIAL_IMAGE.url] },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE }} />
        <StructuredData />
        {children}
        <Motion />
        <CookieBanner />
      </body>
    </html>
  );
}
