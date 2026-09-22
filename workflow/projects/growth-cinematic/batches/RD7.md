# RD7 — Ritam naslovne: krem „How it works" posle heroja, smena svetlo/tamno, forma na kraju

- **Tier:** STRICT (seli se forma sa pristankom, `RULES §3`; + `manual`)
- **Grana:** `rd7-ritam-naslovne` (sa `master` @ `b211076`)
- **Odobrio:** Pavle, 2026-09-22 — pravac B (`SMER-B`, „b"), plan u chatu sa izričitim sukobom sa auditom `U2` i
  podnožjem van obima, pa **„moze execute"**
- **Status:** CLOSED (`8c8546b`)

## Cilj

Naslovna dobija ritam iz pravca B: odmah posle heroja svetla krem sekcija „How it works", zatim smena svetlo/tamno, a
tamna traka sa brzom formom seli se sa vrha na kraj, uz poslednji poziv. Tekst doslovno isti. Obuhvata deo `RD6`
(„tamna traka sa brzom formom posle heroja — spojiti, ukloniti ili premestiti").

## Redosled i tonovi

```
        danas                                   posle (SMER-B)
  1     heroj                                   heroj
  2     traka sa formom (tamna)                 „How it works" (krem)
  3     naplata (svetlo siva)                   naplata (tamna)
  4     „How it works" (krem)                   vrednosti (svetlo siva)
  5     vrednosti (svetlo siva)                 „What we don't do" (tamna)
  6     „What we don't do" (tamna)              osnivač (krem)
  7     osnivač (tamna)                         FAQ (svetlo siva)
  8     FAQ (krem)                              završni poziv + brza forma (tamna)
```

Numeracija sekcija (01–05) ostaje i posle premeštanja ide redom.

⚠️ **Sukob sa auditom `U2`** (`docs/AUDIT-2026-09.md`): audit predlaže „hero → model naplate → proces → brza forma → …".
Oba skidaju formu sa mesta odmah posle heroja (suština nalaza: telefon se traži pre obećanja koja ga opravdavaju); B
formu stavlja posle svih obećanja. Pavlov izbor ima prednost nad auditom (`OPERATING`); prikazano u planu pre
odobrenja. `U2` ostaje OPEN za ostale stavke.

## Plan

1. **Aktivacija:** grana, ovaj manifest, STATE, `quick`; snimci pre izmene (naslovna desktop + telefon) i redosled
   sekcija u renderovanom HTML-u.
2. **`components/CinematicHome.tsx`:** novi redosled; traka `home-callback` se briše; `ApplyForm variant="quick"` prelazi
   u završni poziv sa `id="get-started"` („Skip to your next step" i dalje vodi na formu). `ApplyForm.tsx` i tekst
   pristanka se **ne diraju** (lock zona).
3. **`app/globals.css`:** naplata dobija tamnu varijantu; osnivač prelazi na krem (brišu se pravila koja su ga bojila za
   tamnu podlogu); FAQ na svetlo sivu; završni poziv u dve kolone (tekst + forma), na telefonu jedna; pravila
   `.home-callback` uklonjena ili preimenovana (deljeni selektor sa `.journey-story` ostaje netaknut).
4. **Nova kapija u `rendered`** (18 → 19): redosled sekcija na `/`, tačno jedna brza forma, unutar završnog poziva, sa
   `#get-started` i pristankom — dokazano crvena pa zelena (`RULES §6`).
5. **Forma sa novog mesta:** headless popuni i pošalje, zahtev ka `/api/apply` presretnut — pravi payload, bez prave
   prijave.
6. **`DECISIONS`:** `RD7-LOOK` + zapis da je redosled `SMER-B` zamenio auditov za `U2`.
7. **Kapije** protiv `next start` uz PID proveru, `manual`, pa `/close`.

## Out of scope

- **Podnožje ostaje svetlo** — na stranici „smer" je bilo tamno, ali je komponenta svih 13 stranica; ide sa `RD4`/`RD5`.
- Ostale stavke `U2` (rečenica o pravnom odnosu u telu, jedna numeracija, kickeri na telefonu, skip link pre skrola).
- `ApplyForm.tsx`, `app/api/**`, tekst pristanka; navigacija (`RD4`); zaglavlja podstranica (`RD5`); scena (`lib/`).
- Tekst i registar tvrdnji; merge, push, deploy.

## EXPECTED-FILES

- `components/CinematicHome.tsx`
- `app/globals.css`
- `tests/rendered-html.test.mjs`
- `__tests__/globals-css.test.js` (samo census konstanta, ako se broj namerno menja)
- `workflow/projects/growth-cinematic/batches/RD7.md` (ovaj fajl)
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/CONTEXT.md` (broj `rendered` testova 18 → 19)
- `workflow/projects/growth-cinematic/LESSONS.md` (samo ako nastane pouka)
- `workflow/STATE.md`
- `workflow/LOG.md`

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Izmene samo u EXPECTED-FILES; `git diff master` nad `components/ApplyForm.tsx`, `app/api/`, `lib/` prazan.
2. Renderovan HTML `/`: heroj → process → pay → values → guard → founder → faq → close; tačno jedna brza forma, u
   završnom pozivu, sa `#get-started` i pristankom.
3. Nova kapija dokazano crvena pa zelena; `rendered` 19/19.
4. Slanje brze forme sa novog mesta šalje isti payload na `/api/apply` kao danas (presretnuto); bez JavaScript-a forma i
   dalje ima alternativu (`verify:nojs`).
5. 173 testa; census menjan samo namerno; broj motion atributa na `/` ostaje ili je namerno ažuriran.
6. Kontrast teksta na svakoj sekciji koja menja ton ≥ 4,5:1 (naplata na tamnoj, osnivač i FAQ na svetloj).
7. `verify` 14 + 13; scena ista (`lib/` prazan, svetlina heroja ista).
8. **`manual`:** Pavle skroluje naslovnu na desktopu i telefonu i pošalje brzu formu sa kraja — potvrđuje ritam pravca B
   i da se forma nalazi i šalje.

### Izmereno na zatvaranju (`next start`, `BUILD_ID` 01:38:40 — noviji od svih izmena izvora)

```
  redosled (desktop 1440, y)   process 4229 · pay 5054 · values 5682 · guard 6196 · founder 7195 · faq 7815 · close 8708
  tonovi                       krem · asfalt · svetlo siva · asfalt · krem · svetlo siva · asfalt (+ brza forma)
  telefon 390                  isti redosled; forma ispod teksta zavrsnog poziva
  brza forma                   1 na strani, u home-close, #get-started, pristanak; payload presretnut:
                               {company_website:"", firstName, phone, tcpaConsent:true, leadType:"quick"} -- isti kao pre
  RD7 kapija                   stari build: pala (redosled) · lazni HTML: traka / dvaput / cilj / van / pristanak -- svaka crvena
                               nov build: 19/19
  kontrast                     naplata 15,17 / 13,85 / 9,61 · osnivac 13,91 / 7,23 / 5,36 · FAQ 12,84 / 4,95 (sve >= 4,5)
  scena                        noc 28,7 · finale 56,1 · draw 37/36 · 0 gresaka · lib/, ApplyForm, app/api: diff prazan
  census K1/A                  143 -> 142 (uklonjen ponovljen `.home-callback .home-section-top`)
```

Jedina izmena teksta: sa trakom je otišao i njen naslov „Let's talk about your next route." (stajao bi uz „Ready for your
next route?"); ostalo doslovno.

### Odstupanje od ACCEPTANCE — Pavle prihvatio 2026-09-22 („nisam slao formu. manual pass")

Tačka 8 traži da Pavle pošalje brzu formu sa kraja. **Nije je slao.** Slanje sa novog mesta dokazano je samo agentovim
testom (headless, zahtev ka `/api/apply` presretnut, payload isti kao sa starog mesta) i odgovorom lokalnog API-ja bez baze
(`503`, „Applications are temporarily unavailable…"). Ritam je Pavle potvrdio pogledom uz produkciju kao „pre": *„Mnogo je
lepse posle."*

## ROLLBACK

Grana se ne spaja bez Pavlove reči. Posle spajanja: `git revert` implementacionog commita. Merge i push su Pavlova
odluka.
