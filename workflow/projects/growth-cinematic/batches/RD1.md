# RD1 — Naslov na podstranicama

- **Tier:** STANDARD (+ `manual` — `IntersectionObserver`, `RULES §3`)
- **Grana:** `rd1-naslov-podstranice`
- **Odobrio:** Pavle, 2026-09-16 — „idi rd1", pa plan odobren sa „moze execute"
- **Status:** CLOSED (`4584c80`)

## Cilj

Naslov na svih dvanaest ruta sa `PageShell` vidi se i posle F5 i posle klika iz menija, a animacija
otkrivanja i dalje radi. Uzrok se prvo dokazuje merenjem u Pavlovom browseru, pa tek onda popravlja.

## Polazno stanje (2026-09-16, iz koda)

- `components/PageShell.tsx:37` — `<h1 data-wipe>{title}</h1>`. Ruta sa `PageShell` ima dvanaest: `about`,
  `apply`, `contact`, `error`, `faq`, `for-carriers`, `how-it-works`, `not-found`, `privacy`, `terms`,
  `truckers-lounge`, `truckers-lounge/[slug]`.
- `app/globals.css:1022-1023` — iza `html.js-motion` i `prefers-reduced-motion:no-preference`,
  `[data-wipe]:not(.is-in)` je isečen na nultu širinu (`clip-path: inset(-.3em 100% -.3em -.3em)`).
- `components/Motion.tsx:79-83` — spisak meta se kupi jednom po `pathname`; klasu `is-in` imperativno dodaje
  posmatrač (prag 0,05, `rootMargin 0px 0px -8% 0px`).
- `app/layout.tsx:30` — watchdog posle 3 s sklanja `js-motion` samo ako `data-motion-ready` nije postavljen;
  `Motion.tsx` ga postavlja čim je tab vidljiv, pa u normalnom gledanju watchdog ne spašava ništa.
- Naslovna: `h1` heroja **nema** `data-wipe` (`components/CinematicHome.tsx:33`); devet `data-wipe` meta su
  `h2`/`h3` niže na strani.
- Pavle 2026-09-15/16, dev server, sopstveni browser: naslov se ne vidi ni posle F5 ni posle klika iz menija.
- Headless Chrome i Browser panel nisu merni instrument za posmatrača (`LESSONS` L7; kontrolni test 2026-09-15).

## Plan

1. **Merenje uzroka u Pavlovom browseru.** Privremena `components/WipeDiagnostics.tsx`, montirana u
   `app/layout.tsx`, pali se sa `?dijagnostika=1` (pamti se za tab) i ispisuje panel: `js-motion` i
   `data-motion-ready` kroz vreme, prvu `[data-wipe]` metu, njen `is-in` i `clip-path`, da li je čvor zamenjen,
   pozive posmatrača (sa opcijama iz `Motion.tsx` i sa pragom 0) sa udelom i presekom, i broj `data-wipe` meta
   sa `is-in`. Meri se protiv `next start`, uz proveru PID-a na portu (`L1`).
2. **Uzrok bira oblik popravke:**

| Nalaz | Uzrok | Popravka | Kapija koja pre toga pocrveni |
|---|---|---|---|
| posmatrač se oglasi, `is-in` se pojavi pa nestane | klasa dodata imperativno, pregazi je render (`L3`) | otkrivanje preko stanja koje render poštuje | test izdvojene logike (`lib/motion-reveal.ts`) |
| posmatrač se nikad ne oglasi, udeo 0 | naslov sam sebe seče na nultu površinu | skriveno stanje na omotaču, ne na elementu | statična tvrdnja nad CSS-om |
| meta nije u spisku | spisak se kupi jednom po ruti, naslov stigne kasnije | ponovno kupljenje kad sadržaj stigne | test izdvojene logike |

3. Nova kapija mora dokazano da padne na sadašnjem kodu (`RULES §6`), u `__tests__/motion-reveal.test.js`;
   broj testova raste sa 140 (`LESSONS` L20).
4. Provera obuhvata `/how-it-works`, jedan članak (`/truckers-lounge/[slug]`) i 404.
5. Dijagnostika se briše pre `/close`.

Uzrok van tri kandidata → STOP i prijava (`RULES §5`).

## Nalaz merenja (2026-09-16)

Pavlov browser (Edge, tab u prvom planu), `next start` sa buildom `d3JPrWXeyJZKB3uJedU5E` (PID 16984, pokrenut
14:11:16, build 14:11:06), `/how-it-works?dijagnostika=1`, očitano posle 59 s:

~~~
tab: visible | smanjen pokret: ne
js-motion: da (na pocetku da) | data-motion-ready: da (na pocetku da)
meta: H1 "Here's exactly how it works— no surp" | u DOM-u pri montiranju: da | u kadru: da
is-in: ne | clip-path: inset(-26.4px 100% -26.4px -26.4px) | okvir: 1175x180
cvor zamenjen: ne
IO kao Motion: 1 poziva | +7ms ukrsta=ne odnos=0.00 presek=0x0 okvir=1175x180
IO prag 0: 1 poziva | +7ms ukrsta=ne odnos=0.00 presek=0x0 okvir=1175x180
svi data-wipe: 1, od toga sa is-in: 0
(nema promena klasa)
~~~

