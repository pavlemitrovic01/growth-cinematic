/**
 * Jedan izvor istine za STATICKE rute sajta.
 *
 * ⚠️ ZASTO POSTOJI. Do 2026-09-06 je ovaj spisak zivio u `app/sitemap.ts` i bio prekucan
 * jos na tri mesta: `scripts/verify-claims.mjs`, `scripts/verify-nojs.mjs` i
 * `__tests__/seo.test.js` (kao tvrd broj `13`). Nijedno od ta tri nije uvozilo izvor, pa su
 * sve tri provere BROJALE umesto da POREDE.
 *
 * Posledica koja se time zatvara: nova ruta koju niko ne dopise u spisak ne ulazi u sitemap,
 * ne meri se nijednom kapijom -- i sve ostaje zeleno. Isti obrazac otkazivanja kao
 * `FIND MY NEXT ROUTE` iz Faze 4: pretraga koja broji ne vidi ono cega nema.
 *
 * Clanci NISU ovde -- oni se izvode iz `POSTS` (`lib/posts.js`), koji je vec njihov izvor.
 * Dodavanje cetvrtog clanka zato ne trazi izmenu ovog fajla.
 *
 * ⚠️ Sta ovde NE SME. Rute koje ne smeju biti indeksirane (API, dinamicke, `_not-found`).
 * Spisak se koristi i za sitemap; ono sto udje ovde bice objavljeno kad se upali
 * `NEXT_PUBLIC_SITE_LIVE`.
 */
export const PAGE_PATHS = [
  '/',
  '/apply',
  '/for-carriers',
  '/how-it-works',
  '/about',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/truckers-lounge',
];
