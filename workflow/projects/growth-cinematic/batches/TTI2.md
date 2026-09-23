# TTI2 — lepse podstranice: navigacija, zaglavlje sa fotografijom, tipografija, kartice, pokret

- **Tier:** STANDARD + `manual`
- **Grana:** tti2-lepse-podstranice
- **Odobrio:** Pavle, 2026-09-23 („idi" posle prikazanog plana)
- **Status:** CLOSED (`9d19efa`)

## Cilj
Podstranice su „kostur" (Pavle). Obican, uredan recruiting sajt u jednom batchu: obicna gornja navigacija sa linkovima,
tamno zaglavlje sa pravom fotografijom na svakoj podstranici, pun tekst u naslovima, veca i citljivija tipografija, siri
raspored, sadrzaj u karticama, blag pokret pri skrolu i tamno podnozje. Izgled je isproban u kopiji van repoa (pravac B).

## Out of scope
- Forme, API, baza, tekst pristanka (TCPA) — ne diraju se; menja se samo njihov okvir na strani.
- Nov tekst i nove fotografije — koriste se tri postojece (`hero-01-night`, `hero-02-dawn`, `hero-03-sunrise`).
- `components/Nav.tsx` — markup ostaje; pilula se sakriva iz CSS-a.
- Domen, DNS, Resend, env (odlozeno po Pavlu).

## EXPECTED-FILES
- `app/globals.css`
- `components/PageShell.tsx`
- `components/Home.tsx`
- `components/Reveal.tsx` (nov)
- `__tests__/globals-css.test.js`
- `tests/rendered-html.test.mjs`
- `workflow/projects/growth-cinematic/batches/TTI2.md`
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`

## GATES
`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE
- Na desktopu (>= 1025 px) linkovi navigacije su vidljivi u gornjoj traci; plutajuce pilule „MENU" nema.
- Svaka podstranica ima tamno zaglavlje sa fotografijom; drugi red naslova je pun tekst, ne obris.
- Bez JavaScript-a nista nije sakriveno (`verify` PASS na 14 ruta); pokret postoji samo uz JS i bez reduced-motion.
- Forme salju isto kao pre (`rendered` i `verify` PASS, TCPA tekst netaknut).
- **`manual`:** Pavle u pravom browseru, desktop i telefon: naslovna, `/how-it-works`, `/apply`, `/contact`, `/faq`,
  `/about`, Truckers Lounge — navigacija, zaglavlja sa fotografijom, citljivost, pokret pri skrolu, podnozje.

## ROLLBACK
Pre spajanja: brisanje grane. Posle spajanja: `git revert` implementacionog commita.

## APPROVED-SCOPE-EXPANSION
(nema — izmenjeni su samo `app/globals.css`, `components/Home.tsx`, `components/PageShell.tsx`, nov `components/Reveal.tsx`
i workflow fajlovi; testovi iz spiska nisu morali da se menjaju)

## Zatvaranje (2026-09-23)
- Kapije (lokalno, `next start`, PID 16872, meta `http://localhost:3000`): `quick`, `typecheck`, `test` 135/135, `full`,
  `verify` 14 + 13, `rendered` 21/21 — sve exit 0. Konzola 0 gresaka; posle skrola kroz `/how-it-works` 17 → 0
  sakrivenih elemenata; 6 linkova vidljivo u traci na 1440 px.
- `K1/A` je na putu bio 149 i 144: pet pravila je bilo ponovljeno (spojena) i tri „duplikata" su bila zarez unutar
  `:is()` koji census deli (selektori ispisani pun). Broj je ostao 141. `K1/B` je nasao mrtav `.route-in` — obrisan.
- Ispravke posle snimka: kartice clanaka (stari raspored u dve kolone), obris slova na naslovnoj, podvlaka „READ MORE".
- **`manual`:** Pavle, *„manual pass spoji pushuj"*.
