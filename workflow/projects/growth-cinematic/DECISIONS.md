# DECISIONS — growth-cinematic

> Odluke koje obavezuju kod. **OPEN odluka blokira planiranje svog posla** (`RULES §8`).
> Postavljeno 2026-09-09; unosi pre tog datuma su preneti iz `docs/STATUS.md`.

---

## OPEN

### `C-ROK` — rok odgovora za carrier-a
- **Status:** ⚠️ **odlučen u načelu, formulacija OPEN.**
- **Vlasnik:** Pavle.
- **Odluka (2026-09-09):** carrier dobija **isti rok kao vozač — 15–20 minuta.** Time pada
  pitanje „koji rok se sme obećati"; MAIN-ovo „within 24 hours" ostaje **izbačeno** (tvrdnja bez
  reda u registru).
- **Zašto je i dalje OPEN:** Pavlove reči — *„To moramo da osmislimo perfektno, pretražićemo
  dostupne podatke sa interneta i na ostalim recruiting sajtovima."* **Vodi se kao `LEG-1`:**
  zaseban posao sa svojim istraživanjem, ne stavka koja se zatvori u prolazu.
- **Dva uslova za onoga ko to bude pisao:**
  1. `C12` traži **oba hedža** — „usually" **i** „staffed/business hours" — **u istoj rečenici**
     sa tvrdnjom (`local` doseg, pooštren 2026-09-06). Kapija to presreće sama.
  2. **`C12` je red o VOZAČU.** Carrier upit ide kroz drugu formu i drugi red obaveštenja, pa je
     proširenje **nova poslovna tvrdnja** — traži dopunu `C12` ili sopstveni red, isto kao što je
     `L1` dopunio `C5` umesto da se oslonio na sličnost.
- **Do tada:** carrier nema rok nigde. **Svesno stanje, ne propust.**

### `LEG-1` — `/terms`
- **Status:** OPEN. **Vlasnik: kvalifikovani američki advokat.**
- Nedostaju: governing law / jurisdikcija, arbitraža, intelektualna svojina, uslovi prekida.
- Stranica je do njih nepotpuna; pravni pasusi koji postoje su preneti doslovno.

