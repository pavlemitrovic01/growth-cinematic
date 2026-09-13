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


### `T-FONT` — pismo sajta
- **Status:** OPEN. **Vlasnik:** Pavle. **Blokira:** `T1`.
- Audit 2026-09 (`L-02`): ceo sajt je Arial. Predlog: jedna familija, dve optičke veličine, preko
  `next/font`, ~40 KB. Plaćeno: Söhne ili Neue Haas Grotesk Display (procena iz audita:
  ~€300–600 za dve težine). OFL: **Inter Display**. Odluka: koje pismo, i ko kupuje licencu ako
  je plaćeno.

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
