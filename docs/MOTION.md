# DESIGN I MOTION — plan po površinama

Pisano 2026-09-08. Odluka o pravcu je Pavlova: **pokret kao karakter, bez paralaksa, bez
generičkih efekata**.

⚠️ **Više nije čist plan.** **`D1` je cele implementiran 2026-09-09:** `pay` → utility
(`f541b72`), `values` → utility (`08debb5`), `guard`+`founder` → cinematic uz brisanje
`stories` (`a1a43d3`), sticky `process` (`3dbcc26`, još nespojen). Ostatak dokumenta —
`D2`, `D5` i ceo `M`-kolosek — i dalje je plan. Kad se stavka uradi, red u tabeli dobija ✅ i commit —
da se iz ovog dokumenta uvek vidi šta stoji na disku a šta samo na papiru.

---

## ⚠️ Veći problem od pokreta — i zašto ovaj plan ide drugi

Dopunjeno 2026-09-08, posle nezavisnog pregleda (ChatGPT) žive stranice.

**Dva pregleda su nezavisno pala na isti nalaz.** Ovaj dokument je merenjem našao osam sekcija
naslovne sa identičnim tretmanom i pet podstranica bez ijednog reveala. Spoljni pregled je to
isto video na živom sajtu i formulisao oštrije:

> *„Posle treće sekcije korisnik već zna kako će izgledati sve naredne."*

Oblik svake sekcije je isti: **veliki naslov levo, tekst ili lista desno, tanka linija, isti
outline tretman, fade-in.** Hero je jak i odvojen. Sajt se zato čita kao **jedan odličan ekran,
pa dugačak ujednačen dokument.**

⚠️ **Iz toga sledi da pokret nije prvi posao.** Bolji ulazak u nepromenjen zid je i dalje zid.
Uz to, odluka o pokretu **zavisi** od toga šta sekcija jeste — utility blok sa brojkama i
cinematic sekcija ne ulaze isto.

**Redosled je zato: prvo oblik, pa pokret.**

### Šta se uzima iz spoljnog pregleda

| Uzeto | Zašto |
|---|---|
| **Tri tipa sekcije** — cinematic / editorial / utility | Jedina izmena koja rešava dijagnozu. Sada postoji jedan tip, ponovljen sedam puta. |
| **Sticky proces sekcija** | Konkretna, izvodljiva, uklapa se u postojeću numeraciju `01–04`. |
| **„What we don't do" kao manifest** | To je stvarni diferencijator sajta, a tretiran je kao još jedna sekcija. |
| **Driver stories — preokvirivanje** | „Be one of the first" se čita kao *„nemamo klijente, vi ste test"*. Aktivna šteta, ne propuštena prilika. |
| **Outline tipografija selektivno** | Efekat je jak prvi i drugi put; sada je šablon. |
| **Copy je ~20–25% predugačak** | Poklapa se sa nalazom AUDIT-a da su FAQ odgovori prepisani kraći od originala. |

### Šta se ne uzima, i zašto

- **Video hero, preloader** — zamenili bi WebGL koji radi, odnosno dodali čekanje gde ga nema.
- **Magnetni CTA, custom cursor, paper grain, inner glow** — generički ukras; custom cursor uz
  to ne postoji na telefonu, gde je većina vozača.
- **Ocene tipa „Art direction 8.3/10"** — nemaju rubriku iza sebe.
- **Fotografije u hero** — Pavlova odluka: hero je 3D scena.

### ⚠️ Copy predlozi iz spoljnog pregleda diraju registar

Spoljni pregled ne zna za `docs/CLAIMS.md`. Četiri njegova predloga obaraju postojeće redove:

| Predlog | Šta obara |
|---|---|
| „Compare my options" kao CTA | **C53** — dugme mora reći šta radi; registar imenuje „Start your application"; neodređen CTA je već pao kao acceptance FAIL na F5c |
| „20+ **vetted**", „**trusted** partner carriers" | tvrdnje o proveri partnera — traže red u registru i dokaz |
| „You're in." kao success state | implicira prihvatanje; sajt namerno nikad ne tvrdi da je prijava = posao |
| „No lease presented as an easy path to ownership" | uvodi lease-purchase kao temu; mora biti tačno za GROWTH |