### `LEG-2` — pravni pregled privacy i TCPA teksta
- **Status:** OPEN. **Vlasnik: advokat.**
- Tekstovi su **nacrti**. Sekcija 05 („Where Your Information Is Stored") opisuje stvarno
  skladištenje u bazi — original je nema jer tamo prijava živi samo u mejlu.
- Kad se pregled završi: `LEGAL_UPDATED` u `lib/contact.js` se postavlja na dan pregleda.

### `C52` — državljanstvo, radna dokumenta i znanje engleskog
- **Status:** OPEN. **Vlasnik: advokat.** Nijedan agent ne sme doneti taj zaključak sam.
- Zabranjena površina je **uklonjena sa `/how-it-works`** 2026-09-05 u ovom projektu.
- ⚠️ **Isti tekst i dalje stoji u MAIN-u** (`app/how-it-works/page.jsx:129-130`), na sajtu koji
  je indeksiran i prima prave prijave. Popravka traži svoj batch **u `GROWTH` repou** — ovaj
  projekat MAIN ne dira.

### `D5?` — je li „What we don't do" kao manifest već zatvoren
- **Status:** OPEN, ali **trivijalan** — traži pogled, ne odluku autoriteta.
- `guard` je 2026-09-09 postao cinematic (`a1a43d3`), što je bilo pola te stavke. Odlučiti pre
  nego što se `D5` planira kao zaseban batch.

### `SAP-TEKST` — čuva li se objašnjenje o prekršajima/SAP-u
- **Status:** OPEN. **Vlasnik:** Pavle; privacy deo ide uz `LEG-2`.
- Audit `CC-2`: polja su obavezna (`ApplyForm.tsx:403,410`), `lib/leads.js` ih rediguje pre upisa,
  a pun tekst živi samo u mejlu. Komentar u `lib/leads.js` je odluku odložio „dok se ne napiše
  privacy stranica" — napisana je. Opcije: prestati da se traži (manja izmena) ili čuvati uz
  privacy osnov.

### `CB-API` — `/api/callback` bez pozivaoca
- **Status:** OPEN. **Vlasnik:** Pavle.
- Audit `IA-20`: nijedna komponenta ga ne zove; komentari pominju „chatbot" koji ovde ne postoji.
  Javna POST ruta koja upisuje lead. Dokumentovati spoljni ugovor ili ukloniti (lock zona → STRICT).

### `AUD-OBIM` — nalazi audita nastali čitanjem MAIN-a
- **Status:** OPEN (trivijalna). **Vlasnik:** Pavle. **Blokira:** `G3`.
- `L-23` (pokrivenost claims kapije) i drift `D-03`/`D-04` oslanjaju se na čitanje `CLAIMS.md` i
  `SITEMAP.md` iz MAIN-a (audit `00` §10). Zadržati ili odbaciti.

---

## ZATVORENO

### `RD3-LOOK` — svetlo scene: nebo van magle, oreoli, bistra topla zora, bez svetlog vela · 2026-09-19
- **Izvor stavke** (Pavle, 2026-09-15): *„Kad se pređe (na trećoj slici) nekako je previše prazno i tmurno, kao da je magla
  i da se sunce jedva probija kroz maglu."* Magla je bila zamerka (`LESSONS` L35); „sunce iza kamere" rešio je `RD10`.
- **Procena pre plana:** nije overengineering (u svakom kadru, bez asseta, jeftino); bloom (`EffectComposer`), zraci svetla
  i novi objekti protiv „praznine" jesu — van obima.
- **Izbor od šest varijanti uživo** (`?svetlo=0..5`, kontakt list + linkovi; Pavle tražio *„kao i pre da vidim vise
  varijacija"*): *„Meni se svidjaju 2 3 i 4 ali mi je nekako 3 zlatna sredina"*, pa *„Biram 3."* → mesec, sunce i zvezde van
  magle; meki oreoli oko farova, zadnjih svetala, lampi i truck stop-a; sjajniji asfalt (hrapavost 0,68 → 0,45); u zoru ređa
  magla (0,0095 → 0,0045) boje `#b98468` umesto braon `#6c513b`; nebo od `#3b4757` gore do horizonta u boji magle, sa blagim
  sjajem oko sunca; svetli veo `--bone` na dnu heroja uklonjen.
- **Preporuka agenta bila je ista** (3): 2 ostavlja zoru kao ravan braon zid; 4 uvodi plavu kojoj na sajtu nema para i ide
  protiv toplog svetla iz `S1-LOOK`.
- **Disk ostaje `#ffd392`** — ponuđen toplo-beli disk iz varijante 5 ako deluje zlatno; Pavle izabrao 3 bez izmene.
- **Pregled:** *„pass"* (produkcijski build, pravi browser).
- ⚠️ Ko menja boju magle menja i horizont neba (isti `THREE.Color`). Ko menja `--forest` (Pavle želi, 2026-09-19): noćne boje
  scene (nebo `#07110d`, magla `#0d1a16`, vrh neba `#040a08`, `.journey-shade`) su podešene na nju.

### `RD11-LOOK` — američki put, dva truck stop-a, niža tabla, duži skrol heroja · 2026-09-19
- **Procena pre plana (Pavle traži opomenu):** put nije overengineering (u svakom kadru, jeftin); truck stop kao
  kompleks jeste — prihvaćen samo kao „svetla u daljini", bez teksta i marke, kao varijanta u jednom krugu.
- **Put:** leva ivica žuta, desna bela, isprekidane sa dugim pauzama (MUTCD 3 m / 9 m), ograda u deonicama, stubići sa
  žutim reflektorima levo i belim desno (boja prati ivičnu liniju), markeri na putu.
- **Truck stop — kombinacija** (od `?put=0|1|2|3`): *„put 2 i put 3 mi se svidjaju samo sto se na putu 2 veoma kratko
  vidi truck stop, mozemo li napraviti neku kombinaciju"* → oba: noćni desno ispred kamiona (svetla kroz celo 01,
  nadstrešnica i tabla pred kraj 01, u 02 van kadra) i jutarnji levo, između teksta i puta u 03.
- **Tabla niža:** *„tabla treba biti nize"* — vrh sa 28 na ~16,5; visoka tabla jutarnjeg se u 01 videla kao silueta na
  nebu pored „20+" (`LESSONS` L34).
- **Skrol heroja duži (A):** *„kameru treba usporiti malo"*; od A (duži skrol) i B (sporije praćenje) Pavle: *„A"* —
  `.journey.is-enhanced` `380svh` → `460svh`, ~22 % sporije po točkiću. Plan kamere, sunce, mesec i platoi su po
  napretku skrola, pa se ne menjaju.
- **Pregled:** *„konacno je, idemo dalje"*.
- ⚠️ Ko pomera truck stop: noćni bliže putu ili bliže kamionu upada u 02 ispod naslova „$0" (kamera tamo gleda unazad);
  mesto se meri po kadru, ne prosekom poglavlja (`LESSONS` L33).

### `RD12-LOOK` — klasični američki tegljač sa dugom haubom, bez marke · 2026-09-19
- **Zahtev:** *„kamion treba više da liči na američki kamion piterbelt ili cascadia ili nešto tako što nam je najlakše"*
  (2026-09-17). Preporuka i plan: klasična duga hauba u stilu Peterbilta — ravne plohe i valjci, što scena već dobro
  pravi; Cascadia je aerodinamična i od istih oblika bi delovala grubo.
- **Izbor od varijanti uživo** (kontakt list danas · nov, linkovi `?kamion=0|1`): *„Novi kamion je vrh"*.
- **Bez amblema, imena marke i ukrasa na haubi**; boje `S1-LOOK`, prikolica i logo GROWTH isti. Oblik je podatak
  (`TRUCK_DESIGN`, `lib/hero-truck.ts`) i ostaje u okviru kamiona iz `RD2` — po njemu je izmeren plan kamere.

### `RD10-LOOK` — viša brda, američki tegljač, put; mesec u 01, sunce izlazi u 02 · 2026-09-17
- **Izbor od varijanti uživo** (kontakt list: danas · blaga brda · viša brda · blaga + zrno): *„da budem iskren 3 i 4
  mi se najviše sviđaju jer podsećaju na američke puteve"*, pa *„Najviše mi se sviđa 3."* → tlo **viša brda i daleki
  greben**, **nov kamion**, **nov put**, **bez filmskog zrna**. Boje `S1-LOOK` iste; bez preuzetih modela.
- **Sunce i mesec ne izlaze iz planine:** *„s tim što bi trebalo da napravimo da sunce/mesec ne izlaze iz planine"*.
- **Mesec u 01 na označenom mestu** (snimak sa zaokruženim delom neba): *„mesec treba biti ovde gde sam ga označio"* —
  gore, na sredini neba iznad puta.
- **Sunce u 02 izlazi odozdo nagore** (snimak sa dve oznake i strelicom): *„Sada treba da sredimo sunce da se prvo
  nalazi dole i da izlazi ka gore"*. Donji položaj je ~1,6° iznad tačne oznake, jer je na oznaci disk izlazio iz brda.
- **Pregled:** *„Sada je dobro."*
- ⚠️ Mesec i sunce su pravci od kamere, ne mesta u svetu (`LESSONS` L31). Ko ih pomera: položaj se meri u NDC iz kadra
  koji je Pavle označio (`__tests__/lib/hero-scene.test.js`, testovi 11–13).
- **Otvoreno, ne odluka:** Pavle predlaže američke oznake na putu i truck stop sa strane; preporuka je poseban batch
  (`RD11`) posle release-a, jer je `RD10` dogovoren kao jedan krug poređenja.

### `RD2-LOOK` — kamera „Kran", jedna blaga pauza u 02, release tek sa izgledom scene · 2026-09-17
- **„Zastaje" = kadar, ne kamion** (Pavle): *„Kamion ne mora da stane"* — kamion i svitanje prate skrol.
- **Scena koja doslovno prikazuje posao — odbijena kao overengineering.** Pavle je tražio da se menjaju okolina,
  kamion i *„šta se zapravo dešava"*, uz *„ako mislis da je ovo overenginering opomeni me i ne dozvoli da nastavimo
  dalje"*. Procena: scenu vidi samo desktop, copy nije konačan (`RD9`), a doslovan prikaz traži prave modele i nov
  umetnički pravac; slika koja prikazuje ishod ide kroz registar isto kao rečenica. Pavle: *„ako je overengineering
  nećemo ići u tom pravcu"*. Povratak na ideju tek kad copy bude konačan i analitika pokaže da desktop posetioci gledaju
  hero.
- **Jedna blaga pauza, gde je tekst najbitniji** (Pavle): *„napraviće se samo jedna blaga pauza onamo gde nam je tekst
  u hero-u najbitniji"* → poglavlje 02 („$0 Cost to drivers. Always."), jačina 0,5. Umesto pauze nivo diže kamera:
  kadar pravljen za tekst, pokret sa težinom, jak kadar za 02 — *„Slažem se, ali bih prvo da vidim 3 različite
  varijacije"*.
