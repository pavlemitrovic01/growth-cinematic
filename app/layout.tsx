import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GROWTH Cinematic CDL Experience",
  description: "A cinematic CDL-A recruiting experience for American truck drivers.",
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
