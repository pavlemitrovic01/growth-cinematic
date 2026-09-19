# RD3 — Svetlo i vazduh scene: nebo van magle, sjaj posle uvoda, zora bez braon zida

- **Tier:** STANDARD (+ `manual` — 3D scena i skrol, `RULES §3`)
- **Grana:** `rd3-svetlo-scene` (sa `master` @ `48fe6f4`)
- **Odobrio:** Pavle, 2026-09-19 — „rd3", plan u chatu (procena: nije overengineering; bloom, zraci i novi objekti
  van obima), pa **„moze execute kao i pre da vidim vise varijacija"**
- **Status:** CLOSED (`5e2c036`)

## Cilj

Svetlo i vazduh kroz celu vožnju: sunce i mesec svetle umesto da budu sivi, svetla imaju sjaj i posle uvoda, a zora
nije braon zid sa svetlom maglom preko puta. Kamera, kamion, put, tlo i položaji meseca i sunca ostaju.

## Polazno stanje (`master` @ `48fe6f4`, produkcija izmerena 2026-09-19)

- Pavle 2026-09-15 (izvor stavke): *„Kad se pređe (na trećoj slici) nekako je previše prazno i tmurno, kao da je magla
  i da se sunce jedva probija kroz maglu."* — „magla" je zamerka, ne zahtev.
- **Sunce iza kamere rešeno je u `RD10`** (sunce u 02 izlazi ispred kamere) — van obima.
- Diskovi meseca i sunca (`MeshBasicMaterial`, `fog` podrazumevano `true`) na `SUN_DISTANCE` 110 uz `FogExp2` 0,0095:
  udeo magle `1 − e^(−(0,0095·110)²)` = **0,664** → sivo-bež disk. Zvezde (`PointsMaterial`) isto. Na 200: 0,973.
- `.journey-dawn`: gradijent `--bone` preko donjih 25 % ekrana, opacity = napredak skrola → u 02–03 svetli veo preko
  puta; sekcija ispod heroja (`.home-callback`) je `--forest`.
- Sjaj farova i lampi vidi se samo u uvodu; u 01–03 bez odsjaja i oreola.
- Produkcija (headless Chrome, SwiftShader, 1440×900, 9 tačaka 0–1): draw 28/28/34/34/27/34/34/24/33, 0 grešaka.
- Test 171 u 14 fajlova (`RD11`). Merenja pre izmene za ovu granu idu u `LOG` — ista mašina i isti skript kao posle.

## Plan

1. **Aktivacija:** grana, ovaj manifest, STATE, `quick`; polazna merenja (draw po kadru, gzip chunk scene, testovi).
2. **Nebo van magle:** mesec, sunce i zvezde `fog: false`; disk i dalje bez upisa dubine i crta se prvi, pa ga brda
   zaklanjaju (`RD10-LOOK` važi).
3. **`lib/hero-light.ts` (nov):** meki oreoli od jedne teksture — farovi, lampe na stubovima, lampe truck stop-a,
   sunce — bez novih svetala i senki; položaji iz postojećih podataka (`roadsideParts`, farovi iz `buildTruck`), ne
   prepisani. Nebo u prelazu (tamnije gore, toplo-belo pri horizontu).
4. **Poređenje uživo, jedan krug:** privremeni prekidač `?svetlo=…` — Pavle traži **više varijacija, kao i pre**
   (0 danas · 1 nebo van magle + veo zore samo na kraju 03 · 2 = 1 + oreoli + sjajniji asfalt · 3 = 2 + ređa magla u
   zoru + nebo u prelazu · dodatne varijacije po istim osama). Topli ton ide ka toplo-beloj, ne zlatnoj (`S1-LOOK`).
   Kontakt list + linkovi za pravi browser; servirani kod potvrđen pre pogleda (`L28`). Izbor → `DECISIONS` `RD3-LOOK`.
5. **Posle izbora:** ostaje samo izabrano; prekidač i neizabrani kod se brišu.
6. **Novi uslovi (svaki dokazano crven, `RULES §6`):** (a) udeo magle u boji diska na `SUN_DISTANCE` ≤ 0,1 (danas
   0,664); (b) kamera kroz ceo plan dalje od svakog oreola od njegovog poluprečnika + 1; (c) veo zore 0 kroz 01 i 02 —
   samo ako se veo menja.
