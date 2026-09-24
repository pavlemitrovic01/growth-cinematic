# TTI4 — sajt u identitetu loga: sve svetlo, tamnija crvena, heroj sa slikom terminala

- **Tier:** STANDARD + `manual`
- **Grana:** tti4-identitet
- **Odobrio:** Pavle, 2026-09-24 (*„moze execute"*)
- **Status:** CLOSED (`9ce51c0`)

## Cilj
Sajt prelazi u izgled koji ide uz logo firme. Pavlovi izbori sa poredjenja u kopiji van repoa (2026-09-24): **sve
svetlo** (varijanta 2), **tamnija crvena** (`#b81920`, varijanta 1) i **heroj A** — njegova slika terminala (vozac s
ledja, redovi kamiona, crvena kabina) preko celog heroja, beli naslov na tamnom prelivu sleva.

## Plan
1. Krem i topla siva → bela i neutralna siva (`neutral.py` iz kopije: svaka ne-crvena boja van komentara → ista
   svetlina u sivoj). `--clay` `#b81920`, `--clay-deep`/`--clay-mid` `#9a1219`; logo zadrzava svoju crvenu.
2. Sve svetlo: navigacija, zaglavlja podstranica, tamne sekcije naslovne (`$0`, guard, zavrsni poziv), bocna kartica,
   forma na kontaktu, podnozje; otvoren meni na telefonu beo.
3. Heroj naslovne: slika preko celog heroja, tamni preliv sleva, beli naslov; drugi red naslova `#ff6a70`, nadnaslov
   `#ff8a8f` (tamnocrvena na tamnom ne prolazi kontrast). Telefon: slika kao traka na vrhu (360 px), tekst ispod na
   belom sa tamnocrvenom. `Home.tsx`: `<picture>` sa dve stare slike → jedna nova.
4. Zaglavlja podstranica: bela, samo tekst, crvena linija 4 px ispod.
5. Naslovi u masnom kurzivu; sva dugmad crvena sa belim tekstom (i „APPLY" u donjoj traci na telefonu); crvena linija
   iznad podnozja.
6. `global-error.tsx` u svetlom izgledu.
7. Sest starih fotografija se brisu (nijedna vise nije u upotrebi); u `DECISIONS` se zatvara otvoreno pitanje o njima
   i upisuje odluka o izgledu.
8. Pravila se **spajaju** sa postojecim, ne dopisuju na kraj; prekidac iz kopije se ne prenosi; census `K1/A` se meri.

## Out of scope
- Tekst i logika formi, TCPA, API, lock zona.
- Nove slike za podstranice.
- Uvecana verzija slike (~3000 px) — kasnije zamena jednog fajla.
- Traka za kolacice (ugasena dok je ugasena analitika).
- Merenje na produkciji — odlozeno do domena, kao kod `TTI1`–`TTI3`.

## EXPECTED-FILES
- `app/globals.css`
- `components/Home.tsx`
- `app/global-error.tsx`
- `public/images/hero-04-terminal.jpg` (nov)
- `public/images/hero-01-night.jpg` (brise se)
- `public/images/hero-01-night-mobile.jpg` (brise se)
- `public/images/hero-02-dawn.jpg` (brise se)
- `public/images/hero-02-dawn-mobile.jpg` (brise se)
- `public/images/hero-03-sunrise.jpg` (brise se)
- `public/images/hero-03-sunrise-mobile.jpg` (brise se)
- `__tests__/globals-css.test.js`
- `tests/rendered-html.test.mjs`
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/batches/TTI4.md`
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`

## GATES
`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE
- Kapije `quick`, `typecheck`, `test`, `full`, `verify` (14 + 13), `rendered` (21/21) lokalno exit 0, meta ispisana.
- Test fotografije u heroju proverava novu sliku; pre `/close`-a namerno sklonjena slika → izmeren crveni izlaz → vraceno.
- Kontrast na 14 ruta, desktop 1440 i telefon 390: nijedan tekst ispod 4,5:1 (mali) / 3:1 (veliki); na heroju preko
  slike, 95. percentil najsvetlijih tacaka ispod slova. Nijedna sekcija van heroja nema tamnu podlogu. Brojevi u `LOG`.
- Snimci naslovne, How it works, Apply i telefona odgovaraju pregledu iz kopije.
- `git diff --stat` samo EXPECTED-FILES; tekst, forme, TCPA, API i lock zona nedirnuti.
- **`manual`:** Pavle u pravom browseru, desktop i telefon — naslovna, How it works, Apply, Contact, FAQ, jedan clanak,
  otvoren meni na telefonu i donja traka.

## ROLLBACK
Pre spajanja: brisanje grane. Posle spajanja: `git revert` implementacionog commita (vraca i obrisane slike).

## APPROVED-SCOPE-EXPANSION
- nema.

## Zatvaranje (2026-09-24)
- Kapije (lokalno, `next start`, PID 13444, meta `http://localhost:3000`): `quick`, `typecheck`, `test` 135/135,
  `full`, `verify` 14 + 13, `rendered` 21/21 — sve exit 0. `K1/A` ostaje 139 (izmereno), pa
  `__tests__/globals-css.test.js` nije menjan.
- Test fotografije u heroju: slika namerno sklonjena → `rendered` 20/21, pada „heroj mora imati fotografiju", exit 1 →
  vraceno → 21/21, exit 0.
- Kontrast: 14 ruta × (1440, 390) = 1738 tekstova, 0 ispod praga, 0 tamnih podloga van heroja; preko slike na
  1440/1024/800 najmanje 4,25:1 (drugi red naslova, prag 3). Provera je prvo cutke vracala nulu (regex u stringu izgubio
  escape — `LESSONS` L24, NaN); otkriveno namernim prekrsajem (19 padova + tamno podnozje), popravljeno, pa mereno.
- Merenje je naslo cetiri defekta koja je imao i odobreni pregled, sva ispravljena: „WE DON'T" 3,54:1; „Call" u zavrsnom
  pozivu belo na belom; „Include your area code" 1,47:1; nadnaslov preko slike na 800 px 3,9:1 (jaci preliv na tabletu).
- Svesna odstupanja od pregleda: beo krug strelice na dugmetu forme; naslov na telefonu 44,9 px umesto 46 (skala za
  telefon, da 320 px ne preliva); „APPLY NOW" pri prelazu misem tamnocrven. Ostalo piksel po piksel isto kao pregled.
- **`manual`:** Pavle pregledao build na `localhost:3000` (snimak FAQ sekcije u novom izgledu), pa *„moze, radicemo close
  pa tek onda posle dodati sliku ako dogovorimo"*. Telefon i otvoren meni nije posebno potvrdio.
