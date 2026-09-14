# LOG — audit trail (growth-cinematic)

> Jedan unos po batchu, dodaje se na `/close`. **Najnoviji na vrhu.**
> Non-batch i release unosi se označavaju kao takvi i legitimno dolaze posle poslednjeg batcha.
> Postavljeno 2026-09-09.

---

## T1 (STANDARD) — Arial svuda: Arimo samo gde nema Arial-a, jači drugi red naslova · 2026-09-14

**Implementacija:** `2a3fb5a` · **Grana:** `t1-arial-arimo-drugi-red` — **nije spojena**, release je Pavlova odluka

**Changed files:** `public/fonts/arimo-v36-latin.woff2` · `public/fonts/arimo-v36-latin-italic.woff2` ·
`public/fonts/OFL-Arimo.txt` (novi) · `app/globals.css` · `next.config.ts` · `tests/rendered-html.test.mjs` ·
`__tests__/globals-css.test.js` (odobreno proširenje) · `workflow/projects/growth-cinematic/batches/T1.md`
(nov) · `workflow/projects/growth-cinematic/ROADMAP.md` · `workflow/projects/growth-cinematic/DECISIONS.md` ·
`workflow/projects/growth-cinematic/CONTEXT.md` · `workflow/projects/growth-cinematic/LESSONS.md` ·
`workflow/STATE.md` · ovaj `LOG.md`

