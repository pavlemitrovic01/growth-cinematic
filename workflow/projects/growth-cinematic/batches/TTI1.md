# TTI1 — obican recruiting sajt pod imenom TTIrecruiting

- **Tier:** STRICT
- **Grana:** tti1-obican-sajt
- **Odobrio:** Pavle, 2026-09-23 (`/execute tti1` posle prikazanog plana)
- **Status:** CLOSED (`4e3fad8`)

## Cilj
Isporuciti danas obican recruiting sajt pod imenom **TTIrecruiting** na `ttirecruiting.us`, sa prijavama na
`info@ttirecruiting.us`. Kinematski heroj (three.js scena) i recnik pokreta izlaze; tekst sekcija ostaje.

Pavlove cinjenice (2026-09-23): pravni naziv tacno **„TTIrecruiting"** (bez „LLC"); domen i mejl na GoDaddy-u;
prijave idu na `info@ttirecruiting.us`; telefon **prazan** dok ga Pavle ne posalje; `growthcdl.com` se gasi.

## Out of scope
- `growthcdl.com` (MAIN) — gasenje/preusmerenje radi Pavle; preporuka 301 na `ttirecruiting.us`.
- Pravni pregled privacy/terms/TCPA (`LEG-1`, `LEG-2` ostaju OPEN) — menja se **samo ime**.
- Selidba Vercel projekta na tim (`V1`).
- Nov dizajn i nov copy; `RD5`, `T1b` i kolosek pokreta — na `/close` se beleze kao napusteni.
- Mrtav CSS scene (`.journey*`) u `globals.css` — zaseban posao.
- Interni kljucevi `growth.consent` / `growth:*` i porodica „Growth Sans" — posetilac ih ne vidi, a promena kljuca
  bi resetovala pristanak za kolacice.

## EXPECTED-FILES
Novo ime i kontakt:
- `lib/contact.js`
- `lib/seo.js`
- `lib/email.js`
- `lib/validation.js`
- `lib/faq.js`
- `lib/posts.js`
- `lib/form-options.js`
- `components/ApplyForm.tsx`
- `components/CarrierForm.tsx`
- `app/api/apply/route.js`
- `app/api/callback/route.js`
- `app/api/carrier-inquiry/route.js`
- `components/Nav.tsx`
- `components/Footer.tsx`
- `components/MobileBar.tsx`
- `components/NoScriptContact.tsx`
- `components/StructuredData.tsx`
- `app/layout.tsx`
- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`
- `app/about/page.tsx`
- `app/apply/page.tsx`
- `app/contact/page.tsx`
- `app/faq/page.tsx`
- `app/for-carriers/page.tsx`
- `app/how-it-works/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/truckers-lounge/page.tsx`
- `app/truckers-lounge/[slug]/page.tsx`
- `public/favicon.svg`
- `public/og.jpg`

Obicna naslovna:
- `app/page.tsx`
- `components/CinematicHome.tsx` (brise se)
- `components/Home.tsx` (nov)
- `app/globals.css`
- `components/HeroExperience.tsx` (brise se)
- `components/Motion.tsx` (brise se)
- `lib/motion-reveal.ts` (brise se)
- `lib/hero-beat.ts` (brise se)
- `lib/hero-light.ts` (brise se)
- `lib/hero-road.ts` (brise se)
- `lib/hero-scene.ts` (brise se)
- `lib/hero-terrain.ts` (brise se)
- `lib/hero-truck.ts` (brise se)
- `__tests__/lib/hero-beat.test.js` (brise se)
- `__tests__/lib/hero-scene.test.js` (brise se)
- `__tests__/lib/hero-terrain.test.js` (brise se)
- `__tests__/motion-reveal.test.js` (brise se)
- `package.json`
- `package-lock.json`

Kapije:
- `__tests__/lib/validation.test.js`
- `__tests__/globals-css.test.js`
- `tests/rendered-html.test.mjs`
- `scripts/verify-nojs.mjs`

Bookkeeping:
- `workflow/projects/growth-cinematic/batches/TTI1.md`
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/CONTEXT.md`
- `workflow/projects/growth-cinematic/LESSONS.md`