⚠️ **A jedan predlog nije copy nego izmišljanje:** citat pripisan **Nate Mikicu**, stvarnoj
osobi. Reči koje neko nije rekao ne idu pod njegovo ime. Bolji citat mora doći **od njega**.

### Spojen redosled

| | Posao | Vrsta | Traži |
|---|---|---|---|
| ~~**D1**~~ | **Taksonomija sekcija** — ✅ **ZAKLJUČANA 2026-09-08**, vidi niže | odluka | — |
| **D2** | Outline tipografija svedena na 2–3 mesta | struktura | — |
| **D3** | Utility blokovi — ✅ `$0` urađen sa `pay` (`f541b72`); ostaju `20+`, rok odgovora, 48 država | struktura | D1 |
| **M1** | Rečnik: `OTKRIVANJE` + `CRTA` kao primitivi | pokret | — |
| **M2** | `PageShell` ritam — pet stranica bez ijednog reveala | pokret | M1 |
| **D4** | Sticky proces sekcija | struktura + pokret | ✅ **URAĐENO 2026-09-09**, `3dbcc26` — **nije čekao `M1`**, vidi niže |
| **D5** | „What we don't do" kao manifest | struktura | D1 |
| **M3** | Naslovi — maska po reči | pokret | M1 |
| **D6** | Driver stories — preokvirivanje | **copy** | ⚠️ registar |
| **M5** | View Transitions — usmeren prelaz, shared naslov | pokret | — |
| **M4** | Hero sekvenca | pokret | M1, M3 |
| **M6** | Pritisak i kartice | pokret | M1 |

**M1 i M5 su nezavisni** i mogu bilo kada.

---

## ✅ D1 — taksonomija sekcija, ZAKLJUČANA 2026-09-08

Naslovna ima **deset** sekcija, ne osam — osam je broj `data-reveal` elemenata, što je ranije
u ovom dokumentu pogrešno prošlo kao broj sekcija.

| # | Sekcija | Tip | Odluka |
|---|---|---|---|
| 1 | hero · *Your next route.* | **cinematic** | nepromenjeno |
| 2 | callback · *YOUR NEXT STEP* | **forma** | nepromenjeno — vidi niže |
| 3 | pay · *How we get paid.* | **utility** | ✅ **URAĐENO 2026-09-09**, `f541b72` — proza → podatak, nosi `$0` |
| 4 | process · *The details make the difference.* | **editorial** | ✅ **URAĐENO 2026-09-09**, `3dbcc26` — sticky lede; ⚠️ skrol još nije gledan u pravom browseru |
| 5 | values · *A bigger number isn't the whole offer.* | **utility** | ✅ **URAĐENO 2026-09-09**, `08debb5` — ime ose je display element |
| 6 | guard · *What we don't do.* | **cinematic** | ✅ **URAĐENO 2026-09-09**, `a1a43d3` — ⚠️ **NE prima ništa**, vidi override niže |
| 7 | founder · *Built around the honest part.* | **cinematic** | ✅ **URAĐENO 2026-09-09**, `a1a43d3` — ⚠️ **NE prima ništa**, vidi override niže |
| 8 | ~~stories · *Be one of the first.*~~ | — | ✅ **OBRISANA 2026-09-09**, `a1a43d3` — cela, bez selidbe |
| 9 | faq · *Before you take the next step.* | **editorial** | nepromenjeno; numeracija `06` → `05` |
| 10 | close · *Ready for your next route?* | **cinematic** | nepromenjeno |

```
sada:      C · forma · E · E · E · E · E · E · E · C
posle D1:  C · forma · U · E · U · C · C · E · C
```

### ⚠️ Callback forma namerno NEMA tip

Taksonomija postoji da razbije **sedam sekcija istog oblika**. Forma nije jedna od njih —
nije deo problema monotonije, i radi svoj posao. Izmišljati četvrti tip za jednu stvar koja
nije pokvarena znači dodati rečnik bez ijedne rešene stvari. Vodi se kao „forma", ne kao tip.

### ⚠️ Zašto se `stories` briše, a ne prepisuje

`founder` i `stories` tvrde **istu stvar** — da je firma nova i poštena. Dve susedne sekcije
sa istim argumentom su najskuplje ponavljanje na stranici. Uz to `stories` aktivno šteti:
*„Be one of the first."* se čita kao *„nemamo klijente, vi ste test."*

