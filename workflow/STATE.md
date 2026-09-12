# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći:** **`U1`** (FAQ struktura i nivoi naslova) kroz `/plan`. Kolosek je od 2026-09-11
  **završetak po auditu**: `docs/AUDIT-2026-09.md` + `ROADMAP` → Aktivan kolosek. `M2c` čeka `T1`
  i usklađen `docs/MOTION.md`.
- **Poslednji završen:** **`M7`** (2026-09-12, `0644d8a`) — hero kriva **„drži pa predaj"**: puna
  vidljivost do `abs(d) ≤ 0,4`, linearno predavanje do `0,6`, nula dalje. Zbir dva najbliža
  poglavlja `0,35` → **`1,00`**; puno poglavlje `~0%` → **80%** skrola; dvostruka ekspozicija
  `12%`. Kriva je izdvojena u `lib/hero-beat.ts` i pokrivena testom sa četiri uslova u **četiri
  odvojena `it` bloka**; falsifikovana **tri puta**, svaki uslov bar jednom crven. `manual` PASS.
  ⚠️ **Poglavlje sada klizi 28 px (±14 px) dok je na punoj vidljivosti**, jer je pomeraj ostao
  vezan za `d`. Pavle prihvatio kako jeste, pre `manual`-a (`LESSONS` L22).
  ✅ **ACCEPTANCE 6 zatvoren 2026-09-12** release commitom — izmereno protiv deploy-a; nov build
  potvrđen otiskom minifikovane krive PRE merenja (census ovde ne može — serverski HTML je isti).
- **Pretposlednji:** **`M2b`** (2026-09-09, `d125e5f`) — šest sekcija naslovne na `CRTA` +
  `OTKRIVANJE`; census `0/4/9/9`, falsifikovan po atributu (`LESSONS` L19). ACCEPTANCE 4 zatvoren
  2026-09-11 izmereno protiv deploy-a.
  ⚠️ **`data-reveal` nema nijednog korisnika na celom sajtu.** Primitiv ostaje u `globals.css` i u
  `Motion.tsx:76`; brisanje je zasebna odluka, nije doneta — vodi se u `H1`.
  ⚠️ **Linija je na svetlim sekcijama dvostruko jača nego stara ivica** (`.4` vs `.2`) — prihvaćeno
  kako jeste, `LESSONS` L22.
- Starije (`M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`, manifesti u
  `batches/` i `docs/STATUS-ARCHIVE.md`. Nalazi iz `M2` žive kao `LESSONS` L20 i L21.

## Git

- `M7` (`d733178..b60a140`, implementacija `0644d8a`) spojen fast-forward-om i pušen 2026-09-12.
  **Deploy živ i izmeren protiv njega**; nov build potvrđen otiskom minifikovane krive pre merenja.
- Grana istine **`master`**, izjednačena sa `origin/master`.
- `M2b` (`697b787..ddd12cc`) i zapis audita (`8d788bf`) spojeni fast-forward-om i pušeni
  2026-09-11. **Deploy izmeren protiv njih** (census `0/4/9/9`).
- `M2` (`bb8c407..a362c20`) spojen i pušen 2026-09-09; `G1` (`ddba710..7e73585`) i `G2`
  (`1ff169b..930c33d`) 2026-09-09. **Deploy izmeren protiv svih.**
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`, `m7-hero-prelaz`.

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
