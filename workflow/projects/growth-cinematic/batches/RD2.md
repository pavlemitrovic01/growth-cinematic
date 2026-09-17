# RD2 — Kamera ne prolazi kroz prikolicu i zastaje dok se čita

- **Tier:** STANDARD (+ `manual` — skrol i 3D scena, `RULES §3`)
- **Grana:** `rd2-kamera-prikolica`
- **Odobrio:** Pavle, 2026-09-17 — „idemo rd2", pa posle plana: „Kamion ne mora da stane" (tumačenje
  „zastaje") i „ajde da probamo b", kao odgovor na ponudu da se otvori batch i naprave prekidači
- **Status:** CLOSED (`ae5cf75`)

## Cilj

Kamera u heroju ni u jednom trenutku ne prolazi kroz prikolicu ni tik pored stuba uz put. Dok se tekst poglavlja
čita, kadar stoji umesto da klizi ispod teksta, a kamion vozi dalje. Svetlo, kamion i tekst ostaju kakvi su.

## Polazno stanje (izmereno 2026-09-17)

Putanja iz `lib/hero-scene.ts:258-265`, preračunata u Node-u sa istim three.js-om (0.160.1), desktop vrednosti
(`const narrow = false`, `lib/hero-scene.ts:38`):

- **Prikolica:** kamera je unutar prikolice na **52,84–59,90 %** skrola heroja (`S1`: 52,85–59,95 %), do 2,24
  jedinice duboko, na visini ~3,55, 1,5–2,8 jedinica pre zadnjih vrata. Bliže od 2 jedinice kamionu: 49,21–63,44 %.
  Van tog prolaza najmanji razmak od kamiona je 2,25 (na 87,13 %).
- **Pavlov snimak** (dev server, 2026-09-17): kadar iz unutrašnjosti prikolice u poglavlju 02 — zidovi se crtaju
  samo spolja, pa se vide donja strana ivice krova (crna traka gore) i zadnja strana kabine (zeleni kvadrat).
- **Stub:** na **72,88 %** kamera prolazi **0,34 jedinice** od stuba desno od puta (z −178); jedini ispod 1
  jedinice u vožnji (72,57–73,19 %). Stub je u kadru 72,26–72,87 %, širok do ~585 px na slici 1440×900.
- **Poglavlja:** četiri `[data-beat]` (`components/CinematicHome.tsx`). Pun tekst: uvod 0–13,33 %, 01 20,00–46,67 %,
  02 53,33–80,00 %, 03 86,67–100 %. Prolaz kroz prikolicu i stub padaju u pun tekst poglavlja 02.
- **Kretanje dok se čita:** kamera pređe **26,7 %** putanje u 01 i 02, po 13,3 % u uvodu i 03. Meta pogleda se
  pomera napred na 74–90 % skrola. Hero je `380svh` (`app/globals.css:342`), skrol 280svh — na ekranu 900 px
  2520 px, predaja poglavlja ~168 px.
- **Proba putanja pre izbora (Node):** tri obilaska — a) iza zadnjih vrata, b) preko krova, c) bez prelaska — sva
  ostaju ≥ 2,94 jedinice od kamiona. Stubovi zavise od tajminga: sa današnjom levom stranom (x −11) u probama
  0,28–0,45 jedinice; sa levom stranom na x −12,4 i pauzom (meko ili puno) sve tri ≥ 1,09. Zato se leva strana
  odmiče od puta, a početna tačka (`P0`) ostaje ista.

## Plan

1. **Aktivacija:** grana, ovaj manifest, STATE, `quick`.
2. **Izvlačenje bez promene ponašanja:** putanja kamere, položaj kamiona i meta pogleda postaju čiste funkcije u
   `lib/hero-scene.ts` koje `render` koristi, pa ih test meri direktno. `narrow` vrednosti putanje se ne prenose
   (nedostižne); ostala `narrow` grananja ostaju. `lib/hero-beat.ts` dobija `cameraProgress`, za sada jednak
   skrolu.
3. **Crveno pre popravke** (`RULES §6`): `__tests__/lib/hero-scene.test.js` — kamion ≥ 2, stub ≥ 1, 100 000
   tačaka; `__tests__/lib/hero-beat.test.js` — pomeranje kamere dok je tekst pun, monotono, bez skoka. Na današnjoj
   putanji moraju da padnu: razmak tačno na izmerenim opsezima (dokaz da izvlačenje nije pomerilo kameru),
   zastajanje sa 26,7 %. Crveni izlaz ide u `LOG`.
4. **Varijante uživo na dev serveru**, privremeni prekidači u URL-u (kao `S1`): `?putanja=b` (preko krova, uz levu
   stranu odmaknutu od stubova; Pavle bira nju kao prvu probu, `a` i `c` samo ako `b` ne legne) i
   `?pauza=0|1|2` (0 — kao danas; 1 — meko, kamera usporava dok se čita; 2 — puno, kadar stoji dok je tekst pun).
   Pre Pavlovog pogleda: servirani JS upoređen sa izvorom (`L28`). Pavle gleda u svom browseru (`L7`). Izbor ide u
   `DECISIONS` kao `RD2-LOOK`, a granice testa zastajanja u ovaj manifest, pre implementacije.