~~**Ali njena najjača rečenica ne ostaje bez doma.**~~ ⚠️ **OVAJ DEO ODLUKE JE OBOREN
2026-09-09, Pavlovom odlukom.** Plan je bio da obećanje *„No stock photos. No invented
reviews."* pređe u `guard` kao `what we don't do` tvrdnja. Pavlova formulacija:

> *„Nema potrebe da piše no stock photos, nemamo potrebe da se igde pravdamo što se toga tiče."*

⚠️ **Razlog je jači od plana, i vredi ga zapamtiti šire:** obećanje da nema izmišljenih
recenzija **pretpostavlja optužbu.** Sajt koji to eksplicitno negira sam uvodi sumnju koju niko
nije izneo — ista klasa greške kao odbrana od pitanja koje nije postavljeno. **Brisanje je jače
od selidbe.**

⚠️ **`founder` takođe ne prima ništa.** Doslovan prenos ostatka (*„GROWTH is new. That means the
first drivers who come to us get our full attention…"*) vratio bi **baš onu redundansu zbog koje
se `stories` i briše** — `founder` već nosi *„GROWTH is built around that gap."* Redundansa se
ne bi obrisala nego preselila unutar jedne sekcije.

✅ **Posledica: u batch-u nije napisana nijedna nova reč — samo je brisano.** Registarski rizik
je nula, i otpada ranije upozorenje da se tekst iz `stories` mora ponovo čitati protiv `C41`:
tog teksta više nema.

### ⚠️ Zašto `guard` i `founder` ostaju dva cinematic jedan do drugog

Namerno, ne previdom. Tematski su jedna celina — „ko smo" — a **razlikuju se po formi**:
manifest nosi tipografija, founder nosi čovek i citat. Dve tamne sekcije posle dve svetle
čitaju se kao **prekid čina**, ne kao monotonija. To je upravo ono što stranici fali.

✅ **Provereno na renderovanoj stranici 2026-09-09, i drži.** Sekvenca `values` → `guard` →
`founder` → `faq` gledana kao celina: krem spec-sheet, tamni manifest, tamni founder, krem
editorial. Dve tamne se **ne stapaju**, jer im se razlikuje unutrašnja forma — lista parova
protiv velikog naslova sa citatom u serifu.

⚠️ **Cinematic je bio tehnički najjeftiniji od tri tipa** — par forest/bone već postoji na
`.home-callback` i `.home-close`, pa se oblik nije izmišljao nego primenio. Ali pet pravila
ispod nisu kozmetika nego **čitljivost**: sve nasleđeno je računalo na krem podlogu (telo u
`--moss`, ivice u `rgba(22,32,25,.22)`, labele u `#5b6659` i `--clay-mid`). Ništa od toga se ne
vidi na forestu, a **nijedna kapija to ne bi uhvatila** — `verify-nojs` gleda inline stilove,
ne kontrast.

### ✅ Čime se počelo: `pay` → utility — URAĐENO 2026-09-09 (`f541b72`)

Ne zato što je bilo najlakše, nego zato što je bila **provera pretpostavke.** Cela taksonomija
stoji na tvrdnji da promena oblika rešava monotoniju. `pay` je to trebalo da dokaže ili obori
na **jednoj** sekciji, pre nego što se prepravi četiri.

**Pretpostavka drži.** Šav `pay` → `process` se sada čita kao prelaz između dve različite
stvari, a do juče su to bile dve instance istog rasporeda.

⚠️ **Šta je „utility" ispalo konkretno — ovo je definicija za preostale tri sekcije.**
Nije stvar u markupu nego u **obrnutoj hijerarhiji**:

| | editorial | utility |
|---|---|---|
| display element | naslov, `clamp(40px,5.4vw,82px)` | **broj** (`$0`, izmereno 141px na 1280) |
| naslov | nosi sekciju | caption, 28px |
| telo | pasus proze | parovi labela / vrednost / napomena |
| linije | ivica sekcije | ivica po redu — ista alfa kao `.home-steps` |

Bez tog obrtanja bi „utility" bio ista sekcija sa drugim imenima klasa.

⚠️ **Copy se nije pisao, i to je bilo izvodljivo.** Sve četiri vrednosti postoje doslovno —
tri u zatečenoj prozi, `$0` u C5 dozvoljenim formulacijama. Ispale su tačno dve rečenice,
obe bez reda u registru: *„Our incentives are aligned with yours:"* (red `When` to sada
**pokazuje** podatkom) i *„Just straightforward recruiting."* (zatvaranje pasusa koji više
ne postoji). **Obe su Pavlove da ih vrati ako ih hoće.**

