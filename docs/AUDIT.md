# AUDIT — šta je stvarno nedovršeno, i kojim redom se završava

Urađen 2026-09-05, četiri paralelna prolaza: konverzione podstranice, sadržajne podstranice,
motion i vizuelni sistem, komponente i izvori copy-ja. Svaka brojka ispod je izmerena, ne
procenjena; tvrdnje koje nisu izdržale proveru su izbačene i označene u § „Ispravke".

## Nalaz u jednoj rečenici

Sajt nije nedovršen zato što je nešto ostalo napola napisano — **nema nijednog TODO-a, lorema
ni privremenog teksta u celom `app/`, `components/` i `lib/`**. Nedovršen je zato što su
sekcije izostavljene, copy je pri prenosu prepisan kraće nego original, i zato što pokret
postoji tačno na jednom mestu.

Zato je merilo dovršenosti ovde **naslovna**: šest numerisanih poglavlja, svaka tvrdnja sa
potpornim blokom, svaka sekcija sa izlazom. Podstranice se mere prema njoj.

| Stranica | Ocena | Šta joj nedostaje do 5 |
|---|---|---|
| `/truckers-lounge/[slug]` | 4/5 | Vratiti činjenicu o prevremenom kraju follow-up testiranja |
| `/apply` | 3/5 | Pojas poverenja iznad forme; mikro-FAQ o violations/SAP |
| `/about` | 3/5 | Konverzioni završetak; blok činjenica o firmi |
| `/how-it-works` | 3/5 | Sekcija o modelu naknade koju naslovna već obećava linkom |
| `/faq` | 3/5 | Dva odobrena reda koja su pri prepisu ispala |
| `/truckers-lounge` | 3/5 | Završni CTA — jedina slepa ulica na sajtu |
| `/privacy` | 3/5 | Datum, ispravan procesor, dovršena numeracija |
| `/for-carriers` | 2/5 | Blok o naknadi, rok odgovora, sekcija „šta radimo pre" |
| `/contact` | 2/5 | „No phone tree", grananje po publici (radno vreme rešeno 09-05) |
| `/terms` | 2/5 | Datum, numeracija, pravni subjekt, governing law, kontakt |

---

## Faza 0 — ovo je pogrešno upravo sada

Nije nedovršeno nego netačno. Ide pre svega ostalog jer se tiče pravnog teksta i registra tvrdnji.

**0.1 · `app/privacy/page.tsx:69` — netačan procesor podataka.** Piše „our database hosted on
Cloudflare"; baza je Neon od prelaska 2026-09-05. Jedina korisnički vidljiva pojava u repou
(provereno grep-om — ostalo su komentari). Zaglavlje istog fajla (`:21-25`) zahteva da tekst
opisuje tačno ono što kod radi. Klasa popravke: faktička korekcija imena procesora, ne nova
tvrdnja — ne traži nov red u registru.

**0.2 · `app/not-found.tsx:24` — kršenje C53, i to regresija.** „Apply in 2 minutes ↗" stoji
kao **label dugmeta**. C53 je CONDITIONAL i dozvoljava tu formulaciju isključivo kao opisni
tekst uz formu ili u meta opisu; na dugmetu je izričito zabranjena, uz obrazloženje da je
pala kao acceptance FAIL na F5c prototipu. Stari sajt na istom mestu kaže „Apply for a job".
Bezbedna zamena koja se već koristi na `CinematicHome.tsx:174`: „Start your application ↗".
Ostalih pet pojava „2 minutes" u projektu je ispravno.

**0.3 · `app/how-it-works/page.tsx:84-86` — otvorena C52 površina.** Tekst nabraja uslove
podobnosti: „documents showing you're authorized to work in the US · enough English to handle
dispatch and DOT". C52 je **OPEN**, vlasnik je kvalifikovani američki advokat, a bezbedan
oblik dok je OPEN glasi: ne iznositi kriterijume podobnosti na sajtu, uputiti na razgovor.
Dodirna površina je federalno anti-diskriminaciono pravo i I-9.

⚠️ **Isti tekst stoji i u MAIN-u** (`C:/dev/growth/app/how-it-works/page.jsx:129-130`), dakle
izloženost postoji na živom, indeksiranom sajtu — ne samo ovde. Formulacija se ne predlaže;
registar izričito kaže da taj zaključak ne sme doneti niko osim advokata.

---

## Faza 1 — tokeni i mrtav CSS

Preduslov za sve što sledi. Bez ovoga svaki novi primitiv dodaje još tvrdih vrednosti u fajl
koji ih već ima previše.

