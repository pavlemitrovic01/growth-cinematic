import type { Metadata } from "next";
import "./globals.css";

/**
 * ⚠️ noindex DOK SITE NIJE ZIV — i to nije kozmetika nego zastita od stvarne stete.
 *
 * MAIN (`C:/dev/growth`) je UZIVO i indeksabilan od 2026-08-30 na `growthcdl.com`, a
 * `lib/seo.js` je prenet odatle i upisuje canonical na TAJ domen. Da ovaj sajt ode u
 * indeks pre odluke o prelasku, Google bi dobio dva izvora za isti sadrzaj sa istim
 * canonical-om — sto steti sajtu koji trenutno prima prave prijave.
 *
 * Skida se postavljanjem `NEXT_PUBLIC_SITE_LIVE=true`, isto kao u MAIN-u (L6). Ta
 * odluka je dvokoracna tamo i treba da bude i ovde: prvo deploy sa noindex-om i ziva
 * provera, pa tek onda indeksiranje. Deploy je povratan, indeksiranje nije.
 */
const IS_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === "true";

export const metadata: Metadata = {
  title: "GROWTH Cinematic CDL Experience",
  description: "A cinematic CDL-A recruiting experience for American truck drivers.",
  ...(IS_LIVE ? {} : { robots: { index: false, follow: false } }),
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