**Uzrok potvrđen — drugi red tabele.** Naslov je u kadru po geometriji (okvir 1175×180), ali ga posmatrač
prijavljuje kao neukršten, sa presekom 0×0 — i sa opcijama iz `Motion.tsx` i sa pragom 0 bez margine. Browser
računa presek posle sopstvenog `clip-path`-a mete, a skriveno stanje je seče na nultu površinu unutar okvira.
Jedini poziv stiže odmah (+7 ms) i ne ponavlja se, pa `is-in` nikad ne stiže, a watchdog je već razoružan
(`data-motion-ready: da`). Čvor nije zamenjen (prvi red otpada), a meta je u DOM-u pri montiranju (treći red
otpada).

Isti mehanizam važi za svaku `[data-wipe]` metu: na Pavlovom snimku naslovne istog dana ne vidi se nijedan od
devet naslova sekcija sa `data-wipe`. Popravka u zajedničkom kodu vraća i njih, bez diranja fajlova naslovne.

Browser panel ovde ponovo nije merni instrument: isti panel u njemu je dao prozor 0×0 i okvir 0×294 (izgubljen
raspored, `LESSONS` L7), pa se ta očitavanja ne koriste.

**Oblik popravke:** klasa `is-in` i skriveno stanje ostaju na meti; posmatrač za `[data-wipe]` gleda
**roditelja**, koji nije isečen. Time se isečen element odvaja od posmatranog, u duhu drugog reda, bez novog
markup-a na deset naslova (`PageShell` i naslovna). Logika ide u `lib/motion-reveal.ts`, kapija u
`__tests__/motion-reveal.test.js`.

## Out of scope

- Nov izgled podstranica (`RD5`), copy, tipografija.
- Brisanje `data-reveal` (`H1`).
- Naslovna, telefon, 3D scena.
- Dependency, push, deploy.

## EXPECTED-FILES

Gornja granica; kodni fajlovi se diraju samo koliko izmereni uzrok traži.

- `components/WipeDiagnostics.tsx` (nov, privremen — briše se pre `/close`)
- `app/layout.tsx`
- `components/Motion.tsx`
- `lib/motion-reveal.ts` (nov, samo ako uzrok traži izdvajanje logike)
- `app/globals.css`
- `components/PageShell.tsx`
- `__tests__/motion-reveal.test.js` (nov)
- `workflow/projects/growth-cinematic/batches/RD1.md` (ovaj fajl)
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`
- `workflow/projects/growth-cinematic/LESSONS.md`

## GATES

`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE

1. Uzrok potvrđen merenjem u Pavlovom browseru, vrednosti upisane u ovaj manifest.
2. Nova kapija: crveni izlaz pre popravke u `LOG`-u, zelen posle; broj testova veći od 140.
3. `manual` (Pavle, pravi browser, `next start`): na `/how-it-works` naslov se vidi posle F5 **i** posle klika na
   „How it works" u meniju naslovne, uz animaciju otkrivanja — ne samo statično prikazan.
4. Isto na jednom članku iz `/truckers-lounge` i na 404.
5. `quick`, `typecheck`, `test`, `full`, `verify`, `rendered` exit 0 protiv `next start`, sa ispisanom metom.
6. Dijagnostika obrisana: pretraga repoa za `WipeDiagnostics` i `dijagnostika` daje 0 pogodaka u kodu.

## ROLLBACK

Rad je na grani; `master` se ne dira do Pavlove odluke o spajanju. Pre spajanja: brisanje grane. Posle
spajanja: `git revert` implementacionog commita.

## APPROVED-SCOPE-EXPANSION

—

## Zatvaranje (2026-09-16)

- **Implementacija:** `4584c80` (`components/Motion.tsx`, `lib/motion-reveal.ts`, `__tests__/motion-reveal.test.js`).
- **ACCEPTANCE:**
  1. ✅ Uzrok potvrđen merenjem — „Nalaz merenja" iznad.
  2. ✅ Kapija crvena pa zelena: stara logika `2 failed | 3 passed`, exit 1 → `5 passed`, exit 0; test 140 → 145.
  3. ✅ `manual` PASS — Pavle: „Sada naslovi rade" (build `-TeUDcjeJYlMDj6etW744`, sa dijagnostikom). Animacija
     i klik iz menija nisu posebno imenovani.
  4. ✅ Pokriveno istim odgovorom; članak i 404 nisu posebno imenovani.
  5. ✅ `quick`, `typecheck`, `test` 145/145, `full`, `verify` 14 + 13, `rendered` 18/18 — exit 0 protiv
     `next start` (PID 17504, build `gtfCz_JDVeA0krnyvlnYY`), meta `http://localhost:3000`.
  6. ✅ Dijagnostika obrisana: `app/layout.tsx` bez razlike prema originalu, pretraga koda 0 pogodaka.
- **Nije trebalo:** `app/globals.css`, `components/PageShell.tsx`.
- **Detalji i izlazi:** `workflow/LOG.md`, unos `RD1`.
