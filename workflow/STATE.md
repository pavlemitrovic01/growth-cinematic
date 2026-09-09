# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta, grana je `master`, stablo čisto,
  `origin/master` izjednačen. **Ništa ne stoji nespojeno.**
- **Sledeći:** `M2` — **tanak oblik**, potvrđen nezavisnim pregledom: `<h1 data-wipe>` u
  `PageShell`-u + `data-stagger` na dve mreže u `/how-it-works`. Nula novog CSS-a.
  ⚠️ **Pregled je oborio prvu verziju `M2` plana — dva blokera.** `[data-stagger]>*:nth-child(2)`
  (0,2,0) gazi `[data-wipe]` (0,1,0), pa bi `--wipe-lead` tiho nestao; i `CRTA` na `.sub-hero`
  pada tačno na Nav-ovu ivicu. Zato `.sub-hero` **ne** dobija ni `data-line` ni `data-stagger`.
  ⚠️ Pre `M2` pročitati `LESSONS` **L15–L18**.
- **Poslednji završen:** **`G2`** (2026-09-09, `d685f78`) — `G1/A` i `G1/B` sada mere **14 ruta**
  umesto 10: `PAGE_PATHS` + `allPostSlugs()` + `/missing-page`. Spisak se **izvodi**, pa četvrti
  članak neće tražiti izmenu kapije. Obuhvat se ispisuje pri svakom pokretanju.
  ⚠️ **Dokazano pocrvenela na obe nove površine, zasebno** — petlja puca na prvom prekršaju, pa
  bi zajedničko merenje sakrilo 404.
- **Pretposlednji:** **`G1`** (2026-09-09, `3d9b55a`) — ograničenje „`data-wipe` samo na listne
  elemente" pretvoreno u mašinsku kapiju; postupak „kapija mora pocrveneti" upisan u `RULES §6`.
- Starije (`M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno` i `docs/STATUS-ARCHIVE.md`.

## Git

- Grana istine **`master`**, izjednačena sa `origin/master`. **Ništa ne stoji nespojeno**
  (`git branch --no-merged master` prazno).
- `G1` (`ddba710..7e73585`) i `G2` (`1ff169b..930c33d`) spojeni fast-forward-om i pušeni
  2026-09-09. **Deploy živ i izmeren protiv oba.**
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`.

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