⚠️ **Odnos kolona je promašen iz izvora i ispravljen tek gledanjem stranice.** Prva verzija
je figuri dala `.66fr` — 411 px na 1280, u kojima `$0` od 110 px pliva. Broj koji ne
popunjava svoju kolonu se ne čita kao display element nego kao zaostatak. `.42fr` (314 px)
i `11vw` to zatvaraju. **Drugi put da ista klasa greške prođe pretragu po izvoru** — prvi
je bio hero CTA (`11d4484`). Vizuelna odluka se ne verifikuje čitanjem koda.

Redosled dalje: `guard`+`founder` → sticky `process`.

### ✅ `values` → utility — URAĐENO 2026-09-09 (`08debb5`)

Otvoreno pitanje koje je `pay` ostavio: **`values` nema broj, a `pay` ga je imala — šta je
display element kad brojke nema?**

⚠️ **Odgovor je da broj tu ne SME da bude display element.** Sekcija tvrdi *„A bigger number
isn't the whole offer."* Veliki broj bi oborio sopstvenu rečenicu u istom dahu. Display element
su **imena osa** — `PAY` / `HOME TIME` / `EQUIPMENT`, 44.8 px na 1280 — jer je podatak **sama
taksonomija**: ovo troje se poredi, i ništa drugo.

### ⚠️ Iz toga sledi definicija koja važi šire nego ove dve sekcije

**„Utility" ne znači „ima broj".** Znači da je nosivi sadržaj **podatak**, i da display element
postaje **ono što taj podatak jeste**:

| sekcija | podatak | display element |
|---|---|---|
| `pay` | jedna cifra — cena za vozača | **`$0`** |
| `values` | taksonomija — tri ose poređenja | **imena osa** |

Da je pravilo bilo „utility = veliki broj", `values` bi dobila `01 / 02 / 03` uvećane u display
— ordinale bez sadržaja, i rečenicu koja sama sebi protivreči. **Simetrija je bila pogrešan
kriterijum; sadržaj je tačan.**

⚠️ **Raspored je ostao 3-up grid, obrnuta je hijerarhija UNUTAR ćelije.** Namerno: `pay` je
jedna figura + redovi, `home-steps` i `home-guard-list` su naslagani redovi. Da je i `values`
postala naslagani redovi, tri „različita" oblika bi konvergirala u jedan — isti kvar koji
taksonomija rešava, samo pomeren za jedan nivo.

⚠️ **Copy nepromenjen do slova**, provereno frazu po frazu nad renderovanim HTML-om. Menja se
samo koji element nosi koji tekst: `<h3>` prelazi sa pitanja na ime ose. Verzali su prešli iz
izvora u `text-transform` — Faza 4 je to već jednom platila (`3ece835`), a čitač ekrana sada
dobija „Pay" umesto slova po slovo.

⚠️ **Cena, iskreno:** četiri sekcije menjaju oblik, jedna nestaje. To je veći posao od svega
urađenog 2026-09-08.

⚠️ **D6 ide kroz istu disciplinu kao Faza 4:** copy se prenosi ili odobrava, ne piše usput, i
prolazi `verify-claims`.

---

## ✅ D4 — sticky `process`, URAĐENO 2026-09-09 (`3dbcc26`)

`process` je jedina sekcija koja u `D1` **ostaje editorial**, pa se nije menjao oblik nego
**ponašanje**: naslov stoji dok četiri koraka `01–04` prolaze pored njega.

### ⚠️ Nije čekao `M1`, i to je bila tačna odluka

Spojeni redosled gore vodi `D4` kao zavisan od `M1`. **Nije bio.** `position:sticky` već živi
u ovom projektu na dva mesta — `.card--cta` (`top:24px`) i `.is-enhanced .journey-stage`
(`top:0`) — pa se ništa ne uvozi i ništa ne dodaje u rečnik pokreta. `M1` ostaje nezavisan i
neurađen.

Radi zato što je `.home-editorial` **grid**: kod grid stavke je containing block **grid area**,
koja se proteže celom visinom reda — pa `align-items:start` ne obara sticky nego mu daje
prostor da klizi. Bez grida bi trebao dodatni omotač.

