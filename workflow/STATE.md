# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći — nije odlučeno.** Otvoreno iz `B1`: **release** (Pavlova odluka) — tek on zatvara
  ACCEPTANCE 5, keš zaglavlja na Vercelu. **Preporuka, ne odluka:** ostatak lanca lansiranja — `V1`
  (selidba sa Hobby naloga) i pravni tekstovi advokatu; za dizajn prvo odluka **`T-FONT`**. Od onoga
  što vozač vidi: `U3` (čeka Pavlovu potvrdu da regruteri zovu sa broja iz `lib/contact.js`), a `U2`
  posle `T1`.
  ⚠️ **Otvoreno pitanje za Pavla: okvirni datum prelaska.** `ROADMAP` `X1` („tek kad postoje
  brojke") ne prati izjavu od 2026-09-13 da se MAIN gasi kad novi sajt preuzme domen.
- **Poslednji završen:** **`B1`** (2026-09-13, `7a3f083`) — **social slika 1,53 MB → 129 KB**
  (baseline JPEG 1200×630), keš od sat vremena za `/images/*` i `/og.jpg` u `next.config.ts`,
  Cloudflare `_headers` obrisan. Tier LEAN → STRICT, jer je `lib/seo.js` LOCK. `manual` PASS, nova
  provera tri puta dokazano crvena. ⚠️ **Nije spojen** — keš na Vercelu nije dokazan dok release ne
  izmeri deploy.
- **Pretposlednji:** **`R1`** (2026-09-13, bez koda) — **Resend upaljen i lanac dokazan kraj na
  kraj.** Nov ključ u Vercel env-u, sandbox pošiljalac kao na starom sajtu, redeploy; test prijava
  na deploy-u `POST /api/apply` **`503 → 200`**, mejl stigao u inbox sa celim TCPA zapisom
  (`manual` PASS). `R1-DOMEN` zatvoren: domen tek na lansiranju, posle DKIM-a.
  ⚠️ **`LEAD_FROM_EMAIL` je namerno prazan** — bez DKIM-a bi tiho ugasio isporuku.
  ⚠️ **Test red ostaje u produkcijskoj bazi** (`TEST verifikacija R1`, `555-010-0199`).
- Starije (`K1`, `U1`, `M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `B1` (implementacija `7a3f083` + close commit) stoji na grani **`b1-social-slika-kes`** — **nije
  spojen ni pušen**; release je Pavlova odluka, a ACCEPTANCE 5 se meri na deploy-u posle push-a.
- `R1` (`a55e0be..9d22b05`) spojen fast-forward-om i pušen 2026-09-13 — samo zapisnik; efekat (env +
  redeploy) živ od pre spajanja. Deploy posle push-a zdrav (`verify` 14+13, `rendered` 17/17); nov
  build se po sadržaju ne može dokazati, jer push nosi samo dokumente.
- `K1` (`2aebd07..d5d3ce5`, implementacija `eb2d6d5`) spojen fast-forward-om i pušen 2026-09-12;
  **deploy izmeren protiv njega**, uz nov build potvrđen nestankom mrtvih klasa iz CSS-a.
- Grana istine **`master`**, izjednačena sa `origin/master` (nosi `M7`, `U1`, `K1` i `R1`).
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`, `r1-resend-sandbox`.

## Žive prepreke

- **Stari sajt (MAIN) uskoro ide offline** — Pavle 2026-09-13. Zato je nalaz iz `R1` (prijave sa
  dva sajta se u inbox-u ne razlikuju) **nebitan i ne radi se**. Do samog prelaska MAIN je i dalje
  živ, indeksiran i ne dira se.
- ⚠️ **Vercel projekat je na ličnom Hobby nalogu**, koji je po uslovima nekomercijalan, a sajt
  prima prave prijave. Selidba na tim = ponovo env promenljive i ponovo Neon integracija (`V1`).
- **Osam OPEN odluka blokira svoj posao** (`RULES §8`): `C-ROK`, `LEG-1`, `LEG-2`, `C52` + četiri
  iz audita (`T-FONT`, `SAP-TEKST`, `CB-API`, `AUD-OBIM`).
  Tri traže **advokata**, ne Pavla i ne agenta.
- ⚠️ **`C52` je živ u MAIN-u** — na sajtu koji je indeksiran i prima prave prijave. Ovaj projekat
  MAIN ne dira; popravka traži svoj batch u `GROWTH` repou.
- **`RULES §6` traži dokaz vraćanja „čistim `git status`-om"**, što ne radi dok implementacija
  nije commitovana (`LESSONS` L25). Dopuna pravila je zaseban non-batch.

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
