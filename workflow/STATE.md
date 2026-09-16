# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći — nije odlučeno (nova sesija).** Prvo **release `RD1`** (Pavlova odluka): spajanje, push i provera
  naslova na deploy-u u pravom, vidljivom tabu — do tada se na produkciji ne vidi nijedan naslov sa `data-wipe`.
  Pravac posla je od 2026-09-15 redizajn (`ROADMAP` → „Redizajn", telefon po strani); predlog je stranica „smer
  redizajna" pre `RD4`–`RD7`. Iz scene i dalje otvoreno: kamera prolazi kroz prikolicu (`RD2`), sjaj početnog
  kadra se u poglavljima 01–03 skoro ne vidi i sunce je iza kamere u zori (`RD3`). Za dizajn i dalje čeka
  **`T1b`** (stranica „GROWTH hijerarhija", https://claude.ai/artifact/FMR8hbAMF8u7Q9ia3KwsLn). Ostatak lanca
  lansiranja — `V1` (selidba sa Hobby naloga) i pravni tekstovi advokatu. `U3` čeka Pavlovu potvrdu da
  regruteri zovu sa broja iz `lib/contact.js`.
  ⚠️ **Otvoreno pitanje za Pavla: okvirni datum prelaska.** `ROADMAP` `X1` („tek kad postoje
  brojke") ne prati izjavu od 2026-09-13 da se MAIN gasi kad novi sajt preuzme domen.
- **Poslednji završen:** **`RD1`** (2026-09-16, `4584c80`) — **Naslovi sa `data-wipe`:** izmereno u Pavlovom
  browseru da posmatrač na meti isečenoj na nultu površinu javlja presek 0×0 i nikad više, pa se nije video
  nijedan naslov sa `data-wipe` (12 ruta sa `PageShell` i 9 na naslovnoj), i na produkciji. `Motion.tsx` sada
  posmatra roditelja (`lib/motion-reveal.ts`); kapija crvena pa zelena, test 140 → 145; `manual` PASS („Sada
  naslovi rade"). **Nije spojen** — release čeka Pavla.
- **Pretposlednji:** **`S1`** (2026-09-15, `1b474de`) — hero svetlo i čitljivost scene (kamion `1`, sjaj `b`);
  spojen i pušen 2026-09-15, izmeren na deploy-u.
- ⚠️ Iz `R1`, i dalje živo: **`LEAD_FROM_EMAIL` je namerno prazan** (bez DKIM-a bi tiho ugasio
  isporuku); **test red ostaje u produkcijskoj bazi** (`TEST verifikacija R1`, `555-010-0199`).
- Starije (`T1`, `B1`, `R1`, `K1`, `U1`, `M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `RD1` (grana `rd1-naslov-podstranice` od `7a0cccb`, implementacija `4584c80`, pa close commit) — **nije spojen
  ni pušen**; release je Pavlova odluka.
- `S1` (`575c26f..2e28574`, implementacija `1b474de`) spojen fast-forward-om i pušen 2026-09-15 — nosi i
  non-batch `2e28574` (lista `RD1`–`RD9`); **deploy izmeren protiv njega**, uz nov build potvrđen
  diskriminatorom PRE merenja (servirana `.journey-shade` bez → sa `125% 105%`, CSS `3nhvgp9ajf3u5.css` →
  `154jrck79jy_0.css`).
- `T1` (`1e1d636..5369004`, implementacija `2a3fb5a`) spojen fast-forward-om i pušen 2026-09-15 — nosi
  i non-batch `e9fca6b` (zapis `T-FONT`); **deploy izmeren protiv njega**, uz nov build potvrđen
  diskriminatorom PRE merenja (CSS bez → sa „Growth Sans", `/fonts/arimo-v36-latin.woff2` 404 → 200).
- `B1` (`059551e..fb26091`, implementacija `7a3f083`) spojen fast-forward-om i pušen 2026-09-14;
  **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja (`/og.png` 404,
  `/og.jpg` 200, `/_headers` 404).
- `R1` (`a55e0be..9d22b05`) spojen fast-forward-om i pušen 2026-09-13 — samo zapisnik; efekat (env +
  redeploy) živ od pre spajanja. Deploy posle push-a zdrav (`verify` 14+13, `rendered` 17/17); nov
  build se po sadržaju ne može dokazati, jer push nosi samo dokumente.
- `K1` (`2aebd07..d5d3ce5`, implementacija `eb2d6d5`) spojen fast-forward-om i pušen 2026-09-12;
  **deploy izmeren protiv njega**, uz nov build potvrđen nestankom mrtvih klasa iz CSS-a.
- Grana istine **`master`**: jedan commit ispred `origin/master` — `7a0cccb` (non-batch zapis F5 testa za `RD1`,
  nepušen); origin nosi `M7`, `U1`, `K1`, `R1`, `B1`, `T1` i `S1`.
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`, `r1-resend-sandbox`,
  `b1-social-slika-kes`, `t1-arial-arimo-drugi-red`, `s1-hero-svetlo`.

## Žive prepreke

- ⚠️ **Naslovi sa `data-wipe` se ne vide na produkciji dok se `RD1` ne pusti.** Popravka je na grani
  `rd1-naslov-podstranice` (`4584c80`), nespojena: na deploy-u se i dalje ne vidi naslov nijedne od 12 ruta sa
  `PageShell` ni devet naslova sekcija naslovne. Release = spajanje, push i provera u pravom, vidljivom tabu —
  skriveni tab (panel, headless) prikaže sve posle 3 s preko watchdog-a i ne dokazuje ništa (`L7`, `L29`).
- **Stari sajt (MAIN) uskoro ide offline** — Pavle 2026-09-13. Zato je nalaz iz `R1` (prijave sa
  dva sajta se u inbox-u ne razlikuju) **nebitan i ne radi se**. Do samog prelaska MAIN je i dalje
  živ, indeksiran i ne dira se.
- ⚠️ **Vercel projekat je na ličnom Hobby nalogu**, koji je po uslovima nekomercijalan, a sajt
  prima prave prijave. Selidba na tim = ponovo env promenljive i ponovo Neon integracija (`V1`).
- **Sedam OPEN odluka blokira svoj posao** (`RULES §8`): `C-ROK`, `LEG-1`, `LEG-2`, `C52` + tri
  iz audita (`SAP-TEKST`, `CB-API`, `AUD-OBIM`).
  Tri traže **advokata**, ne Pavla i ne agenta.
- ⚠️ **`C52` je živ u MAIN-u** — na sajtu koji je indeksiran i prima prave prijave. Ovaj projekat
  MAIN ne dira; popravka traži svoj batch u `GROWTH` repou.
- **`RULES §6` traži dokaz vraćanja „čistim `git status`-om"**, što ne radi dok implementacija
  nije commitovana (`LESSONS` L25). Dopuna pravila je zaseban non-batch.

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
