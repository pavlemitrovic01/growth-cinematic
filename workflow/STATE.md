# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta, grana je `master`, stablo čisto,
  `origin/master` izjednačen. **Ništa ne stoji nespojeno.**
- **Sledeći:** **`G1` (LEAN)** — pretvoriti ograničenje „`data-wipe` samo na listne elemente" iz
  komentara u **mašinsku kapiju** (`tests/rendered-html.test.mjs`). Pavlova odluka 2026-09-09:
  zaseban batch, ne proširenje `M1`-a. ⚠️ `M2` je prvi koji bi ograničenje mogao prekršiti, pa
  `G1` ide **pre** njega.
- **Pa onda:** `M2` — površine 3, 4 i 5 (sekcije, brojke, `PageShell` ritam).
  ⚠️ Pre `M2` pročitati `LESSONS` **L15–L18** — sva četiri su iz `M1` i sva četiri opisuju
  zamke koje nijedna kapija ne vidi.
- **Poslednji završen:** **`M1`** (2026-09-09, `396d28c` + `30f471d`, `manual` PASS) — rečnik
  pokreta. **Prvi batch koji je prošao ceo `/plan → /execute → /close` ciklus.**
  ⚠️ Nezavisan dizajn pregled našao je defekt koji je prošao **sve** mašinske kapije: bazno
  `clip-path` van kapije je pravilo containing block **trajno**, i bez JS-a i pod `reduce`.
  Popravljeno pre merge-a.

## Git

- Grana istine **`master`**, izjednačena sa `origin/master`. **Ništa ne stoji nespojeno**
  (`git branch --no-merged master` prazno).
- Grane `d1-pay-utility`, `d1-values-utility`, `d1-cinematic-guard-founder`, `d4-sticky-process`
  su spojene fast-forward-om i ostavljene kao bookmark-ovi.

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