### ⚠️ Pod `reduce` sticky NAMERNO ostaje — i to je odgovor na pitanje iz `STATUS.md`

Kill switch gasi `animation` i `transition`, **ne `position`**, pa ovo preživljava. To je
**tačan ishod, ne rupa u kapiji.** `reduce` postoji zbog vestibularnih tegoba, a sticky element
se **ne pomera**: stoji dok se stranica kreće. To je *manje* pokreta nego alternativa, ne više.
Paralaks — pomeranje **različitom brzinom** — morao bi da se gasi; zato paralaks i nije u planu.

### ⚠️ Gasi se na niskom prozoru, i nijedna kapija to ne meri

Ako je lede viši od vidnog polja, sticky bi mu prikovao vrh a dno — **uključujući link „See the
whole process ↗"** — ostalo bi trajno van ekrana i **nedohvatljivo**. Ne dešava se na uobičajenom
laptopu, ali se dešava na **200% zoom-u** i na niskom prozoru. `@media(max-height:640px)` vraća
normalan tok. Ispod 900 px širine takođe `static`: u jednoj koloni lede stoji **iznad** koraka,
pa bi sticky pojeo vrh ekrana bez ijedne dobijene stvari.

### ⚠️ Šta NIJE potvrđeno

**Samo ponašanje pri skrolu.** Browser panel je usred provere izgubio layout u celini
(`docH=900`, svi elementi nulte visine, iako DOM ima svih 9 sekcija) i nije se oporavio ni posle
zatvaranja taba ni posle resize-a.

Dokazano **jeste** da se pravilo primenjuje: `getComputedStyle` na živom elementu vraća
`position:sticky; top:40px`, a build servira tačno tri očekivana pravila sa oba media upita.
**Nije** dokazano da se pri skrolu ponaša kako treba.

Ovaj dokument to ionako traži — *„Sve što zavisi od skrola proverava se u pravom browseru."*
**`D4` je prva stavka na koju se to pravilo stvarno odnosi**, i zato grana ne ide na merge dok
Pavle ne pogleda.

---

## Šta plan nasleđuje i ne sme da obori

Faza 2 je već napravila rečnik. Plan ga **proširuje**, ne zamenjuje.

| Nasleđeno | Vrednost |
|---|---|
| Tri brzine | `--dur-fast .18s` · `--dur .28s` · `--dur-slow .6s` |
| Jedna kriva | `--ease-out: cubic-bezier(.22,1,.36,1)` |
| Stagger ritam | 70 / 140 / 210 / 280 / 350 ms |
| Tvrda kapija | `prefers-reduced-motion: reduce` gasi **sve** sa `!important` |
| Sigurnosna kapija | `js-motion` + watchdog 3 s — sadržaj se nikad ne zaglavi skriven |
| Merenje | `verify-nojs` na 14 ruta, `verify-claims` na 13 |

**Tri pravila iz kojih se sve izvodi:**

1. **Pokret sme da pojačava, ne da nosi.** Ako se pod `reduce` izgubi informacija, dizajn je
   pogrešan, ne kapija.
2. **Ništa se ne krije bez povratka.** Svako skriveno početno stanje ide iza `html.js-motion`,
   koji watchdog skida posle 3 s. Bez toga sadržaj može ostati nevidljiv zauvek, a
   `verify-nojs` to **ne bi uhvatio** — meri inline stilove, ne klase.
3. **Nula zavisnosti.** Sve niže se radi čistim CSS-om, `IntersectionObserver`-om koji već
   postoji, i React-ovim `<ViewTransition>`. Nijedna biblioteka.

---

## Rečnik: šta se od danas smatra „našim" gestom

Sajt već ima tri sopstvena poteza. Plan ih proglašava rečnikom i koristi svuda umesto uvezenih.

| Gest | Mehanika | Gde već živi |
|---|---|---|
| **OKRET** | `rotate(45deg)` | strelica u dugmadima, `+` u FAQ-u kad se otvori |
| **CRTA** | `scaleX(0→1)`, `transform-origin:left` | nav podvlaka |
| **PUTOVANJE** | translacija po horizontali | `route-slide` traka pri učitavanju rute |

Četvrti se dodaje, jer ga tema traži:

| **OTKRIVANJE** | `clip-path` / maska s leva | novo — zamenjuje fade-up |