7. **Kapije** protiv `next start` uz PID proveru (`L1`), headless merenja, `manual`, pa `/close`.

Varijanta koja traži više od budžeta (draw ≤ 38 po kadru, chunk ≤ +3 KiB gzip) ili novi fajl → **STOP i prijava**
(`RULES §5`).

## Out of scope

- Kamera (`CAMERA_PLAN`, `cameraProgress`) — uočeno: na ~0,5 skrola kamera prolazi tik uz kabinu i auspuhe; to je
  odobrena kamera iz `RD2`.
- Kamion, put, truck stop, tlo; novi objekti protiv „praznine".
- Položaji meseca i sunca (`MOON_DIRECTION`, `SUN_LOW`, `SUN_HIGH`, `SUN_APPEARS`).
- Bloom i drugi postprocesing (`EffectComposer`), zraci svetla; novi dependency, preuzeti asseti.
- Tekst heroja, telefon i fotografska podloga; merge, push, deploy.

## EXPECTED-FILES

- `lib/hero-light.ts` (nov)
- `lib/hero-scene.ts`
- `lib/hero-beat.ts` (samo ako izabrana varijanta menja veo zore)
- `components/HeroExperience.tsx` (samo za veo zore)
- `__tests__/lib/hero-scene.test.js`
- `__tests__/lib/hero-beat.test.js` (samo za veo zore)
- `workflow/projects/growth-cinematic/batches/RD3.md` (ovaj fajl)
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/CONTEXT.md`
- `workflow/projects/growth-cinematic/LESSONS.md` (samo ako nastane pouka)
- `workflow/STATE.md`
- `workflow/LOG.md`

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Implementacija samo u fajlovima iz EXPECTED-FILES.
2. Postojeći testovi prolaze **bez popuštanja granica** (kamion ≥ 2, stub ≥ 1, tlo 1,5 / 0,5, mesec/sunce iz `RD10`,
   uslovi iz `RD11`).
3. `CAMERA_PLAN`, `SUN_LOW`, `SUN_HIGH`, `MOON_DIRECTION`, `SUN_APPEARS` nepromenjeni; `git diff master` nad
   `lib/hero-truck.ts`, `lib/hero-road.ts`, `lib/hero-terrain.ts` prazan.
4. Novi uslovi (a), (b), (c-ako-postoji) izmereno crveni pa zeleni; crveni izlaz u `LOG`.
5. Draw ≤ 38 u svakom merenom kadru, chunk scene ≤ +3 KiB gzip, 0 grešaka u konzoli (headless).
6. `?svetlo` — 0 pogodaka u kodu; izbor u `DECISIONS` `RD3-LOOK` sa Pavlovim rečima.
7. `verify` 14 + 13, `rendered` 18/18 (protiv `next start`); telefon i fotografska podloga nepromenjeni.
8. **`manual`:** Pavle u svom browseru, na lokalnom serveru sa izabranom varijantom, skroluje ceo hero (uvod → 03) i
   potvrđuje: sunce i mesec svetle, svetla imaju sjaj i posle uvoda, zora nije braon zid ni svetla magla preko puta.

## APPROVED-SCOPE-EXPANSION

- **2026-09-19, Pavle: „okej idemo da zavrsimo ovo sto smo poceli"** — odgovor na pitanje „Da li može?" za jedan fajl
  van spiska. **Razlog:** izabrana varijanta 3 uklanja svetli veo zore; element i JS su u `HeroExperience.tsx`, a
  pravilo u `app/globals.css`, pa ga je census kapija `K1/B` (`__tests__/globals-css.test.js`) prijavila kao mrtvu
  klasu: *„expected ['journey-dawn'] to deeply equal []"*. **Dodatna putanja:** `app/globals.css` — samo brisanje dva
  pravila `.journey-dawn` (bivši redovi 334 i 351), ništa drugo.

## ROLLBACK

Grana se ne spaja bez Pavlove reči. Posle spajanja: `git revert` implementacionog commita. Merge i push su Pavlova
odluka.