- **Kamera „Kran"**, izabrana između Kran / Dron / Ispred kamiona na dev serveru, uz snimke svih poglavlja:
  *„idemo na 1"*.
- **Release tek sa izgledom scene.** Posle kamera: *„okruženje mi previše izgleda kao lego kockice"* i *„ove kamere
  jesu dobre ali džabe kada nema šta da se vidi"*. Na predlog da `RD2` ne ide na Vercel dok `RD10` ne sredi brda,
  kamion i put, i da se puste zajedno: *„Može, radimo tako"*.
- ⚠️ **Hero ostaje 3D scena** (odluka od 2026-09-08 važi). U istom razgovoru „main" je značio `master` ovog projekta
  na Vercelu, ne MAIN repo i njegove fotografije — pravac „fotografije umesto scene" nije ni predložen od Pavla.

### Redizajn — cilj, i telefon po strani · 2026-09-15
- **Cilj** (Pavle): *„jasan cilj ovog redizajna je da napravimo što bolji cinematic osećaj, ali da uz to
  pružamo ozbiljno dobre i logički povezane informacije"*. Stavke → `ROADMAP` „Redizajn" (`RD1`–`RD9`).
- **Telefon po strani** (Pavle): *„za sada telefon po strani, radimo redesign"* — posle Android provere i
  izjave da i telefon traži poseban redizajn. Obim redizajna za telefon nije definisan.