**Izmereno stanje:** `:root` (`app/globals.css:2`) nosi **5 tokena**. U istom fajlu stoji
**27 unikatnih hex boja i 32 unikatne rgba vrednosti**. Šest boja se ponaša kao token a nema
ime — `#455044` se pojavljuje **17 puta**, `#8a3d12` 8, `#e2b183` 7, `#86502b` 7, `#e6dfce` 6.
Komentar na `:548-549` ih **naziva tokenima**, iako nijedan nije deklarisan. Alfa varijante
postojećih tokena su prekucane ručno: `rgba(22,32,25,…)` je `--ink` u **17 različitih alfa
vrednosti**, ukupno oko 45 pojava. Za greške postoje **četiri različite crvene**, bez tokena.
Ne postoji nijedan token za razmake, tipografsku skalu, radijuse, **trajanja** ni **easing**.

**Dve mrtve tranzicije — potvrđeno čitanjem obe linije:**
- `.nav-links a` (`:108`) postavi `opacity:.72` sa tranzicijom, a `:394` je pregazi na `opacity:1`
  → hover animira `1 → 1`.
- `.foot ul a` (`:122`) isti obrazac sa `:487`.

Uzrok je strukturni: blok od `:386` („Shared editorial rhythm") sistematski poništava ono što
su linije 1–380 postavile. Isti selektor je definisan do **7 puta** (`.qa`).

**Mrtve klase:** `.proof-section` — 2 CSS pravila, 0 upotreba u markup-u. `.journey-final` —
1 upotreba, 0 pravila. `.form-layout` — 2 upotrebe (`app/apply/page.tsx:10`,
`app/for-carriers/page.tsx:10`), 0 pravila; trag namere da forma dobije svoj raspored.

**Posao:** dodati tokene trajanja i easinga (`--dur-fast:.18s`, `--dur:.28s`,
`--dur-slow:.6s`, `--ease-out:cubic-bezier(.22,1,.36,1)` — isti easing koji stari sajt već
koristi, pa je pokret prepoznatljiv), imenovati šest boja koje se ponašaju kao tokeni, ukloniti
dve mrtve tranzicije i tri mrtve klase.

---

## Faza 2 — rečnik pokreta

**Arhitektonsko pravilo koje sve drži:** podrazumevano stanje je **VIDLJIVO**. Skriveno stanje
sme da postoji samo iza dvostruke kapije — klase koju doda JS **i** `prefers-reduced-motion:
no-preference`. Bez JS-a klasa nikad ne stigne, pravilo se ne poklopi, sadržaj se vidi. To je
suprotan polaritet od framer-motion-a, i projekat taj obrazac već ima na
`globals.css:272-278` + `HeroExperience.tsx:171`.

⚠️ **Kapija ovo ne proverava.** `scripts/verify-nojs.mjs:51-56` gleda isključivo inline
`style="..."` — `opacity:0`, `display:none`, `visibility:hidden`. Klasna rešenja ne vidi.
Predloženi pristup je bezbedan **po konstrukciji, ne po proveri**; ako se polaritet pogreši,
kapija će ćutati. Taj deo traži sopstvenu disciplinu ili proširenje kapije.

| # | Primitiv | Kako, bez framer-motion-a |
|---|---|---|
| 1 | `reveal` — sekcija ulazi | Jedan `IntersectionObserver` dodaje `.is-in` na `[data-reveal]`; skriveno stanje samo pod `html.js-motion` i `no-preference` |
| 2 | `stagger` — deca u nizu | Isti observer; kašnjenje kroz `transition-delay:calc(var(--i)*70ms)`, `--i` statički u markup-u |
| 3 | `lift` — hover na kartici | Čist CSS: `transform:translateY(-3px)` na `:hover,:focus-within` |
| 4 | `nudge` — strelica se pomera | Čist CSS; proširiti postojeći `rotate(45deg)` obrazac i na `:focus-visible` |
| 5 | `settle` — stanja forme | Dodati `box-shadow` u listu tranzicije na `:58`; puls dok je `aria-busy`; ulazna animacija za uspeh/grešku |
| 6 | `sweep` — prelaz rute | Traka već postoji (`app/loading.tsx`); `usePathname()` dodaje klasu na 250 ms. **Nikad `transform` na wrapperu** — vidi ispod |

Cena celog paketa: oko 40 linija CSS-a, jedan observer (~15 linija), jedan inline script od tri
linije. Nula novih zavisnosti.

**Primitivi 3, 4 i 5 su čist CSS bez ijedne linije JS-a** — mogu odmah, nula rizika za no-JS
kapiju. Primitivi 1 i 2 traže observer i idu poslednji, uz `npm run verify`.

### Mrtve zone — gde danas nema nikakvog pokreta

Osam sekcija naslovne (`CinematicHome.tsx:58,74,87,103,148,161,179,185`) pojavljuje se
odjednom. Tri kartice, četiri koraka i pet parova — bez ulaza. `MobileBar` nema `:active`
stanje, pa je na telefonu **jedini CTA bez taktilnog odgovora**. Uspeh forme
(`ApplyForm.tsx:171`) **iskoči bez ijednog signala** — najvažniji trenutak u toku konverzije.
`CookieBanner` se teleportuje. Prelaza stranice nema. `.af-field input:focus` prelazi
`border-color` ali `box-shadow` prsten upada trenutno, što deluje kao kvar.

### Šta se NE prenosi iz starog sajta

- **framer-motion u bilo kom obliku** — `Reveal.jsx:6-8` sam dokumentuje uzrok.
- **`TextReveal` po rečima** — svaka reč startuje na `y:115%` unutar `overflow:hidden`; bez
  JS-a naslov nije providan nego potpuno van kadra. Komentar beleži **46 pojava
  `translateY(115%)` samo na naslovnoj**. Hero naslovi ovde imaju `-webkit-text-stroke`
  konturu koja bi se lomila po rečima.
- **`lenis` / `SmoothScroll`** — trajni `rAF` loop koji nikad ne staje. `HeroExperience.tsx:146`
  je posebno projektovan da nema idle rAF; lenis bi se borio sa hero kontrolerom oko istog skrola.
- **`TiltCard` i `MagneticButton` u punom obimu** — prvi računa radial-gradient na svaki
  `mousemove` po kartici; drugi pomera dugme ispod kursora, pa meta beži od korisnika.
- **`transform` na page-transition wrapperu** — animirani transform pravi containing block za
  `position:fixed` potomke, a projekat ih ima tri (`.mobar`, `.consent-bar`, `.route-loading`)
  plus `.skip-link`. Čist `opacity` fade, ništa drugo.

---

## Faza 3 — podstranice, redom po šteti

**`/for-carriers` (2/5)** — jedina strana publike koja plaća, i najtanja na sajtu. Lede tvrdi
„You pay only for successful placements" bez potpornog bloka, a taj blok već postoji doslovno
na `CinematicHome.tsx:63-68`. Vozač dobija rok od 15–20 minuta na četiri mesta; **carrier ne
dobija nijedan rok, nigde**. Nema izlaza — fajl ne uvozi `Link`.

**`/contact` (2/5)** — najplića na sajtu, četiri kratka bloka. Izgubljena jedina
diferencirajuća rečenica: „No phone tree, no ticket number." (fraza ne postoji nigde u repou).
Lede pominje „hiring drivers", a strana nema link ka `/for-carriers`.

**`/terms` (2/5)** — nijedan pravni pasus nije izgubljen, svih pet sekcija je doslovno
preneto. Ali fali `Last updated`, fale brojevi sekcija (klasa `.sub-num` postoji i `/privacy` je
koristi), i **nema pravnog subjekta** — ugovor bez ugovorne strane. Nema governing law,
nema kontakt sekcije.

**`/apply` (3/5)** — forma je jača od stare. Ali ceo pojas poverenja iznad nje je izostavljen,
a CSS klasa `.sub-trust` za tačno tu namenu **postoji i ostilizovana je** (`globals.css:94,411`),
koristi je samo `/how-it-works`. Najskuplja tačka odustajanja: forma pita za violations i SAP,
a strana nigde ne kaže šta se dešava ako vozač odgovori Yes — a odgovor već postoji u
`lib/faq.js:14-17`.

**`/how-it-works` (3/5)** — sve sekcije postoje, ali su četiri pasusa prepisana naniže i jedan
link vodi u prazno: naslovna linkuje „How it works ↗" ispod sekcije o naknadi, a odredišna
stranica model naknade **nigde ne objašnjava**.

**`/about` (3/5)** — jedina strana čija poslednja akcija ne vodi ni ka prijavi ni ka telefonu.
Nema nijednu činjenicu o firmi; hero je bez lede-a.

**`/truckers-lounge` (3/5)** — jedina stranica na sajtu bez ijednog sledećeg koraka.

**`/privacy` (3/5)** — sve iz starog je ostalo, plus nova sekcija 05. Ali numeracija se
prekida (Cookies i Contact bez broja) i sekcije 02 i 05 **protivreče**: `:48` kaže „samo sa
carrier-ima", `:69` nabraja i Resend kao procesora. Registar to predviđa i nudi rešenje.

**`/truckers-lounge/[slug]` (4/5)** — **ne dirati sadržaj članaka.** Jedini deo sajta koji je u
prenosu dobio: treći članak je prepisan i skoro udvostručen, dodat je četvrti izvor,
uklonjena je konkretna CPM brojka i implicirana vetting tvrdnja. Jedino vredi vratiti činjenicu
da SAP može prekinuti follow-up testiranje po isteku prve godine.

**Zajednički nalaz:** stari sajt je imao `CallToAction` na dnu svake podstranice. Ovde ga nema
na `/truckers-lounge`, `/privacy` i `/terms`. Tri od četiri konverzione strane nemaju **nijedan
interni link iz tela** — tok je jednosmeran: uđeš na formu ili odustaneš.

---

## Faza 4 — copy, dva prolaza

**Prolaz 1 — vratiti ono što je pri prepisu ispalo.** FAQ ima svih 8 pitanja i isti redosled,
ali su svi odgovori **prepisani**, ne preneti: prosečna dužina je pala sa ~85 na ~55 reči.
Svi novi odgovori prolaze registar. Ali dva odobrena reda su ispala, oba vredna vraćanja jer
**jačaju** poziciju i sajt ih već tvrdi drugde:

- `lib/faq.js` — „we don't sell your information to marketers or lead brokers…" (C15, zaveden
  kao izričit KEEP)