Pavlove odluke 2026-09-14: `T-FONT` — Arial ostaje; drugi red naslova varijanta 2 („moze 2"); Arimo za
uređaje bez Arial-a („Da"), da Android što više liči na desktop.

⚠️ **Merenje je promenilo plan pre koda:** (1) AOSP `fonts.xml` ima `<alias name="arial" to="sans-serif" />`,
pa Arimo ne ide iza Arial-a u listi fontova, nego u porodicu „Growth Sans" sa `local()` prvim
(`LESSONS` L27); (2) Arial cifre su već iste širine (svih 10 po 55,62 px), pa „tabularne cifre" ispadaju;
(3) hijerarhija (skala, nadnaslovi, gde obris ostaje) nije odlučena → nov batch `T1b`, prvo stranica sa
predlogom.

⚠️ **Lažan nalaz kapije, popravljen uz odobrenje:** `K1/B` je `.woff2` iz `url("/fonts/…woff2")` čitao kao
CSS klasu i pao (139/140). STOP, pa Pavle „odobravam a": `__tests__/globals-css.test.js` briše `url(...)`
pre traženja klasa. Klasa `LESSONS` L18.

Fontovi (sha256): `arimo-v36-latin.woff2` 20.132 B `6a22ce0b…9bc1b9` · `arimo-v36-latin-italic.woff2`
22.352 B `bc7513e4…fde6b8` · `OFL-Arimo.txt` 4.384 B `11cce536…960992`.

IZMERENO (`/close`, meri se: http://localhost:3000, `next start` PID 47704 pokrenut posle `BUILD_ID`-a):
```
  quick / typecheck / full      exit 0 · gotov CSS 2ka6-_n9u3vzu.css, isti kao servirani
  test                          140/140 u 11 fajlova
  rendered                      18/18 (bilo 17) · T1/A zelen
  verify                        nojs PASS 14 · claims PASS 13
  servirani CSS                 4 Growth Sans lica sa local(Arial...) ispred url(/fonts/arimo...)
                                body: Growth Sans,Arial,Helvetica,sans-serif
  obris                         .journey h1/h2 em · .home-section h2 em · .sub-hero h1 em · .error-page h1 em
                                stroke 2px + weight 800 (computed na hero-u: 2px / 800)
  /fonts/*.woff2                200 font/woff2 20132 / 22352 B · Cache-Control: public, max-age=3600
  desktop Chromium              0 .woff2 zahteva na / (Arial lokalno) · simulacija bez Arial-a: Arimo 200
```

`RULES §6` — nove i izmenjene provere dokazano crvene, jedan prekršaj po pokretanju, svaki vraćen (sha256 `OK`):
```
  K1/B  izmisljena klasa        expected [ 't1-lazna-mrtva-klasa' ] to deeply equal []   (K1/A ostao zelen)
  F1    400 lice bez local()    CSS: Growth Sans 400 normal nema instaliran Arial ispred Arimo-a
  F2    body bez Growth Sans    CSS: `body` ne pocinje sa Growth Sans pa Arial
  F3    fajl uklonjen           /fonts/arimo-v36-latin.woff2: HTTP 500 — font na koji CSS pokazuje ne postoji
  preload                       detekcija: fixture sa preload-om 1 · servirana / 0
```
F1 i F2 su mereni na zasebnim build-ovima (PID 34484 i 16836, svaki pokrenut posle svog `BUILD_ID`-a, uz
diskriminator da servirani CSS nosi prekršaj); F3 na živom serveru — `next start` za fajl uklonjen posle
starta vraća 500, ne 404.

✅ **`manual` PASS (Pavle)** — „manual pass moze close". Da li je Android deo (b) rađen preko LAN-a nije
navedeno; ako nije, radi se uz release, na produkciji.

**SCOPE_DRIFT: none** — 14 putanja: 13 iz EXPECTED-FILES + `__tests__/globals-css.test.js` iz
APPROVED-SCOPE-EXPANSION (Pavle, 2026-09-14). Nezavisni review nije tražen: mala reverzibilna izmena bez
claims, legal, security i lock-zone površine. `NoFallbackError` u logu servera je postojeća stavka `H1`.

**NEXT STEP:** release `T1` (Pavlova odluka) — na deploy-u prvo diskriminator (servirani CSS nosi
„Growth Sans"), pa ACCEPTANCE 2–5, `verify` i `rendered`, i Android provera ako nije rađena. Posle toga
`T1b`: stranica sa predlogom hijerarhije, pa plan.

---

## non-batch(docs) — `T-FONT` odlučen: Arial ostaje · 2026-09-14

**Changed files:** `workflow/projects/growth-cinematic/DECISIONS.md` ·
`workflow/projects/growth-cinematic/ROADMAP.md` · `workflow/STATE.md` · ovaj `LOG.md`

Pavlova odluka u dva koraka, 2026-09-14: prvo „nećemo nikakva plaćena pisma", pa posle stranice za
poređenje — privatni artifact sa pravim hero-om, poglavljem `$0` i sekcijom „How it works" u Arial,
Archivo, Barlow i Oswald + Inter, uz proveru da je svako pismo stvarno učitano — „od svih ovih arial
mi se najviše sviđa".

**Posledica:** `T1` više ne čeka odluku i menja sadržaj — nema novog pisma, licence ni preuzimanja.
Ostaje ono što je Pavle stvarno opisao („tekst me ne vodi kroz sajt", hero „ne dolazi do izražaja"):
hijerarhija. Izmereno u `globals.css` pre odluke: 55 različitih veličina slova, 84 `letter-spacing`,
težine 800 i 850 koje Arial prikazuje kao 700, 12 pravila sa obrisom (`D2`), 0 tabularnih cifara.

⚠️ Otvoreno za `/plan T1`: zamensko pismo za Android, koji nema Arial (poznato ponašanje sistema,
nije izmereno na uređaju).

**NEXT STEP:** `/plan T1` — hijerarhija na Arial-u.

---

## non-batch(release) — `B1` spojen i pušen; ACCEPTANCE 5 zatvoren merenjem na deploy-u · 2026-09-14

**Changed files:** `workflow/projects/growth-cinematic/batches/B1.md` · `workflow/STATE.md` ·
`workflow/projects/growth-cinematic/ROADMAP.md` · ovaj `LOG.md`

`master` `059551e..fb26091` fast-forward, push. Pavlova odluka 2026-09-14 („spoji i pushuj"). Pre
spajanja proveren `origin/master` (`ls-remote` = `059551e`, nepomeren) i da je fast-forward moguć.

**Diskriminator PRE merenja:** na deploy-u pre push-a `/og.png` 200 · `/og.jpg` 404 · `/_headers` 200;
posle push-a `/og.png` **404** · `/og.jpg` **200** · `/_headers` **404** — nov build živ ~26 s posle
push-a (`X-Vercel-Id` `fra1::4m8db-1789342803601-7f9836eda705`).

IZMERENO protiv deploy-a:
```
  / meta                        og:image i twitter:image https://growth-cinematic.vercel.app/og.jpg,
                                1200x630, alt isti · clanak 0x og:image
  /og.jpg                       200 image/jpeg 129047 B · Cache-Control: public, max-age=3600
  /images/hero-01-night*.jpg    Cache-Control: public, max-age=3600 (oba; pre B1 max-age=0)
  /og.png · /_headers           404 · 404
  security zaglavlja            6 istih na /og.jpg i / · X-Robots-Tag: noindex, nofollow
  verify                        nojs PASS 14 · claims PASS 13
  test:rendered                 17/17
  meri se: https://growth-cinematic.vercel.app
```

✅ **Rizik iz plana otpao:** Vercel poštuje `Cache-Control` iz `headers()` i za statične fajlove iz
`public/` — bez `vercel.json`. `B1` ACCEPTANCE 5 zatvoren.

⚠️ Sitno, alat: Git Bash je labelu `-w '/og.jpg …'` u `curl` čekanju preveo u Windows putanju. Merenje
nije pogođeno — diskriminator je meren zasebnim zahtevima, ispisanim iznad.

⚠️ Ovaj release commit nosi samo dokumente, pa se deploy posle njegovog push-a po sadržaju ne može
razlikovati; merenje iznad je nad deploy-om `fb26091`.

**NEXT STEP:** nije odlučeno — preporuka u `STATE`-u (`V1` + pravni tekstovi advokatu; `T-FONT`; `U3`
čeka potvrdu o broju). Otvoreno pitanje za Pavla: okvirni datum prelaska.

---

## B1 (STRICT) — social slika 1,53 MB → 129 KB, keš slika u `next.config.ts`, `_headers` napolje · 2026-09-13

**Implementacija:** `7a3f083` · **Grana:** `b1-social-slika-kes` — **nije spojena**, release je Pavlova odluka

**Changed files:** `public/og.jpg` (nov) · `public/og.png` (obrisan) · `public/_headers` (obrisan) ·
`lib/seo.js` (LOCK, 1 red) · `next.config.ts` · `__tests__/seo.test.js` ·
`workflow/projects/growth-cinematic/batches/B1.md` (nov) · `workflow/projects/growth-cinematic/ROADMAP.md` ·
`workflow/projects/growth-cinematic/CONTEXT.md` · `workflow/STATE.md` · ovaj `LOG.md`

⚠️ **Tier ispravljen pri planiranju, LEAN → STRICT:** kriterijum iz audita („dimenzije u
`lib/seo.js:8` usklađene") dira LOCK zonu, a audit i `ROADMAP` su `B1` vodili kao LEAN.

**Izmereno pre rada, na deploy-u:** `og.png` 1.528.568 B uz `Cache-Control: public, max-age=0,
must-revalidate`, isto na hero slikama; **`/_headers` → 200** — Cloudflare fajl koji na Vercelu ništa
ne radi, a javno se servira. Njegova namera (`max-age=3600` za `/images/*` i social sliku) prešla je u
`next.config.ts`; pravilo `/assets/*` nije preneto, jer folder ne postoji.

⚠️ **Zamka alata uhvaćena u probi, pre implementacije:** `sharp` sa `mozjpeg: true` **tiho gazi
`progressive: false`** — isti bajtovi, SOF `0xc2`. Isporučen je baseline bez preseta (q90, 4:4:4,
trellis + deringing + tabela 3): 129.047 B, SOF `0xc0`, sha256 `e0629934…f3f54`, determinističan.

IZMERENO (`/close`, na kodu identičnom `7a3f083`):
```
  quick / typecheck / full      exit 0 · full 20/20 staticnih stranica
  test                          140/140 u 11 fajlova (bilo 139)
  verify                        nojs PASS 14 · claims PASS 13
  rendered                      17/17
  / meta                        og:image i twitter:image /og.jpg, 1200x630, alt isti · clanak 0x og:image
  /og.jpg                       200 image/jpeg 129047 B · Cache-Control: public, max-age=3600
  /images/hero-01-night*.jpg    Cache-Control: public, max-age=3600 (oba)
  /og.png · /_headers           404 · 404
  security zaglavlja            6 istih na /og.jpg i / · X-Robots-Tag: noindex, nofollow
  meri se: http://localhost:3000 (next start PID 19856, pokrenut posle BUILD_ID)
```

`RULES §6` — nova provera dokazano crvena, **jedan prekršaj po pokretanju**, svaki vraćen (sha256 `OK`):
```
  F1  width 1201       AssertionError: dimenzije public/og.jpg se ne slazu sa SOCIAL_IMAGE:
                       expected { width: 1200, height: 630 } to deeply equal { width: 1201, height: 630 }
  F2  og.jpg uklonjen  AssertionError: public/og.jpg ne postoji: expected false to be true
  F3  q100 624304 B    AssertionError: public/og.jpg ima 624304 B, a limit je 150000:
                       expected 624304 to be less than or equal to 150000
  svako pokretanje: 1 failed | 3 passed · posle vracanja 4/4
```

✅ **`manual` PASS (Pavle)** — stara `og.png` sa deploy-a i nova `og.jpg` sa localhost-a, u pravom browseru.

**SCOPE_DRIFT: none** — 11 putanja, tačno EXPECTED-FILES. Van gita: `.claude/launch.json` dobio
konfiguraciju `growth-cinematic-start` za `npm start` (isključen preko `.git/info/exclude`).
Nezavisni review nije tražen: mala reverzibilna izmena bez claims, legal i security promene; LOCK zona
dirnuta jednim redom.

⏳ **ACCEPTANCE 5 ostaje otvoren do release-a:** keš zaglavlja na Vercelu se dokazuju samo na
deploy-u. Ako tamo ne piše `max-age=3600` → STOP, bez `vercel.json` zaobilaska.

**NEXT STEP:** release `B1` (Pavlova odluka) — na deploy-u prvo diskriminator (`/og.png` 404,
`/og.jpg` 200), pa ACCEPTANCE 3 i 4, `verify` i `rendered` sa `VERIFY_BASE`, meta ispisana. Posle
toga preporuka iz `STATE`-a.

---

## non-batch(docs) — `K1` i `U1` manifesti: zaostao `Status: OPEN` uklonjen · 2026-09-13

**Changed files:** `workflow/projects/growth-cinematic/batches/K1.md` ·
`workflow/projects/growth-cinematic/batches/U1.md` · ovaj `LOG.md`

Nalaz `/kickoff`-a 2026-09-13, Pavlova odluka („ispravi k1 i u1"). Oba manifesta su ispod
`Status: CLOSED (<sha>)` nosila i drugi red `Status: OPEN`, a šablon (`batches/README.md`) ima
jedno polje. Uz aktivan batch NONE to je drift po `/audit` pravilu — ne sme postojati OPEN manifest.
**Bloker nije bio:** SHA u CLOSED redu, `ROADMAP` → `Zatvoreno` i spojene grane držali su stanje
jednoznačnim, a `/plan` i `/execute` po svom `SKILL.md` ne proveravaju status postojećih manifesta.
Obrisan je samo zaostali red; scope i ostatak oba manifesta netaknuti.

**Kako je nastao:** oba manifesta su prvi put commitovana tek u close commitu, i već tada sa oba
reda (`6fd1ad2`, `d5d3ce5`) — CLOSED je dopisan iznad umesto da zameni OPEN. `M7` i `R1`, zatvoreni
pre i posle njih, imaju jedno polje.

IZMERENO (ista provera pre i posle):
```
  "^- **Status:**" po fajlu u batches/   K1 2 -> 1 · U1 2 -> 1 · ostali (7 manifesta + README) 1 -> 1
  "^- **Status:** OPEN"                  K1:7, U1:7, README:30  ->  samo README:30 (sablon, ne manifest)
  git diff --stat (manifesti)            2 fajla, 2 brisanja, 0 dodavanja
  quick                                  exit 0
```

**NEXT STEP:** nepromenjen — izbor sledećeg batch-a (`STATE`).

---

## non-batch(release) — `R1` spojen i pušen; predaja novoj sesiji · 2026-09-13

**Changed files:** `workflow/projects/growth-cinematic/batches/R1.md` · `workflow/STATE.md` ·
`workflow/projects/growth-cinematic/ROADMAP.md` · ovaj `LOG.md`

`master` `a55e0be..9d22b05` fast-forward, push. Pavlova odluka 2026-09-13 („Spoji i pushuj").

⚠️ **Bez diskriminatora novog builda** — push nosi samo dokumente, pa je serviran sadržaj isti.
Izmereno zdravlje deploy-a posle push-a: `verify:nojs` PASS 14 · `verify:claims` PASS 13 ·
`test:rendered` 17/17 · `meri se: https://growth-cinematic.vercel.app` · `noindex` drži.

**Dve Pavlove odluke iz iste poruke, upisane za novu sesiju:**
- **Stari sajt (MAIN) uskoro ide offline.** Do prelaska je i dalje živ i ne dira se.
- **Nalaz iz `R1` (prijave sa dva sajta se u inbox-u ne razlikuju) je nebitan** — ne radi se.
  ⚠️ To se NE proteže na `C52`: pravna izloženost na živom sajtu ostaje otvorena dok MAIN radi.

**NEXT STEP:** nova sesija počinje sa `/kickoff`. Redosled posle `R1` nije odlučen — preporuka u
`STATE`-u: `V1` + pravni tekstovi advokatu; za dizajn prvo `T-FONT`.

---

## R1 (STRICT) — Resend: lanac forma → baza → inbox dokazan merenjem · 2026-09-13

**Changed files:** `workflow/projects/growth-cinematic/batches/R1.md` (nov) ·
`workflow/projects/growth-cinematic/DECISIONS.md` · `workflow/projects/growth-cinematic/CONTEXT.md` ·
`workflow/projects/growth-cinematic/ROADMAP.md` · `workflow/STATE.md` · ovaj `LOG.md`

**Nijedan fajl koda.** `lib/email.js` je već slao čim postoje `RESEND_API_KEY` i
`LEAD_NOTIFICATION_EMAIL`; Pavle ih je postavio u Vercel (nov ključ, stari sajt netaknut) i uradio
redeploy. Redosled rada preokrenut Pavlovom odlukom 2026-09-12 posle razgovora o auditima: `R1` više
nije „poslednji jer je najlakši" — bio je **jedina nedokazana karika**, a nepoznato je rizik, ne rad.

IZMERENO:
```
  POST /api/apply (deploy)   503 pre R1  ->  200     (mrezni zahtev, ne poruka na ekranu)
  mejl u inbox-u              stigao — Pavle, snimak ekrana, sa TCPA zapisom pristanka
  verify:nojs / claims        PASS 14 / 13 — protiv deploy-a koji nosi kljuc
  test:rendered               17/17 — protiv deploy-a
  quick / typecheck / full    exit 0 · test 139/139 u 11 fajlova
  meri se: https://growth-cinematic.vercel.app
```
Kapije nisu poslale nijedan mejl: jedini `POST` u testovima je cross-origin, proxy ga odbija pre isporuke.

⚠️ **200 dokazuje prihvatanje, ne dolazak.** Ruta posle slanja upisuje red uvek, pa ni 200 ni red
u bazi ne dokazuju da je mejl stigao — to je izmerio samo Pavlov inbox. Zato je `manual` bio kapija,
ne formalnost.

⚠️ **Vercel konektor ne vidi ovaj projekat** (`list_teams` → `[]`): vezan je za nalog koji ne drži
`growth-cinematic`. Promenljive se zato dokazuju ponašanjem deploy-a, ne čitanjem konfiguracije.

⚠️ **NALAZ: prijave sa starog i novog sajta se u inbox-u ne razlikuju** — isti pošiljalac, isti
inbox, identičan naslov (`C:/dev/growth/app/api/apply/route.js:104` = naš `:116`). Popravka je
naslov u `app/api/**` (lock zona), zaseban batch.

**`R1-DOMEN` ZATVOREN:** sandbox sada; domen tek na lansiranju i tek posle DKIM-a (`_dmarc` je
`p=quarantine`). **`LEAD_FROM_EMAIL` namerno nije postavljen.**

Test red ostaje u produkcijskoj bazi (`TEST verifikacija R1`, `555-010-0199`, `test@example.com`).

**SCOPE_DRIFT: none.** Nezavisni review nije tražen — nema diffa koda.

**NEXT STEP:** preostali lanac lansiranja — `V1` (selidba sa Hobby naloga) i pravni tekstovi
advokatu; za dizajn se prvo čeka odluka `T-FONT`. Plus zaseban mali batch za naslov mejla.

---

## non-batch(release) — `K1` spojen i pušen; izmereno protiv deploy-a · 2026-09-12

**Changed files:** `workflow/projects/growth-cinematic/batches/K1.md` · `workflow/STATE.md` ·
ovaj `LOG.md`

`master` `2aebd07..d5d3ce5` fast-forward, push, Vercel deploy automatski. Nosi `K1` (`eb2d6d5`,
`d5d3ce5`). Pavlova odluka 2026-09-12 („Spoji i push pa da diskutujemo").

⚠️ **Treći batch zaredom sa drugačijim diskriminatorom, i to je poenta.** `M2b` je mogao census,
`U1` sidra, a `K1` menja **samo CSS** — pa se nov build dokazuje time što su tri obrisane mrtve
klase nestale iz serviranog CSS-a:
```
  contact-h2      stari deploy 1  ->  nov 0
  contact-sub                     ->      0
  home-noscript                   ->      0
  faq-q (kontrola)                ->      1   (fajl nije prazan, samo je nov)
```

IZMERENO PROTIV DEPLOY-a, sa ispisanom metom (`RULES §6`):
```
  verify:nojs     PASS 14 ruta
  verify:claims   PASS 13 ruta
  test:rendered   17/17 · G1/C census 0/4/9/9 zelen
  meri se: https://growth-cinematic.vercel.app
```
Deploy `fra1::95bwg-1789225113541-27392b58b782`, `noindex` drži.

**NEXT STEP:** `U2` (naslovna: redosled poverenja) kroz `/plan` — više ne čeka `K1`. `T1` čeka
`T-FONT`.

---

## K1 (STANDARD) — `globals.css`: merenje oborilo plan, isporučen smanjen obim · 2026-09-12

**Changed files:** `app/globals.css` · `__tests__/globals-css.test.js` (nov) ·
`workflow/projects/growth-cinematic/batches/K1.md` (nov) · `.../CONTEXT.md` · `.../ROADMAP.md` ·
`.../LESSONS.md` · `workflow/STATE.md` · ovaj `LOG.md`

Implementacija `eb2d6d5`, close commit ispod. Batch je krenuo po nalazu audita `L-10` da fajl
svede na „jedna deklaracija po selektoru" i **merenjem je oboren pre implementacije**. Pavlu je
prijavljen STOP; Pavle je izabrao „zatvori `K1` malo".

**INSTRUMENT NAPRAVLJEN I DOKAZAN PRE UPOTREBE** (u scratchpad-u, van repoa — traži lokalni
Chrome i gitignore-ovan `work/`):
```
  obuhvat      64 stanja stranice (14 ruta x 4 sirine + 8 sa pokretom)
               9.521 element x 57 svojstava
  determinizam dva pokretanja istog CSS-a -> isti sha256 (7fbb55a0)
  osetljivost  promena od 1px -> 167 izmenjenih elemenata, i visina stranice 3797.75 -> 3801.75
  vracanje     povratak fajla -> povratak na isti bazni hash
```

**ŠTA JE MERENJE POKAZALO** — tri pokušaja spajanja, tri regresije koje nijedna kapija ne vidi:
```
  1) 68 klastera na poslednju poziciju   6280 elemenata  nav-links display:none -> flex
                                                         (mobilni meni se otvorio)
  2) + "nema istog selektora izmedju"     144 elementa   .btn ispred .btn-ghost, providan
                                                         border pojeo boju ivice
  3) + izuzet .btn                        108 elemenata  .post-body p{margin:0} ispred
                                                         .post-cta p{margin:0 0 16px}
  4) dokazivo siguran uslov                 1 od 109 klastera spojivo
```
Uslov 4: spajanje je sigurno samo ako **nijedno pravilo između prve i poslednje pojave ne dira
isto svojstvo**. Provereno i sa labavijim poređenjem (tačna imena umesto porodica) — i dalje 1.
⚠️ **Redosled u `globals.css` je sadržaj, ne nered.** Pouka: `LESSONS` **L26**.

**ISPORUČENO:** spojen `[data-line]::before`; obrisane tri mrtve klase (`contact-h2`,
`contact-sub`, `home-noscript`), s tim da je `.contact-sub` iz deljenog pravila **skraćen, ne
obrisan sa ostalima** (`LESSONS` L4); nova kapija `__tests__/globals-css.test.js`.

VERIFICATION (konačno stablo, port provereno slobodan):
```
  npm run lint / typecheck / build   exit 0
  npm test                           exit 0   139/139 u 11 fajlova (bilo 137/10)
  npm run verify                     exit 0   nojs 14 · claims 13
  npm run test:rendered              exit 0   17/17 · census 0/4/9/9 nepromenjen
  meri se: http://localhost:3000
  snimak computed style-a            IDENTICAN baznom (7fbb55a0) — 0 pomerenih elemenata
```

**FALSIFIKACIJA NOVE KAPIJE — dva crvena pokretanja, po jedan prekršaj:**
```
  K1/A  cetvrta pojava vec duplikovanog .foot-tag   142 !== 141
  K1/B  .k1-mrtva-proba bez ijednog korisnika       ['k1-mrtva-proba'] !== []
```
⚠️ **Prva verzija `K1/A` NIJE MOGLA DA POCRVENI** — brojala je selektore sa preklapanjem, pa
dodatna pojava već duplikovanog selektora ništa ne menja. Falsifikacija je to otkrila; mera je
promenjena na **broj suvišnih deklaracija**. Bez tog koraka kapija bi bila zelena zauvek.
⚠️ I `K1/B` je prvo bio pokvaren: prijavio je `subpage--article`/`subpage--form` kao mrtve, iako
ih `PageShell.tsx:11` sklapa u runtime-u. Popravljena **provera**, ne CSS (`LESSONS` L18).

⚠️ **`manual` stoji kao NIJE POKRENUTO, ne kao PASS.** Kriterijum je bio „Pavle ne vidi razliku na
4 širine"; snimak je dokazao bajt-identičan computed style na 9.521 elementu, što je jači dokaz,
pa je Pavle zatvorio bez ručnog prolaza.

**SCOPE_DRIFT: none** — 8 putanja, sve iz EXPECTED-FILES (2 u implementaciji, 6 u close-u).

**NEXT STEP:** release je Pavlova odluka. Zatim `U2` (naslovna: redosled poverenja) — više ne
čeka `K1`. `T1` i dalje čeka `T-FONT`.

---

## non-batch(release) — `U1` spojen i pušen; izmereno protiv deploy-a · 2026-09-12

**Changed files:** `workflow/projects/growth-cinematic/batches/U1.md` · `workflow/STATE.md` ·
ovaj `LOG.md`

`master` `819dd63..6fd1ad2` fast-forward, push, Vercel deploy automatski. Nosi `U1` (`2df7aa3`,
`6fd1ad2`). Pavlova odluka 2026-09-12 („nema pravih gresaka, spoji i push").

⚠️ **Prva provera posle push-a pokazala je STARI build** — nula sidara i tri `h2` na `/faq`.
Merenje je sačekalo nov, potvrđen diskriminatorom koji stari deploy nema:
```
  sidra pitanja na /faq    0  ->  8    (pay, violations, home-time, …)
  h2 na /faq               3  ->  11
```

IZMERENO PROTIV DEPLOY-a, sa ispisanom metom (`RULES §6`):
```
  verify:nojs     PASS 14 ruta
  verify:claims   PASS 13 ruta
  test:rendered   17/17 · U1/A–U1/D zeleni · G1/C census 0/4/9/9 zelen
  meri se: https://growth-cinematic.vercel.app
```
Deploy `fra1::5w2rf-1789220217273-c6bde6c05370`, `X-Robots-Tag: noindex, nofollow` drži.

⚠️ **Konzolne greške koje je Pavle video pre ovoga nisu bile defekt.** Posle `/close`-a sam ugasio
dev server dok je njegov tab ostao otvoren, pa je svaki Next prefetch (`…?_rsc=…`) pao na
`ERR_CONNECTION_REFUSED`. Server vraćen, isti zahtev vratio 200. Ne dira kod.

**NEXT STEP:** `K1` (`globals.css` bez preklapanja pravila, bez namerne vizuelne promene) kroz
`/plan`.

---

## U1 (STANDARD) — FAQ struktura: pitanja postaju naslovi sa sidrima · 2026-09-12

**Changed files:** `components/Accordion.tsx` · `components/FaqDeepLink.tsx` (nov) ·
`app/faq/page.tsx` · `components/CinematicHome.tsx` · `app/apply/page.tsx` · `app/globals.css` ·
`tests/rendered-html.test.mjs` · `workflow/projects/growth-cinematic/batches/U1.md` (nov) ·
`workflow/projects/growth-cinematic/CONTEXT.md` · `.../ROADMAP.md` · `.../LESSONS.md` ·
`workflow/STATE.md` · ovaj `LOG.md`

Implementacija `2df7aa3`, close commit ispod njega. Nalazi audita `L-06` i `IA-04`: osam pitanja
na `/faq` bilo je `<summary>` **bez ijednog naslova** — stranica je imala `h1` i tri `h2`, sva tri
iz futera — a stabilni `id`-jevi iz `lib/faq.js` nisu stizali u DOM.

IZMERENO, PRE → POSLE:
```
  /faq naslovi        h1 + 3 h2   ->  h1 + 11 h2  (8 pitanja + 3 futer)
  /faq sidra          0           ->  8           (pay, start, violations, trucks,
                                                   grads, states, different, home-time)
  naslovna            bez naslova ->  4 nova h3 ispod postojeceg <h2 id="faq-heading">
  FAQPage JSON-LD     4d28222a…   ->  4d28222a…   (bajt za bajt isto)
  test:rendered       13/13       ->  17/17
```

VERIFICATION (konačno stablo, port provereno slobodan):
```
  npm run lint           exit 0
  npm run typecheck      exit 0
  npm test               exit 0   137/137 u 10 fajlova (nepromenjeno)
  npm run build          exit 0
  npm run verify         exit 0   nojs 14 ruta · claims 13 ruta
  npm run test:rendered  exit 0   17/17 · G1/C census 0/4/9/9 nepromenjen
  meri se: http://localhost:3000
```

**FALSIFIKACIJA — četiri crvena pokretanja, svako sa svojim buildom i TAČNO JEDNIM palim blokom:**
```
  A  /faq renderuje pitanja kao h3        U1/A crven
  B  prvo pitanje ostaje bez sidra        U1/B crven
  C  naslovna dobija h2 umesto h3         U1/C crven
  D  schema pita `item.q + " (test)"`     U1/D crven
```
⚠️ **Vraćanje dokazano sha256 poklapanjem, ne čistim `git status`-om** — implementacija tada nije
bila commitovana, pa je stablo prljavo po dizajnu. Drugi put zaredom (`M7`) → `LESSONS` **L25**,
uz predlog da se `RULES §6` dopuni zasebnim non-batch commitom.

⚠️ **DVA ODSTUPANJA OD ODOBRENOG UGOVORA, prijavljena pre commita.**
**(1) Tri tvrdnje → četiri.** `U1/B` je prvo imao dva `assert`-a u istom bloku (sidra + schema);
drugi se tako ne može dokazati crvenim jer prvi prekida blok (`LESSONS` L19) — a to je baš
tvrdnja zbog koje test postoji. Razdvojeno na `U1/B` i `U1/D`.
**(2) Provera je bila pokvarena, ne kod.** `U1/B` je prijavio da sidara nema iako ih je osam bilo
u serviranom HTML-u: regex sklopljen u template literalu izgubio je nivo escape-ovanja, pa je
`\b` postao znak backspace a `\s` slovo `s`. Zamenjen parserom bez regexa → `LESSONS` **L24**.

**Usput popravljena kapija koja je lagala imenom.** Test `FAQ schema matches visible questions` je
do sada proveravao samo da reč `FAQPage` postoji u HTML-u; vidljiva pitanja nije pogledao nikad
(`LESSONS` L20). `U1/D` to ime čini istinitim — schema i vidljiva pitanja se stvarno porede.

**`manual`:** Pavle, 2026-09-12, dev server u njegovom browseru (ne Claude panel, `LESSONS` L7) —
„ok close". Tipografija izmerena `getComputedStyle`-om pre predaje: `summary` i `h2` u njemu nose
**18px/700 na 1280** i **17px/700 na 375**, margin `0` — identično pre i posle.

**SCOPE_DRIFT: none** — 13 putanja, sve iz EXPECTED-FILES (7 u implementaciji, 6 u close-u).
Nezavisni review nije tražen: mala reverzibilna izmena bez claims, legal, security i lock-zone
površine (`OPERATING`).

**NEXT STEP:** release je Pavlova odluka — merenje protiv deploy-a zatvara `verify`/`rendered`
na živom sajtu. Zatim `K1` (`globals.css` bez preklapanja pravila) kroz `/plan`.

---

## non-batch(release) — `M7` spojen i pušen; ACCEPTANCE 6 zatvoren izmereno · 2026-09-12

**Changed files:** `workflow/projects/growth-cinematic/batches/M7.md` · `workflow/STATE.md` ·
ovaj `LOG.md`

`master` `d733178..b60a140` fast-forward, push, Vercel deploy automatski. Nosi `M7` (`0644d8a`,
`b60a140`). Pavlova odluka 2026-09-12 („spoji i push").

⚠️ **Diskriminator nije mogao da bude census, kao kod `M2b`.** `M7` menja samo klijentski JS, a
serverski HTML je isti — svako merenje nad HTML-om prošlo bi i na **starom** deploy-u. Nov build je
zato potvrđen **otiskom minifikovane krive** u chunku koji `/` učitava:
```
  NOV    (n=Math.abs(i))<=.4?1:n>=.6?0:(.6-n)/.19999999999999996    nadjen 1x
  STARI  1.65 (multiplikator stare krive)                           0x
```
`0.6 − 0.4` je pri minifikaciji sklopljeno u `.19999999999999996` — otisak koji se ne može
slučajno pojaviti. Deploy `fra1::gckbk-1789173629359-26381a640da3`, `X-Robots-Tag: noindex,
nofollow` drži.

IZMERENO PROTIV DEPLOY-a, sa ispisanom metom (`RULES §6`):
```
  verify:nojs     PASS 14 ruta
  verify:claims   PASS 13 ruta
  test:rendered   13/13, `G1/A i G1/B mere 14 ruta`, `G1/C` census 0/4/9/9 zelen
  meri se: https://growth-cinematic.vercel.app
```

Time je zatvoren ACCEPTANCE 6 iz `batches/M7.md` — jedini kriterijum koji je na `/close`-u stajao
kao NIJE POKRENUTO.

**NEXT STEP:** `U1` (FAQ struktura i nivoi naslova) kroz `/plan`.

---

## M7 (STANDARD) — hero prelaz: kriva „drži pa predaj" · 2026-09-12

**Changed files:** `lib/hero-beat.ts` (nov) · `components/HeroExperience.tsx` ·
`__tests__/lib/hero-beat.test.js` (nov) · `workflow/projects/growth-cinematic/batches/M7.md` (nov) ·
`workflow/projects/growth-cinematic/CONTEXT.md` · `workflow/projects/growth-cinematic/ROADMAP.md` ·
`workflow/projects/growth-cinematic/LESSONS.md` · `workflow/STATE.md` · ovaj `LOG.md`

Implementacija `0644d8a`, close commit ispod njega. Nalaz audita `L-03`: `HeroExperience.tsx:119`
je nosio `1 − abs(d) · 1.65`, pa je poglavlje bilo potpuno vidljivo **samo u jednoj tački**, na
sredini između dva poglavlja oba su bila na `0,175`, a na **39% skrola** nijedno nije bilo ni do
pola vidljivo. Kriva je izdvojena u `lib/hero-beat.ts` (čista funkcija `beatOpacity`) i zamenjena:
puna vidljivost do `abs(d) ≤ 0,4`, linearno predavanje do `0,6`, nula dalje.

VERIFICATION (sve na konačnom stablu, port proveren pre merenja):
```
  npm run lint           exit 0
  npm run typecheck      exit 0
  npm test               exit 0   137/137 u 10 fajlova (bilo 132 u 9)
  npm run build          exit 0
  npm run verify         exit 0   nojs 14 ruta · claims 13 ruta
  npm run test:rendered  exit 0   13/13 · G1/C census 0/4/9/9 nepromenjen
  meri se: http://localhost:3000
```

Izmereno nad krivom (10000 uzoraka, `--reporter=verbose`, jer podrazumevani reporter ne ispisuje
`console.log`):
```
  min zbir dva najbliža    0,35 -> 1,0000   (prag >= 0,9)
  puno poglavlje           0%   -> 80,00%   (prag >= 75%)
  dvostruka ekspozicija           12,00%    (prag <= 20%)
  sused kad je centriran          0         (prag <= 0,05)
```

**FALSIFIKACIJA — tri crvena pokretanja pre priznanja kapije** (`RULES §6`). Četiri uslova su u
četiri `it` bloka, pa se vidi tačno koji pada (`LESSONS` L19); pre svakog merenja ispisana je
ubačena izmena, da `sed` ne promaši tiho (`LESSONS` L18):
```
  A  stara kriva 1 - 1.65*abs(d)    uslov 1 crven (0,35) · uslov 2 crven (0%)   · uslov 5 crven
  B  HOLD 0.2 / HANDOFF 0.8         uslov 2 crven (40%)  · uslov 3 crven (36%)
  C  HOLD 0.4 / HANDOFF 1.2         uslov 3 crven (100%) · uslov 4 crven (0,25) · uslov 5 crven
```
Pokretanje A reprodukuje baš nalaz `L-03`. ⚠️ **Vraćanje je dokazano sha256 poklapanjem**
(`699c5be0…f230a18`), **ne čistim `git status`-om** — modul je tada bio untracked, pa git nije
mogao da bude dokaz.

⚠️ **ACCEPTANCE 5 nije mogao da se izmeri onako kako je plan rekao.** Next 16.3.4 **ne ispisuje**
First Load JS, pa je merenje prebačeno na artefakt: skripte koje `/` stvarno učitava, iz
prerenderovanog `.next/server/app/index.html`. A/B preko iste radne kopije (samo
`HeroExperience.tsx` vraćen na `master` verziju): **602.233 B → 602.266 B, +33 B**; chunk sa
three.js (480 KB) nije među njima. Zamena je **jača** od originalnog praga → `LESSONS` **L23**.

**`manual`:** Pavle, 2026-09-12, dev server u njegovom browseru (ne Claude panel, `LESSONS` L7) —
„okej moze close". Klizanje teksta **±14 px** dok je poglavlje na punoj vidljivosti (ukupan hod
28 px; staro ±10,6 px na ≥0,5 vidljivosti) stavljeno pred njega **pre** pregleda po pravilu
`LESSONS` L22 i prihvaćeno kako jeste.

**SCOPE_DRIFT: none** — 9 putanja, sve iz EXPECTED-FILES (3 u implementaciji, 6 u close-u).
Nezavisni review nije tražen: mala reverzibilna izmena bez claims, legal, security i lock-zone
površine (`OPERATING`).
⚠️ **Prva verzija ove scope provere bila je pokvarena** — `sed` opseg je stao na otvarajućoj
ogradi code bloka, pa je spisak EXPECTED-FILES izašao prazan i provera je „našla" svih devet
fajlova van scope-a. Popravljena i ponovljena: **9 = 9**, tačno poklapanje. `LESSONS` L18 ponovo,
bez novog unosa.

**NEXT STEP:** release je Pavlova odluka — merenje `verify`/`rendered` protiv deploy-a zatvara
ACCEPTANCE 6. Zatim `U1` (FAQ struktura) kroz `/plan`.

---

## non-batch(release) — `M2b` spojen i pušen; ACCEPTANCE 4 zatvoren izmereno · 2026-09-11

**Changed files:** `workflow/projects/growth-cinematic/batches/M2b.md` · `workflow/STATE.md` ·
`workflow/projects/growth-cinematic/ROADMAP.md` · `docs/AUDIT-2026-09.md` · ovaj `LOG.md`

`master` `697b787..8d788bf` fast-forward, push, Vercel deploy automatski. Nosi `M2b` (`d125e5f`,
`ddd12cc`) i zapis audita (`8d788bf`). Pavlova odluka 2026-09-11 („Commit + release").

⚠️ **Nov build potvrđen PRE merenja**, diskriminatorom koji stari nema: census naslovne na
deploy-u `0/4/9/9` (stari `6/4/3/3`), prvi pokušaj posle push-a. Deploy
`fra1::mtlfd-1789135104849-7beef7dccd6b`, `noindex` drži.

IZMERENO PROTIV DEPLOY-a, sa ispisanom metom (`RULES §6`):
  verify:nojs     PASS 14 ruta
  verify:claims   PASS 13 ruta
  test:rendered   13/13, `G1/A i G1/B mere 14 ruta`, `G1/C` census zelen
  meri se: https://growth-cinematic.vercel.app

**`L-20` iz audita je povučen kao greška merenja.** Audit je na deploy-u gađao
`/_next/static/chunks/10x60x6vt5hvz.css` — ime iz **lokalnog** builda, koje deploy ne koristi.
Deploy servira heširane assete pod `/_next/static/immutable/chunks/`, sa `immutable`:
```
  /_next/static/immutable/chunks/062vycfdv0dq9.css | HTTP 200 | Cache-Control: public,max-age=31536000,immutable
  /_next/static/immutable/chunks/0c0hxoamwjsbw.js | HTTP 200 | Cache-Control: public,max-age=31536000,immutable
  /_next/static/immutable/chunks/1amzvk42j9ro8.js | HTTP 200 | Cache-Control: public,max-age=31536000,immutable
```
⚠️ **I prvo ponovljeno merenje u ovoj sesiji je bilo nevažeće** — regex nije našao putanju asseta,
pa je `curl` gađao naslovnu (`max-age=0` je zaglavlje stranice). Ponovljeno sa zaštitom od
prazne putanje; gore je važeće merenje. Ista klasa greške kao `LESSONS` L18: pogrešna meta daje
uverljiv, a netačan rezultat.

Time je zatvoren ACCEPTANCE 4 iz `batches/M2b.md` — jedini kriterijum koji je na `/close`-u stajao
kao NIJE POKRENUTO.

**NEXT STEP:** `M7` (hero prelaz) kroz `/plan`.

---

## non-batch — audit 2026-09 zapisan kao radni plan · 2026-09-11

**Changed files:** `docs/AUDIT-2026-09.md` (nov) · `workflow/projects/growth-cinematic/ROADMAP.md` ·
`workflow/projects/growth-cinematic/DECISIONS.md` · `workflow/STATE.md` · ovaj `LOG.md`

Nezavisni audit (2026-09-10, revizija 3 od 2026-09-11; pun izveštaj van repoa, u
`C:/dev/growth-audits/claude-2026-09-10-0300/`) preveden u radni plan po `RULES §1`: nalazi i
redosled u `docs/AUDIT-2026-09.md`, batch-evi kao redovi u `ROADMAP`-u (`M7`, `U1`–`U5`, `K1`,
`T1`, `B1`, `H1`, `G3`), otvorena pitanja kao pet novih OPEN odluka u `DECISIONS`-u.

⚠️ **Audit je bio read-only; ovo je prvi unos koji iz njega piše u repo.** Runtime kod nije dirnut
(`RULES §10`).

⚠️ **`K1` i `T1` su razdvojeni**, iako ih je audit predložio kao jedan batch — `RULES §2`.

⚠️ **Resend ostaje poslednji** — Pavlova odluka, ponovo potvrđena 2026-09-11. Audit ga vodi kao
uslov za lansiranje, ne kao defekt.

**NEXT STEP:** release `M2b` (Pavlova odluka), pa `M7` kroz `/plan`.

---

## M2b (STANDARD) — naslovna na nov rečnik: `CRTA` uvodi, naslov stiže otkrivanjem · 2026-09-09

**Code:** `d125e5f` · **Grana:** `m2b-naslovna-recnik` · **Manifest:** `batches/M2b.md`

**Changed files (3 + workflow):** `components/CinematicHome.tsx`, `app/globals.css`,
`tests/rendered-html.test.mjs`
*(+ `batches/M2b.md`, `LESSONS.md`, `ROADMAP.md`, `STATE.md`, ovaj `LOG.md` na close)*

Šest sekcija (`pay`, `process`, `guard`, `founder`, `faq`, `close`) prelazi sa `data-reveal` na
par `[data-line]` + `[data-wipe]`. **`data-reveal` posle ovoga nema nijednog korisnika na celom
sajtu** — primitiv ostaje u `globals.css` i u `Motion.tsx:76`, mrtav ali živ; brisanje je zasebna
odluka.

### Gate dokaz

| Gate | Exit | Metrika |
|---|---|---|
| `quick` · `typecheck` · `full` | 0 | — |
| `test` | 0 | 132/132 u 9 fajlova |
| `verify` | 0 | `meri se: http://localhost:3000` · nojs 14 · claims 13 |
| `rendered` | 0 | `mere 14 ruta` · 13/13 · census `0/4/9/9` |
| `manual` | **PASS** | Pavle, pravi browser |

⚠️ **ACCEPTANCE 4 stoji kao `NIJE POKRENUTO`** — merenje protiv deploy-a traži push. Zatvara ga
release commit, kao kod `M2`.

### Census falsifikovan PO ATRIBUTU, ne odjednom

`ROADMAP` je unapred rekao da će `M2b` oboriti census i da se broj menja u istom batchu. Ali sva
četiri reda padaju pod **istu** tvrdnju, a `assert` prekida petlju na prvom (`LESSONS` L19) — pa
bi jedno pokretanje sa tri promene dokazalo samo prvu:

```
pokretanje 1   data-reveal   0 !== 6   CRVENO
pokretanje 2   data-wipe     9 !== 3   CRVENO
pokretanje 3   data-line     9 !== 3   CRVENO
pokretanje 4   0/4/9/9                 ZELENO
```

`data-stagger` ostaje 4 i nikad ne pocrveni — tačno, nije dirnut.

### CSS: selektor skraćen, ne obrisan (L4)

`.home-section{border-top}` → `.home-section:not([data-line]){border-top}`. `home-values` nosi
`.home-section` ali je na rečnik prešla drugačije (kroz `<li data-line>`) i `data-line` na sekciji
nema — brisanje bi tiho pojelo **njen** razdelnik. `:not([data-line])` se održava sam.

### Izmereno computed stilom, ne pogledom

| | podloga | linija | `border-top` |
|---|---|---|---|
| `pay` · `process` · `faq` | svetla | `rgb(22,32,25)` | `0px` |
| `guard` · `founder` · `close` | `rgb(8,17,13)` | `rgb(241,231,213)` | `0px` |
| `values` (bez `data-line`) | — | — | **`1px rgba(22,32,25,.2)` ostao** |

`currentColor` sam okreće polaritet, pa L8 zamka ne puca **po konstrukciji**. Raspored po tagu:
`data-line` = `section` 6 + `li` 3; `data-wipe` = `h2` 6 + `h3` 3.

⚠️ **Nalaz koji nijedna kapija ne vidi, predat Pavlu pre odluke:** primitiv ide na `opacity:.4`,
stara ivica je bila `.2` — linija je na svetlim sekcijama **dvostruko jača**. Prihvaćeno kako
jeste. **`LESSONS` L22.**

**SCOPE_DRIFT:** none — 5 od 8 EXPECTED-FILES u implementaciji, ostalo u close commitu.
`LESSONS.md` je ovog puta **bio** u spisku; `M2` ga je izostavio i pouka je morala da čeka
zaseban commit.

**NEXT:** release odluka (zatvara ACCEPTANCE 4), pa `M2c` — brojke stižu pre sadržaja.

---

## non-batch(release) — `M2` spojen i pušen; pregled našao netačnu tvrdnju · 2026-09-09

**Code:** `a362c20` · `master` `bb8c407..a362c20` fast-forward, push, Vercel deploy automatski.
Pavlova odluka: *„pregledaj detaljno šta je odrađeno, ako nađeš rupe popravi pa spoji i pushuj."*

### Pregled posle `/close`-a — jedna stvarna rupa

`components/PageShell.tsx` je u komentaru tvrdio da shell renderuje i `app/error.tsx`.
**Ne renderuje** — `error.tsx` namerno ne koristi shell. Izvor greške: `grep -rl "PageShell" app/`
uhvatio je rečenicu *„⚠️ NAMERNO BEZ `PageShell`-a"* **iz komentara**.

⚠️ Tvrdnja je prošla `/plan`, `/execute` i `/close` i ušla u `1a3bca5` — **iako je isti batch
izmerio census koji je demantuje** (13 × 1 + `/` × 3 = 16, bez `error.tsx`). Dokaz je postojao i
nije pročitan kao dokaz. Ispravljeno u `a362c20`; izmena je isključivo unutar `{/* */}` bloka.

Provereno i **nije** rupa: `docs/STATUS.md` — od postavljanja workflow-a (`89a2235`) nijedan close
ga ne dira, pa ni `M2`. Tvrdnja „pre `M2` 13 praznih ruta" — potvrđena na `bb8c407`, nijedan
`data-wipe` u markupu van `CinematicHome`.

### ACCEPTANCE 2 zatvoren — izmereno protiv deploy-a

```
meri se: https://growth-cinematic.vercel.app
verify:nojs      PASS 14 ruta
verify:claims    PASS 13 ruta
test:rendered    13/13, `mere 14 ruta`
x-vercel-id      fra1::b9hgg-1788974128458-1b4a34dc4c7e
x-robots-tag     noindex, nofollow  (drži)
census           16 data-wipe na 14 ruta, praznih ruta 0
```

Novi build potvrđen **pre** merenja diskriminatorom koji stari nema — `<h1 data-wipe>` na
`/about`. Bez toga bi merenje moglo proći na starom deploy-u i prijaviti PASS ni na čemu.

⚠️ **Za razliku od `G1` i `G2`, `M2` JESTE dirnuo runtime kod**, pa ovo merenje dokazuje i nov
deploy, ne samo da kapija drži.

**LESSONS +2:** `L20` (zelena kapija ume da bude zelena jer nema šta da pregleda),
`L21` (`grep -l` po izvoru broji i komentare).

**NEXT:** `M2b` — naslovna na nov rečnik; namerno će oboriti `G1/C` census.

---

## M2 (STANDARD) — `PageShell` ritam: rečnik pokreta stiže na podstranice · 2026-09-09

**Code:** `1a3bca5` · **Grana:** `m2-pageshell-ritam` · **Manifest:** `batches/M2.md`

**Changed files (2 + workflow):** `components/PageShell.tsx`, `app/how-it-works/page.tsx`
*(+ `batches/M2.md`, `ROADMAP.md`, `STATE.md`, ovaj `LOG.md` na close)*

Tri atributa, dva fajla, **nula CSS-a**: `<h1 data-wipe>` u `PageShell`-u, `data-stagger` na
`.sub-2up` i `.sub-3up` u `/how-it-works`.

### Gate dokaz

| Gate | Exit | Metrika |
|---|---|---|
| `quick` | 0 | — |
| `typecheck` | 0 | — |
| `test` | 0 | 132/132 u 9 fajlova |
| `full` | 0 | 14 ruta + 3 API + 3 SSG članka |
| `verify` | 0 | `meri se: http://localhost:3000` · nojs 14 · claims 13 |
| `rendered` | 0 | `mere 14 ruta` · 13/13, `G1/C` census nepromenjen |
| `manual` | **PASS** | Pavle, pravi browser — otkrivanje s leva, stepenica na obe mreže, `.card--cta` se i dalje lepi |

⚠️ **ACCEPTANCE 2 stoji kao `NIJE POKRENUTO`** — merenje protiv deploy-a traži push, a push je
zasebna release odluka. Isto kao kod `G1` i `G2`; zatvara ga release commit.

⚠️ **Pre merenja provereno koji PID sluša na 3000, i to komandnom linijom, ne imenom procesa**
(`next start`, ne `next dev`). Dev server ugašen, port izmeren prazan, pa tek onda build.

### Nalaz: obuhvat rute nije obuhvat tvrdnje

`G2` je dokazao da `G1/A` i `G1/B` **posećuju** 14 ruta. `M2` je izmerio šta su tamo **nalazile**:

| | pre `M2` | posle `M2` |
|---|---|---|
| `data-wipe` elemenata ukupno | 3 (svi na `/`) | **16** |
| ruta na kojima `G1/A` prolazi **prazna** | **13** | **0** |

Kapija je na 13 od 14 ruta bila zelena zato što **nije imala šta da pregleda**, ne zato što je
nešto potvrdila. To nije bio defekt `G2` — obuhvat je bio tačan — nego posledica toga što
`data-wipe` do danas nije postojao van naslovne. Vredi zapamtiti kao pitanje, ne kao optužbu:
*„koliko elemenata je ova kapija stvarno pregledala?"* je drugo pitanje od *„koliko ruta pokriva?"*.

⚠️ **Ovo nije upisano u `LESSONS`** — `LESSONS.md` nije bio u EXPECTED-FILES ovog batcha i scope
se ne širi tiho (`RULES §5`). Predloženo Pavlu kao zaseban non-batch doc commit.

### L18 u praksi, na sopstvenoj proveri

Prvi `grep` je na `/how-it-works` prijavio **4** `data-stagger` umesto 2 — brojao je i RSC flight
payload (`"data-stagger":true`), koji nije markup. Kapija (`rendered-html.test.mjs`) seče
`<script>` **pre** tokenizacije i zato vidi tačno 2. Kod je bio ispravan; provera nije. Isti
obrazac koji je u `M1` tri puta poslao u pogrešnom smeru.

**SCOPE_DRIFT:** none — 4 od 6 EXPECTED-FILES dirnuto, nijedan fajl van spiska.

**NEXT:** release odluka (spajanje + push + merenje protiv deploy-a, zatvara ACCEPTANCE 2), pa
`M2b` — naslovna na nov rečnik.

---

## G2 (LEAN) — kapija pokriva sve što `PageShell` renderuje · 2026-09-09

**Code:** `d685f78` · **Grana:** `g2-gate-coverage` · **Manifest:** `batches/G2.md`

**Changed files (1 + workflow):** `tests/rendered-html.test.mjs`
*(+ `batches/G2.md`, `ROADMAP.md`, `STATE.md`, `LESSONS.md`, ovaj `LOG.md` na close)*

`G1` je postavljen tako da `M2` ne može da prekrši `data-wipe` ograničenje. **Nezavisan pregled
`M2` plana je izmerio da rupa stoji tačno tamo gde će `M2` pisati:**

| | |
|---|---|
| `<PageShell>` poziva | **11** |
| Renderovanih površina | **13** — 9 podstranica + `/404` + 3 članka |
| `G1/A` i `G1/B` merili | **10** |
| **Negejtovano** | **4** |

`scripts/verify-nojs.mjs` je taj obuhvat imao od početka; `G1` je jedini ostao na užem spisku.
`GATED_ROUTES` = `PAGE_PATHS` + `allPostSlugs()` + `/missing-page` — **izvodi se, ne prekucava**,
pa četvrti članak neće tražiti izmenu kapije. Obuhvat se **ispisuje** (`mere 14 ruta`).

⚠️ **`/missing-page` vraća 404 i to je namerno** — `app/not-found.tsx` renderuje `PageShell` kao
i svaka druga stranica. Zapisano u komentaru da neko kasnije ne „popravi" spisak izbacivanjem 404.

### ⚠️ Falsifikacija je otkrila grešku u sopstvenom postupku

Prva verzija je ubacila **oba** prekršaja odjednom. Kapija je pocrvenela **samo na članku** —
obe rute pokriva ista tvrdnja (`G1/A`), a `assert` prekida petlju na prvom pogotku:

```
✖ /truckers-lounge/new-cdl-graduate-what-training-provided-actually-means:
  <article> nosi data-wipe, a nije listni tekstualni element
```

**`/404` nikad nije ni izmeren.** Da je tu stalo, prijavio bih obuhvat koji nisam dokazao — u
batchu čija je cela svrha nedokazan obuhvat. Razdvojeno i dokazano zasebno:

```
✖ /missing-page: <div> nosi data-wipe, a nije listni tekstualni element
```

Posle `git checkout --` i rebuild-a: **13/13 zeleno**, `app/` diff prazan. → **`LESSONS` L19.**

**VERIFICATION:** `quick` 0 · `full` 0 · `test:rendered` **13/13, 14 ruta** · `typecheck` 0
(van LEAN zahteva) · `test` 132/132 (van LEAN zahteva). `meri se: http://localhost:3000` ispisano
pri svakom merenju; port provereno slobodan pre svakog dizanja servera (`L1`).

✅ **`ACCEPTANCE 2` PASS — izmereno protiv deploy-a posle push-a** (Pavlova release odluka,
2026-09-09). Fast-forward `1ff169b..930c33d`, pa mereno: `test:rendered` **13/13, 14 ruta** ·
`verify:nojs` PASS 14 ruta · `verify:claims` PASS 13 ruta.
`meri se: https://growth-cinematic.vercel.app` ispisano pri svakom merenju. Deploy
`fra1::sw9mp-1788969665750-ebed308755a4`, `noindex` drži.

**SCOPE_DRIFT:** none — podskup EXPECTED-FILES. `LESSONS.md` je bio **uslovan** i **jeste**
aktiviran: falsifikacija je otkrila novu grešku u postupku (L19), ne u kodu.

**NEXT STEP:** `M2` — sada slobodan. Kapija na `master`-u i u deploy-u meri svih 14 ruta, pa
`M2` piše na površinu koja je pokrivena. To je bio ceo razlog da `G2` ide prvi.

---

## non-batch (release) — `G2` spojen i pušen · 2026-09-09

Pavlova release odluka. `master` `1ff169b..930c33d` **fast-forward**, push, Vercel deploy
automatski.

**Izmereno protiv deploy-a:** `test:rendered` **13/13 na 14 ruta** · `verify:nojs` PASS 14 ruta ·
`verify:claims` PASS 13 ruta. `meri se: https://growth-cinematic.vercel.app` ispisano svaki put.
Time je zatvoren `ACCEPTANCE 2` iz `batches/G2.md`.

⚠️ Kao i kod `G1`: `G2` nije dirnuo nijedan runtime fajl, pa merenje ne dokazuje „nov deploy",
nego da kapija drži nad **stvarno serviranim** HTML-om na svih 14 ruta.

Ne dira runtime kod (`RULES §10`).

---

## non-batch (release) — `G1` spojen i pušen · 2026-09-09

Pavlova release odluka. `master` `ddba710..7e73585` **fast-forward**, push na
`github.com/pavlemitrovic01/growth-cinematic`, Vercel deploy automatski.

**Izmereno protiv deploy-a:** `test:rendered` 13/13 · `verify:nojs` PASS 14 ruta ·
`verify:claims` PASS 13 ruta. `meri se: https://growth-cinematic.vercel.app` ispisano svaki put.
Time je zatvoren `ACCEPTANCE 4` iz `batches/G1.md` — jedini kriterijum koji je na `/close`-u
stajao kao `NIJE POKRENUTO`.

Ne dira runtime kod (`RULES §10`). Detalji merenja → `G1` unos ispod.

---

## G1 (LEAN) — `data-wipe` placement kapija + census pokreta · 2026-09-09

**Code:** `3d9b55a` · **Grana:** `g1-wipe-placement-gate` · **Manifest:** `batches/G1.md`

**Changed files (2 + workflow):** `tests/rendered-html.test.mjs` · `workflow/RULES.md`
*(+ `batches/G1.md`, `ROADMAP.md`, `STATE.md`, ovaj `LOG.md` na close)*

Ograničenje „`data-wipe` samo na listne tekstualne elemente" je do sada postojalo na **tri mesta
i sva tri su bila komentar** (`app/globals.css:908`, `docs/MOTION.md:332`, `LESSONS` L17). Sada su
to **tri mašinske tvrdnje**: **A** allowlist listnih tagova (svih 10 ruta), **B** nijedan
`data-line` unutar `data-wipe` (svih 10 ruta), **C** census `6/4/3/3` na `/`.

**Tri odobrena pojačanja preko ROADMAP reda** (Pavle, 2026-09-09): allowlist umesto denyliste —
`<div data-wipe>` oko podstabla je isti defekt, a denylist bi ga pustio; sweep preko svih 10 ruta
iz `lib/routes.js` — kapija koja gleda samo `/` ne bi videla `M2` prekršaj, a to joj je jedina
svrha; i `LESSONS` L17 pravilo 2.

⚠️ **KAPIJA JE DOKAZANO POCRVENELA pre nego što je priznata.** Tri namerna prekršaja, jedan build,
tri crvene tvrdnje (10 pass / 3 fail):

```
✖ A  <section data-reveal="true" data-wipe="true" class="home-guard home-section" …>
     „nosi data-wipe, a nije listni tekstualni element"
✖ B  <span data-line> unutar <h3 data-wipe>
     „Clip guta pseudo-element, pa linija ne moze da vodi"
✖ C  data-reveal  5 !== 6
```

Posle `git checkout --` i rebuild-a: **13/13 zeleno**, `CinematicHome.tsx` netaknut.
**Ovaj postupak je istim batchem upisan u `RULES §6`** kao trajno pravilo — odobrena scope
ekspanzija, zapisana u manifestu sa datumom i razlogom.

⚠️ **Zašto renderovan HTML, a ne grep po izvoru:** `grep -o data-reveal` nad `CinematicHome.tsx`
vraća **7**, a živih atributa ima **6** — sedmi je pomen u komentaru. Isto `data-stagger` (6→4) i
`data-line` (4→3). Provera po izvoru bi lagala na prvom pokretanju.

⚠️ **Nalaz iz merenja:** React renderuje `data-wipe` kao `data-wipe="true"`, ne `=""`. Parser to
hvata po konstrukciji (vrednosti se seku pre poređenja skupova), ali fixture je pretpostavljao
pogrešan oblik — dopisan je stvarni.

**VERIFICATION:** `quick` 0 · `full` 0 · `test:rendered` **13/13** · `typecheck` 0 (van LEAN
zahteva) · `test` 132/132 (van LEAN zahteva). `meri se: http://localhost:3000` ispisano pri svakom
merenju. PID provere pre svakog merenja — server svež, ne zaostao (`L1`).

✅ **`ACCEPTANCE 4` PASS — izmereno protiv deploy-a posle push-a** (Pavlova release odluka,
2026-09-09). Spojeno fast-forward-om `ddba710..7e73585`, pušeno, pa mereno:
`test:rendered` **13/13** · `verify:nojs` PASS 14 ruta · `verify:claims` PASS 13 ruta.
`meri se: https://growth-cinematic.vercel.app` ispisano pri svakom merenju.
Deploy `fra1::jq7tf-1788963748748-000a5b1a7f4b`, `noindex` drži.

⚠️ **Zašto se sadržaj deploy-a nije mogao promeniti:** `G1` nije dirnuo **nijedan** runtime fajl —
samo test i dokumentaciju. Merenje zato ne dokazuje „nov deploy", nego da tri tvrdnje kapije drže
nad **stvarno serviranim** HTML-om, a ne samo nad lokalnim build-om.

**SCOPE_DRIFT:** none — tačno EXPECTED-FILES + odobrena ekspanzija (`workflow/RULES.md`).
`LESSONS.md` je bio naveden kao **uslovan** i **ostao je netaknut**: falsifikacija nije otkrila
ništa što parser već ne rešava, pa nova lekcija nije izmišljena da popuni mesto.

**VAN OBUHVATA, prijavljeno ne prošireno autonomno:** `/truckers-lounge/<slug>` se izvodi iz
`POSTS` i nije u `PAGE_PATHS`, pa A i B ne sweep-uju članke (danas tamo nema motion atributa).
`LESSONS` L17 pravilo 1 traži replikaciju CSS kaskade i ne staje u LEAN.

**NEXT STEP:** `M2` — sekcije, brojke i `PageShell` ritam. Sada gradi na `master`-u koji **ima**
`G1` kapiju, što je i bio razlog da `G1` ide prvi. Census (6/4/3/3) će pasti namerno i ispravlja
se u istom batchu.

---

## M1 (STANDARD) — rečnik pokreta: `OTKRIVANJE` + `CRTA` · 2026-09-09

**Code:** `396d28c` · **Fix:** `30f471d` · **Docs:** `e425557` · **Grana:** `m1-motion-vocabulary`
**Manifest:** `batches/M1.md` — **prvi batch ovog projekta koji je prošao ceo `/plan → /execute →
/close` ciklus.**

**Changed files (6):** `app/globals.css` · `components/Motion.tsx` · `components/CinematicHome.tsx` ·
`docs/MOTION.md` · `batches/M1.md` · `ROADMAP.md` *(+ `STATE.md`, `LESSONS.md`, ovaj `LOG.md` na close)*

Dva primitiva — `[data-wipe]` (OTKRIVANJE, `clip-path`) i `[data-line]` (CRTA, `scaleX` na
`::before`) — uz **jednu dokaznu primenu** na `values`.

⚠️ **Odstupanje od `MOTION.md`, odobreno:** plan je tražio `M1` „bez ijedne primene". Njegov
sopstveni ugovor merenja traži dokaz **polariteta** i **`reduce`**-a; batch bez primene ostavlja
obe kapije prazne. Isti slab dokaz koji je `D4` razotkrio.

⚠️ **Nezavisan dizajn pregled našao je defekt koji je prošao SVE kapije** i koji bih bez njega
merge-ovao. Bazno `[data-wipe]{clip-path:inset(-.3em)}` stajalo je **van obe kapije**, pa je svaki
takav element nosio containing block **trajno** — i bez JS-a, i pod `reduce`. Komentar je pritom
tvrdio „fail-safe po konstrukciji". Popravljeno u `30f471d`; još šest manjih nalaza uz to
(1px regresija, preuska carve-out maska, `+90ms` pečen u primitiv, srpski naziv promenljive u
kodu protiv `RULES §12`). → `LESSONS` L15–L18.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 ·
`verify:nojs` PASS 14 ruta (`/` **6343 znakova, nepromenjeno** — pokret ne dodiruje serverski
HTML) · `verify:claims` PASS 13 ruta · `test:rendered` 9/9 — **lokalno i protiv deploy-a**.
U živom build-u potvrđeno: `clip-path` na `[data-wipe]` postoji **isključivo** iza
`html.js-motion` unutar `no-preference`.

✅ **`manual` PASS (Pavle)** — pogledao u pravom browseru, ne vidi grešku.

**Izmereno protiv deploy-a posle push-a:** `verify:nojs` PASS 14 ruta (`/` 6343, isto kao
lokalno) · `verify:claims` PASS 13 ruta · `test:rendered` 9/9. Na živom CSS-u potvrđeno da
`clip-path` na `[data-wipe]` postoji **isključivo** iza `html.js-motion`, i da nema **nijednog**
pravila van kapije. `noindex` drži. Deploy živ ~30 s posle push-a.

⚠️ **Zamka `L1` uhvaćena uživo, četvrti put:** port je držao server iz `D4` batcha sa build-om od
**pre** ovih izmena. Da PID nije proveren, merio bi se pogrešan build.

**NEXT STEP:** `G1` (LEAN) — pretvoriti ograničenje „`data-wipe` samo na listne elemente" iz
komentara u mašinsku kapiju. Pavlova odluka: zaseban batch, ne proširenje `M1`-a.

---

## non-batch — WORKFLOW postavljen · 2026-09-09

**Changed files:** `workflow/**` (nov) · `docs/STATUS.md` · `docs/STATUS-ARCHIVE.md` (nov)

Postavljen minimalni workflow: `OPERATING.md`, `RULES.md` (12 sekcija, ne MAIN-ovih 18),
`STATE.md`, ovaj `LOG.md`, i projektni ugovor u `workflow/projects/growth-cinematic/`
(`CONTEXT.md` 92/120, `ROADMAP.md`, `DECISIONS.md`, `LESSONS.md`, `batches/`).

`docs/STATUS.md` podeljen **735 → 338** redova; osam sesijskih blokova preseljeno u
`docs/STATUS-ARCHIVE.md` (410 redova, bez cap-a).

**Povod, doslovno:** Pavlovo pitanje *„zašto nam se ovo dešava, da nije zato što radimo bez
workflow-a"*. Izmereno pre odgovora: `C:/dev/growth` ima ceo sistem (`RULES` 18 sekcija, `LOG`
3795 redova, `STATE` 383), a ovaj repo **nijedan takav fajl** — samo `docs/STATUS.md`. Skillovi
`/plan` `/execute` `/close` `/kickoff` `/audit` stajali su neiskorišćeni jer nisu imali šta da
čitaju.

⚠️ **Retroaktivni manifesti NISU napravljeni.** Rad pre danas nema manifest jer workflow tada
nije postojao; fajl koji tvrdi da je Pavle odobrio scope u formatu koji nije postojao je
**izmišljen zapis, ne evidencija** (`OPERATING.md`).

**NEXT STEP:** `M1` — rečnik pokreta, kroz `/plan`.

---

## pre-workflow — D4 · sticky `process` · 2026-09-09

**Code:** `3dbcc26` · **Docs:** `8e84841`, `e7ac551` · **Grana:** `d4-sticky-process` (ff u `master`)

Poslednja strukturna stavka `D1`. Naslov `process` sekcije stoji dok četiri koraka prolaze pored
njega. **Nije čekao `M1`** iako ga plan tako vodi — `position:sticky` već živi na `.card--cta` i
na hero sceni, pa se ništa ne uvozi u rečnik pokreta.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9 — **i lokalno i protiv deploy-a**. `/` 6343 znakova, **nepromenjeno** (sticky je
čista prezentacija). U živom CSS-u na deploy-u stoje sva tri pravila uključujući
`@media (max-height:640px)`.

⚠️ **`manual` PASS (Pavle).** Prva stavka koju agent **nije mogao** da potvrdi — panel je izgubio
layout u celini. Agent je dokazao da se pravilo **primenjuje** (`getComputedStyle`, build), ali ne
i da se **ponaša**; grana je ostala nespojena i vraćena Pavlu. **Postupak je odradio svoje** →
`LESSONS` L7, L12.

---

## pre-workflow — D1/3 · `guard`+`founder` cinematic, `stories` obrisana · 2026-09-09

**Code:** `a1a43d3` · **Docs:** `9a0806f`, `7798beb` · **Grana:** `d1-cinematic-guard-founder`

⚠️ **Pavlov override same `D1` odluke:** rečenica *„No stock photos. No invented reviews."* **ne
seli** u `guard`. Posledica — **u batch-u nije napisana nijedna nova reč, samo je brisano**, pa je
registarski rizik nula. Naslovna sa 10 na **9** sekcija; `faq` `06` → `05`.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` **6725 → 6343** znakova (razlika = obrisana
sekcija). Potvrđeno da obrisanog teksta nema nijedne pojave na živoj stranici. → `LESSONS` L8, L11.

---

## pre-workflow — D1/2 · `values` → utility · 2026-09-09

**Code:** `08debb5` · **Docs:** `4297a82`, `814ff46` · **Grana:** `d1-values-utility`

Display element su **imena osa** (`PAY`/`HOME TIME`/`EQUIPMENT`, 44.8 px), **ne broj** — sekcija
tvrdi *„A bigger number isn't the whole offer."* **Copy nepromenjen do slova**, provereno frazu po
frazu nad renderovanim HTML-om.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` 6725 znakova. → `LESSONS` L9, L10.

---

## pre-workflow — D1/1 · `pay` → utility · 2026-09-09

**Code:** `f541b72` · **Docs:** `2217eb3`, `f4d819e` · **Grana:** `d1-pay-utility`

Prva sekcija iz editorial u utility. `h2` pada na caption skalu, `$0` uzima raspon koji je naslov
imao. **Copy se nije pisao** — sve četiri vrednosti prenete (tri iz zatečene proze, `$0` iz `C5`
dozvoljenih formulacija). Dve rečenice namerno ispale, obe bez reda u registru.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` 6731 znakova. → `LESSONS` L6.

---

> **Starije od 2026-09-09** nije u ovom fajlu — workflow tada nije postojao.
> Puna istorija po sesiji → `docs/STATUS-ARCHIVE.md`.
