# STATUS-ARCHIVE — istorija sesija

> Odvojeno iz `STATUS.md` **2026-09-09**, kad je taj fajl narastao na 735 redova — plus 60% u
> jednoj sesiji. Isti razlog zbog kog `workflow/RULES.md §13` uvodi doc cap: dokument koji niko
> ne čita ceo prestaje da bude memorija projekta.
>
> **Ovde ide zatvorena istorija — šta je urađeno i zašto, po sesiji, najnovije na vrhu.**
> Živo stanje je u `workflow/STATE.md`, plan u `workflow/projects/growth-cinematic/ROADMAP.md`,
> kapije i capovi u `CONTEXT.md`, trajne pouke u `LESSONS.md`.
>
> ⚠️ Ovaj fajl **nema cap** i ne ulazi ni u jedno planiranje. Raste namerno.

---

## Sesija 2026-09-09 (nastavak 3) — D4, sticky `process`. **D1 je time ceo implementiran.**

Dva commita na grani **`d4-sticky-process`** (`3dbcc26` kod, `8e84841` dokumenti), spojena u
`master` i pušena **tek pošto je Pavle potvrdio skrol u pravom browseru**.

`process` je jedina sekcija koja u `D1` ostaje editorial, pa se ne menja oblik nego **ponašanje**:
naslov stoji dok četiri koraka `01–04` prolaze pored njega.

### `D4` nije čekao `M1`, i to je bila tačna odluka

Plan ga vodi kao zavisnog od `M1` (novi primitivi pokreta). **Nije bio.** `position:sticky` već
živi na `.card--cta` i na hero sceni, pa se ništa ne uvozi i ništa ne dodaje u rečnik pokreta.
**`M1` ostaje nezavisan i neurađen.**

### ⚠️ Odgovor na pitanje koje je prethodni blok postavio: pod `reduce` sticky OSTAJE

Kill switch gasi `animation` i `transition`, **ne `position`**. To je **tačan ishod, ne rupa u
kapiji**: `reduce` postoji zbog vestibularnih tegoba, a sticky element se **ne pomera** — stoji
dok se stranica kreće. To je *manje* pokreta, ne više. Paralaks bi morao da se gasi; zato
paralaks i nije u planu.

### ⚠️ Zamka koju nijedna kapija ne meri — nizak prozor

Ako je lede viši od vidnog polja, sticky bi mu prikovao vrh a dno — **uključujući link** — ostalo
bi trajno **nedohvatljivo**. Ne dešava se na laptopu, ali se dešava na **200% zoom-u**.
`@media(max-height:640px)` vraća normalan tok. Ispod 900 px takođe `static`.

**Kapije, protiv `npm run build && npm start` na `:3000`** (PID 13920):
`typecheck 0` · `lint 0` · `test 132/132` · `build 0` · `verify:nojs PASS 14 ruta`
(`/` **6343 znakova, nepromenjeno** — sticky je čista prezentacija) · `verify:claims PASS 13
ruta` · `test:rendered 9/9`.

### ⚠️ Prva stavka koju agent nije mogao da potvrdi — i kako je zatvorena

Browser panel je **usred provere izgubio layout u celini** — `docH=900`, svi elementi nulte
visine, iako DOM ima svih 9 sekcija. Nije se oporavio ni posle zatvaranja taba, ni posle
`resize`-a, ni posle fronting-a. **To je otkaz alata, ne koda.**

Agent je dokazao da se pravilo **primenjuje** (`getComputedStyle` vraća `position:sticky;
top:40px`, build servira tri očekivana pravila sa oba media upita), ali **ne** da se pri skrolu
ponaša kako treba. Grana je zato ostala nespojena i **vraćena Pavlu**.

✅ **Pavle je potvrdio u pravom browseru: radi kako treba.** Tek onda merge i push.

`MOTION.md` to ionako traži — *„Sve što zavisi od skrola proverava se u pravom browseru."*
`D4` je prva stavka na koju se to pravilo stvarno odnosilo, i **postupak je odradio svoje:
agent nije prijavio gotovo dok nije bilo gledano.**

**Izmereno protiv deploy-a posle push-a:** `verify:nojs PASS 14 ruta` (`/` 6343) ·
`verify:claims PASS 13 ruta` · `test:rendered 9/9`. U živom CSS-u na deploy-u stoje sva tri
pravila, uključujući `@media (max-height:640px)`. Deploy je bio živ ~170 s posle push-a.

