# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći:** **`K1`** (`globals.css` bez preklapanja pravila, bez vizuelne promene) kroz
  `/plan`. Kolosek je od 2026-09-11 **završetak po auditu**: `docs/AUDIT-2026-09.md` + `ROADMAP`
  → Aktivan kolosek. `K1` ide pre `T1` da bi svaka vizuelna razlika u `T1` došla od pisma.
  `M2c` čeka `T1` i usklađen `docs/MOTION.md`.
- **Poslednji završen:** **`U1`** (2026-09-12, `2df7aa3`) — osam pitanja na `/faq` postalo je
  naslovi sa sidrima: `h1` + 3 `h2` → **`h1` + 11 `h2`**, sidara **0 → 8**. Naslovna nosi ista
  pitanja kao `h3`. `FAQPage` schema **bajt za bajt ista** (`4d28222a…`), census `0/4/9/9`
  nepromenjen, `test:rendered` **13 → 17**. Kapija `U1/A`–`U1/D`, svaka dokazano crvena zasebno.
  `manual` PASS.
  ⚠️ **Bez JavaScripta deep-link sleće na ZATVORENO pitanje** — vidljivo je i otvara se jednim
  klikom. Svesna degradacija, zapisana u `FaqDeepLink.tsx`.
  ⚠️ **Dva odstupanja od ugovora, oba zapisana:** tri tvrdnje → četiri (`L19`), i prva verzija
  provere bila je pokvarena, ne kod (`L24`).
  ⚠️ **`verify`/`rendered` protiv deploy-a još nisu mereni** — traže release.
- **Pretposlednji:** **`M7`** (2026-09-12, `0644d8a`) — hero kriva „drži pa predaj": zbir dva
  najbliža poglavlja `0,35` → `1,00`, puno poglavlje `~0%` → **80%** skrola. Spojen i pušen
  2026-09-12; ACCEPTANCE 6 zatvoren izmereno protiv deploy-a.
  ⚠️ **Poglavlje klizi 28 px (±14 px) dok je na punoj vidljivosti** — Pavle prihvatio kako jeste
  (`LESSONS` L22).
- Starije (`M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`, manifesti
  u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene iz `M2b`: **`data-reveal` nema nijednog
  korisnika na celom sajtu** (briše se u `H1`, odluka nije doneta) i **linija je na svetlim
  sekcijama dvostruko jača nego stara ivica** (`LESSONS` L22).

## Git

- ⚠️ **`U1` je na grani `u1-faq-struktura` i NIJE spojen ni pušen** — implementacija `2df7aa3` +
  close commit. Release je Pavlova odluka; **deploy još servira stanje pre `U1`**.
- Grana istine **`master`**, izjednačena sa `origin/master`.
- `M7` (`d733178..b60a140`) spojen fast-forward-om i pušen 2026-09-12. **Deploy izmeren protiv
  njega**; nov build potvrđen otiskom minifikovane krive pre merenja (census tamo ne može —
  serverski HTML je isti).
- `M2b` (`697b787..ddd12cc`) i zapis audita (`8d788bf`) pušeni 2026-09-11 (census `0/4/9/9`);
  `M2` (`bb8c407..a362c20`), `G1` (`ddba710..7e73585`) i `G2` (`1ff169b..930c33d`) 2026-09-09.
  **Deploy izmeren protiv svih.**
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`.

## Žive prepreke

- ⚠️ **Sajt skuplja prijave a nikoga ne obaveštava.** Lead se upiše u Neon, vozač dobije 503
  „pozovite nas", i lanac se prekida. **`R1` (Resend) je poslednja nedokazana karika** i najveći
  efekat po uloženom vremenu — ali ide **poslednji**, pred lansiranje — Pavlova odluka, potvrđena 2026-09-11.
- ⚠️ **Vercel projekat je na ličnom Hobby nalogu**, koji je po uslovima nekomercijalan, a sajt
  prima prave prijave. Selidba na tim = ponovo env promenljive i ponovo Neon integracija (`V1`).
- **Devet OPEN odluka blokira svoj posao** (`RULES §8`): `C-ROK`, `LEG-1`, `LEG-2`, `C52` + pet
  iz audita (`T-FONT`, `SAP-TEKST`, `CB-API`, `R1-DOMEN`, `AUD-OBIM`).
  Tri traže **advokata**, ne Pavla i ne agenta.
- ⚠️ **`C52` je živ u MAIN-u** — na sajtu koji je indeksiran i prima prave prijave. Ovaj projekat
  MAIN ne dira; popravka traži svoj batch u `GROWTH` repou.
- **`RULES §6` traži dokaz vraćanja „čistim `git status`-om"**, što ne radi dok implementacija
  nije commitovana (`LESSONS` L25). Dopuna pravila je zaseban non-batch.

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
