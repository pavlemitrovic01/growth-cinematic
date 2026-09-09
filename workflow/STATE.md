# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — `M2` zatvoren, spojen i pušen; nema OPEN manifesta.
  Provereno `git branch --no-merged master` (prazno), ne samo `git status` (`LESSONS` L13).
- **Sledeći:** `M2b` — naslovna: šest sekcija na nov rečnik + brojke stižu pre sadržaja.
  ⚠️ **Dva ograničenja koja `M2` predaje `M2b`-u:** wipe **nikad** kao direktno dete
  `data-stagger` kontejnera (`nth-child` 0,2,0 gazi `[data-wipe]` 0,1,0 i `--wipe-lead` tiho
  nestaje), i `CRTA` ne ide na `.sub-hero` — pada na Nav-ovu ivicu.
  ⚠️ **`M2b` će namerno oboriti `G1/C` census** (`6/4/3/3`); broj se ispravlja u istom batchu
  koji menja markup, nikad zasebno.
- **Poslednji završen:** **`M2`** (2026-09-09, `1a3bca5`) — `PageShell` dobio `<h1 data-wipe>`,
  `/how-it-works` `data-stagger` na `.sub-2up` i `.sub-3up`. Tri atributa, dva fajla, **nula
  CSS-a**. `manual` PASS (Pavle, pravi browser).
  ⚠️ **Izmereno: `G1/A` je do danas prolazila prazna na 13 od 14 ruta** — `data-wipe` je
  postojao samo na `/`. Sada je 16 elemenata na 14 ruta, praznih ruta **nula**. Obuhvat rute
  nije obuhvat tvrdnje.
  ✅ **ACCEPTANCE 2 zatvoren izmereno** protiv deploy-a (`a362c20`).
  ⚠️ **Pregled posle `/close`-a našao je netačnu tvrdnju u komentaru** (`error.tsx` NE koristi
  `PageShell`); ispravljeno u `a362c20`, upisano kao `LESSONS` **L20** i **L21**.
- **Pretposlednji:** **`G2`** (2026-09-09, `d685f78`) — `G1/A` i `G1/B` mere **14 ruta** umesto
  10, spisak se **izvodi** iz `PAGE_PATHS` + `allPostSlugs()` + `/missing-page`.
- Starije (`G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno` i `docs/STATUS-ARCHIVE.md`.

## Git

- Grana istine **`master`**, izjednačena sa `origin/master`. **Ništa ne stoji nespojeno**
  (`git branch --no-merged master` prazno).
- `M2` (`bb8c407..a362c20`) spojen fast-forward-om i pušen 2026-09-09, uz release pregled koji je
  našao i ispravio netačnu tvrdnju u komentaru. **Deploy živ i izmeren protiv njega.**
- `G1` (`ddba710..7e73585`) i `G2` (`1ff169b..930c33d`) spojeni fast-forward-om i pušeni
  2026-09-09. **Deploy živ i izmeren protiv oba.**
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`.

## Žive prepreke

- ⚠️ **Sajt skuplja prijave a nikoga ne obaveštava.** Lead se upiše u Neon, vozač dobije 503
  „pozovite nas", i lanac se prekida. **`R1` (Resend) je poslednja nedokazana karika** i najveći
  efekat po uloženom vremenu — ali ide **posle** pokreta, Pavlovom odlukom.
- ⚠️ **Vercel projekat je na ličnom Hobby nalogu**, koji je po uslovima nekomercijalan, a sajt
  prima prave prijave. Selidba na tim = ponovo env promenljive i ponovo Neon integracija (`V1`).
- **Četiri OPEN odluke blokiraju svoj posao** (`RULES §8`): `C-ROK`, `LEG-1`, `LEG-2`, `C52`.
  Tri od četiri traže **advokata**, ne Pavla i ne agenta.
- ⚠️ **`C52` je živ u MAIN-u** — na sajtu koji je indeksiran i prima prave prijave. Ovaj projekat
  MAIN ne dira; popravka traži svoj batch u `GROWTH` repou.

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
