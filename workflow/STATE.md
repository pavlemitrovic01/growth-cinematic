# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeće:** pravac B (`SMER-B`): **`RD4` navigacija sa strane** → `RD5` (deo) zaglavlje podstranice sa kadrom (uz njih i
  tamno podnožje). Za vizuelne odluke **varijante PRE plana** (`L39`). Blag šav navigacija (asfalt) → nebo heroja
  (zeleno) ostao je posle `RD17`; ako zasmeta, noćne boje scene su zaseban posao sa varijantama. `T1b`
  (https://claude.ai/artifact/FMR8hbAMF8u7Q9ia3KwsLn) i dalje čeka izbor; `U2` ostaje za pravnu rečenicu u telu,
  numeraciju, kickere na telefonu i skip link. Ostatak lanca lansiranja — `V1` i pravni tekstovi advokatu. `U3` čeka
  Pavlovu potvrdu da regruteri zovu sa broja iz `lib/contact.js`.
  ⚠️ **Otvoreno pitanje za Pavla: okvirni datum prelaska.** `ROADMAP` `X1` („tek kad postoje
  brojke") ne prati izjavu od 2026-09-13 da se MAIN gasi kad novi sajt preuzme domen.
- **Poslednji završen:** **`RD7`** (2026-09-22, `8c8546b`) — **Ritam naslovne** (drugi deo pravca B): posle heroja krem
  „How it works", pa naplata tamna, vrednosti, guard tamna, osnivač krem, FAQ svetlo siva, završni poziv sa brzom
  formom; traka sa formom posle heroja uklonjena, `#get-started` ide sa formom (`ApplyForm`, API, pristanak nedirnuti).
  Nova `rendered` kapija (19). Pavle: *„Mnogo je lepse posle."*; `manual` PASS uz odstupanje — formu nije slao, slanje
  dokazano presretnutim zahtevom. Spojen i pušen 2026-09-22, izmeren na deploy-u (HTML i CSS stigli zajedno).
  ⚠️ Brza forma je živa na novom mestu; slanje na produkciji još niko nije uradio — prvo pravo slanje je prava prijava.
- **Pretposlednji:** **`RD17`** (2026-09-22, `299accf`) — **Paleta asfalt** (prvi deo pravca B, `SMER-B`):
  `--forest #08110d` → `--asphalt #121314`, tamni tekst `#1c1c1b` i siva `--stone #4b4a47` neutralni, 46 linija u boji
  teksta sa njim, ivice heroja u asfalt; oznaka u guard-u 3,18 → 4,70:1. Noćne boje scene ostale (blag šav, prikazan).
  Noć 28,6 → 28,7, finale 55,9 → 56,0. `manual` PASS („manual pass"). Spojen i pušen 2026-09-22, izmeren na deploy-u
  (JS i CSS stigli zajedno).
- ⚠️ Iz `R1`, i dalje živo: **`LEAD_FROM_EMAIL` je namerno prazan** (bez DKIM-a bi tiho ugasio
  isporuku); **test red ostaje u produkcijskoj bazi** (`TEST verifikacija R1`, `555-010-0199`).
- Starije (`RD16`, `RD15`, `RD13`, `RD14` napušten, `RD3`, `RD11`, `RD12`, `RD10`, `RD2`, `RD1`, `S1`, `T1`, `B1`, `R1`, `K1`, `U1`, `M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `RD7` (`b211076..f150106`, implementacija `8c8546b`) spojen fast-forward-om i pušen 2026-09-22 (Pavle: „spoji i
  pushuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja za **HTML i CSS**
  (`home-close-form` 0 → 2, `.home-close-grid` 0 → 2, `home-callback` → 0, kontrole iste u oba); `rendered` 19/19 na
  produkciji; `manual` na produkciji nije posebno tražen.
- `RD17` (`1154b7c..a165df9`, implementacija `299accf`) spojen fast-forward-om i pušen 2026-09-22 (Pavle: „spoji i
  pushuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja za **CSS i JS**
  (`--asphalt:#121314` 0 → 1, `global-error` `#121314` 0 → 1, kontrole iste u oba); `manual` na produkciji nije
  posebno tražen.
- `RD16` (`18b8465..dbf810b`, implementacija `fe04aeb`) spojen fast-forward-om i pušen 2026-09-21 (Pavle: „spoji i
  pushuuuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja za **JS i CSS**
  (`e8c7a3` 0 → 1, `saturate(0)` u finalu 0 → 1, kontrola three 1 u oba); `manual` na produkciji nije posebno tražen.
- `RD15` (`6f737ed..c1f9037`, implementacija `47e365d`; nosi i zapis `0efa23d` o napuštenom `RD14`) spojen
  fast-forward-om i pušen 2026-09-21 (Pavle: „spoji i pusuj pa prelazim"); **deploy izmeren protiv njega**, uz nov build
  potvrđen diskriminatorom PRE merenja za **JS i CSS** (niz strana 0 → 1, `journey-shade-right` 0 → 1, kontrola three 1
  u oba); `manual` na produkciji nije posebno tražen.
- `RD13` (`612259f..d1ca86d`, implementacija `644e2e1`) spojen fast-forward-om i pušen 2026-09-20 (Pavle: „spoji i
  pushuj"); **deploy izmeren protiv njega tek posle redeploy-a bez build keša** — prvi build je dao nov JS (`#c49a7c`)
  ali **star CSS pod istim imenom**; redeploy je promenio ime (`370vta1vre4jp.css` → `3iu9mf55lgoo0.css`) i doneo pravi
  preliv. Diskriminator od sada nosi marker za JS **i** CSS (`L37`). `manual` na produkciji nije posebno tražen.
- `RD3` (`48fe6f4..8339d7b`, implementacija `5e2c036`) spojen fast-forward-om i pušen 2026-09-20 (Pavle: „spoji i
  pushuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja (kod `RD3` u JS-u koji `/`
  može da učita 0 → 1, `facingEye` i `#b98468`; servirani chunk scene 512 952 B, isti kao lokalno); `manual` na
  produkciji nije posebno tražen.
- `RD11` (`fabd74a..9ccc972`, implementacija `5def0d5`) spojen fast-forward-om i pušen 2026-09-19 (Pavle: „spoji u
  master i pushuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja (kod `RD11` u
  JS-u koji `/` može da učita 0 → 1 i CSS `380svh` → `460svh`, kontrola three 1 u oba); `manual` na produkciji nije
  posebno tražen.
- `RD12` (`8c56df0..65cf78a`, implementacija `66a88db`) spojen fast-forward-om i pušen 2026-09-19 (Pavle: „spoji u
  master i pushuj"); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE merenja (kod `RD12` u
  JS-u koji `/` može da učita 0 → 1, kontrola three 1 u oba); `manual` na produkciji nije posebno tražen.
- `RD2` + `RD10` (`701556f..0ec75df`, implementacije `ae5cf75` i `07d0df4`) spojeni fast-forward-om i pušeni zajedno
  2026-09-17 (Pavle: „može release"); **deploy izmeren protiv njih**, uz nov build potvrđen diskriminatorom PRE merenja
  (kod `RD10` u JS-u koji `/` može da učita 0 → 1, kontrola three 1 u oba); `manual` na produkciji nije posebno tražen.
- `RD1` (`cb7e163..b4cab0a`, implementacija `4584c80`) spojen fast-forward-om i pušen 2026-09-16 — nosi i
  non-batch `7a0cccb` (F5 test); **deploy izmeren protiv njega**, uz nov build potvrđen diskriminatorom PRE
  merenja (popravka u serviranom JS-u 0 → 1 chunk, kontrolni string u oba); `manual` PASS na produkciji.
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
- Grana istine **`master`**: jednak `origin/master` posle release zapisa `RD7`; origin nosi `M7`, `U1`, `K1`,
  `R1`, `B1`, `T1`, `S1`, `RD1`, `RD2`, `RD10`, `RD12`, `RD11`, `RD3`, `RD13`, `RD15`, `RD16`, `RD17` i `RD7`.
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`, `r1-resend-sandbox`,
  `b1-social-slika-kes`, `t1-arial-arimo-drugi-red`, `s1-hero-svetlo`,
  `rd1-naslov-podstranice`, `rd2-kamera-prikolica`, `rd10-izgled-scene`, `rd12-americki-kamion`, `rd11-americki-put`,
  `rd3-svetlo-scene`, `rd13-zora-na-tlu`, `rd15-smena-strana`, `rd16-boja-zavrsnog-kadra`, `rd17-paleta-asfalt`, `rd7-ritam-naslovne`.

## Žive prepreke

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
