# STATUS — narativ i kontekst projekta

> ⚠️ **ULOGA OVOG FAJLA JE PROMENJENA 2026-09-09.** Do tada je bio **jedina** memorija projekta:
> stanje, kapije, plan, odluke i istorija u jednom dokumentu od 735 redova. Tog dana je postavljen
> `workflow/`, pa se posao podelio:
>
> | Šta | Gde |
> |---|---|
> | Kapije, doc capovi, lock zona, env, stack | `workflow/projects/growth-cinematic/CONTEXT.md` |
> | Gde smo sada, aktivan batch, žive prepreke | `workflow/STATE.md` |
> | Plan i redosled posla | `workflow/projects/growth-cinematic/ROADMAP.md` |
> | Odluke, OPEN i zatvorene | `workflow/projects/growth-cinematic/DECISIONS.md` |
> | Trajne pouke | `workflow/projects/growth-cinematic/LESSONS.md` |
> | Audit trag po batchu | `workflow/LOG.md` |
> | **Istorija po sesiji** | `docs/STATUS-ARCHIVE.md` |
>
> **Ovde ostaje samo narativ:** šta je ovaj projekat, zašto postoji, kako je došao dovde, i šta
> je svesno ostavljeno otvoreno. **Ništa mašinsko se ovde ne deklariše.** Ako ovaj fajl protivreči
> `CONTEXT.md`-u, **`CONTEXT.md` pobeđuje** (`RULES §1`).
>
> Cap: **350 linija** (upozorenje). Poslednji put ažurirano: 2026-09-09.

## Šta je ovo

Novi CDL-A sajt (`C:/dev/growth-cinematic`), izgrađen na cinematic prototipu, uz prenos
svega upotrebljivog iz postojećeg sajta. **Ovo je poseban projekat sa sopstvenim git-om**, a
ne grana postojećeg.

