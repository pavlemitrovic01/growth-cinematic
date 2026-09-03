// Jedan izvor za per-stranica metadata (SEO1). Popravlja bug: `app/layout.jsx`
// je postavljao `alternates.canonical:'/'` kao deo root metadata, a Next
// nasledjuje roditeljska polja na svaku rutu koja ih sama ne redefinise —
// svih 7 ruta je zato imalo canonical na naslovnu, sto Google cita kao
// "ovih 6 stranica su duplikat" i izbacuje ih iz indeksa.
//
// title/description su OPCIONI i namerno se ne upisuju u objekat kad nisu
// prosledjeni (umesto da se postave na undefined) — Next-ov merge nasledjuje
// roditeljsko polje samo kad dete NE DEFINISE taj kljuc uopste. Zato naslovna
// moze da pozove pageMeta({path:'/'}) i zadrzi title/description iz layout-a
// bez dupliranja teksta na dva mesta.
// JEDINI IZVOR DOMENA U PROJEKTU (L6, 2026-08-29).
//
// Do L6 je placeholder domen bio raspisan na 6 mesta u 4 fajla: `app/layout.jsx` (x3),
// `app/robots.js`, `components/JsonLd.jsx` i ovde. L6 je ostala tri fajla prevezao na ovu
// konstantu, pa je promena domena od sada JEDNA izmena, a provera je `grep` na nulu.
//
// ⚠️ Ne vracati doslovan domen ni u jedan drugi fajl. Ako neko mesto zatreba drugu vrednost,
// to je nov izvedeni export ovde, ne nov string tamo.
export const SITE_URL = 'https://growthcdl.com';

// Next NE spaja `openGraph` polje-po-polje izmedju layout-a i stranice — ako
// stranica definise sopstveni `openGraph`, on ceo ZAMENJUJE roditeljski.
// Izmereno: /about i /for-carriers su posle prve verzije ovog fajla izgubili
// og:image/site_name/locale/type (ostali su samo na naslovnoj, koja tada
// nije imala sopstveni openGraph). Zato SVAKI poziv pageMeta() mora da nosi
// ove konstante — ne mogu se osloniti na nasledjivanje iz layout.jsx.
const OG_DEFAULTS = {
  siteName: 'GROWTH.CO',
  images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 }],
  locale: 'en_US',
  type: 'website',
};

export function pageMeta({ path, title, description }) {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: `${SITE_URL}${path}`,
      ...OG_DEFAULTS,
    },
  };
}
