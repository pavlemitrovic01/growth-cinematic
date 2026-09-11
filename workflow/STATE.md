# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći:** prvi batch iz audita — **`M7`** (hero prelaz), kroz `/plan`. Kolosek je od 2026-09-11 **završetak po auditu**: `docs/AUDIT-2026-09.md` +
  `ROADMAP` → Aktivan kolosek. `M2c` čeka `T1` i usklađen `docs/MOTION.md`.
- **Poslednji završen:** **`M2b`** (2026-09-09, `d125e5f`) — šest sekcija naslovne sa
  `data-reveal` na `CRTA` + `OTKRIVANJE`. Census `6/4/3/3` → **`0/4/9/9`**, falsifikovan **po
  atributu** (tri crvena pokretanja, L19). `manual` PASS.
  ⚠️ **`data-reveal` više nema nijednog korisnika na celom sajtu.** Primitiv ostaje u
  `globals.css` i u `Motion.tsx:76`. Brisanje je zasebna odluka, nije doneta.
  ⚠️ **Linija je na svetlim sekcijama dvostruko jača nego stara ivica** (`.4` vs `.2`) — Pavle
  prihvatio kako jeste. `LESSONS` **L22**.
  ✅ **ACCEPTANCE 4 zatvoren 2026-09-11** release commitom — izmereno protiv deploy-a.
- **Pretposlednji:** **`M2`** (2026-09-09, `1a3bca5`) — `PageShell` dobio `<h1 data-wipe>`;
  `G1/A` prestala da prolazi prazna na 13 od 14 ruta. Release pregled našao netačnu tvrdnju u
  komentaru (`error.tsx` NE koristi `PageShell`) → `L20`, `L21`.
- Starije (`G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno` i `docs/STATUS-ARCHIVE.md`.

## Git

- `M2b` (`697b787..ddd12cc`) i zapis audita (`8d788bf`) spojeni fast-forward-om i pušeni
  2026-09-11. **Deploy živ i izmeren protiv njega** (census `0/4/9/9`).
- Grana istine **`master`**, izjednačena sa `origin/master`.
- `M2` (`bb8c407..a362c20`) spojen fast-forward-om i pušen 2026-09-09, uz release pregled koji je
  našao i ispravio netačnu tvrdnju u komentaru. **Deploy živ i izmeren protiv njega.**
- `G1` (`ddba710..7e73585`) i `G2` (`1ff169b..930c33d`) spojeni fast-forward-om i pušeni
  2026-09-09. **Deploy živ i izmeren protiv oba.**
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`.

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

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