✅ **`M1` (2026-09-09) je oba pretvorio u pozivljive primitive:** `[data-line]` i `[data-wipe]`.

⚠️ **`CRTA` je IZDVOJENA, ne izmišljena** — `.nav-links a::after` je već radi. **Nav nije dirnut**
(radi, i već je jednom bio slomljen u Fazi 1), pa mehanika nakratko živi na dva mesta. Spajanje
ide kad druga površina zatraži primitiv, ne pre.

⚠️ **`OTKRIVANJE` nosi tvrdo ograničenje:** `clip-path` različit od `none` **trajno** pravi
containing block za `position:fixed` potomke — gore nego `transform`, jer posledica ostaje i
posle animacije. `[data-wipe]` zato sme **isključivo na listne tekstualne elemente**, nikad na
`<main>` ni `<section>`. Puno obrazloženje stoji u komentaru iznad pravila.

⚠️ **Fade-up (`opacity` + `translateY`) se povlači iz upotrebe.** To je ono što `[data-reveal]`
danas radi i najgenerička je animacija na vebu. Ostaje samo tamo gde je ulazna animacija bez
skrivenog stanja (`.form-done`, `.form-error`) — tamo radi posao i ne primećuje se.

---

## Površine

### 1 · Hero — `Cinematic Hero Entrance`

Najjača tačka plana i jedino mesto gde je veliki gest zaslužen: dešava se jednom, i to je
prvi utisak.

| | |
|---|---|
| Okidač | učitavanje stranice, **bez JS-a** — čista CSS animacija |
| Redosled | 3D scena izranja iz magle → kicker → `h1` → lede → CTA |
| Trajanje | scena `--dur-slow`, tekst po `--dur`, razmak 70 ms |
| Pod `reduce` | sve odjednom, bez sekvence |

⚠️ **`<h1>` je LCP element.** Sekvenca **ne sme** da veže tekst za učitavanje WebGL scene —
vozač na slaboj vezi bi gledao prazan ekran, a Core Web Vitals bi pali. Scena ulazi **ispod**
teksta koji je čitljiv od prvog frejma.

⚠️ **Namerno bez `js-motion` kapije.** Hero je iznad preloma, ne treba mu `IntersectionObserver`.
Čista CSS animacija na `load` znači da nema skrivenog stanja koje bi se moglo zaglaviti — pa
ni watchdog nije potreban. Ovo je jedina površina koja tako radi.

### 2 · Naslovi — `Text Mask Reveal`, jedinica je REČ

| | |
|---|---|
| Okidač | ulazak u vidno polje (`IntersectionObserver`, postojeći `Motion.tsx`) |
| Mehanika | omotač `overflow:hidden`, unutrašnji raspon se podiže u vidno polje |
| Jedinica | **reč** — ne slovo |
| Trajanje | `--dur`, stagger 70 ms po reči |
| Pod `reduce` | tekst prosto stoji |
| Kapija | iza `html.js-motion` (ima skriveno početno stanje) |

⚠️ **Zašto reč a ne slovo.** Deljenje na slova obara **selekciju teksta**, **čitače ekrana** i
**pretragu po stranici**. Rotacija i blur po slovu su uz to definicija efekta koji traži pažnju
— direktno protiv `„Straight answers, no pressure"`. Reč daje isti osećaj bez ijedne od tih cena.

⚠️ **Deljenje se radi na klijentu, posle hidracije.** Serverski HTML ostaje netaknut, pa
`verify-nojs` (minimum znakova) i `verify-claims` (zabranjeni obrasci u renderovanom HTML-u)
mere isto što i danas. Deljenje na serveru bi im promenilo ulaz.

⚠️ **Pristupačnost:** omotač nosi `aria-label` sa punim tekstom, komadi `aria-hidden`.

### 3 · Sekcije — `CRTA` uvodi, sadržaj je prosto tu

⚠️ **ISPRAVKA 2026-09-09 (`M1`):** ovde je pisalo „zamena za **osam** `data-reveal` fade-up-ova".
Danas ih je **sedam** — `stories` je obrisana. Posle `M1` ih je **šest**: `values` je prva
sekcija koja je prešla na nov rečnik.

