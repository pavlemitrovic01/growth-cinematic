# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeće:** **domen i mejl za `TTI1`**, kad Pavle kaže (*„kad sve završimo"*): GoDaddy DNS (`A @ → 76.76.21.21`,
  `CNAME www → cname.vercel-dns.com`, **MX GoDaddy pošte se ne dira**) i Resend domen `ttirecruiting.us` radi Pavle;
  Vercel domen + env (`NEXT_PUBLIC_SITE_URL`, `LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL` posle potvrde Resend-a)
  radi agent uz Pavlovo „da"; zatim `verify` + `rendered` na `ttirecruiting.us` i probna prijava. Google indeks:
  Pavle *„moze a i ne mora"* — ostaje `noindex` dok ne kaže (ako da, `rendered` test za `noindex` se menja).
  Kinematski kolosek (`RD5`, `T1b`, `M2c`–`M6`, `RD8`) je **napušten** (`TTI-IME`). Ostatak lanca lansiranja —
  `V1` (Hobby nalog) i pravni tekstovi advokatu (`LEG-1`, `LEG-2`).
- **Poslednji završen:** **`TTI3`** (2026-09-24, `9c83a2e`) — **Logo firme i crveni akcenti**: crveni „TTI" u krugu
  u navigaciji, podnožju, faviconu, ikonici na telefonu, JSON-LD-u i slici za deljenje; `--clay*` nose crvenu iz loga
  (`#e2111a` / `#b10713`). Kapije lokalno sve exit 0; Pavle: *„da za test, manual pass pushuj"*. Spojen i pušen
  2026-09-24 (`9747839..6091a5b`); build živ u 01:08, **deploy nije meren** (odloženo do domena).
- **Pretposlednji:** **`TTI2`** (2026-09-23, `9d19efa`) — **Lepše podstranice**: obična gornja navigacija sa
  linkovima, tamno zaglavlje sa fotografijom (obične strane — vozač, forme — izlazak sunca, članci — noć), pun tekst u
  naslovima i na naslovnoj, veća tipografija, širi raspored, kartice, tamno podnožje, blag pokret (`Reveal.tsx`; bez
  JS-a ništa skriveno). Forme netaknute. Kapije lokalno sve exit 0; Pavle: *„manual pass spoji pushuj"*. Spojen i pušen
  2026-09-23 (`9523a66..553c902`); build živ u 15:28, **deploy nije meren** (odloženo do domena).
- ⚠️ Iz `RD7` (2026-09-22, spojen i pušen): brza forma je živa na kraju naslovne; slanje na produkciji još niko nije
  uradio — prvo pravo slanje je prava prijava.
- ⚠️ Iz `R1`, i dalje živo: **`LEAD_FROM_EMAIL` je namerno prazan** (bez DKIM-a bi tiho ugasio
  isporuku); **test red ostaje u produkcijskoj bazi** (`TEST verifikacija R1`, `555-010-0199`).
- Starije (`TTI1` običan sajt pod imenom TTIrecruiting — spojen i pušen 2026-09-23, `RD4` navigacija — spojen i pušen 2026-09-23, `RD7` ritam naslovne i `RD17` paleta asfalt — spojeni i pušeni 2026-09-22, `RD16`, `RD15`, `RD13`, `RD14` napušten, `RD3`, `RD11`, `RD12`, `RD10`, `RD2`, `RD1`, `S1`, `T1`, `B1`, `R1`, `K1`, `U1`, `M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `TTI3` (`9747839..6091a5b`, implementacija `9c83a2e`) spojen fast-forward-om i pušen 2026-09-24 (Pavle: „manual pass
  pushuj"). **Deploy nije meren**; potvrđeno samo da vercel.app služi logo i crveni CSS (01:08:38).
- `TTI2` (`9523a66..553c902`, implementacija `9d19efa`) spojen fast-forward-om i pušen 2026-09-23 (Pavle: „manual pass
  spoji pushuj"). **Deploy nije meren**; potvrđeno samo da vercel.app služi nov CSS (`hero-02-dawn`, 15:28:22).
- `TTI1` (`2a6c160..c4d99ca`, implementacija `4e3fad8`) spojen fast-forward-om i pušen 2026-09-23 (Pavle: „moze
  spoji i pushuj"). **Deploy NIJE meren** — Pavle je merenje odložio do domena; samo potvrđeno da
  `growth-cinematic.vercel.app` u 14:52:44 služi nov HTML (`584-1777` 10×, `GROWTH` 0, `journey-canvas` 0).
- `H2` (`2a6c160`) spojen fast-forward-om i pušen 2026-09-23; deploy izmeren (marker u JS-u 0 → 1).
- `RD4` (`cf95c47..2909d52`, implementacija `217df2a`) spojen fast-forward-om i pušen 2026-09-23 (Pavle: „spoji i
  pushuj"); nosi i non-batch `68aa001` i `85d58fc`. **Deploy izmeren protiv njega**, uz nov build potvrđen
  diskriminatorom PRE merenja za **HTML, CSS i JS** (`nav-pill` u HTML-u 0 → 1, u CSS-u 0 → 1 uz novo ime
  `3na46zht_km27.css` → `0h8p3k4kvl123.css`, `(min-width: 1025px)` u JS-u 0 → 1; kontrole `nav-links`, `--asphalt`,
  „APPLY NOW" i „Open menu" iste u oba). Na produkciji `verify` 14 + 13 i `rendered` 20/20; `manual` na produkciji nije
  posebno tražen.
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
- Grana istine **`master`**: jednak `origin/master` posle release zapisa `TTI3`; origin nosi `M7`, `U1`, `K1`,
  `R1`, `B1`, `T1`, `S1`, `RD1`, `RD2`, `RD10`, `RD12`, `RD11`, `RD3`, `RD13`, `RD15`, `RD16`, `RD17`, `RD7`, `RD4`, `H2`, `TTI1`, `TTI2` i `TTI3`.
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`, `r1-resend-sandbox`,
  `b1-social-slika-kes`, `t1-arial-arimo-drugi-red`, `s1-hero-svetlo`,
  `rd1-naslov-podstranice`, `rd2-kamera-prikolica`, `rd10-izgled-scene`, `rd12-americki-kamion`, `rd11-americki-put`,
  `rd3-svetlo-scene`, `rd13-zora-na-tlu`, `rd15-smena-strana`, `rd16-boja-zavrsnog-kadra`, `rd17-paleta-asfalt`, `rd7-ritam-naslovne`,
  `tti1-obican-sajt`, `tti2-lepse-podstranice`, `tti3-logo`.

## Žive prepreke

- **Stari sajt (MAIN, `growthcdl.com`) se gasi** — Pavle 2026-09-23, uz prelazak na TTIrecruiting. Gašenje ili
  preusmerenje (preporuka: 301 na `ttirecruiting.us`) radi Pavle; ovaj projekat MAIN ne dira.
- ⚠️ **Obaveštenje o prijavi stiže na `info@ttirecruiting.us` tek kad Resend potvrdi domen.** Do tada je pošiljalac
  sandbox, koji isporučuje samo na adresu Resend naloga; prijava se i dalje upisuje u bazu.
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