Van repoa (operativno, kao `R1`): Vercel domen `ttirecruiting.us` + `www` i env (`NEXT_PUBLIC_SITE_URL`,
`LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL`, `NEXT_PUBLIC_SITE_LIVE` po Pavlovoj odluci) — svaka izmena uz Pavlovo
„da". GoDaddy DNS i Resend domen radi Pavle; MX zapisi GoDaddy poste se ne diraju.

## GATES
`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE
- Renderovan HTML svih 14 ruta ne sadrzi `GROWTH`, `Capljinac`, `growthcdl` ni `corecruitinggroup` (vidljiv tekst,
  meta i strukturirani podaci).
- Nijedna ruta nema telefon ni `tel:`/`sms:` link dok je `PHONE_E164` prazan.
- Naslovna nema `<canvas>`; `three` nije u izgradjenom JS-u ni u `package.json`.
- TCPA tekst u obe forme razlikuje se od starog **samo** po imenu; `CONSENT_TEXT_VERSION` = `2026-09-23`.
- `quick`, `typecheck`, `test`, `full` exit 0; `verify` i `rendered` PASS lokalno i protiv deploy-a na
  `ttirecruiting.us` (meta ispisana). Svaka izmenjena kapija dokazano pocrveni pre `/close`-a.
- Probna prijava sa produkcije zavrsi u bazi; obavestenje stize na `info@` ako je Resend domen potvrdjen
  (inace se prijavljuje kao NIJE POKRENUTO sa razlogom).
- **`manual`:** Pavle u pravom browseru, telefon i desktop: naslovna (heroj sa fotografijom, sekcije, forma na dnu),
  `/apply`, `/contact`, podnozje — ime TTIrecruiting svuda, nema telefona, nema animacija.

## ROLLBACK
Pre spajanja: brisanje grane `tti1-obican-sajt`. Posle spajanja: `git revert` implementacionog commita + redeploy.
Env vratiti na prethodne vrednosti; domen moze ostati dodat.

## APPROVED-SCOPE-EXPANSION
(nema — nijedan fajl van EXPECTED-FILES; provereno poredjenjem `git status` sa spiskom pre commita)

## Zatvaranje (2026-09-23)

- **Telefon stigao pre `/close`-a:** Pavle je poslao `3125841777` → `PHONE_E164 = '+13125841777'`. Batch je izgradjen i
  izmeren i bez broja i sa njim; kapije su ponovo pustene posle upisa.
- **Odstupanje 1 — mrtav CSS obrisan u ovom batchu,** iako je plan rekao „zaseban posao": `K1/B` je pao na 14 klasa bez
  pomena u izvoru (`.journey-*`, `is-in`, `is-enhanced`, `is-scene-off`). Obrisana su tacno pravila sa tim klasama i sa
  golim `.journey` (postcss, po selektoru); `K1/A` 142 → 141, izmereno. Fajl je bio u EXPECTED-FILES.
- **Odstupanje 2 — 11 recenica koje salju posetioca da zove** (nadjeno na snimku `/contact`: „Call or text — that is
  the fastest way" bez ijednog broja). Sada idu iza `HAS_PHONE`; poruke o gresci dele `REACH_US`. Nova provera u
  `verify-nojs` pada ako se vrate dok broja nema.
- **Nezavisan pregled** (drugi agent, pravna i API povrsina, stabilan diff): bez defekata. Jedina napomena — `/terms`
  „This website is operated by TTIrecruiting. TTIrecruiting acts…" je suvisno, ne netacno; ostaje do advokata (`LEG-1`).
- **Ostaje van repoa (release):** Vercel domen + env, GoDaddy DNS, Resend domen, merenje na `ttirecruiting.us`.
- **Zastareo komentar** u `components/PageShell.tsx` (pominje `Motion.tsx` i `CinematicHome.tsx`) — fajl nije bio u
  obimu, nije diran.