- `lib/faq.js` — „your phone number doesn't get handed around. When you give us permission to
  call, that permission is for us…" (isti obim kao TCPA tekst u formi)

Izgubljena je i kanonska C21 formulacija („the real figures up front, not after you sign" +
bedž „Real Numbers Upfront") — parafraza na `CinematicHome.tsx:81` prolazi registar, ali
formulacije koju registar imenuje više nema nigde.

**Najveći pojedinačni gubitak: `KnowBeforeYouGo`.** Stari sajt je imao sekciju sa tri trampe,
po tri „Ask the carrier" pitanja za svaku, i blok „Where you are right now changes the answers"
— copy zaveden pod **jedanaest redova registra**, sa citiranim FMCSA/FDA/BLS izvorima. Novi
ekvivalent (`CinematicHome.tsx:87-95`) **zadržava isti naslov** „02 / KNOW BEFORE YOU GO" ali
nosi tri generičke kartice bez ijedne trampe, bez pitanja i bez izvora. Isti naslov sa
ispražnjenim sadržajem čita se kao propust, ne kao odluka o obimu. Po sadržaju pripada
`/apply` ili `/how-it-works`, ne naslovnoj.

**Prolaz 2 — nedoslednosti.** Sedam različitih labela za isto odredište `/apply`, tri od njih
na istoj stranici (`FIND MY NEXT ROUTE`, `LET'S FIND YOUR NEXT ROUTE`, `START MY APPLICATION`).
Rečenica o 15–20 minuta postoji u **šest instanci i tri varijante** („calls" / „calls back" /
„calls you back") — sve prolaze registar, ali rečenica sa sopstvenim redom u registru treba da
živi na jednom mestu i da se uvozi; obrazac već postoji (`ApplyForm.tsx:160` ima `successNote`).
Prefiks pristanka „By checking this box," stoji u tri od četiri forme — a to je tekst čija se
verzija upisuje u bazu uz svaki pristanak, pa jedan `CONSENT_TEXT_VERSION` sada pokriva dve
rečenice. `lib/posts.js` meša prave i tipografske navodnike između članka 1 i članaka 2–3.

**Rupa zatvorena 2026-09-05 — i nije zatvorena onako kako je nalaz predlagao.** Nalaz je
glasio: sajt se ograđuje sa „during business hours" na devet mesta a nigde ne kaže koje su to
sate, pa treba objaviti radno vreme. Pavlov odgovor ga je preokrenuo — tim je dostupan svaki
dan od jutra do kasno u noć, dakle **hedž nije bio nedovoljno definisan nego pogrešan**:
„business hours" opisuje firmu sa centralom i rasporedom, što je suprotno od pozicije sajta
(„no phone tree, a real person"), a objavljen raspored bi **suzio** ono što je stvarno tačno.

Rešeno kroz registar, bez objavljivanja rasporeda:

- C12 dozvoljena formulacija već priznaje „business/**staffed** hours" — svih devet pojava
  prešlo na „staffed".
- ⚠️ **Kapija je bila uža od registra koji sprovodi.** `verify-claims.mjs` je za drugi hedž
  tražio doslovno `/business hours/i`, pa bi ispravan copy oborio `npm run verify` na svih 13
  ruta i izgledalo bi kao greška u tekstu. Regex proširen na `/(business|staffed) hours/i`
  **pre** izmene copy-ja. Pouka šira od ovog slučaja: kapija koja odbija ono što registar
  dozvoljava tera pisca da prekrši registar da bi prošao build.
- Kanonska C13 rečenica („Call or text us daily — weekends included. We typically respond
  quickly during staffed hours.") vraćena na naslovnu, uz telefon u `home-close`.

⚠️ **Granica koja ostaje živa:** C13 je PROHIBITED za „Available 24/7", „around the clock" i
sve što implicira garantovan odgovor van radnih sati. Istina je blizu te granice, utoliko je
lakše preći je pri sledećem prolazu kroz copy. Provereno na renderovanom HTML-u: nijedan
zabranjen oblik nije prisutan.

Ostaje otvoreno: `openingHours` u `StructuredData.tsx` i dalje ne postoji — svesno, jer bi
strukturirani podaci objavili raspored koji sajt namerno ne objavljuje.

---

## Faza 5 — pravno, ide paralelno od danas

Najduže vreme čekanja, ne zavisi ni od jedne faze gore. C52 traži advokata. Privacy i TCPA
tekstovi su nacrti za pregled. `/terms` treba pravni subjekt, governing law i kontakt.

---

## Struktura koja je već jednom pukla

`"Capljinac LLC"` je hardkodovano na **sedam zasebnih površina** (tri API rute, privacy,
obe forme, footer, strukturirani podaci) — nijedna ne uvozi iz zajedničkog izvora. Ime je
svuda tačno. Ali to je **tačno ista struktura koja je u MAIN-u zahtevala ceo batch** kad je
halucinirano ime živelo na osam mesta bez izvora. `lib/contact.js` je prirodan dom.

Logotip-SVG je doslovno dupliran između `Nav.tsx:39` i `Footer.tsx:26`.

---

## Šta je već gotovo — ne raditi ponovo

- **Rubne stranice.** `global-error.tsx` nosi izmerenu činjenicu da pri padu root layout-a
  `document.styleSheets.length === 0`, pa su boje namerno inline. `error.tsx` namerno ne
  koristi `PageShell` da pad Nav-a ne obori i ekran greške.
- **Naslovna je gotova na nivou sadržaja** — šest poglavlja, bez lorema. „Driver stories"
  placeholder je odluka koju registar navodi kao **uzoran** primer (C16).
- **Metadata na svih 11 stranica**, `robots.ts` i `sitemap.ts` vezani za `IS_LIVE`, sitemap
  pokriva svih 13 URL-ova.
- **Hero motion je rigorozno izmeren** — vidi `HERO-MOTION-FIX.md`.
- **`Accordion.tsx` nije placeholder** — nativni `<details>`, odgovori su uvek u renderovanom
  HTML-u; rešava problem koji je MAIN morao da popravlja.
- **Rešeno u odnosu na MAIN:** članak o skrivenim troškovima bez CPM brojke i bez implicirane
  vetting tvrdnje · `CarrierForm` više ne obećava odgovor za 24 sata · članci dobili prave
  `description` i `modified` · `EmploymentAgency` + `legalName` u strukturiranim podacima.

---

## Šta automatska kapija ne hvata

`verify-claims.mjs` pokriva 7 zabranjenih obrazaca i 2 uslovna. **Ne pokriva:** C53 (nalaz 0.2
prolazi bez traga), C52 (nalaz 0.3 prolazi bez traga), doslednost pravnog imena, i faktičku
tačnost bilo koje vrste — nalaz 0.1 nije tvrdnja iz registra pa nijedan regex ne pomaže.

Dva nova pravila bi mehanizovala dva od tri prioritetna nalaza: broj minuta unutar teksta
dugmeta (C53), i `authorized to work|work authorization|enough English` (C52).

---

## Ispravke — tvrdnje koje nisu izdržale proveru

Agenti su prijavili da „48 continental states" i „Clearinghouse" ne postoje nigde u repou.
**Netačno:** „48 contiguous US states" stoji u `lib/faq.js:31`, „Clearinghouse" u
`lib/posts.js:130,146,186`. Tačan, uži nalaz je da te činjenice nisu na `/apply` kao signal
poverenja. Provereno da stvarno nemaju nijedan pogodak: „No hidden fees", „No phone tree",
„road-ready", „drop and hook".