✅ **Primitivi postoje od `M1`** — `[data-line]` (CRTA) i `[data-wipe]` (OTKRIVANJE), oba u MOTION
bloku `app/globals.css`. Ova površina je time iz „plana" prešla u „preostaje primeniti na šest
sekcija", što je `M2`.

| | |
|---|---|
| Okidač | ulazak u vidno polje |
| Mehanika | hairline se iscrta s leva (`scaleX`), pa sadržaj otkrivanjem |
| Trajanje | crta `--dur-fast`, sadržaj `--dur` sa razmakom od 90 ms |
| Pod `reduce` | crta stoji iscrtana, sadržaj vidljiv |
| Kapija | `js-motion` |

Aktér je **linija**, ne tekst. Sajt ima 16 mesta sa `var(--line)` — jezik već postoji.

### 4 · Brojke stižu pre sadržaja

Sajt numeriše sve: `01 / HOW IT WORKS`, koraci `01–04`, `20+ partner carriers`.

| | |
|---|---|
| Okidač | ulazak u vidno polje, **pre** svoje sekcije |
| Mehanika | otkrivanje s leva, `--dur-fast`, 120 ms pre sadržaja |
| Pod `reduce` | stoji |

Veže se na **isprekidanu liniju u 3D heroju** — oznake koje prolaze pored puta. To je jedina
stvar u planu koja postoji samo zato što je sajt o vožnji.

### 5 · Podstranice — isto što i naslovna

⚠️ **ISPRAVKA 2026-09-09 (`M1`), merenjem:** tvrdnja „`PageShell` ima nula pokreta" je
**tačna samo za `reveal`**. `data-stagger` je već na **četiri podstranice** —
`app/about`, `app/contact`, `app/for-carriers` (sve tri na `.sub-3up`) i `app/truckers-lounge`
(`.post-list`). Dakle `stagger` je „procurio" u `PageShell` svet, `reveal` nije.

Tačno stanje: `PageShell.tsx` sam po sebi nema nijedan motion atribut; pet stranica
(`/apply`, `/faq`, `/how-it-works`, `/privacy`, `/terms`) nema **nijedan** pokret, četiri imaju
po jedan `data-stagger`.

⚠️ **Ovo je propalo kroz procep između faza.** Faza 2 u naslovu kaže „podstranice u Fazi 3", a
Faza 3 je ispala copy faza. Niko nije primetio.

Rešenje: ritam se ugrađuje u **`PageShell.tsx`** i `sub-head`, jednom, umesto da se devet
stranica ukrašava pojedinačno.

### 6 · Prelaz rute — `View Transitions`, usmeren

| | |
|---|---|
| Mehanika | React `<ViewTransition>` — nativno u Next 16, **bez konfiguracije i bez biblioteke** |
| Ponašanje | napred/nazad imaju smer; zamenjuje sadašnji `.route-in` fade |
| Trajanje | `--dur` |
| Bez podrške u browseru | sajt radi normalno, prelaz se prosto ne animira |
| Pod `reduce` | bez prelaza |

### 7 · Shared element — naslov kartice → naslov članka

Jedini `card → page` tok koji sajt ima: kartica u `/truckers-lounge` → stranica članka.

| | |
|---|---|
| Nosilac | **naslov**, ne slika |
| Mehanika | `<ViewTransition name>` na oba kraja |

⚠️ **Slika ne može biti nosilac** — ali ne zato što slika nema. **Ispravka prvobitne tvrdnje
u ovom dokumentu (2026-09-08):** `public/images/` sadrži **šest fotografija**, ne nula.
Prvobitno je globovan samo vrh `public/` i ceo folder je promašen.

```
hero-01-night.jpg    + mobile   ← u upotrebi, kao fallback ispod 3D scene
hero-02-dawn.jpg     + mobile   ← NEISKORIŠĆENA
hero-03-sunrise.jpg  + mobile   ← NEISKORIŠĆENA
```

Dawn je kadar iz kabine — ruke na volanu, papiri i olovka na klipbordu, zora kroz
šoferšajbnu. Sunrise je kamion ka izlasku sunca na otvorenom putu. Obe su režirane kao set:
tamna leva trećina za tekst, topli izvor svetla desno.

⚠️ **U hero ne idu.** Odluka Pavlova, 2026-09-08: hero je 3D scena — kamion, pokret, izlazak
sunca već postoje u njoj. Fotografija tamo ostaje **samo fallback** i to joj je jedina uloga.
Gde (i da li) dve neiskorišćene idu drugde na sajtu je **otvoreno pitanje**, ne zadatak.

