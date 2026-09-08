# DESIGN I MOTION — plan po površinama

Pisano 2026-09-08. Odluka o pravcu je Pavlova: **pokret kao karakter, bez paralaksa, bez
generičkih efekata**. Ovaj dokument je plan, ne implementacija — nijedan red CSS-a još nije
napisan po njemu.

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
| **D1** | **Taksonomija sekcija** — koja je cinematic, koja editorial, koja utility | odluka | **Pavla** |
| **D2** | Outline tipografija svedena na 2–3 mesta | struktura | — |
| **D3** | Utility blokovi — `$0`, `20+`, rok odgovora, 48 država kao podaci a ne proza | struktura | D1 |
| **M1** | Rečnik: `OTKRIVANJE` + `CRTA` kao primitivi | pokret | — |
| **M2** | `PageShell` ritam — pet stranica bez ijednog reveala | pokret | M1 |
| **D4** | Sticky proces sekcija | struktura + pokret | D1, M1 |
| **D5** | „What we don't do" kao manifest | struktura | D1 |
| **M3** | Naslovi — maska po reči | pokret | M1 |
| **D6** | Driver stories — preokvirivanje | **copy** | ⚠️ registar |
| **M5** | View Transitions — usmeren prelaz, shared naslov | pokret | — |
| **M4** | Hero sekvenca | pokret | M1, M3 |
| **M6** | Pritisak i kartice | pokret | M1 |

**D1 je uslov za polovinu liste** i jedina stavka koja se ne može izvesti merenjem — traži tvoju
odluku šta koja sekcija *jeste*.

**M1 i M5 su nezavisni** i mogu ranije ako se čeka na D1.

⚠️ **D6 ide kroz istu disciplinu kao Faza 4:** copy se prenosi ili odobrava, ne piše usput, i
prolazi `verify-claims`.

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

Zamena za osam `data-reveal` fade-up-ova na naslovnoj.

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

Danas: `PageShell.tsx` ima **nula** pokreta, pet stranica (`/apply`, `/faq`, `/how-it-works`,
`/privacy`, `/terms`) nema **nijedan** reveal, četiri imaju po jedan.

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
| **M1** | rečnik: `OTKRIVANJE` + `CRTA` kao primitivi, uz postojeća 6 | — |
| **M2** | površine 3, 4, 5 — sekcije, brojke, `PageShell` | M1 |
| **M3** | površina 2 — naslovi, deljenje na reči | M1 |
| **M4** | površina 1 — hero sekvenca | M1, M3 |
| **M5** | površine 6, 7 — View Transitions | — |
| **M6** | površine 8, 9 — pritisak i kartice | M1 |

M5 je nezavisan i može ranije ako se pokaže rizičnim.

## Kako se svaki batch meri

Pored šest postojećih kapija, svaki batch mora pokazati:

1. **Polaritet** — uklanjanje `js-motion` daje sav sadržaj vidljiv (isti dokaz kao Faza 2)
2. **`reduce`** — sa uključenim `prefers-reduced-motion` nema nijedne animacije, sadržaj potpun
3. **Bez JS-a** — `verify-nojs` nepromenjen na 14 ruta
4. **Registar** — `verify-claims` nepromenjen; deljenje teksta ne sme promeniti serverski HTML

⚠️ **Merenje pokreta iz Claude browser panela ne važi.** Panel drži tab u
`visibilityState: "hidden"`, pa se `IntersectionObserver` ne okida i watchdog uvek odradi svoje.
Sve što zavisi od skrola proverava se u **pravom browseru**.
