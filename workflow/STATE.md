# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta, stablo čisto.
  ⚠️ **Ali grana `g1-wipe-placement-gate` NIJE spojena ni pušena** (vidi `Git`).
- **Sledeći:** `M2` — površine 3, 4 i 5 (sekcije, brojke, `PageShell` ritam).
  ⚠️ Pre `M2` pročitati `LESSONS` **L15–L18** — sva četiri su iz `M1` i sva četiri opisuju
  zamke koje nijedna kapija ne vidi.
  ⚠️ **`M2` će oboriti `G1` census (6/4/3/3) čim doda pokret — to je namerno.** Broj se ispravlja
  u **istom** batchu koji menja markup, nikad kao zaseban „fix testa".
- **Poslednji završen:** **`G1`** (2026-09-09, `3d9b55a`) — ograničenje „`data-wipe` samo na
  listne elemente" je sada **mašinska kapija** na svih 10 ruta, plus census pokreta na `/`.
  ⚠️ **Kapija je dokazano pocrvenela** na tri namerna prekršaja pre nego što je priznata; taj
  postupak je istim batchem upisan u **`RULES §6`** kao trajno pravilo.
- **Pretposlednji:** **`M1`** (2026-09-09, `396d28c` + `30f471d`, `manual` PASS) — rečnik pokreta.
  ⚠️ Nezavisan dizajn pregled našao je defekt koji je prošao **sve** mašinske kapije. Baš taj
  presedan je razlog zašto `G1` traži crveni dokaz.

## Git

- Grana istine **`master`**, izjednačena sa `origin/master`.
- ⚠️ **`g1-wipe-placement-gate` STOJI NESPOJENA I NEPUŠENA** — dva commita (`3d9b55a` +
  close commit). `/close` ne pushuje; **release je zasebna Pavlova odluka** (`/close §6`).
  Dok se ne spoji, `M2` gradi na `master`-u koji **nema** `G1` kapiju.
  ⚠️ **Iz istog razloga `ACCEPTANCE 4` (merenje protiv deploy-a) nije pokrenuto**, ne prijavljeno
  kao PASS. Prvi korak posle merge-a: push, pa `VERIFY_BASE=… npm run test:rendered`.
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
