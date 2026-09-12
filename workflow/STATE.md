# STATE — growth-cinematic

> „Gde smo sada." Ažurira se na `/close`. **Ne duplirati `ROADMAP`/`CONTEXT`/`DECISIONS`** —
> ovde samo pozicija i žive prepreke.

## Pozicija

- **Aktivan projekat:** `growth-cinematic` (`workflow/projects/growth-cinematic/`)
- **Aktivan batch:** **NONE** — nema OPEN manifesta.
- **Sledeći:** **`U2`** (naslovna: redosled poverenja, jedna numeracija, kickeri, skip link) —
  više ne čeka `K1`. `T1` i dalje čeka odluku **`T-FONT`**; `B1` i `H1` su LEAN i nezavisni.
  Kolosek je od 2026-09-11 **završetak po auditu** (`docs/AUDIT-2026-09.md` + `ROADMAP`).
- **Poslednji završen:** **`K1`** (2026-09-12, `eb2d6d5`) — **isporučen u smanjenom obimu, posle
  merenja koje je oborilo plan.** Od **109** preklapanja u `globals.css` samo **jedno** se dalo
  spojiti bez promene izgleda; tri pokušaja spajanja dala su tri regresije (mobilni meni otvoren,
  `.btn-ghost` bez ivice, `.post-cta p` bez 16px). Isporučeno: spojen `[data-line]::before`,
  obrisane tri mrtve klase, nova kapija `__tests__/globals-css.test.js`.
  ⚠️ **Redosled u `globals.css` je sadržaj, ne nered** — `LESSONS` **L26**. Ko krene ponovo, ne
  mehanički: traži analizu po elementima i vizuelnu odluku, što je posao `T1`-a.
  ⚠️ **`manual` stoji kao NIJE POKRENUTO**, ne kao PASS. Snimak computed style-a (9.521 element ×
  57 svojstava × 64 stanja) bio je **bajt-identičan** baznom, pa je ručni prolaz preskočen
  Pavlovom odlukom.
  ✅ **Spojen i pušen 2026-09-12; izmereno protiv deploy-a** (17/17), uz nov build potvrđen time
  što su obrisane mrtve klase nestale iz serviranog CSS-a.
- **Pretposlednji:** **`U1`** (2026-09-12, `2df7aa3`) — osam pitanja na `/faq` postalo naslovi sa
  sidrima (`h1`+3 `h2` → `h1`+11 `h2`, sidara 0 → 8); schema bajt za bajt ista. Spojen i pušen,
  deploy izmeren.
- Starije (`M7`, `M2b`, `M2`, `G2`, `G1`, `M1`, `D1`, `D4`, faze) → `ROADMAP` → `Zatvoreno`,
  manifesti u `batches/` i `docs/STATUS-ARCHIVE.md`. Žive napomene: hero poglavlje **klizi 28 px**
  dok je na punoj vidljivosti (`M7`, prihvaćeno); **`data-reveal` nema nijednog korisnika** (briše
  se u `H1`, odluka nije doneta); **linija je na svetlim sekcijama dvostruko jača** (`L22`).

## Git

- `K1` (`2aebd07..d5d3ce5`, implementacija `eb2d6d5`) spojen fast-forward-om i pušen 2026-09-12;
  **deploy izmeren protiv njega**, uz nov build potvrđen nestankom mrtvih klasa iz CSS-a.
- Grana istine **`master`**, izjednačena sa `origin/master` (nosi `U1`).
- `U1` (`819dd63..6fd1ad2`) i `M7` (`d733178..b60a140`) spojeni fast-forward-om i pušeni
  2026-09-12; **deploy izmeren protiv oba**, uz nov build potvrđen diskriminatorom PRE merenja.
- `M2b` + zapis audita pušeni 2026-09-11 (census `0/4/9/9`); `M2`, `G1`, `G2` 2026-09-09.
- Bookmark grane, sve spojene: `d1-pay-utility`, `d1-values-utility`,
  `d1-cinematic-guard-founder`, `d4-sticky-process`, `g1-wipe-placement-gate`,
  `g2-gate-coverage`, `m2-pageshell-ritam`, `m2b-naslovna-recnik`, `audit-2026-09-plan`,
  `m7-hero-prelaz`, `u1-faq-struktura`, `k1-css-bez-preklapanja`.

## Žive prepreke

- ⚠️ **Sajt skuplja prijave a nikoga ne obaveštava.** Lead se upiše u Neon, vozač dobije 503
  „pozovite nas", i lanac se prekida. **`R1` (Resend) je poslednja nedokazana karika** i najveći
  efekat po uloženom vremenu — ali ide **poslednji**, pred lansiranje — Pavlova odluka, potvrđena 2026-09-11.
- ⚠️ **Vercel projekat je na ličnom Hobby nalogu**, koji je po uslovima nekomercijalan, a sajt
  prima prave prijave. Selidba na tim = ponovo env promenljive i ponovo Neon integracija (`V1`).
- **Devet OPEN odluka blokira svoj posao** (`RULES §8`): `C-ROK`, `LEG-1`, `LEG-2`, `C52` + pet
  iz audita (`T-FONT`, `SAP-TEKST`, `CB-API`, `R1-DOMEN`, `AUD-OBIM`).
  Tri traže **advokata**, ne Pavla i ne agenta.
- ⚠️ **`C52` je živ u MAIN-u** — na sajtu koji je indeksiran i prima prave prijave. Ovaj projekat
  MAIN ne dira; popravka traži svoj batch u `GROWTH` repou.
- **`RULES §6` traži dokaz vraćanja „čistim `git status`-om"**, što ne radi dok implementacija
  nije commitovana (`LESSONS` L25). Dopuna pravila je zaseban non-batch.

## Napomena o startu sesije

`/kickoff` čita ovaj fajl. Nezavisno od njega, na početku sesije ide **`git branch -vv` i
`git ls-remote --heads origin`** — čisto radno stablo ne znači da nema nespojenog rada
(`LESSONS` L13).
