# STATUS — gde je projekat i šta je sledeće

Poslednji put ažurirano: 2026-09-04. Piše se na kraju sesije, čita se na početku sledeće.

## Šta je ovo

Novi CDL-A sajt (`C:/dev/growth-cinematic`), izgrađen na cinematic prototipu, uz prenos
svega upotrebljivog iz postojećeg sajta. **Ovo je poseban projekat sa sopstvenim git-om**, a
ne grana postojećeg.

## ⚠️ Tvrdo ograničenje

**`C:/dev/growth` (MAIN) se NE DIRA.** To je živ sajt na `growthcdl.com` koji prima prave
prijave. Čita se slobodno kao izvor; ne piše se u njega ni na granu.

Provereno na kraju ove sesije: `main` na `391fde3`, čisto radno stablo, `0 0` prema
`origin/main`.

**`C:/dev/GROWTH-B`** nije zaseban folder nego **git worktree MAIN-a** na grani
`batch/pb1-cinematic-home`. Nosi `DECISIONS.md` unos **D28** — zapis zašto ovaj projekat
postoji i šta ga obavezuje — i `PB1.md` manifest. Commit `f6015c2`. **Grana se nikad ne
merge-uje.** Ako se folder briše, D28 i PB1.md odlaze s njim.

## Stanje

Sajt je funkcionalno kompletan i nikad nije deploy-ovan.

| | |
|---|---|
| Ruta | 14 |
| Inicijalni JS | 102 kB gz (`hero-scene` je zaseban lazy chunk, 119 kB) |
| Sadržaj | ~85% obima originala; podstranice na paritetu ili iznad |
| Testovi | 117 u 8 fajlova + 8 worker HTTP testova |

**Kapije** — sve moraju biti zelene pre commita:

```
npm run typecheck
npm run lint
npm test
npm run verify        # verify:nojs + verify:claims, traži pokrenut server
npx vinext build
```

`npm run verify` gađa `:5173` po difoltu (`--port` menja).

## Zamke koje su već jednom pojele vreme

- **`scripts/preview.mjs` nema nijedan Cloudflare binding.** Uvozi build u običan Node, gde
  `cloudflare:workers` ne postoji. Log tada kaže „D1 nije vezan" — to nije kvar. Sve što
  dodiruje D1 meri se protiv `npm run dev` (vite + Miniflare).
- **Proveri koji proces sluša na portu pre merenja.** Zaostali dev server je dvaput dao
  lažne nalaze (pogrešan CSP, lažni `opacity:0`). `netstat -ano | grep 5173`.
- **Browser panel drži tab u `visibilityState: "hidden"`**, pa se 3D scena namerno ne
  pokreće i `rAF` ne radi. Hero se ne može proveriti odatle — traži pravi browser.
- **D1 migracija je primenjena samo na lokalni Miniflare**, ručno. Na pravu bazu je nikad
  niko nije pustio.

## Šta je namerno ugašeno

- **`NEXT_PUBLIC_SITE_LIVE`** — dok nije `true`, sajt je `noindex` na tri mesta (HTML, HTTP
  zaglavlje, `robots.txt`) i `sitemap` je prazan. `lib/seo.js:5` baca grešku ako neko upali
  indeksiranje bez pravog HTTPS origin-a. **Original je živ i indeksiran na istom domenu** —
  dva izvora za isti sadržaj štete sajtu koji prima prave prijave.
- **`NEXT_PUBLIC_CONSENT_REQUIRED`** — consent baner, kontrola u footeru i puna verzija
  privacy sekcije pale se zajedno. Dok je ugašeno, sajt ne učitava nijedan tracker i privacy
  tekst to tačno kaže. Pali se **u istom trenutku kad i analitika**, ne pre.
- **Resend** (`RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`) — rute rade i bez njega: vraćaju
  503 „pozovite nas", nikad lažnu potvrdu. Lead se svejedno upisuje u D1.

## Sledeće, po redosledu

1. **Deploy sa `noindex`.** Jedini korak koji otključava četiri stvari koje se lokalno ne
   mogu proveriti: 3D na pravom hardveru, Lighthouse na hostingu, prijava kroz ceo lanac
   (forma → D1 → Resend → inbox), i pokazivanje sajta bilo kome.
2. **Migracija na pravu D1** — ide uz deploy.
3. **Resend ključ i adresa za notifikacije** — čeka Pavla.
4. **Analitika**, pa uz nju upaliti consent kapiju.
5. **Odluka o prelasku** — tek kad postoje brojke.

## Otvoreno, svesno

- **Chatbot** nije prenet. Odluka o obimu, ne propust.
- **Next vraća 200 na uhvaćenu serversku grešku** (odgovor je već streamovan). Nije
  popravljivo iz `error.tsx`; bitno kad se uključi monitoring.
- **`npm audit`:** 4 high u produkcijskim zavisnostima (`nanoid`, `next`, `postcss`,
  `sharp`). Izmereno: nijedan od ta tri proverljiva nije uvezen u worker bundle ni u
  klijentske chunkove. Od devet `next` stavki šest otpada — nema Server Actions, nema
  rewrites, ne koristi se Turbopack. Rešava se podizanjem `next`-a van trenutnog raspona.
- **`env.IMAGES` binding ne postoji** (`hosting.json` ga nema). `/_vinext/image` degradira
  umesto da puca, ali severnost nije potvrđena jer 500 koji je izmeren lokalno ima drugi
  uzrok (`ASSETS` fali u dev-u). Proveriti posle deploy-a.
- **Privacy i TCPA tekstovi su nacrti za pravni pregled.** Sekcija 05 („Where Your
  Information Is Stored") je nova i opisuje stvarno skladištenje u D1 — original je nema jer
  tamo prijava živi samo u mejlu.

## Pravila sadržaja koja i dalje važe

Procesna pravila originala ne obavezuju ovaj projekat (D28), ali `docs/CLAIMS.md` u originalu
nije stil nego FCC/FTC. Sprovodi se automatski: `npm run verify:claims` gađa renderovani HTML,
7 zabranjenih obrazaca i 2 uslovna koja moraju nositi hedž. Copy je prenet doslovno baš zato
što je već prošao kroz sedam claims batch-eva.

**Class A only** — Pavlova odluka 2026-09-04: „prima ali za sad neka ostane samo A".
`lib/form-options.js` ne nudi Class B; vrednost je izvedeno uklonjena i iz serverskog
whitelist-a.
