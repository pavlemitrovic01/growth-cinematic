/**
 * Jedan izvor za natpis CTA dugmeta koje vodi na `/apply`.
 *
 * ⚠️ ZASTO POSTOJI. Faza 4 je izmerila SEDAM razlicitih natpisa za istu radnju, tri od njih
 * na naslovnoj („LET'S FIND YOUR NEXT ROUTE", „START MY APPLICATION", „Start your
 * application"). Nijedan nije bio netacan -- ali vozac koji predje sa `/about` na
 * `/how-it-works` dobija „Apply now" pa „Start your application" za isto dugme, i mora da
 * zakljuci da li je to ista radnja.
 *
 * ⚠️ VELIKA SLOVA SU PREZENTACIJA, NE TEKST. Do 2026-09-06 su bila doslovno u izvoru
 * (`globals.css` nije imao `text-transform` ni na jednoj CTA klasi), pa se natpis nije mogao
 * deliti izmedju editorijalnih dugmadi na naslovnoj i onih na podstranicama a da se izgled ne
 * promeni. Sada `.journey-cta` nosi `text-transform:uppercase` -- string je jedan, izgled
 * ostaje isti.
 *
 * ⚠️ NAVIGACIONI CHROME NAMERNO NE UVOZI OVO -- ODLUKA, POTVRDJENA 2026-09-08: `Nav.tsx` („APPLY NOW"), `MobileBar.tsx`
 * („Apply ↗") i `Footer.tsx` („Apply") su kratki jer stoje pored jednorecnih suseda -- „Call",
 * „Text", „FAQ". Duga recenica bi tamo bila regresija izgleda, ne doslednost. Ako se to ikad
 * promeni, promeni se svesno, ne uvozom.
 *
 * Strelica `↗` ostaje na pozivu: negde je deo teksta, a u `.journey-cta` zaseban `<b>` element.
 */
export const APPLY_CTA = 'Start your application';
