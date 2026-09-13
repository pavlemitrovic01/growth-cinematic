# CONTEXT — growth-cinematic (projekt istine)

> Operativna destilacija za kodiranje. Skillovi čitaju **ovaj** fajl za kapije, capove i lock
> zonu — nikad ne hardkoduju komande. Narativ i istorija → `docs/STATUS.md` i
> `docs/STATUS-ARCHIVE.md`. Postavljeno 2026-09-09.

## Stack
- **Next.js 16.3.4** (app router) · React 19.2.6 · **TypeScript** · three.js 0.160 · Tailwind 4
- **Deploy: Vercel** (`growth-cinematic`, nalog „pavle's projects" — **Hobby**), git-connected:
  push na `master` triggeruje deploy. ⚠️ Hobby je nekomercijalan po Vercel uslovima; **pre pravog
  saobraćaja projekat se seli na tim** (`team_lFVUISCch3euonXJEBmOdfiA`).
- **Baza: Neon** (Postgres, `iad1`, Free) kroz Marketplace. `DATABASE_URL` postavljen; migracija
  puštena, obe tabele postoje. ⚠️ Neon ubacio još 15 `DATABASE_*` — **ne dirati**.
- Git: `master` → `github.com/pavlemitrovic01/growth-cinematic` (privatan). Rad ide po granama.
- **`proxy.ts`** (ne `middleware.ts`, Next 16 konvencija) nosi cross-origin zaštitu **i** pečati
  bezbednosna zaglavlja — odgovor nastao u njemu ne prolazi kroz `headers()` iz `next.config.ts`.

## Health gates (skillovi čitaju OVO — nikad ne hardkoduju komande)
| Gate | Komanda | Koji tier ga traži |
|---|---|---|
| `quick` | `npm run lint` | svi tier-i · `/kickoff` |
| `typecheck` | `npm run typecheck` | STANDARD, STRICT |
| `test` | `npm test` | STANDARD, STRICT |
| `full` | `npm run build` | STANDARD, STRICT · LEAN samo ako je kod dirnut |
| `verify` | `npm run verify` | STANDARD, STRICT — **traži pokrenut server** |
| `rendered` | `npm run test:rendered` | STANDARD, STRICT — **traži pokrenut server** |
| `manual` | Pavlov pregled u **pravom** browseru | STRICT · **i sve što zavisi od skrola** |

- **`test`:** vitest, **140 u 11 fajlova** (izmereno 2026-09-13). `test:rendered` je zasebnih **17**
  HTTP testova nad renderovanim HTML-om.
- ⚠️ **Vitest hvata SAMO `__tests__/**/*.test.js`** (`vitest.config.mts`). Fajl imenovan
  `.test.ts` bio bi **tiho preskočen** — kapije zelene, a test nikad pokrenut. Posle dodavanja
  testa **izmeri da je broj porastao**, ne veruj zelenom (`LESSONS` L20).
- ⚠️ **Podrazumevani vitest reporter ne ispisuje `console.log`.** Za izmerene vrednosti iz testa
  ide `npx vitest run <fajl> --reporter=verbose`.
- **`verify` = `verify:nojs` (14 ruta) + `verify:claims` (13 ruta).** Claims kapija od 2026-09-07
  **poredi hedž uz tvrdnju**, ne broji njegovo prisustvo (`scripts/claims-rules.mjs`).
- ⚠️ **Poslednje dve ne pokreću server same.** `npm run build && npm start`, pa meri. Meta se
  ispisuje (`meri se: <origin>`) i **bira se preko `VERIFY_BASE`, nikad `-- --base`** — `node --test`
  ne prosleđuje argv, pa bi merenje tiho otišlo na localhost i prijavilo PASS na pogrešnoj meti.
- ⚠️ **Proveri koji PID sluša na portu pre merenja.** Zaostali server je **tri puta** dao lažan
  prolaz. Na Windows-u `kill` iz Git Bash-a ne gasi Node — ide `taskkill /PID <pid> /T /F`.
- ⚠️ **`manual` je obavezan i van STRICT-a** kad posao dira skrol, `IntersectionObserver` ili 3D
  scenu: Claude browser panel drži tab u `visibilityState:"hidden"` i **ume da izgubi layout u
  celini**. Vidi `LESSONS` L7.

## Doc capovi (skillovi čitaju OVO — kao i Health gates iznad)
| Fajl | Cap | Gate |
|---|---|---|
| `workflow/projects/growth-cinematic/ROADMAP.md` | 200 linija | **bloker** — `/plan` odbija |
| `workflow/projects/growth-cinematic/CONTEXT.md` | 120 linija | **bloker** — `/plan` odbija |
| `workflow/projects/growth-cinematic/LESSONS.md` | 300 linija | **upozorenje** |
| `docs/STATUS.md` | 350 linija | **upozorenje** |

- **Nema `BIBLE.md`** — ne postoji u ovom projektu. Odsustvo nije drift.
- **`docs/STATUS-ARCHIVE.md` NEMA cap** — izlaz je, ne ulaz; ne ulazi ni u jedno planiranje.
- **Zašto `docs/STATUS.md` uopšte ima cap:** 2026-09-09 je narastao **459 → 735 u jednoj sesiji**.
  Podeljen je tog dana; cap postoji da se ne vrati na isto.

## Stanje koda
- **14 ruta** (+3 API: `apply`, `callback`, `carrier-inquiry`). Naslovna ima **9 sekcija**
  (bila 10 do brisanja `stories`, 2026-09-09).
- Naslovna posle `D1`: hero(C) · callback(forma) · pay(**U**) · process(E, sticky) · values(**U**) ·
  guard(**C**) · founder(**C**) · faq(E) · close(C).
- **13 komponenti.** Ključne: `HeroExperience` (three.js), `CinematicHome`, `Motion` (reveal/
  stagger/sweep pogon), `ApplyForm` (quick/full), `PageShell`, `Accordion`.
- API rute rade i bez Resend-a: vraćaju **503 „pozovite nas"**, nikad lažnu potvrdu. Upis u bazu
  ide **ispred** 503-a namerno.

## Namerno ugašeno (env)
- **`NEXT_PUBLIC_SITE_LIVE`** — dok nije `true`, sajt je `noindex` na **četiri** sloja (HTTP
  zaglavlje, HTML meta, `robots.txt`, prazan `sitemap`). `lib/seo.js:5` baca ako neko upali
  indeksiranje bez pravog HTTPS origin-a. **Original je živ i indeksiran na istom domenu.**
- **`NEXT_PUBLIC_CONSENT_REQUIRED`** — baner, kontrola u footeru i puna privacy sekcija pale se
  **zajedno, u istom trenutku kad i analitika**. Dok je ugašeno, sajt ne učitava nijedan tracker
  i privacy tekst to tačno kaže.
- **Resend — UPALJEN 2026-09-13 (`R1`).** `RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` stoje u Vercel
  env-u; pošiljalac je sandbox `onboarding@resend.dev`, isporuka **samo** na adresu Resend naloga.
  ⚠️ **`LEAD_FROM_EMAIL` je namerno prazan** dok DKIM za `growthcdl.com` ne stoji (`R1-DOMEN`).
  ⚠️ Env promena važi tek za **nov** deploy. ⚠️ Vercel MCP konektor ne vidi ovaj projekat
  (`list_teams` → `[]`), pa se env dokazuje ponašanjem deploy-a, ne čitanjem konfiguracije.

## Pravila sadržaja (FCC/FTC, ne stil)
- Registar je `docs/CLAIMS.md` **u originalu** (`C:/dev/growth`) — čita se, ne piše.
  Sprovodi se mašinski: `npm run verify:claims`, 7 zabranjenih obrazaca + 2 uslovna sa hedžom.
- **Nula izmišljenih podataka.** Bez testimonijala, iznosa zarade, brojeva plasmana.
- **TCPA:** pristanak eksplicitan boolean, one-to-one. Svako polje sa telefonom ima consent.
- **Class A only** — Pavlova odluka 2026-09-04; `lib/form-options.js` ne nudi Class B, vrednost
  izvedeno uklonjena i iz serverskog whitelist-a.

## LOCK zona
> Izmene samo kroz **STRICT** batch:
> `app/api/**` · `proxy.ts` · `lib/rate-limit.js` · `lib/seo.js` · TCPA consent tekst
> (`ApplyForm`, `CarrierForm`, `app/privacy`) · `scripts/claims-rules.mjs` · `db/**`

## ⚠️ Tvrdo ograničenje van ovog repoa
**`C:/dev/growth` (MAIN) se NE DIRA** — živ sajt na `growthcdl.com` koji prima prave prijave.
Čita se slobodno kao izvor; ne piše se u njega ni na granu. `C:/dev/GROWTH-B` je **worktree
MAIN-a**, ne zaseban folder — nosi `D28` (zašto ovaj projekat postoji) i **nikad se ne merge-uje**.
