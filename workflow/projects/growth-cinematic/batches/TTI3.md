# TTI3 — logo firme i crveni akcenti

- **Tier:** STANDARD + `manual`
- **Grana:** tti3-logo
- **Odobrio:** Pavle, 2026-09-23 (*„idi crvena logo i akcenti u crvenoj"*)
- **Status:** CLOSED (`9c83a2e`)

## Cilj
Logo firme (crveni „TTI" u krugu, Pavle 2026-09-23) ociscen van repoa (krug isecen, providna ivica, velicine za sajt i
ikonice) i postavljen u navigaciju, podnozje, favicon, ikonicu na telefonu, strukturirane podatke i sliku za deljenje.
Narandzasti akcenti sajta prelaze u crvenu iz loga (tokeni `--clay*` i nekoliko upisanih vrednosti).

## Out of scope
- Tekst, raspored, forme, API, TCPA — ne diraju se.
- Fotografije u zaglavljima (topla svetlost na slikama ostaje).
- Imena tokena (`--clay*`) ostaju ista, menjaju se samo vrednosti — preimenovanje bi dotaklo stotinu pravila.

## EXPECTED-FILES
- `components/Nav.tsx`
- `components/Footer.tsx`
- `components/StructuredData.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/global-error.tsx` (dodat pre pocetka: narandzasta je tu upisana direktno, jer taj ekran radi bez CSS-a)
- `public/logo-96.png` (nov)
- `public/logo-192.png` (nov)
- `public/logo-512.png` (nov)
- `public/icon-32.png` (nov)
- `public/apple-touch-icon.png` (nov)
- `public/og.jpg`
- `public/favicon.svg` (brise se)
- `workflow/projects/growth-cinematic/batches/TTI3.md`
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`

## GATES
`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE
- Logo se vidi u navigaciji i podnozju na svim rutama; favicon i ikonica na telefonu su logo.
- Nigde u serverskom HTML-u i CSS-u nema starih narandzastih vrednosti (`#c8662e`, `#e2b183`, `#d5a06d`, `#8a3d12`,
  `#86502b`, `200,102,46`).
- `verify` i `rendered` PASS; forme rade kao pre.
- **`manual`:** Pavle u browseru — logo u traci i podnozju, favicon na tabu, crveni akcenti (dugmad, drugi red naslova,
  brojevi koraka, linkovi).

## ROLLBACK
Pre spajanja: brisanje grane. Posle spajanja: `git revert` implementacionog commita.

## APPROVED-SCOPE-EXPANSION
- 2026-09-23 · Pavle (*„da za test"*) · `__tests__/globals-css.test.js` — census `K1/A` 141 → 139: uz znak „TTI"
  (`.brand-mark`) obrisana su i dva njegova ponovljena pravila; menja se samo broj i komentar.

## Zatvaranje (2026-09-24)
- Kapije (lokalno, `next start`, PID 15860, meta `http://localhost:3000`): `quick`, `typecheck`, `test` 135/135 (posle
  odobrene izmene broja), `full`, `verify` 14 + 13, `rendered` 21/21 — sve exit 0. U CSS-u 0 starih narandzastih
  vrednosti, `#e2111a` prisutan; `/icon-32.png` i logo kroz `/_next/image` 200; konzola 0.
- Usput: `<img>` je dao dva lint upozorenja — logo ide kroz `next/image`, lint ponovo cist. Nadnaslov u tamnoj bocnoj
  kartici (tamna crvena na asfaltu) prebacen na svetlu.
- **`manual`:** Pavle, *„da za test, manual pass pushuj"*.