## Sesija 2026-09-09 (nastavak 2) — D1, `guard`+`founder` cinematic, `stories` obrisana

Dva commita na grani **`d1-cinematic-guard-founder`** (`a1a43d3` kod, `9a0806f` dokumenti),
spojena u `master` fast-forward-om i **pušena istog dana**. `origin/master` na `9a0806f`.

Treće i četvrto od četiri iz `D1`, u jednom potezu — jer se `stories` po planu delila između
njih. Odnosno, Pavlovom odlukom, **ne deli**.

### Pavlov override same `D1` odluke — i razlog vredi zapamtiti šire

`D1` je propisao brisanje `stories` **ali selidbu** njene najjače rečenice (*„No stock photos.
No invented reviews."*) u `guard`. Pavlova odluka 2026-09-09:

> *„Nema potrebe da piše no stock photos, nemamo potrebe da se igde pravdamo što se toga tiče."*

**Obećanje da nema izmišljenih recenzija PRETPOSTAVLJA optužbu.** Sajt koji to eksplicitno
negira sam uvodi sumnju koju niko nije izneo. **Brisanje je jače od selidbe.**

⚠️ **`founder` takođe ne prima ništa.** Doslovan prenos ostatka bi vratio **baš onu redundansu
zbog koje se `stories` i briše** — `founder` već nosi *„GROWTH is built around that gap."*
Redundansa se ne bi obrisala nego preselila unutar jedne sekcije.

### Posledica: u batch-u nije napisana nijedna nova reč

Samo je brisano. **Registarski rizik je nula** — `verify:claims` može samo biti sigurniji nego
pre. Time otpada i ranije upozorenje da se tekst iz `stories` mora ponovo čitati protiv `C41`:
tog teksta više nema. Naslovna ima **devet** sekcija; `faq` je prešao sa `06` na `05`.

### Cinematic je bio najjeftiniji od tri tipa — ali ne besplatan

Par forest/bone već postoji na `.home-callback` i `.home-close`, pa se oblik nije izmišljao nego
primenio. To je cela razlika prema `pay` i `values`, gde je oblik trebalo naći.

⚠️ **Ali pet pravila ispod nisu kozmetika nego čitljivost.** Sve nasleđeno je računalo na krem
podlogu: telo u `--moss` (`#455044`), ivice u `rgba(22,32,25,.22)`, labele u `#5b6659` i
`--clay-mid` (`#86502b`). **Ništa od toga se ne vidi na forestu**, a nijedna kapija to ne bi
uhvatila — `verify-nojs` gleda inline stilove, **ne kontrast**. Sekcija bi bila tamna i prazna,
i prošla bi zeleno.

⚠️ **Deljeni selektor `.home-steps p,.home-founder p` nije diran** — `process` ostaje krem;
dodat je uži `.home-guard p,.home-founder p`. **Treći put isti obrazac** u ovom fajlu.

### Provereno kao celina, ne po sekciji

Sekvenca `values` → `guard` → `founder` → `faq` gledana zajedno: krem spec-sheet, tamni
manifest, tamni founder, krem editorial. **Dve tamne se ne stapaju**, jer im se razlikuje
unutrašnja forma — lista parova protiv velikog naslova sa citatom u serifu. To je „prekid čina"
koji je `D1` tvrdio, sada izmeren a ne pretpostavljen.

**Kapije, protiv `npm run build && npm start` na `:3000`** (PID 12844):
`typecheck 0` · `lint 0` · `test 132/132` · `build 0` · `verify:nojs PASS 14 ruta`
(`/` **6343** znakova, bilo 6725 — razlika je obrisana sekcija) · `verify:claims PASS 13 ruta` ·
`test:rendered 9/9`. Prelomi 1180 i 390 pogledani.

**Ponovo izmereno protiv deploy-a posle push-a**: `verify:nojs PASS 14 ruta` (`/` 6343, isto
kao lokalno) · `verify:claims PASS 13 ruta` · `test:rendered 9/9`. `noindex` drži, `sitemap`
prazan. Potvrđeno da obrisanog teksta **nema nijedne pojave** na živoj stranici.

### Zapaženo usput, nije dirano

- **`founder` ima praznu levu kolonu** ispod naslova — `.home-editorial` je `1fr 1fr`, a levo
  stoji samo `h2`. Bilo je isto i na kremu; na forestu se prazan prostor primeti više. **Nije
  regresija, i nije u obimu ovog posla.**
- **Komentar uz `.home-guard-list` netačno opisuje ponašanje** — kaže da „na jednoj koloni
  labela ide iznad teksta", ali `.home-steps li` ostaje `display:flex` na svim prelomima, pa
  labela ostaje levo i prelama se u dva reda. Čitljivo je; ispravka bi značila odluku da li
  labela TREBA da ide iznad, što je dizajn izmena.

## Sesija 2026-09-09 (nastavak) — D1, druga sekcija: `values` → utility

Dva commita na grani **`d1-values-utility`** (`08debb5` kod, `4297a82` dokumenti), spojena u
`master` fast-forward-om i **pušena istog dana**. `origin/master` na `4297a82`.

### ⚠️ Otvoreno pitanje iz prethodnog bloka je zatvoreno — i odgovor je bio suprotan

Pitanje je bilo: *„`values` nema broj, a `pay` ga je imala — šta je display element kad brojke
nema?"* **Odgovor: broj tu ne SME da bude display element.** Sekcija tvrdi *„A bigger number
isn't the whole offer."* Veliki broj bi oborio sopstvenu rečenicu u istom dahu.

Display element su **imena osa** — `PAY` / `HOME TIME` / `EQUIPMENT`, 44.8 px na 1280 — jer je
podatak **sama taksonomija**: ovo troje se poredi, i ništa drugo. `h2` pada na 28.16 px, ista
caption skala kao `pay`.

### ⚠️ Definicija „utility" koja važi šire nego ove dve sekcije

**„Utility" ne znači „ima broj".** Znači da je nosivi sadržaj **podatak**, i da display element
postaje **ono što taj podatak jeste**:

| sekcija | podatak | display element |
|---|---|---|
| `pay` | jedna cifra — cena za vozača | **`$0`** |
| `values` | taksonomija — tri ose poređenja | **imena osa** |

Da je pravilo bilo „utility = veliki broj", `values` bi dobila uvećane `01/02/03` — ordinale
bez sadržaja, i rečenicu koja sama sebi protivreči. **Simetrija je bila pogrešan kriterijum.**

Raspored je ostao 3-up grid, obrnuta je hijerarhija **unutar ćelije** — namerno: `pay` je
figura + redovi, `home-steps` i `home-guard-list` su naslagani redovi. Da je i `values` postala
naslagani redovi, tri „različita" oblika bi konvergirala u jedan.

### Copy nepromenjen, ali dve mehaničke stvari jesu

Sve rečenice su preživele **do slova** — provereno frazu po frazu nad renderovanim HTML-om.
Menja se samo koji element nosi koji tekst: `<h3>` prelazi sa pitanja na ime ose („Pay" je
podnaslov, pitanje nije). Iz naslova ispada `<br />` i outline `<em>`, po `D2`.

⚠️ **Verzali su prešli iz izvora u CSS.** Do sada je stajalo `01 — PAY`; sada `Pay` +
`text-transform`. Faza 4 je to već jednom platila (`3ece835`), a uz to čitač ekrana sada dobija
„Pay" umesto slova po slovo.

⚠️ **`.home-value-grid p` je skinut iz DELJENOG selektora, ne ceo red** — `.home-steps p` i
`.home-founder p` su živi. Isti obrazac koji je već jednom zamalo oborio `.af` kroz
`.proof-section`. Ostala `.home-value-grid` pravila obrisana kao mrtva, uključujući ono u
`@media 900`.

**Kapije, sve protiv `npm run build && npm start` na `:3000`** (PID 24180):
`typecheck 0` · `lint 0` · `test 132/132` · `build 0` · `verify:nojs PASS 14 ruta`
(`/` 6725 znakova) · `verify:claims PASS 13 ruta` · `test:rendered 9/9`.
Polaritet potvrđen u panelu; `reduce` po konstrukciji — nijedna nova tranzicija.
Prelomi 1280 i 390 pogledani, `EQUIPMENT` staje na 390.

**Ponovo izmereno protiv deploy-a posle push-a** (`meri se: https://growth-cinematic.vercel.app`
u oba izlaza): `verify:nojs PASS 14 ruta` (`/` 6725 znakova, isto kao lokalno) ·
`verify:claims PASS 13 ruta` · `test:rendered 9/9`. `noindex` drži na sva četiri sloja,
`sitemap` prazan (0 URL-ova). Deploy živ ~30 s posle push-a.

## Sesija 2026-09-09 — D1, prva sekcija: `pay` → utility

Dva commita na grani **`d1-pay-utility`** (`f541b72` kod, `2217eb3` dokumenti), spojena u
`master` fast-forward-om i **pušena istog dana**. `origin/master` na `2217eb3`.

**Šta je urađeno:** `pay` je izašla iz `home-editorial` rasporeda (naslov levo, pasus proze
desno) i postala **utility blok** — prva od četiri sekcije iz `D1`.

### ⚠️ Pretpostavka na kojoj stoji cela taksonomija — DRŽI

`pay` je birana baš zato što je najjeftinija provera: ako promena oblika ne razbija monotoniju
na jednoj sekciji, plan se preispituje pre nego što se prepravi četiri. **Razbija je.** Šav
`pay` → `process` se sada čita kao prelaz između dve različite stvari; do juče su to bile dve
instance istog rasporeda. **Ostale tri sekcije iz `D1` mogu da krenu.**

### Šta „utility" konkretno znači — definicija za preostale tri

Nije markup nego **obrnuta hijerarhija**. U editorial sekciji naslov je display element; u
utility bloku je **broj**.

| | editorial | utility |
|---|---|---|
| display | naslov `clamp(40px,5.4vw,82px)` | **broj** — `$0`, izmereno 141px na 1280 |
| naslov | nosi sekciju | caption, 28px |
| telo | pasus proze | parovi labela / vrednost / napomena |

Bez tog obrtanja je „utility" ista sekcija sa drugim imenima klasa.

### ⚠️ Copy se nije pisao — i to je bilo izvodljivo

Ista disciplina kao Faza 4. Sve četiri vrednosti postoje doslovno: tri u zatečenoj prozi,
`$0` u C5 dozvoljenim formulacijama (`„$0 cost to drivers. Ever."`, `„Free for drivers,
always"`). Negativno obećanje *„We don't get paid unless you actually start."* pokriva dopuna
L1. `verify:claims` nepromenjen — PASS 13 ruta.

⚠️ **Ispale su tačno dve rečenice, obe bez reda u registru, i obe su Pavlove da ih vrati:**

- *„Our incentives are aligned with yours:"* — red `When` to sada **pokazuje** podatkom;
  zadržati je značilo bi reći ono što tabela već dokazuje.
- *„Just straightforward recruiting."* — zatvaranje pasusa koji više ne postoji.

Uz to je naslov izgubio `<em>` outline tretman — namerno, po `D2`; u utility bloku bi outline
takmičio sa brojem.

### ⚠️ Vizuelna odluka je opet promašena iz izvora — drugi put

Prva verzija je figuri dala `.66fr`, tj. 411 px na 1280, u kojima `$0` od 110 px **pliva**.
Broj koji ne popunjava svoju kolonu ne čita se kao display element nego kao zaostatak. Kod je
bio ispravan, brojevi su bili ispravni, i **pretraga po izvoru to ne bi našla nikad.**
Nađeno gledanjem stranice, ispravljeno na `.42fr` + `11vw`.

**Ista klasa greške kao hero CTA (`11d4484`).** Zaključak koji sada stoji dvaput: *vizuelna
odluka se ne verifikuje čitanjem koda.*

**Kapije, sve protiv `npm run build && npm start` na `:3000`** (PID 29464, potvrđeno da nije
zaostao raniji server):

`typecheck 0` · `lint 0` · `test 132/132` · `build 0` · `verify:nojs PASS 14 ruta`
(`/` 6731 znakova) · `verify:claims PASS 13 ruta` · `test:rendered 9/9`

Batch-kapije iz `MOTION.md`: **polaritet** potvrđen u panelu — watchdog je skinuo `js-motion`,
sekcija ostala cela vidljiva; **`reduce`** važi po konstrukciji, novi CSS ne dodaje nijednu
tranziciju ni animaciju; **bez JS-a** i **registar** nepromenjeni. Prelomi 1280 / 768 / 390
pogledani.

**Ponovo izmereno protiv deploy-a posle push-a** (`meri se: https://growth-cinematic.vercel.app`
u oba izlaza, dakle meta je potvrđena a ne pretpostavljena):

`verify:nojs PASS 14 ruta` (`/` 6731 znakova, isto kao lokalno) · `verify:claims PASS 13 ruta` ·
`test:rendered 9/9`. `noindex` drži na sva četiri sloja — HTTP zaglavlje, HTML meta,
`robots.txt` i prazan `sitemap`. Deploy je bio živ ~30 s posle push-a.

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
