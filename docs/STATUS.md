# STATUS — gde je projekat i šta je sledeće

Poslednji put ažurirano: 2026-09-06. Piše se na kraju sesije, čita se na početku sledeće.

## Šta je ovo

Novi CDL-A sajt (`C:/dev/growth-cinematic`), izgrađen na cinematic prototipu, uz prenos
svega upotrebljivog iz postojećeg sajta. **Ovo je poseban projekat sa sopstvenim git-om**, a
ne grana postojećeg.

**Stek: Next.js → Vercel, Neon (Postgres) za bazu.** Do 2026-09-05 je ciljao Cloudflare
Workers kroz `vinext`; taj sloj je uklonjen (vidi „Prelazak na Vercel" niže).

**Živ pod `noindex` na https://growth-cinematic.vercel.app.** Repo:
`github.com/pavlemitrovic01/growth-cinematic` (privatan). Do 2026-09-05 repo nije imao
remote uopšte — ceo rad je stajao na jednoj kopiji na disku.

## ⚠️ Tvrdo ograničenje

**`C:/dev/growth` (MAIN) se NE DIRA.** To je živ sajt na `growthcdl.com` koji prima prave
prijave. Čita se slobodno kao izvor; ne piše se u njega ni na granu.

Provereno na kraju ove sesije: `main` na `391fde3`, čisto radno stablo.

**`C:/dev/GROWTH-B`** nije zaseban folder nego **git worktree MAIN-a** na grani
`batch/pb1-cinematic-home`. Nosi `DECISIONS.md` unos **D28** — zapis zašto ovaj projekat
postoji i šta ga obavezuje — i `PB1.md` manifest. **Grana se nikad ne merge-uje.** Ako se
folder briše, D28 i PB1.md odlaze s njim.

## Stanje

Sajt je funkcionalno kompletan, **deploy-ovan i izmeren protiv deploy-a**, pod `noindex`.

| | |
|---|---|
| Ruta | 14 (+3 API) |
| Sadržaj | podstranice dopunjene 2026-09-05; `/for-carriers` +46%, `/contact` +35% |
| Testovi | 120 u 8 fajlova (vitest) + 9 HTTP testova nad renderovanim HTML-om |
| Grana | **`master`** (44 commita); `vercel-migration`, `faza-4-copy` i `faza-6-kapije` spojene fast-forward-om |
| Hosting | Vercel projekat `growth-cinematic`, nalog **„pavle's projects" (Hobby)** |
| Baza | Neon Free, regija `iad1`, Neon Auth ugašen; migracija puštena, obe tabele postoje |

**Kapije** — sve moraju biti zelene pre commita:

```
npm run typecheck
npm run lint
npm test
npm run build
npm run verify         # verify:nojs + verify:claims, traži pokrenut server
npm run test:rendered  # traži pokrenut server
```

Poslednje dve ne pokreću server same — pokreni `npm run build && npm start` pa meri protiv
njega. Po difoltu gađaju `:3000`.

**Meta merenja se bira, i uvek se ISPISUJE** (`meri se: <origin>`):

    VERIFY_BASE=https://growth-cinematic.vercel.app npm run verify
    VERIFY_BASE=https://growth-cinematic.vercel.app npm run test:rendered

⚠️ Za `test:rendered` MORA `VERIFY_BASE`, nikad `-- --base`: `node --test` ne prosleđuje
argumente posle `--` test fajlu, pa bi merenje tiho otišlo na `localhost` i prijavilo PASS
na pogrešnoj meti. Desilo se već jednom — vidi `2accf84`.

## Prelazak na Vercel (2026-09-05)

Otkriveno merenjem: `app/` i `components/` nisu bili vezani za Cloudflare uopšte — uvoze
samo standardni Next, pa `next build` prolazi bez izmene izvora stranica. Uklonjeno je
`worker/index.ts`, `vite.config.ts`, `build/`, `.openai/hosting.json`, `env.d.ts`,
`examples/d1/`, `app/chatgpt-auth.ts`, pet `scripts/` pomoćnika i 123 npm paketa.

**Tri stvari su bile stvarni posao, ne brisanje:**

1. **`middleware.ts`** — `rejectCrossOrigin` se u celom projektu zvao isključivo iz
   workera. Bez zamene bi migracija tiho otvorila javne POST rute za cross-origin zahteve.
   Middleware sam pečati bezbednosna zaglavlja jer odgovor koji u njemu nastane ne prolazi
   kroz `headers()` iz `next.config.ts`.
2. **`lib/rate-limit.js` → `clientIp`** — redosled zaglavlja je **obrnut**. Na Cloudflare-u
   je `cf-connecting-ip` išlo prvo jer ga edge prepisuje; Vercel ga ne postavlja, pa bi ga
   posetilac slao sam i kočnica bi se zaobilazila jednim zaglavljem. Sada prvo idu
   platformska zaglavlja, a `x-forwarded-for` uzima **poslednji** unos, ne prvi.
3. **`dynamicParams = false`** na članku — sa `true` je nepostojeći `/truckers-lounge/<bilo
   šta>` vraćao **200 sa telom 404 stranice**, jer se `notFound()` okida pošto je odgovor
   već streamovan. Pretraživaču bi svaka izmišljena putanja izgledala kao validna stranica.

Baza: D1 (SQLite) → Neon (Postgres). Šema prevedena, migracija regenerisana.
**Zamka koja je uhvaćena u prevodu:** `reset_at` drži epoch u milisekundama (~1.8e12);
SQLite `INTEGER` je 64-bitni, ali Postgres `integer` je int4 sa granicom ~2.15e9 —
doslovan prenos tipa bi dao overflow na prvom upisu i kočnica bi otkazala u celosti.
Kolona je zato `bigint`.

## Zamke koje su već jednom pojele vreme

- **Proveri koji proces sluša na portu pre merenja.** Zaostali server je dvaput dao lažne
  nalaze. `netstat -ano | grep 3000`. Na Windows-u `kill <pid>` iz Git Bash-a **ne gasi**
  Node proces — ide `taskkill /PID <pid> /T /F`, pa tek onda merenje.
- **Browser panel drži tab u `visibilityState: "hidden"`**, pa se 3D scena namerno ne
  pokreće i `rAF` ne radi. Hero se ne može proveriti odatle — traži pravi browser.
- **Migracija nikad nije puštena ni na jednu živu bazu.** Na D1 je bila primenjena samo
  lokalno; Neon baza još ne postoji.

## Šta je namerno ugašeno

- **`NEXT_PUBLIC_SITE_LIVE`** — dok nije `true`, sajt je `noindex` na tri mesta (HTML, HTTP
  zaglavlje, `robots.txt`) i `sitemap` je prazan. `lib/seo.js:5` baca grešku ako neko upali
  indeksiranje bez pravog HTTPS origin-a. **Original je živ i indeksiran na istom domenu** —
  dva izvora za isti sadržaj štete sajtu koji prima prave prijave.
- **`NEXT_PUBLIC_CONSENT_REQUIRED`** — consent baner, kontrola u footeru i puna verzija
  privacy sekcije pale se zajedno. Dok je ugašeno, sajt ne učitava nijedan tracker i privacy
  tekst to tačno kaže. Pali se **u istom trenutku kad i analitika**, ne pre.
- **Resend** (`RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`) — rute rade i bez njega: vraćaju
  503 „pozovite nas", nikad lažnu potvrdu.
- **`DATABASE_URL`** — **postavljen 2026-09-05** kroz Neon Marketplace integraciju. Prefiks
  je zadat kao `DATABASE`, pa je ime tačno ono koje `db/index.ts:31` traži; da je ostao
  difoltni `STORAGE`, kod ga nikad ne bi našao i tiho bi zauvek radio na in-memory sloju.
  Uz njega je Neon ubacio još 15 `DATABASE_*` promenljivih koje kod ne koristi — **ne dirati
  ih**, integracija ih sama održava.

## Sesija 2026-09-07 — Faza 6 (kapije + KnowBeforeYouGo)

Dva commita, spojena u `master` i deploy-ovana **2026-09-08**.

| Commit | Šta |
|---|---|
| `8599caa` | claims kapija **prestaje da broji i počinje da poredi** |
| `358a812` | `KnowBeforeYouGo` dobija stranicu; C41 zatvorena |

**Kapija je bila slabija nego što je izgledala.** Do tada je merila **prisustvo** hedža na
stranici, ne njegovu **blizinu tvrdnji** — stranica sa „15–20 minutes" u jednom pasusu i
„usually" u sasvim drugom prolazila je kao ispravna. Nov `scripts/claims-rules.mjs` poredi
hedž uz samu tvrdnju. Uz to `lib/routes.js` kao jedan izvor spiska ruta.

| | pre | posle |
|---|---|---|
| `test` | 120 | **132** |
| `verify:nojs` | 11 ruta | **14 ruta** (tri su postojale a nisu merene) |
| `verify:claims` | prisustvo hedža | **hedž uz tvrdnju** |

**`KnowBeforeYouGo` zatvoren:** pun sadržaj na `/how-it-works#know-before-you-go`, naslovna
dobila `02 / WHAT TO COMPARE` uz link. Obećanje i odredište spojeni.

⚠️ **C41 zatvorena usput** — `„the drivers we place right now"` → `„the first drivers who come
to us"`. Prezent koji tvrdi aktivno plasiranje, a GROWTH nema zabeleženih plasmana. **Promaklo
kroz sedam claims batch-eva.**

### ⚠️ Pouka o procesu, ne o kodu

Rad iz ove faze je **postojao samo na lokalnoj grani, nepušen**, dok ga sesija od 2026-09-08
nije slučajno otkrila — i to tek kad je krenula da piše **isti sadržaj ponovo**. `master` ga
nije imao, GitHub ga nije imao, `STATUS.md` ga nije pominjao.

**Zato: na početku sesije proveri `git branch -vv` i `git ls-remote --heads origin`, ne samo
`git status`.** Čisto radno stablo ne znači da nema nespojenog rada.

## Sesija 2026-09-06 — Faza 4 (copy)

Šest commita, grana `faza-4-copy` spojena u `master` fast-forward-om i deploy-ovana.

| Commit | Šta |
|---|---|
| `b3cfb09` | **Prolaz 1** — tri odobrena reda vraćena, doslovno iz izvora |
| `eb7c469` | prefiks pristanka u sam `CONSENT_TEXT` + `CONSENT_TEXT_VERSION` → `2026-09-06` |
| `3ece835` | jedan natpis za CTA — `lib/cta.js` |
| `11d4484` | ⚠️ ispravka: konsolidacija je promašila **hero dugme** |
| `41e277c` | C12 rečenica u jedan izvor + navodnici u `posts.js` |
| `d012863` | hero dobio „Applying does not commit you to a job.", preneto sa `/apply` |

**Izmereno protiv `https://growth-cinematic.vercel.app` posle deploy-a:**
`verify` PASS 11 ruta no-JS + PASS 13 ruta claims · `test:rendered` 9/9 · `noindex` drži.

**Tri stvari koje su ispale veće nego što je AUDIT procenio:**

1. **Pristanak nije bio kozmetika.** Quick i full forma prikazivale su **različit tekst pod
   istom verzijom**, a obe šalju `source: 'apply'` — iz `leads.consent_version` se nije moglo
   razlučiti šta je vozač video, što je jedina svrha te kolone. (Razlika vozač/carrier **jeste**
   razlučiva, preko `source`, i namerna je — nije dirana.)
2. **C12 je bio rizik, ne neurednost.** Devet pojava u pet varijanti, ne šest u tri. Goli oblik
   te tvrdnje je **trajno zabranjen**; devet kopija je devet prilika da ispadne hedž.
3. **Velika slova su bila u izvoru, ne u CSS-u**, pa se natpis nije mogao deliti bez promene
   izgleda. Prebačena su u prezentaciju (`text-transform` na `.journey-cta`).

⚠️ **Konsolidacija je jednom prijavljena kao gotova a nije bila.** `FIND MY NEXT ROUTE` nije
stajao ni na jednom pozivu nego kao **podrazumevana vrednost propa**, pa ga pretraga po
pozivima nije našla — i hero dugme, najvidljiviji CTA, ostalo je sa starim natpisom.
Otkriveno **gledanjem stranice**, ne brojanjem po izvoru (`11d4484`).

⚠️ **Zaostao server je dao lažan prolaz — treći put.** Kapije su prijavile zeleno dok je
pozadinski server pao na zauzet port, pa se merio **prethodni build**. Od tada: ubij po PID-u
(`taskkill /PID <pid> /T /F`), potvrdi da je port slobodan, pa tek onda meri.

⚠️ **Hidracioni nesklad — BIO JE STVARAN, POPRAVLJEN.** Dev je prijavio da `js-motion`
nestaje sa `<html>`. **Prvo sam ga zatvorio kao „dev artefakt" — pogrešno**, na osnovu
pretpostavke umesto dokaza. Pavlov screenshot Next overlay-a pokazao je suprotno: legenda
`+ Client − Server` sa crvenim `− className="js-motion"` na `<html>` iz `layout.tsx`, dakle
**stvaran nesklad u kodu**, ne posledica overlay-a.

Uzrok je isti obrazac na tri mesta — element koji se menja **imperativno, van React-ovog
rendera**, pa React pri hidraciji zatiče atribut koji njegovo stablo ne deklariše:

| Element | Ko ga menja | Popravka |
|---|---|---|
| `<html>` | `MOTION_GATE` inline skripta, sinhrono pre hidracije | `suppressHydrationWarning` |
| `<main>` naslovna (`CinematicHome.tsx`) | `Motion.tsx:111-113`, `route-in` pri promeni rute | isto |
| `<main>` podstranice (`PageShell.tsx`) | isto | isto |

⚠️ **Zašto je vredelo:** da je React skinuo `js-motion` kod pravog posetioca, `Motion.tsx:31`
bi odustao i **ceo rečnik pokreta iz Faze 2 tiho ne bi radio ništa**. Sadržaj bi ostao vidljiv
(fail-safe drži), pa **nijedna kapija to ne bi uhvatila** — `verify-nojs` gleda inline
stilove, ne klase.

Uz to `data-scroll-behavior="smooth"` na `<html>`: bez njega Next pri promeni rute pušta
browser da **glatko skroluje kroz celu stranicu** umesto da skoči.

Provereno klijentskom navigacijom u oba smera i potvrđeno u Pavlovom browseru: konzola čista.

## Sesija 2026-09-05 (nastavak) — deploy

Četiri commita na `master`. **Sve merenje od ovog trenutka ide protiv deploy-a, ne localhost-a.**

| Commit | Šta |
|---|---|
| `0b2b747` | `next` 16.3.4 — četiri high iz produkcije zatvorene (`npm audit --omit=dev`: 0) |
| `9c125be` | `--base` u tri kapije |
| `2accf84` | ⚠️ ispravka: `node --test` ne prosleđuje argv → meta preko `VERIFY_BASE`, i ispisuje se |

Uz to, van commita: GitHub repo napravljen i obe grane pušene; `vercel-migration` spojena
u `master` fast-forward-om; Vercel projekat + Neon kroz Marketplace; migracija puštena.

**⚠️ `master` je pre merge-a bio mina.** Nosio je `worker/index.ts` i `vite.config.ts`, a
**nije imao `middleware.ts`**. Pošto i GitHub i Vercel po difoltu gađaju default granu,
import bi objavio tri javne POST rute bez cross-origin zaštite i bez ijednog bezbednosnog
zaglavlja — tačno tiho otkazivanje na koje ovaj dokument upozorava kao na glavni rizik
migracije. Uhvaćeno pre uvoza u Vercel.

**Izmereno protiv `https://growth-cinematic.vercel.app`:**

`verify:nojs` PASS 11 ruta · `verify:claims` PASS 13 ruta · `test:rendered` **9/9**

Prvo stvarno merenje `middleware`-a cross-origin zaštite na pravom sajtu — **prolazi**.
`noindex` drži na sva četiri sloja (HTTP zaglavlje, HTML meta, `robots.txt`, prazan `sitemap`).

**Lanac prijave dokazan do baze.** Test POST na `/api/apply` vratio je očekivani 503
(„call or text us instead"), a red je svejedno upisan: `source=apply`,
`consent_granted=t`, `consent_version=2026-09-02`, `email_delivered=f`. Upis stoji **ispred**
503-a namerno — bez toga bi prijava nestala bez traga baš u slučaju zbog kog baza i postoji.
Test-red obrisan. Ostaje nedokazana samo poslednja karika: Resend → inbox.

## Sesija 2026-09-05 — šta je urađeno

Osam commita na grani `vercel-migration`, 55 fajlova, +1992 / −3394 linija.

| Commit | Šta |
|---|---|
| `ece2157` | Prelazak Cloudflare Workers → Vercel + Neon |
| `00b5251` | `docs/AUDIT.md` — audit dovršenosti, četiri paralelna prolaza |
| `d328f4c` | „staffed hours" + kapija koja je to blokirala |
| `de7e40c` | **Faza 0** — tri stvari koje su bile netačne, ne nedovršene |
| `d5356c6` | **Faza 1** — tokeni i mrtav CSS, izgled dokazano nepromenjen |
| `c110e66` | **Faza 2** — rečnik pokreta, šest primitiva, nula zavisnosti |
| `b8ce4b8` | **Faza 3** — podstranice dopunjene, sve preneto |

Kapije na kraju sesije, sve izmereno protiv `npm run build && npm start` na `:3000`:
`typecheck 0` · `lint 0` · `test 120/120` · `build 0` · `verify PASS 11 ruta no-JS + PASS 13
ruta claims` · `test:rendered 9/9`.

## ⚠️ Prvo što sledeća sesija treba da uradi

**Otvori [`docs/MOTION.md`](MOTION.md) i kreni od `D1`.** To je sada glavni kolosek; sve niže
u ovom dokumentu čeka iza njega.

### Zašto se redosled promenio 2026-09-08

Do te sesije je sledeći posao bio Resend. Pavlova odluka ga je pomerila: **dizajn i pokret idu
pre Resenda** — sajt je funkcionalno kompletan, ali je vizuelno „skelet".

Dva nezavisna pregleda — merenje u ovom repou i spoljni pregled žive stranice — pala su na
isti nalaz: **osam sekcija naslovne ima isti oblik** (naslov levo, tekst desno, linija,
outline, fade-in), a pet podstranica nema **nijedan** reveal.

⚠️ **Zbog toga pokret nije prvi posao.** Bolji ulazak u nepromenjen zid je i dalje zid, a
odluka o pokretu **zavisi** od toga šta sekcija jeste. Redosled je: **prvo oblik, pa pokret.**

### Šta blokira

**`D1` — taksonomija sekcija.** Koja je *cinematic*, koja *editorial*, koja *utility*.
Jedina stavka u planu koja se **ne može izvesti merenjem** — traži Pavlovu odluku šta koja
sekcija *jeste*. Blokira polovinu liste.

**`M1` i `M5` su nezavisni** i mogu odmah, ako treba da se nešto pomera dok `D1` čeka:
- `M1` — dva nova primitiva (`OTKRIVANJE`, `CRTA`) uz postojećih šest, bez ijedne primene
- `M5` — View Transitions, usmeren prelaz rute i shared naslov kartice

### Odluke iz te sesije koje ne treba ponovo otvarati

- **Pravac pokreta:** karakter, **bez paralaksa**, bez generičkih efekata
- **Hero ostaje 3D scena.** Fotografije u njega **ne idu** — kamion, pokret i izlazak sunca
  već postoje u sceni; fotografija je tamo samo fallback
- **Resend ide posle** dizajna i pokreta
- `KnowBeforeYouGo` zatvoren u Fazi 6, `middleware` → `proxy` urađen — ne raditi ponovo

### ⚠️ Otvoreno pitanje, ne zadatak

`public/images/` sadrži **šest** fotografija; `hero-02-dawn` i `hero-03-sunrise` su
**neiskorišćene**. Dawn je kadar iz kabine (ruke na volanu, papiri, zora), sunrise je kamion
ka izlasku sunca. Obe su režirane kao set — tamna leva trećina za tekst. U hero ne idu.
**Da li i gde idu drugde nije odlučeno.**

### ✅ Dve odluke — donete 2026-09-08

1. **Chrome labele: OSTAJU kratke.** Nav („APPLY NOW"), MobileBar („Apply ↗"), Footer
   („Apply") se ne uključuju u `APPLY_CTA` konsolidaciju. Nisu CTA dugmad nego navigacioni
   chrome pored jednorečnih suseda (`Call`, `Text`, `FAQ`) — duga rečenica bi tamo bila
   regresija izgleda, ne doslednost. Razlog stoji u `lib/cta.js`. **Ne otvarati ponovo bez
   nove odluke.**
2. **`AGENTS.md` / `CLAUDE.md`: COMMIT-ovani.** Next ih regeneriše deterministički, između
   `BEGIN:nextjs-agent-rules` / `END` markera; gašenje kroz `agentRules: false` bi samo
   pravilo razliku koju neko mora da čisti pri svakom `next dev`. Provereno pre commita:
   `AGENTS.md` 678 B, `CLAUDE.md` 11 B (`@AGENTS.md`), ništa osim Next-ovog bloka.
   ⚠️ `CLAUDE.md` u korenu se **automatski učitava u kontekst agenta** — ako Next ikad
   promeni sadržaj tog bloka, promena stiže kroz `git diff`, ne tiho.

### Sitnije, nagomilano

- **Navigacioni chrome** — Nav („APPLY NOW"), MobileBar („Apply ↗"), Footer („Apply") nisu
  u konsolidaciji natpisa; razlog u `lib/cta.js`. Pavle je tražio „sve na jednu labelu",
  odstupljeno svesno i objašnjeno. **Njegova odluka.**
- **`AGENTS.md` i `CLAUDE.md`** — `next dev` ih generiše sam na svaki pokretanje, stoje
  neispraćeni. ⚠️ `CLAUDE.md` u korenu se automatski učitava u kontekst agenta u budućim
  sesijama, pa nije svejedno. Predlog: `agentRules: false` u `next.config.ts`.
- **✅ `middleware` → `proxy`** — urađeno 2026-09-08. Fajl je `proxy.ts`, funkcija `proxy`,
  `config` nepromenjen. Zaštita izmerena direktno posle preimenovanja: strani Origin → 403 sa
  pečatiranom politikom, ispravni Origin → propušten, GET → propušten.
- **Lighthouse na hostingu** i **3D hero na telefonu** — deploy ih je otključao, još
  neiskorišćeno.

**Ograničenje Claude browser panela i dalje važi:** panel drži tab u `visibilityState:
"hidden"`, pa se okidanje `IntersectionObserver`-a i 3D scena odatle ne mogu proveriti.
Sve što zavisi od vidljivog taba traži pravi browser — vidi nalaz o `js-motion` gore.

## Sledeće, po redosledu

0. **✅ Urađeno 2026-09-05.** Sajt pogledan u pravom browseru, izgled odobren, grana
   `vercel-migration` spojena u `master` fast-forward-om.
1. **✅ Urađeno** — `next` 16.3.4, `0b2b747`.
2. **✅ Urađeno 2026-09-06** — Faza 4, oba prolaza. `KnowBeforeYouGo` zatvoren u **Fazi 6**.
   Original opisa: Prvi prolaz vraća dva
   odobrena reda koja su pri prepisu ispala iz `lib/faq.js` (C15 lead-brokeri, obim TCPA
   pristanka) i kanonsku C21 formulaciju; drugi rešava nedoslednosti: sedam labela za
   `/apply`, tri varijante C12 rečenice u šest instanci, prefiks pristanka u tri od četiri
   forme. Najveći pojedinačni gubitak je `KnowBeforeYouGo` — vidi `AUDIT.md`.
3. **✅ Urađeno** — Vercel projekat + Neon kroz Marketplace, migracija puštena.
   ⚠️ **Ali na ličnom Hobby nalogu**, ne na timu na kom živi original
   (`team_lFVUISCch3euonXJEBmOdfiA`). Hobby je po Vercel uslovima nekomercijalan, a ovaj
   sajt prima prave prijave. **Pre pravog saobraćaja projekat treba premestiti na tim** —
   što znači ponovo env promenljive i ponovo Neon integraciju.
4. **✅ Urađeno** — deploy pod `noindex`. Od četiri stvari koje otključava, dve su
   iskorišćene (prijava kroz lanac do baze, pokazivanje linka); **Lighthouse na hostingu i
   3D na pravom hardveru još nisu.**
4.5 **Dizajn i pokret** — ⚠️ **umetnuto 2026-09-08, ispred Resenda, Pavlovom odlukom.**
   Plan je [`docs/MOTION.md`](MOTION.md), jedanaest stavki, `D1` blokira polovinu.
   Sajt je funkcionalno kompletan ali vizuelno „skelet": jak hero, pa dugačak ujednačen
   dokument. Ovo je jedini kolosek na kom se sada radi.

5. **Resend** — ⚠️ **najveći efekat po uloženom vremenu, i manje je blokiran nego što je
   ovaj dokument ranije tvrdio.** ⚠️ **Ide POSLE dizajna i pokreta** (odluka 2026-09-08).
   Sajt trenutno **skuplja prijave a nikoga ne obaveštava**:
   lead se upiše u bazu, vozač dobije 503 „pozovite nas", i tu se lanac prekida.

   Izmereno 2026-09-06: **verifikovan domen NE treba.** `lib/email.js:106` uzima
   `LEAD_FROM_EMAIL || SANDBOX_FROM`, a `SANDBOX_FROM` je `GROWTH.CO
   <onboarding@resend.dev>` — Resend-ov sandbox pošiljalac. `lib/email.js:13` traži samo
   `RESEND_API_KEY` **i** `LEAD_NOTIFICATION_EMAIL`.

   Koraci: Resend kroz Vercel Marketplace (kao Neon) ubaci ključ sam → dodaš
   `LEAD_NOTIFICATION_EMAIL` → redeploy → test-prijava kroz `/api/apply` → **potvrdiš da je
   mejl stigao**. Petnaest minuta, i time je lanac forma → Neon → Resend → inbox zatvoren.
6. **Analitika**, pa uz nju upaliti consent kapiju.
7. **Odluka o prelasku** — tek kad postoje brojke. Original ostaje živ i indeksiran do tada.

### Blokirano na Pavlu ili advokatu — ne može se raditi bez odgovora

- **Rok odgovora za carrier-a.** Vozač ga dobija na četiri mesta (15–20 min, uz oba C12
  hedža), carrier nijedan. MAIN-ovo „within 24 hours" je tvrdnja bez reda u registru i ovaj
  projekat ju je svesno izbacio. **Koji rok se sme obećati?**
- **`/terms`:** governing law / jurisdikcija, arbitraža, intelektualna svojina, uslovi
  prekida. Sve četiri traže kvalifikovanog američkog advokata.
- **C52 (OPEN):** zabranjena površina je uklonjena sa `/how-it-works` 2026-09-05, ali red
  ostaje otvoren. ⚠️ **Isti tekst i dalje stoji u MAIN-u**
  (`C:/dev/growth/app/how-it-works/page.jsx:129-130`), na sajtu koji je indeksiran i prima
  prave prijave. **Ponovo provereno 2026-09-05, stoji doslovno:** „documents showing you're
  authorized to work in the US · enough English to handle dispatch and DOT" — lista uslova
  za zaposlenje po imigracionom statusu i jeziku, tačno obrazac koji `docs/CLAIMS.md:666`
  imenuje kao zabranjen dok je red OPEN. Vlasnik reda je **kvalifikovani američki advokat**;
  nijedan agent ne sme doneti taj zaključak sam. Popravka traži svoj batch u `GROWTH`
  repo-u — ovaj projekat MAIN ne dira.
- **Pravni pregled** privacy i TCPA teksta. Kad se završi, `LEGAL_UPDATED` u
  `lib/contact.js` se postavlja na dan pregleda.

## Šta je nedovršeno

`docs/AUDIT.md` (2026-09-05) nosi izmeren spisak po stranici, sa redosledom rada u pet faza.
Ukratko: nema nijednog TODO-a ni lorema — nedovršenost je u izostavljenim sekcijama, u copy-ju
koji je pri prenosu prepisan kraći od originala, i u tome što pokret postoji samo na heroju.
Tri stavke su tamo označene kao **pogrešne sada, ne nedovršene**: netačan procesor podataka u
privacy politici, kršenje C53 na 404 stranici i otvorena C52 površina na `/how-it-works`.

## Otvoreno, svesno

- **`npm audit` u produkciji: čisto.** Četiri high (`postcss` — XSS + tri path-traversal
  preko `sourceMappingURL`; `sharp` — libvips CVE-2026-33327/33328/35590/35591) zatvorene
  su bump-om `next`-a na 16.3.4 (`0b2b747`). `npm audit --omit=dev` daje
  `found 0 vulnerabilities`. Nije se moglo zakrpiti odozdo: `next@16.2.6` je nosio **svoj**
  `postcss@8.4.31` unutar svog stabla, a advisory pogađa sve `<=8.5.22`.
  ⚠️ **Pun `npm audit` (sa dev-om) i dalje daje 9** (1 low, 4 moderate, 4 high) — ali su to
  **drugi** nalazi: `brace-expansion`, `browserslist`, `js-yaml`, `vite`. Svi dev-only;
  ništa od toga se ne deploy-uje. Pun dev audit **nije** izmeren pre bump-a, pa se ne tvrdi
  da li je tih 9 zatečeno ili pomereno.
- **Cold start baze pada u putanju POST-a forme.** Neon gasi compute posle 5 min mirovanja
  i budi se sam za ~300–800 ms, a prvi dodir baze u zahtevu je rate-limit provera. Prva
  prijava posle zatišja je sporija za oko sekundu; ne pada, jer in-memory sloj stoji ispod.
- **Chatbot** nije prenet. Odluka o obimu, ne propust.
- **Next vraća 200 na uhvaćenu serversku grešku** (odgovor je već streamovan). Isti
  mehanizam koji je proizveo 404-bug iz ovog prelaska; bitno kad se uključi monitoring.
- **`env.IMAGES` stavka je zatvorena** — `/_vinext/image` je nestao sa workerom, a Next-ov
  `/_next/image` na Vercelu radi nativno.
- **Privacy i TCPA tekstovi su nacrti za pravni pregled.** Sekcija 05 („Where Your
  Information Is Stored") opisuje stvarno skladištenje u bazi — original je nema jer tamo
  prijava živi samo u mejlu.

## Pravila sadržaja koja i dalje važe

Procesna pravila originala ne obavezuju ovaj projekat (D28), ali `docs/CLAIMS.md` u originalu
nije stil nego FCC/FTC. Sprovodi se automatski: `npm run verify:claims` gađa renderovani HTML,
7 zabranjenih obrazaca i 2 uslovna koja moraju nositi hedž. Copy je prenet doslovno baš zato
što je već prošao kroz sedam claims batch-eva.

**Class A only** — Pavlova odluka 2026-09-04: „prima ali za sad neka ostane samo A".
`lib/form-options.js` ne nudi Class B; vrednost je izvedeno uklonjena i iz serverskog
whitelist-a.
