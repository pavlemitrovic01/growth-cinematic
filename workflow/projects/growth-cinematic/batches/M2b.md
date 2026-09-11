# M2b — naslovna na nov rečnik: `CRTA` uvodi, naslov stiže otkrivanjem

- **Tier:** STANDARD (+ `manual` obavezan — `RULES §3`: skrol, `IntersectionObserver`, kontrast)
- **Grana:** `m2b-naslovna-recnik`
- **Odobrio:** Pavle, 2026-09-09 (izbor „Podeli — `M2b` sad, `M2c` posle": *„tačno kako je plan gore"*)
- **Status:** CLOSED (`d125e5f`)

## Cilj

Šest sekcija naslovne nose `data-reveal` — generički fade-up, jedina ulazna animacija koju je
`M1` došao da zameni. `M2b` ih prevodi na rečnik: **`CRTA` uvodi sekciju, naslov stiže
otkrivanjem.** Sekcije: `pay`, `process`, `guard`, `founder`, `faq`, `close`.

## Out of scope

- **Površina 4 `MOTION.md` — „brojke stižu pre sadržaja".** Izdvojena u `M2c` Pavlovom odlukom
  2026-09-09. Razlog: `--wipe-lead` se **nasleđuje** od `[data-line]`, pa kicker i `<h2>` unutar
  iste sekcije dobijaju **isto** kašnjenje; razdvajanje traži novu promenljivu, i to baš u zoni
  specifičnosti koja je oborila prvu verziju `M2` plana. `RULES §2`: 1 tema = 1 batch.
- **`home-values` se ne dira** — prešla je na rečnik u `M1`; `data-line` je već na njenim `<li>`.
- **`home-callback` se ne dira** — po `D1` namerno nema tip.
- **Mrtav `data-reveal` primitiv se NE briše.** Posle ovog batcha ostaje bez ijednog korisnika na
  celom sajtu (izmereno), ali brisanje iz `globals.css` i iz `Motion.tsx:76` je zasebna odluka.
- `docs/MOTION.md`, `M3` (maska po reči), `M6`.

## EXPECTED-FILES

```
components/CinematicHome.tsx
app/globals.css
tests/rendered-html.test.mjs
workflow/projects/growth-cinematic/batches/M2b.md
workflow/projects/growth-cinematic/ROADMAP.md
workflow/projects/growth-cinematic/LESSONS.md
workflow/STATE.md
workflow/LOG.md
```

⚠️ **`LESSONS.md` je ovog puta U SPISKU.** `M2` ga je izostavio, pa je nalaz vredan pouke morao
da čeka zaseban non-batch commit. Sva tri close-a pre `M2` su ga dirala.

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Svih šest mašinskih kapija exit-0.
2. **Crveni census izmeren i zalepljen u `LOG` PRE ispravke broja.** `G1/C` je tripwire; njegov
   pad je dokaz da radi. Broj se menja u **istom** batchu koji menja markup, nikad zasebno
   (`ROADMAP`, `RULES §6`).
3. Nov census **`data-reveal: 0 · data-stagger: 4 · data-wipe: 9 · data-line: 9`** zelen, a
   `G1/A` i `G1/B` zeleni na svih 14 ruta.
4. `verify` i `rendered` protiv **deploy-a** posle push-a, sa ispisanom metom (`RULES §6`).
   Zatvara se release commitom, kao kod `M2`.
5. **`manual` — Pavle, u pravom browseru** (ne Claude panel, `LESSONS` L7):
   - linija se **iscrtava s leva** na svih šest sekcija, naslov stiže **posle** nje;
   - ⚠️ **linija je vidljiva i na tamnim (`--forest`: `guard`, `founder`, `close`) i na svetlim
     sekcijama** — `[data-line]::before` koristi `currentColor`, a kapije ne mere kontrast
     (`LESSONS` L8);
   - **`.process-lede` se i dalje lepi** pri skrolu;
   - **razdelnik iznad `values` nije nestao** (ostaje statični `border-top`).

## ROLLBACK

`git checkout master && git branch -D m2b-naslovna-recnik`.

## REZULTAT (`/close`, 2026-09-09)

| Gate | Exit | Metrika |
|---|---|---|
| `quick` · `typecheck` · `full` | 0 | — |
| `test` | 0 | 132/132 u 9 fajlova |
| `verify` | 0 | `meri se: http://localhost:3000` · nojs 14 · claims 13 |
| `rendered` | 0 | `mere 14 ruta` · 13/13 · census `0/4/9/9` |
| `manual` | **PASS** | Pavle, 2026-09-09, pravi browser — „pogledao sam, sve je okej" |

- **ACCEPTANCE 1** ✅ svih šest exit-0.
- **ACCEPTANCE 2** ✅ **census falsifikovan PO ATRIBUTU** (`LESSONS` L19), tri crvena pokretanja:
  `data-reveal` `0 !== 6` · `data-wipe` `9 !== 3` · `data-line` `9 !== 3`; četvrto zeleno.
  `data-stagger` ostaje 4 i nikad ne pocrveni — tačno.
- **ACCEPTANCE 3** ✅ `0/4/9/9` zelen; `G1/A` i `G1/B` zeleni na 14 ruta. Raspored po tagu
  izmeren u renderu: `data-line` = `section` 6 + `li` 3; `data-wipe` = `h2` 6 + `h3` 3.
- **ACCEPTANCE 4** ✅ **ZATVOREN 2026-09-11 release commitom.** `master` `697b787..8d788bf`
  (fast-forward, push). Izmereno protiv deploy-a, meta ispisana: `verify` PASS (nojs 14, claims 13),
  `rendered` 13/13, census `0/4/9/9` na deploy-u.
- **ACCEPTANCE 5** ✅ `manual` PASS. Uz njega izmereno computed stilom, ne pogledom:
  linija je `rgb(241,231,213)` na tamnim sekcijama i `rgb(22,32,25)` na svetlim; `home-values`
  zadržala `border-top 1px rgba(22,32,25,.2)`; šest sekcija na `border-top 0px`.
- ⚠️ **Nalaz predat Pavlu pre odluke:** primitiv ide na `opacity:.4`, stara ivica je bila `.2` —
  linija je na svetlim sekcijama **dvostruko jača**. Pavle prihvatio kako jeste; primitiv se ne
  dira. Upisano kao `LESSONS` **L22**.
- **SCOPE_DRIFT: none** — 5 od 8 EXPECTED-FILES dirnuto u implementaciji, ostalo u close commitu.