**Stek: Next.js → Vercel, Neon (Postgres) za bazu.** Do 2026-09-05 je ciljao Cloudflare
Workers kroz `vinext`; taj sloj je uklonjen (vidi „Prelazak na Vercel" niže).

**Živ pod `noindex` na https://growth-cinematic.vercel.app.** Repo:
`github.com/pavlemitrovic01/growth-cinematic` (privatan). Do 2026-09-05 repo nije imao
remote uopšte — ceo rad je stajao na jednoj kopiji na disku.

## ⚠️ Tvrdo ograničenje

**`C:/dev/growth` (MAIN) se NE DIRA.** To je živ sajt na `growthcdl.com` koji prima prave
prijave. Čita se slobodno kao izvor; ne piše se u njega ni na granu.

Provereno na kraju ove sesije: `main` na `391fde3`, čisto radno stablo.

**`C:/dev/GROWTH-B`** nije zaseban folder nego **git worktree MAIN-a** na grani
`batch/pb1-cinematic-home`. Nosi `DECISIONS.md` unos **D28** — zapis zašto ovaj projekat
postoji i šta ga obavezuje — i `PB1.md` manifest. **Grana se nikad ne merge-uje.** Ako se
folder briše, D28 i PB1.md odlaze s njim.

## Stanje

Sajt je funkcionalno kompletan, **deploy-ovan i izmeren protiv deploy-a**, pod `noindex`.

| | |
|---|---|
| Ruta | 14 (+3 API) — naslovna od 2026-09-09 ima **devet** sekcija, ne deset |
| Sadržaj | podstranice dopunjene 2026-09-05; `/for-carriers` +46%, `/contact` +35% |
| Testovi | 132 u 9 fajlova (vitest) + 9 HTTP testova nad renderovanim HTML-om |
| Grana | **`master`** (59 commita); sve `d1-*` + `d4-*` grane spojene i pušene 2026-09-09 |
| Hosting | Vercel projekat `growth-cinematic`, nalog **„pavle's projects" (Hobby)** |
| Baza | Neon Free, regija `iad1`, Neon Auth ugašen; migracija puštena, obe tabele postoje |

**Kapije se od 2026-09-09 deklarišu na jednom mestu** — `CONTEXT.md → ## Health gates`.
Skillovi čitaju odande i **nikad ne hardkoduju komande**; ovaj fajl ih više ne nabraja, da ne
postoje dva spiska koja mogu da se raziđu.

⚠️ Dva pravila iz tog spiska koja su već jednom koštala vremena stoje kao pouke:
**`LESSONS` L1** (zaostali server, tri lažna prolaza) i **`LESSONS` L2** (`VERIFY_BASE`, nikad
`-- --base` — `node --test` ne prosleđuje argv, pa merenje tiho ode na localhost).

## Prelazak na Vercel (2026-09-05)

Otkriveno merenjem: `app/` i `components/` nisu bili vezani za Cloudflare uopšte — uvoze
samo standardni Next, pa `next build` prolazi bez izmene izvora stranica. Uklonjeno je
`worker/index.ts`, `vite.config.ts`, `build/`, `.openai/hosting.json`, `env.d.ts`,
`examples/d1/`, `app/chatgpt-auth.ts`, pet `scripts/` pomoćnika i 123 npm paketa.

**Tri stvari su bile stvarni posao, ne brisanje:**

1. **`middleware.ts`** — `rejectCrossOrigin` se u celom projektu zvao isključivo iz
   workera. Bez zamene bi migracija tiho otvorila javne POST rute za cross-origin zahteve.
   Middleware sam pečati bezbednosna zaglavlja jer odgovor koji u njemu nastane ne prolazi
   kroz `headers()` iz `next.config.ts`.
2. **`lib/rate-limit.js` → `clientIp`** — redosled zaglavlja je **obrnut**. Na Cloudflare-u
   je `cf-connecting-ip` išlo prvo jer ga edge prepisuje; Vercel ga ne postavlja, pa bi ga
   posetilac slao sam i kočnica bi se zaobilazila jednim zaglavljem. Sada prvo idu
   platformska zaglavlja, a `x-forwarded-for` uzima **poslednji** unos, ne prvi.
3. **`dynamicParams = false`** na članku — sa `true` je nepostojeći `/truckers-lounge/<bilo
   šta>` vraćao **200 sa telom 404 stranice**, jer se `notFound()` okida pošto je odgovor
   već streamovan. Pretraživaču bi svaka izmišljena putanja izgledala kao validna stranica.

Baza: D1 (SQLite) → Neon (Postgres). Šema prevedena, migracija regenerisana.
**Zamka koja je uhvaćena u prevodu:** `reset_at` drži epoch u milisekundama (~1.8e12);
SQLite `INTEGER` je 64-bitni, ali Postgres `integer` je int4 sa granicom ~2.15e9 —
doslovan prenos tipa bi dao overflow na prvom upisu i kočnica bi otkazala u celosti.
Kolona je zato `bigint`.

## Zamke koje su već jednom pojele vreme

**Preseljene 2026-09-09 u `workflow/projects/growth-cinematic/LESSONS.md`**, gde ih `/kickoff`
stvarno čita (poslednjih sedam) umesto da čekaju da neko pročita ovaj fajl do kraja.
Četrnaest unosa, `L1`–`L14`.

## Šta je namerno ugašeno

**Preseljeno 2026-09-09 u `CONTEXT.md → ## Namerno ugašeno (env)`.** `NEXT_PUBLIC_SITE_LIVE`,
`NEXT_PUBLIC_CONSENT_REQUIRED` i Resend — svaki sa razlogom zašto stoji ugašen i šta se dešava
kad se upali.

⚠️ Jedna stvar odatle je previše važna da živi samo u ugovoru: **sajt trenutno skuplja prijave a
nikoga ne obaveštava.** Lead se upiše u bazu, vozač dobije 503 „pozovite nas", i tu se lanac
prekida. To je `R1` u `ROADMAP`-u.

## Šta je sledeće — ne piše više ovde

**Preseljeno 2026-09-09.** Pozicija i aktivan batch → `workflow/STATE.md`. Redosled posla →
`ROADMAP.md`. Odluke koje blokiraju svoj posao → `DECISIONS.md`.

Razlog za selidbu nije urednost nego to što je ovaj fajl **narastao 459 → 735 redova u jednoj
sesiji**, a dve netačne tvrdnje u njemu nađene su slučajno — jedna je protivrečila dvema drugim
tvrdnjama **u istom fajlu**. Puno obrazloženje → `workflow/OPERATING.md` i `LESSONS` L14.

## Šta je nedovršeno

`docs/AUDIT.md` (2026-09-05) nosi izmeren spisak po stranici, sa redosledom rada u pet faza.
Ukratko: nema nijednog TODO-a ni lorema — nedovršenost je u izostavljenim sekcijama, u copy-ju
koji je pri prenosu prepisan kraći od originala, i u tome što pokret postoji samo na heroju.
Tri stavke su tamo označene kao **pogrešne sada, ne nedovršene**: netačan procesor podataka u
privacy politici, kršenje C53 na 404 stranici i otvorena C52 površina na `/how-it-works`.

## Otvoreno, svesno

- **`npm audit` u produkciji: čisto.** Četiri high (`postcss` — XSS + tri path-traversal
  preko `sourceMappingURL`; `sharp` — libvips CVE-2026-33327/33328/35590/35591) zatvorene
  su bump-om `next`-a na 16.3.4 (`0b2b747`). `npm audit --omit=dev` daje
  `found 0 vulnerabilities`. Nije se moglo zakrpiti odozdo: `next@16.2.6` je nosio **svoj**
  `postcss@8.4.31` unutar svog stabla, a advisory pogađa sve `<=8.5.22`.
  ⚠️ **Pun `npm audit` (sa dev-om) i dalje daje 9** (1 low, 4 moderate, 4 high) — ali su to
  **drugi** nalazi: `brace-expansion`, `browserslist`, `js-yaml`, `vite`. Svi dev-only;
  ništa od toga se ne deploy-uje. Pun dev audit **nije** izmeren pre bump-a, pa se ne tvrdi
  da li je tih 9 zatečeno ili pomereno.
- **Cold start baze pada u putanju POST-a forme.** Neon gasi compute posle 5 min mirovanja
  i budi se sam za ~300–800 ms, a prvi dodir baze u zahtevu je rate-limit provera. Prva
  prijava posle zatišja je sporija za oko sekundu; ne pada, jer in-memory sloj stoji ispod.
- **Chatbot** nije prenet. Odluka o obimu, ne propust.
- **Next vraća 200 na uhvaćenu serversku grešku** (odgovor je već streamovan). Isti
  mehanizam koji je proizveo 404-bug iz ovog prelaska; bitno kad se uključi monitoring.
- **`env.IMAGES` stavka je zatvorena** — `/_vinext/image` je nestao sa workerom, a Next-ov
  `/_next/image` na Vercelu radi nativno.
- **Privacy i TCPA tekstovi su nacrti za pravni pregled.** Sekcija 05 („Where Your
  Information Is Stored") opisuje stvarno skladištenje u bazi — original je nema jer tamo
  prijava živi samo u mejlu.

## Pravila sadržaja koja i dalje važe

**Preseljena 2026-09-09 u `CONTEXT.md → ## Pravila sadržaja`.** Ukratko: procesna pravila
originala ne obavezuju ovaj projekat (`D28`), ali `docs/CLAIMS.md` u originalu **nije stil nego
FCC/FTC** i prelazi bez izuzetka. Sprovodi se mašinski kroz `npm run verify:claims`.
