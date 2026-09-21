# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeće:** **release `RD15`** (Pavlova odluka), pa **u novoj sesiji: boja završnog kadra (03)**. Pavle: *„okolinu i
  pozadinu… kao da se neko posrao preko ekrana"*. Izmereno: tlo nijansa 62°, iza teksta 47°, put 53° pri 9–24 % svetline
  — maslinasto-braon; uzrok je topli ton iz `RD13` preko zelenog tla (pre `RD13` tlo 91°). Tri pravca za poređenje:
  neutralno-hladno tlo (tople samo svetle površine), suva trava / pesak, tamno tlo uz svetao put i nebo.
  **„Filmski jezik" do sada:** skala i prored nisu poluga (`RD14` napušten); smena strana ne ide u 01/02 zbog meseca i
  sunca (`RD15`, `L38`) — ostaje **svetla krem sekcija sa Georgia serifom posle heroja** (van scene, bez tog sukoba).
  Uz to stranica **„smer redizajna"** (paleta; Pavle želi da menja `--forest`), **`T1b`**
  (https://claude.ai/artifact/FMR8hbAMF8u7Q9ia3KwsLn). Ostatak lanca lansiranja — `V1` i pravni tekstovi advokatu.
  `U3` čeka Pavlovu potvrdu da regruteri zovu sa broja iz `lib/contact.js`.
  ⚠️ **Otvoreno pitanje za Pavla: okvirni datum prelaska.** `ROADMAP` `X1` („tek kad postoje
  brojke") ne prati izjavu od 2026-09-13 da se MAIN gasi kad novi sajt preuzme domen.
- **Poslednji završen:** **`RD15`** (2026-09-21, `47e365d`) — **Centriran finale sa većim naslovom:** finale 03 u sredini
  (naslov do 104 px, kolona `min(56vw, 820px)`), ogledalo tamnog preliva, strane poglavlja kao podatak (`BEAT_SIDES`);
  puna smena strana odbačena merenjem (mesec/sunce van kadra ili iza brda, `L38`). `manual` PASS. **Nije spojen ni pušen.**
- **Pretposlednji:** **`RD13`** (2026-09-20, `644e2e1`) — **Zora na tlu:** ambijent u zoru nosi boju neba, albedo
  terena i asfalta se podiže uz topao ton, jedno usmereno svetlo bez senke sa strane sunca, donji deo `.journey-shade`
  guta 20 % kadra umesto 44 %. Završni kadar 44,7 → 63,1 prosečne svetline, noć nepromenjena; chunk +148 B gzip.
  `manual` PASS („manual passs"), dva odstupanja prijavljena pa prihvaćena. Spojen i pušen 2026-09-20; **deploy je prvo
  bio pola-pola** (JS nov, CSS star zbog Vercel build keša) i sređen redeploy-em bez keša, pa izmeren (`L37`).
- ⚠️ Iz `R1`, i dalje živo: **`LEAD_FROM_EMAIL` je namerno prazan** (bez DKIM-a bi tiho ugasio
  isporuku); **test red ostaje u produkcijskoj bazi** (`TEST verifikacija R1`, `555-010-0199`).
- Starije (`RD14` napušten, `RD3`, `RD11`, `RD12`, `RD10`, `RD2`, `RD1`, `S1`, `T1`, `B1`, `R1`, `K1`, `U1`, `M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `RD15` (implementacija `47e365d` + close) na grani **`rd15-smena-strana`** (sa `master` @ `0efa23d`) — **nije spojen
  ni pušen**; release je Pavlova odluka. `master` nosi i neposlat zapis `0efa23d` (`RD14` napušten). Merenja protiv
  lokalnog `next start`; deploy nosi `RD13`.
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
- Grana istine **`master`**: jednak `origin/master` posle release zapisa `RD13`; origin nosi `M7`, `U1`, `K1`,
  `R1`, `B1`, `T1`, `S1`, `RD1`, `RD2`, `RD10`, `RD12`, `RD11`, `RD3` i `RD13`.
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`, `r1-resend-sandbox`,
  `b1-social-slika-kes`, `t1-arial-arimo-drugi-red`, `s1-hero-svetlo`,
  `rd1-naslov-podstranice`, `rd2-kamera-prikolica`, `rd10-izgled-scene`, `rd12-americki-kamion`, `rd11-americki-put`,
  `rd3-svetlo-scene`, `rd13-zora-na-tlu`.

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
