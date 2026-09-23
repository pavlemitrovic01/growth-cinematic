# RD4 — Navigacija: staklena pilula desno (`RD4-LOOK`)

- **Tier:** STANDARD + `manual` (fiksni elementi i boja po pozadini zavise od skrola, `RULES §3`)
- **Grana:** `rd4-pilula-desno` (sa `master` @ `85d58fc`)
- **Odobrio:** Pavle, 2026-09-22 — izbor `?nav=14` („14 definitivno") posle pet krugova varijanti, plan u chatu sa
  rešenjima četiri tačke iz `RD4-LOOK` i tamnim podnožjem van obima, pa **„moze execute"**
- **Status:** CLOSED (`217df2a`)

## Cilj

Na ≥ 1025 px navigacija postaje varijanta 14: znak i kapsula telefon + APPLY lebde gore u staklu, meni je uspravna
staklena pilula desno po sredini koja se otvara u visok panel, a zatvorena pilula menja boju po pozadini. Telefon
(< 1025 px) ostaje piksel isti.

## Plan

1. **`components/Nav.tsx`:** nov omotač `nav-menu` oko `<nav id="nav-links">` i u njemu pravo dugme `nav-pill`
   (☰ MENU, `aria-expanded`, `aria-controls="nav-links"`). Na < 1025 omotač je `display:contents` i dugme skriveno, pa
   telefon ima isti raspored. Postojeće stanje `open` (Esc, klik van, fokus na prvi link) deli se između `nav-toggle`
   (telefon) i `nav-pill`.
2. **Boja po pozadini:** pri skrolu (`requestAnimationFrame`) i promeni veličine — prva neprovidna pozadina ispod
   centra pilule → `data-tone` (tamno/svetlo) na omotaču; samo na ≥ 1025; markup drugih komponenti se ne dira. Pre JS-a
   pilula je krem (heroj i zaglavlja podstranica su tamni).
3. **`app/globals.css`:** jedan blok `@media(min-width:1025px)` na kraju fajla — kapsule, pilula, panel, staklo.
   Otvaranje: prelaz miša samo pod `(hover:hover)`, fokus tastaturom (`:has(:focus-visible)`, da klik mišem ne zaglavi
   panel), klik/dodir na pilulu (`.is-open`). Linkovi su u panelu već na punoj širini, da se tekst ne prelama dok raste.
4. **Posledice nestanka gornje trake:** zaglavlje podstranice 112 px odozgo; `.journey-intro` bez JS-a gubi oduzimanje
   90 px; `<noscript>` pravilo navigacije se sužava sa 1200 na 1024 px (inače bi bez JS-a razbilo pilulu na 1025–1200).
5. **Uska margina:** na 1025–1279 pilula 52 px široka, 8 px od ivice — staje u desnu marginu (6vw = 61 px).
6. **Kapija `rendered`** (19 → 20): pilula je `<button>` sa `aria-expanded` koji kontroliše `#nav-links`, i `noscript`
   pravilo ne važi iznad 1024 px — dokazano crvena pa zelena (`RULES §6`).
7. **CSS census `K1/A` ostaje 142:** svaki selektor jednom po media kontekstu. Ako se pomeri — STOP, test fajl nije u
   obimu.

## Out of scope

- Navigacija na telefonu (< 1025 px) i `MobileBar`.
- **Tamno podnožje** — preporuka `RD5` (šablon podstranice); Pavle nije tražio ovde.
- Zaglavlje podstranice sa kadrom (`RD5`); linkovi, nazivi i copy; traka za kolačiće (ugašena, beleži se rizik).
- Lock zona; scena (`lib/`); `ApplyForm`; merge, push, deploy.

## EXPECTED-FILES

- `components/Nav.tsx`
- `app/globals.css`
- `tests/rendered-html.test.mjs`
- `workflow/projects/growth-cinematic/batches/RD4.md` (ovaj fajl)
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/CONTEXT.md` (broj `rendered` testova 19 → 20)
- `workflow/projects/growth-cinematic/DECISIONS.md` (kako su rešene četiri tačke iz `RD4-LOOK`)
- `workflow/STATE.md`
- `workflow/LOG.md`

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Izmene samo u EXPECTED-FILES; `git diff master` nad `lib/`, `app/api/`, `components/ApplyForm.tsx` prazan.
2. `quick`, `typecheck`, `test` (173, census `K1/A` 142), `full`, `verify` (14 + 13) i `rendered` exit 0 protiv
   `next start` uz PID proveru; `rendered` 20/20; nova kapija izmereno crvena pa zelena, crveni izlaz u `LOG`.
3. **Pravi Chrome, 1025 / 1280 / 1440:** pilula ne ulazi u kolonu sadržaja (levi rub pilule ≥ desni rub sadržaja);
   otvoren panel ne seče kapsule; `data-tone` na `/` ide tamno → svetlo na krem sekciji, a na `/how-it-works` prati
   sekcije.
4. **Bez miša** (`hover:none`): prelaz ne otvara, dodir otvara; Esc zatvara i vraća fokus na pilulu.
5. **390 i 1024 px:** isečak zaglavlja piksel isti kao na `master`-u.
6. **`manual`:** Pavle u svom browseru na naslovnoj i jednoj podstranici — pilula se vidi na tamnom i na kremu, otvara
   se na prelaz, panel i linkovi rade, telefon isti.

### Izmereno na zatvaranju (`next start`, `BUILD_ID` 02:33:42 — noviji od svih izmena izvora; PID provereno)

```
  kapije        quick 0 · typecheck 0 · test 173/173 (census K1/A 142) · full 0 · verify 14 + 13 · rendered 20/20
  RD4 kapija    lazni server :3099 nad pravim HTML-om, jedan prekrsaj po pokretanju — svih sest crveno:
                noscript do 1200 px · bez aria-controls · div umesto dugmeta · bez pilule · pilula posle <nav> ·
                nesto izmedju pilule i <nav>; bez prekrsaja zeleno. Repo pri tom nije menjan (mutacije su u posredniku).
  margina       najmanji razmak pilula - tekst: 1025 px 225 · 1280 px 17 · 1440 px 23 (nijedan negativan)
  panel         440x776 na sve tri sirine; ne sece kapsule (znak [20,20,187,80], akcije [.,20,.,80])
  boja pilule   48 uzoraka na / i /how-it-works: svaki se slaze sa prvom neprovidnom pozadinom ispod pilule
  bez misa      touch emulacija (hover:none, pointer:coarse): prelaz NE otvara (52) · dodir otvara (440,
                aria-expanded true) · Esc zatvara i vraca fokus na pilulu · dodir na sadrzaj zatvara
  tastatura     Tab: skip-link > brand > nav-pill (panel ostaje zatvoren, prsten se vidi) > prvi link (panel 440)
  telefon       390 i 1024 px, zatvoren i otvoren meni, / i /how-it-works: 0 razlicitih piksela naspram `master`-a
                (isti snimak ponovljen dva puta bajt po bajt, pa poredjenje nije sum)
  manual        Pavle 2026-09-23: „imamo eror ali manual pass"
```

⚠️ **Greška nađena merenjem, pa popravljena:** zatvoren spisak linkova ležao je preko pilule i jeo dodir — bez
`pointer-events:none` meni se na tabletu bez miša ne bi otvarao. Mišem se to ne bi primetilo.

⚠️ **Dev-only upozorenje koje Pavle vidi u konzoli nije iz `RD4`:** „A tree hydrated but some attributes… didn't
match" na `<h1 data-wipe>` dolazi iz `Motion.tsx` (klasa `is-in` se dodaje posle učitavanja). `RD4` ne dira ni
`Motion.tsx` ni tu klasu; ista poruka postoji i u preview kopiji sa kodom od pre `RD4`. **Nije popravljeno ovde.**

### Tri odstupanja od odobrenog plana (ista EXPECTED-FILES površina)

1. **Nema omotača `nav-menu`.** Plan ga je predviđao; izmereno je da omotač sa `display:contents` menja zaglađivanje
   zaglavlja na telefonu (raspored isti do 0,001 px, ali 1198 različitih piksela, do 52/255 na ivici znaka). Pilula je
   zato dugme **odmah ispred** `<nav>`, a panel je sam `<nav>`. Sa tom strukturom telefon je 0 piksela razlike.
2. **Uska pilula važi do 1339 px**, ne do 1279: na 1280 px je 6vw = 76,8 px, a pilula od 64 px na 16 px od ivice
   zauzima 80 px.
3. **Boja pilule se čita sa tačke gde pilula stoji zatvorena**, a atribut `data-tone` nosi `<header>` — ne panel —
   da merenje ne zavisi od toga da li je panel otvoren.

## ROLLBACK

Grana se ne spaja bez Pavlove reči. Posle spajanja: `git revert` implementacionog commita.