- **Redosled:** Pavle je prvo tražio scenu u heroju (*„Prvo to"*) → `S1`.

### `S1-LOOK` — hero svetlo i kamion: varijanta `1` za kamion, `b` za sjaj · 2026-09-15
Pavle je birao na živom dev serveru, između varijanti u pravoj sceni (privremeni prekidači u URL-u,
uklonjeni pre commita):
- **Kamion — varijanta `1`** (*„1 mi se najviše sviđa, 2 i 3 idu previše prema mouse grey"*): kabina
  `#34472d`, tamni delovi `#1c231d`, hrom metalnost 0,55, staklo `#223a31`, gume `#121514`. Svetlije
  nijanse kabine čitaju se kao siva.
- **Sjaj — varijanta `b`** (*„B definitivno"*, posle *„između 2 i 1 … više vuče na zlatno nego na
  svetlo"*): jačina između ranijih `1` i `2`; noćni rim `#ffcf9f` i farovi `#fff0d2` umesto zasićenog
  amber/žutog. U zori rim i dalje prelazi u originalni amber `#ffb365`.
- ⚠️ **Odbijen je zlatni ton, ne samo jačina.** Ko sledeći dira svetlo scene: topla svetlost ide ka
  toplo-beloj, ne ka zlatnoj.

### `T-FONT` — pismo sajta: Arial ostaje · 2026-09-14
Pavlova odluka u dva koraka: prvo *„nećemo nikakva plaćena pisma"*, pa posle stranice za poređenje
sa pravim hero-om i sekcijom sajta u četiri pisma (Arial, Archivo, Barlow, Oswald + Inter):
*„od svih ovih arial mi se najviše sviđa"*.
- **Posledica za `T1`:** nema novog pisma, licence ni preuzimanja. Posao koji ostaje je
  hijerarhija — Pavlov nalaz da ga tekst ne vodi kroz sajt i da hero nema jačinu ne dolazi od pisma.
- ⚠️ **Arial nema težine iznad bold-a:** `font-weight` 800 i 850 u CSS-u prikazuju se kao 700.
  Jačina zato mora doći iz veličine, kontrasta i rasporeda, ne iz dodatne težine.
- ⚠️ **Android nema Arial** i prikazuje zamensko sistemsko pismo (obično Roboto). **Pavle 2026-09-14**
  („trebamo se potruditi da što više skinemo desktop verziju", pa „Da"): uređaji bez Arial-a dobijaju
  **Arimo** (OFL, iste širine slova kao Arial). Isporučeno u `T1` kao porodica „Growth Sans" sa
  `local()` prvim, jer AOSP `fonts.xml` ima alias `arial → sans-serif` (`LESSONS` L27).
- **Drugi red naslova — varijanta 2** (Pavle 2026-09-14, „moze 2", posle stranice sa četiri
  varijante): debela slova i ivica od 2 px umesto 1 px. Isporučeno u `T1`; **gde** obris ostaje
  (`D2`) odlučuje se u `T1b`.

### `R1-DOMEN` — Resend: sandbox sada, verifikovan domen na lansiranju · 2026-09-13
Pavle je odobrio `R1` plan koji je nosio ovu odluku i postavio env tačno po njoj: **nov** Resend
ključ za `growth-cinematic`, `LEAD_NOTIFICATION_EMAIL` na adresu naloga, **`LEAD_FROM_EMAIL` namerno
prazan**. Isto kao stari sajt, koji tako radi (`C:/dev/growth/workflow/STATE.md:343-348`). Lanac
izmeren u `R1`: `POST /api/apply` `503 → 200`, mejl potvrđen u inbox-u.
- ⚠️ **Verifikovan domen tek na lansiranju, i tek posle DKIM-a.** `_dmarc` je `p=quarantine`, pa bi
  prelazak `LEAD_FROM_EMAIL`-a na `@growthcdl.com` bez DKIM-a tiho ugasio isporuku, a HTTP 200 to ne
  bi pokazao. DNS je u GoDaddy-ju; postojeći `spf.em.secureserver.net` zapis se ne briše.
- Sandbox isporučuje **samo na adresu Resend naloga** — zato autoresponder vozaču (`F1b`) i dalje
  čeka domen.

### `D1` — taksonomija sekcija · zaključana 2026-09-08, implementirana 2026-09-09
Deset sekcija, tip za svaku. `pay` i `values` → **utility**; `guard` i `founder` → **cinematic**;
`stories` → **briše se**; `process` ostaje editorial + sticky. Callback forma **namerno nema tip**.
- ⚠️ **Override 2026-09-09, Pavlov:** plan je tražio da rečenica *„No stock photos. No invented
  reviews."* pređe iz `stories` u `guard`. **Ne prelazi.** Pavlove reči: *„nemamo potrebe da se
  igde pravdamo što se toga tiče."* Obećanje da nema izmišljenih recenzija **pretpostavlja
  optužbu**; brisanje je jače od selidbe. `founder` takođe ne prima ništa — doslovan prenos bi
  vratio baš redundansu zbog koje se `stories` briše.

### Pravac pokreta · 2026-09-08
Karakter, **bez paralaksa**, bez generičkih efekata. Nema video hero-a, preloader-a, magnetnog
CTA, custom cursor-a, paper grain-a. Nema deljenja teksta na slova.

### Hero ostaje 3D scena · 2026-09-08
Fotografije u hero **ne idu** — kamion, pokret i izlazak sunca već postoje u sceni; fotografija
je tamo **samo fallback**.
- ⚠️ **Otvoreno pitanje, ne zadatak:** `public/images/` ima šest fotografija; `hero-02-dawn` i
  `hero-03-sunrise` su **neiskorišćene**. Da li i gde idu drugde **nije odlučeno**.

### Redosled: dizajn i pokret ispred Resenda · 2026-09-08
Sajt je funkcionalno kompletan ali vizuelno „skelet". Dva nezavisna pregleda pala su na isti
nalaz. **Resend ide posle.**
- **Potvrđeno 2026-09-11, posle audita:** Resend ide **poslednji**, jer je najlakši. Audit ga vodi
  kao uslov za lansiranje, ne kao defekt.

### Chrome labele ostaju kratke · 2026-09-08
Nav („APPLY NOW"), MobileBar („Apply ↗"), Footer („Apply") **se ne uključuju** u `APPLY_CTA`
konsolidaciju — navigacioni chrome pored jednorečnih suseda, ne CTA dugmad. Razlog stoji u
`lib/cta.js`. Pavle je tražio „sve na jednu labelu"; **odstupljeno svesno i objašnjeno, njegova
odluka.**

### `AGENTS.md` / `CLAUDE.md` se commit-uju · 2026-09-08
Next ih regeneriše deterministički između markera; `agentRules: false` bi samo pravio razliku
koju neko mora da čisti pri svakom `next dev`. ⚠️ `CLAUDE.md` se **automatski učitava u kontekst
agenta** — ako Next promeni taj blok, promena stiže kroz `git diff`, ne tiho.

### Class A only · 2026-09-04
Pavlova formulacija: „prima ali za sad neka ostane samo A". `lib/form-options.js` ne nudi Class B;
vrednost je **izvedeno uklonjena i iz serverskog whitelist-a**.

### `D28` — zašto ovaj projekat postoji · živi u `C:/dev/GROWTH-B`
Procesna pravila originala **ne obavezuju** ovaj projekat. Ali `docs/CLAIMS.md` nije stil nego
FCC/FTC i **prelazi bez izuzetka**. ⚠️ `D28` i `PB1.md` žive u worktree-u MAIN-a; ako se taj
folder obriše, odlaze s njim.