5. **Implementacija izabranog:** meta pogleda prati kameru, ne skrol; kamion i svitanje ostaju vezani za skrol.
   Prekidači se brišu.
6. **Kapije** protiv `next start`, uz proveru PID-a na portu (`L1`); headless Chrome za draw pozive, konzolu i
   telefon.
7. **`manual`** (Pavle), pa `/close`. Merge i push su Pavlova odluka.

## Out of scope

- `RD3`: sunce iza kamere, sjaj posle početnog kadra, magla.
- Svetla, materijali i geometrija kamiona, puta, stubova i brda (`S1-LOOK` ostaje).
- Kretanje kamiona i svitanje (ostaju vezani za skrol).
- Tekst poglavlja: kriva vidljivosti (`BEAT_HOLD`/`BEAT_HANDOFF`), klizanje 28 px (`M7`), copy, tipografija.
- Visina heroja, sticky, `IntersectionObserver`, glađenje od 280 ms.
- Telefon i smanjen pokret (scena tamo ne radi).
- Merge, push, deploy.

## EXPECTED-FILES

- `lib/hero-scene.ts`
- `lib/hero-beat.ts`
- `components/HeroExperience.tsx`
- `__tests__/lib/hero-scene.test.js` (nov)
- `__tests__/lib/hero-beat.test.js`
- `workflow/projects/growth-cinematic/batches/RD2.md` (ovaj fajl)
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/CONTEXT.md`
- `workflow/projects/growth-cinematic/LESSONS.md` (samo ako nastane pouka)
- `workflow/STATE.md`
- `workflow/LOG.md`

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Implementacija samo u `lib/hero-scene.ts`, `lib/hero-beat.ts`, `components/HeroExperience.tsx` i dva test
   fajla.
2. Test razmaka: crven pre popravke na izmerenim opsezima, zelen posle — kamera nigde bliže od 2 jedinice kamionu
   ni od 1 jedinice stubu.
3. Test zastajanja: crven pre (26,7 %), zelen posle sa granicama iz izabrane varijante; početak 0, kraj 1,
   monotono, vršna brzina ispod granice.
4. Broj testova raste: 145 u 12 fajlova → više u 13, izmereno (`L20`).
5. Prvi kadar isti: kamera na početku skrola u istoj tački i sa istom metom (test).
6. three.js ostaje odložen: pre i posle, samo chunk scene sadrži three (`centripetal`), ne JS koji `/` učitava
   odmah.
7. Scena bez novih objekata, svetala i materijala (diff); draw pozivi na početku, 1/3, 2/3 i kraju prijavljeni pre
   i posle; 0 grešaka u konzoli i WebGL-u.
8. Telefon i smanjen pokret: fotografija nepromenjena (0,00 % piksela).
9. Privremeni prekidači nisu ni u jednom commitu.
10. `quick`, `typecheck`, `test`, `full`, `verify`, `rendered`: exit 0 protiv `next start`, meta ispisana.
11. **`manual` — Pavle, u svom browseru:** kamera ni u jednom trenutku ne prolazi kroz prikolicu ni tik pored
    stuba; dok se čita, kadar se ponaša po izabranoj varijanti; smena poglavlja bez trzaja.

## ROLLBACK

- Pre spajanja: `git checkout master && git branch -D rd2-kamera-prikolica`; `master` netaknut.
- Posle release-a: `git revert <implementacioni SHA>` + push.

## APPROVED-SCOPE-EXPANSION

**2026-09-17 — kamera sa kompozicijom, umesto pune pauze.** Pavle je video `b` sa pauzama 0/1/2 („možda mi se
čak najviše sviđa b puna pauza"), pa je ideju da scena doslovno prikazuje posao odbacio kao overengineering
(„ako je overengineering nećemo ići u tom pravcu") i tražio: **samo jedna blaga pauza gde je tekst najbitniji**
i da se nivo digne kamerom. Na predlog (blaga pauza u 02; kadar pravljen za tekst; pokret sa težinom; jak kadar
za ključnu poruku; bez novih objekata; jedan krug poređenja) — **„Slažem se, ali bih prvo da vidim 3 različite
varijacije"**.

- **Razlog:** merenje kadrova na sredini poglavlja (1440×900) — kamera je gledala u sredinu kamiona, pa je
  **65–82 %** kamiona bilo ispod kolone teksta (x 6–67 %), iza senke.
- **Nove putanje:** nema; isti EXPECTED-FILES.
- **Šta se menja u obimu:** putanja i meta pogleda postaju plan kadrova po poglavlju (položaj, meta, ugao objektiva,
  pomeraj slike kao udeo širine ekrana); vreme kamere dobija blagu pauzu samo u 02 (`CAMERA_PAUSE` 0,5) i težinu
  pokreta (`CAMERA_WEIGHT` 0,6). Poređenje: `?kamera=1|2|3` (Kran, Dron, Ispred kamiona), privremeno.
- **ACCEPTANCE, izmene:** (3) test zastajanja ograničava samo poglavlje 02; (5) prvi kadar je kadar izabrane
  varijante, a ne današnji; dodaje se (12) kompozicija — na sredini svakog poglavlja najviše 25 % kamiona ispod
  kolone teksta na 1440×900, uz prijavu za 1920×1080, 1280×1024 i 1024×650; dodaje se (13) brda — kamera nigde
  bliže od 1 jedinice.

## Zatvaranje (2026-09-17)

- **Implementacija:** `ae5cf75` (`lib/hero-scene.ts`, `lib/hero-beat.ts`, `components/HeroExperience.tsx`,
  `__tests__/lib/hero-scene.test.js`, `__tests__/lib/hero-beat.test.js`).
- **Izbor:** kamera „Kran" (`?kamera=1`, Pavle: „idemo na 1"); blaga pauza samo u 02 (`CAMERA_PAUSE` 0,5), težina
  pokreta `CAMERA_WEIGHT` 0,6. Odluka i obrazloženje: `DECISIONS` → `RD2-LOOK`.
- **ACCEPTANCE:**
  1. ✅ Implementacija samo u pet fajlova iz tačke 1 (`ae5cf75`).
  2. ✅ Razmak: stara putanja crvena — kamion `49.21-63.44%`, stub `72.57-73.19%`, exit 1; posle zeleno — kamion
     min 4,24, stub min 2,44.
  3. ✅ Pauza (izmenjeno proširenjem): stara putanja crvena sa 26,7 %; posle 02 = 9,5 % (≤ 10 %), ostala 12,4 / 24,8 /
     12,4 % (> 10 %); početak 0, kraj 1, samo napred, vršna brzina 3,38×.
  4. ✅ Test 145 u 12 fajlova → 156 u 13.
  5. ✅ Prvi kadar (izmenjeno proširenjem): kamera (−14, 5, −33), meta (0, 3,3, 7), objektiv 40°, pomeraj 0,3 — test.
  6. ✅ three.js odložen: produkcija (`master`) i grana — 9 početnih JS fajlova, 589 KiB, three ni u jednom; na grani
     samo u chunk-u scene `33ihsqwg9dh9m.js`.
  7. ✅ Bez novih objekata, svetala i materijala (u diff-u samo `CatmullRomCurve3`/`Vector3`); draw pozivi
     početak / 1/3 / 2/3 / kraj: pre (stara putanja, `S1`) 58 / 49 / 53 / 35, posle 58 / 59 / 59 / 57; 0 grešaka u konzoli
     (headless Chrome, `next start`).
  8. ✅ Fotografija: telefon 375×812 — 0 od 1 218 000 piksela različito; smanjen pokret 1440×900 — 0 od 1 296 000
     (produkcija naspram grane); scena `static`, bez platna, u oba.
  9. ✅ Prekidači (`?putanja`, `?pauza`, `?kamera`) nisu u `ae5cf75` — pretraga diff-a 0 pogodaka.
  10. ✅ `quick`, `typecheck`, `test` 156/156, `full` (`9g9VcvZWesqg4uU5TtFwI`), `verify` nojs 14 + claims 13,
      `rendered` 18/18 — exit 0 protiv `next start` (PID 24980, pokrenut 04:55:08, posle `BUILD_ID`-a 04:54:55), meta
      `http://localhost:3000`.
  11. ✅ `manual` PASS — Pavle: „pass" (isti build). Pojedinačne stavke nisu posebno imenovane.
  12. ✅ Kompozicija, ispod teksta uvod / 01 / 02 / 03: 1440×900 1,6 / 3,0 / 4,4 / 0,0 % (pre 65–82 %); 1920×1080 0 / 0 /
      0 / 0; 1280×1024 13,1 / 9,8 / 15,5 / 4,3; 1024×650 4,8 / 5,8 / 8,7 / 0,0.
  13. ✅ Brda: min 5,98.
- **Falsifikacija** (`RULES §6`, svaka greška ubačena sama, pa vraćena; vraćanje dokazano sha256 oba fajla, jer
  `git status` pre commita ne dokazuje, `L25`): `CAMERA_PAUSE = 0` → 8 crven; `CAMERA_PAUSE_CHAPTER = 1` → 8 i 9
  crveni; pretapanje 0,01 → 7 i 10 crveni; pomeraj kadra 01 = 0 → 5 crven; tačka putanje u kamionu → 1 crven; tačka
  u brdu → 3 crven; kamera držana na liniji stubova → 2 crven (min 0,06). Prva proba za stub (jedna tačka na liniji
  stubova) ostala je zelena — `LESSONS` L30.
- **Release: ne.** Pavle 2026-09-17 („Može, radimo tako"): `RD2` ne ide na Vercel dok `RD10` ne sredi izgled
  scene; puštaju se zajedno.
- **Detalji i izlazi:** `workflow/LOG.md`, unos `RD2`.