Za shared element prelaz nosilac je i dalje **naslov** — kartice članaka nemaju slike.

### 8 · Pritisak — `OKRET` umesto skupljanja

`MobileBar` nema `:active`. Na telefonu je to **jedini CTA bez odgovora na dodir**.

| | |
|---|---|
| Mehanika | strelica se okrene 45°, `--dur-fast` |
| Zašto ne `scale(.97)` | to je generički pritisak; okret je gest koji sajt već koristi na četiri mesta |

### 9 · Kartice — hover koji nije `translateY(-3px)`

Danas `.card:hover` podiže karticu za 3 px. To je generički potez.

| | |
|---|---|
| Predlog | hairline kartice se iscrta (`CRTA`), bez podizanja |
| Trajanje | `--dur-fast` |

⚠️ Ovo je jedina stavka u planu koja menja nešto što **radi** i **nije generičko po posledici,
samo po poreklu**. Ako se pri pregledu pokaže da podizanje bolje čita hijerarhiju, ostaje.

### 10 · Forme i baner

`settle` već radi: fokus prsten, puls na slanju, ulaz uspeha i greške. **Ne dira se.**

`CookieBanner` se teleportuje, ali je ugašen dok se ne uključi analitika — ide **sa** njom,
ne pre.

---

## Šta se namerno NE animira

- **Ništa u toku prijave** posle klika na submit osim postojećeg pulsa. Vozač koji je poslao
  formu čeka odgovor, ne predstavu.
- **Telefon i CTA** — nikad se ne skrivaju radi ulaza, ni na milisekundu.
- **Paralaks** — Pavlova odluka.
- **Preloader** — dodao bi čekanje tamo gde ga sada nema.
- **Deljenje na slova, rotacija i blur po slovu.**

---

## Redosled rada

| Batch | Sadržaj | Zavisi od |
|---|---|---|
| ~~**M1**~~ | ✅ **URAĐENO 2026-09-09** — `OTKRIVANJE` + `CRTA`, **uz jednu dokaznu primenu** na `values` | — |
| **M2** | površine 3, 4, 5 — sekcije, brojke, `PageShell` | M1 |
| **M3** | površina 2 — naslovi, deljenje na reči | M1 |
| **M4** | površina 1 — hero sekvenca | M1, M3 |
| **M5** | površine 6, 7 — View Transitions | — |
| **M6** | površine 8, 9 — pritisak i kartice | M1 |

M5 je nezavisan i može ranije ako se pokaže rizičnim.

## ⚠️ Zašto `M1` NIJE isporučen „bez ijedne primene"

Ovaj dokument je `M1` opisao kao čist rečnik, bez primene. **Tako ne može**, i razlog je u
sledećem odeljku: ugovor merenja traži da svaki motion batch dokaže **polaritet** i **`reduce`**.
Batch koji ništa ne primenjuje ostavlja **obe kapije prazne** — prošao bi time što je bez
posledice. To je isti slab oblik dokaza koji je `D4` razotkrio: *pravilo se primenjuje ≠ pravilo
se ponaša.*

`M1` je zato isporučen sa **tačno jednom** dokaznom primenom, na `values`: tri hairline-a se
iscrtaju s leva sa stepenicom, pa se imena osa otkriju 90 ms iza svoje linije. Isti postupak
kojim je `pay` proverio pretpostavku `D1`-a pre nego što je prepravljeno četiri sekcije.

## Kako se svaki batch meri

Pored šest postojećih kapija, svaki batch mora pokazati:

1. **Polaritet** — uklanjanje `js-motion` daje sav sadržaj vidljiv (isti dokaz kao Faza 2)
2. **`reduce`** — sa uključenim `prefers-reduced-motion` nema nijedne animacije, sadržaj potpun
3. **Bez JS-a** — `verify-nojs` nepromenjen na 14 ruta
4. **Registar** — `verify-claims` nepromenjen; deljenje teksta ne sme promeniti serverski HTML

⚠️ **Merenje pokreta iz Claude browser panela ne važi.** Panel drži tab u
`visibilityState: "hidden"`, pa se `IntersectionObserver` ne okida i watchdog uvek odradi svoje.
Sve što zavisi od skrola proverava se u **pravom browseru**.
