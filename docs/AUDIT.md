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

## Faza 0 — ✅ URAĐENO 2026-09-05

Nije bilo nedovršeno nego netačno. Išlo je pre svega ostalog jer se tiče pravnog teksta i
registra tvrdnji. Sve provereno na renderovanom HTML-u, ne samo u izvoru.

**0.1 · `app/privacy/page.tsx` — netačan procesor podataka. ✅** Pisalo je „our database hosted
on Cloudflare"; baza je Neon od prelaska istog dana. Ispravljeno na „hosted on Neon, and the
site itself runs on Vercel". Provereno: `Cloudflare` sada ima **nula pogodaka** u renderovanoj
stranici. Klasa popravke: faktička korekcija imena procesora, ne nova tvrdnja.

**0.1b · Ista stranica, sekcija 02 — protivrečnost sa sekcijom 05. ✅** *(prošireni obim,
vidi napomenu)* Sekcija 02 je tvrdila da se podaci dele „**only with** the specific carriers",
dok sekcija 05 dva pasusa niže imenuje Neon i Resend kao procesore. C15 tu protivrečnost
izričito predviđa i nosi **unapred odobrenu privremenu formulaciju**; ona je uklopljena u glas
stranice. „we never sell it" ostaje — C15 to dozvoljava; ono što zabranjuje je apsolutna
tvrdnja da se podaci ne dele ni sa kim.

> ⚠️ **Napomena o obimu.** Ovo nije bilo u Fazi 0 nego u Fazi 3. Urađeno je ovde jer ispravka
> 0.1 čini sekciju 05 eksplicitnijom o procesorima, čime **pojačava** protivrečnost sa
> sekcijom 02 — ostaviti je značilo bi svesno pogoršati pravni dokument koji se u istom potezu
> popravlja. Tekst je registarski odobren, ne nov. Revertibilno zasebno ako se ne slažeš.

**0.2 · `app/not-found.tsx` — kršenje C53. ✅** „Apply in 2 minutes ↗" je stajalo kao **label
dugmeta**; C53 to dozvoljava isključivo kao opisni tekst uz formu ili u meta opisu, a na
dugmetu izričito zabranjuje (palo kao acceptance FAIL na F5c prototipu). Zamenjeno sa „Start
your application ↗", formulacijom koja se već koristi na `CinematicHome.tsx:174`. Provereno:
`Apply in 2 minutes` ima **nula pogodaka** u renderovanoj stranici. Ostalih pet pojava
„2 minutes" u projektu je ispravno i netaknuto.

**0.3 · `app/how-it-works/page.tsx` — otvorena C52 površina. ✅ uklonjena, ⚠️ C52 OSTAJE OPEN.**
Spisak je nabrajao „documents showing you're authorized to work in the US · enough English to
handle dispatch and DOT". C52 zabranjuje svaku listu uslova za zaposlenje **po nacionalnosti,
imigracionom statusu ili jeziku**; te dve stavke su bile tačno na te dve ose i uklonjene su.
Preostale tri (CDL-A, vozački dosije, spremnost) nisu ni na jednoj zabranjenoj osi i ostaju.
Dodata je rečenica koja primenjuje **propisani bezbedan oblik dok je C52 OPEN** — uputiti na
razgovor: „Carrier requirements vary. Anything else that matters for a specific carrier, we go
through with you on the call."

Provereno u renderovanom HTML-u: `authorized to work`, `enough English` i `work authorization`
vraćaju **nula pogodaka**.

> ⚠️ **Ovo ne zatvara C52.** Uklonjena je zabranjena površina; odluka nije doneta. Vlasnik reda
> je kvalifikovan američki advokat i samo on sme doneti taj zaključak. Status ostaje OPEN.

⚠️ **Isti tekst i dalje stoji u MAIN-u** (`C:/dev/growth/app/how-it-works/page.jsx:129-130`),
na sajtu koji je indeksiran i prima prave prijave. MAIN se iz ovog projekta ne dira — ali
izloženost tamo postoji i nije uklonjena ovim radom.

---

## Faza 1 — ✅ URAĐENO 2026-09-05

Preduslov za sve što sledi. Bez ovoga bi svaki novi primitiv dodavao još tvrdih vrednosti u
fajl koji ih već ima previše.

**Šta je urađeno:** šest boja koje su se već ponašale kao tokeni dobilo je ime (`--moss`,
`--bone-dim`, `--clay-deep`, `--clay-mid`, `--clay-soft`, `--clay-light`) — **47 zamena**;
dodata su četiri tokena za pokret (`--dur-fast`, `--dur`, `--dur-slow`, `--ease-out`,
gde je krivulja ista koju stari sajt koristi u sve četiri reveal komponente); uklonjene su
dve mrtve tranzicije i tri mrtve klase.

**Dokaz da se izgled nije pomerio.** Nije uzet uzorak elemenata nego je poređen **razrešen
izvor**: u novom fajlu su `var()` reference vraćene u heks vrednosti, komentari uklonjeni, i
rezultat diffovan protiv `globals.css` iz prethodnog commita. Diff sadrži **tačno četiri
izmene i nijednu drugu** — dodate `:root` deklaracije, uklonjen `.proof-section` prefiks,
uklonjena dva `.nav-links a` pravila, uklonjena mrtva polovina `.foot ul a`. Svih 47 zamena
vraća bajt-identičnu vrednost.

**Dve ispravke audita, otkrivene pri radu:**

- ⚠️ **`.proof-section` nije imao dva mrtva pravila nego jedno i po.** `globals.css:17` je bio
  **deljeni** selektor `.proof-section :focus-visible,.af :focus-visible` — a `.af` je apply
  forma i živa je. Brisanje celog pravila, kako je nalaz sugerisao, oborilo bi boju fokus
  prstena na formi. Uklonjen je samo prefiks.
- ⚠️ **`.foot ul a` hover nije bio potpuno mrtav.** Mrtav je bio `opacity:1` (baza je već 1 iz
  kasnijeg bloka), ali **podvlačenje je radilo**. Uklonjena je samo mrtva polovina.

**Posledica koju treba znati:** nav linkovi sada nemaju **nijedno** hover stanje. Nisu ga imali
ni pre — pravilo je postojalo ali je animiralo `1 → 1`, pa je samo *izgledalo* kao da postoji.
Pravo hover stanje je posao Faze 2 (primitiv `nudge`).

**Nije rešeno i čeka svoj prolaz:** `rgba(22,32,25,…)` je `--ink` prekucan ručno u 17 različitih
alfa vrednosti (~45 pojava), a za greške postoje **četiri** crvene (`#e0714f`, `#ffa68b`,
`#9d2e16`, `#942b14`). Svođenje crvenih na dve je vizuelna odluka, ne čišćenje, pa nije išlo u
ovu fazu.

### Zatečeno stanje pre ove faze

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

## Faza 2 — ✅ URAĐENO 2026-09-05 (primenjeno na naslovnu; podstranice u Fazi 3)

Šest primitiva, ~90 linija CSS-a u jednom bloku na **kraju** `globals.css` (namerno: blok od
`:400` sistematski pregazuje sve iznad sebe i već je proizveo dve mrtve tranzicije), jedan
klijentski `components/Motion.tsx`, i jedna inline skripta u `app/layout.tsx`. Nula novih
zavisnosti.

Naslovna je dobila **8 `data-reveal` sekcija i 3 `data-stagger` kontejnera**. Hero nije
dodirnut — ima svoj kontroler i svoju izmerenu podešenost (`HERO-MOTION-FIX.md`).

### Šta je dokazano merenjem

| Provera | Ishod |
|---|---|
| Serverski HTML nosi `<html lang="en">` bez ijedne klase | ✅ pravilo se bez JS-a ne može poklopiti |
| Nula inline `opacity:0` / `display:none` u serverskom HTML-u | ✅ |
| Uklanjanje `js-motion` → svih 8 sekcija na `opacity: 1` | ✅ **polaritet dokazan** |
| Dodavanje `.is-in` → `opacity: 1`, `transform: none` | ✅ CSS mehanika radi |
| Skriven tab → watchdog otkriva sadržaj posle 3s | ✅ degradacija radi |
| `verify` · `test:rendered` · `test` | PASS+PASS · 9/9 · 120/120 |

### ⚠️ Bug koji je merenje otkrilo, i popravka

Prva verzija je postavljala `data-motion-ready` odmah po montiranju komponente. Izmereno:
**u tabu sa `visibilityState === "hidden"` browser uopšte ne isporučuje IntersectionObserver
callback-ove** — provereno kontrolnim observer-om koji nema veze sa ovim kodom, i ni on se
nije okinuo. Posledica: komponenta je živa, observer ćuti, a atribut je **razoružao watchdog**
— sadržaj bi ostao skriven zauvek.

Realan scenario nije egzotičan: otvaranje sajta u pozadinskom tabu (srednji klik, „open in new
tab"). Popravka je da se odgovornost preuzima tek kad tab stvarno postane vidljiv; do tada
watchdog radi i posle 3s otkriva sve bez animacije. Lošije izgleda, ali se **vidi** — a to je
jedini ishod koji sme da postoji.

### ⚠️ Šta NIJE moglo da se proveri odavde

**Okidanje observer-a na skrol u vidljivom tabu.** Browser panel drži tab u
`visibilityState: "hidden"`, gde IntersectionObserver ne isporučuje callback-ove — isto
ograničenje zbog kog se ni 3D hero ne može proveriti odatle. Traži pravi browser.

Sve ostalo — polaritet, CSS mehanika, degradacija — jeste izmereno i prolazi.

### Original plana



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

## Faza 3 — ✅ URAĐENO 2026-09-05 (osim onoga što traži advokata i Pavla)

**Načelo:** sav dodat tekst je **prenet, ne napisan**. Svaka nova rečenica dolazi sa mesta gde
je već prošla registar tvrdnji — naslovna, `lib/faq.js`, `Footer.tsx`, ili MAIN. Tamo gde bi
trebalo napisati nov tekst, nije napisan nego zaveden kao otvoreno.

**Obim sadržaja u serverskom HTML-u, izmereno pre/posle:**

| Ruta | Pre | Posle |
|---|---|---|
| `/for-carriers` | 1743 | **2548** (+46%) |
| `/contact` | 1620 | **2181** (+35%) |
| `/apply` | 2028 | **2541** |
| `/how-it-works` | 2536 | **2985** |
| `/terms` | 1886 | **2190** |
| `/privacy` | 4326 | **4651** |
| `/truckers-lounge` | 1552 | 1644 |
| `/about` | 1858 | 1928 |

Kapije: typecheck 0 · lint 0 · test 120/120 · build 0 · verify PASS+PASS · rendered 9/9.

### Šta je urađeno po stranici

- **`/for-carriers`** — pojas poverenja, tri numerisane sekcije (model naknade doslovno sa
  naslovne, pokrivenost doslovno iz `lib/faq.js`, pravni odnos doslovno iz `Footer.tsx`),
  i izlazi ka `/how-it-works` i `/about`. Fajl više nije bez ijednog internog linka.
- **`/contact`** — vraćena „No phone tree, no ticket number" (fraza koja u repou nije
  postojala nigde), vraćeno „free for drivers, always", i dodato **grananje po publici**
  u tri sekcije. Carrier više ne dobija formu za vozače.
- **`/terms`** — brojevi sekcija 01–06, `Last updated`, imenovano pravno lice, Contact
  sekcija, završni CTA.
- **`/privacy`** — `Last updated`, numeracija dovršena (Cookies → 06, Contact → 07),
  završni CTA. Datum je zajednički izvor sa `/terms` (`LEGAL_UPDATED` u `lib/contact.js`),
  jer ih MAIN drži odvojeno i već su se razišle.
- **`/apply`** — pojas poverenja iznad forme (`.sub-trust` je postojao i bio ostilizovan, a
  koristila ga je samo `/how-it-works`), i mikro-FAQ o prekršajima/SAP-u koji se **čita iz
  `lib/faq.js`**, ne prekucava — taj tekst nosi C36 i C19.
- **`/how-it-works`** — dodata sekcija „03 · How we get paid", jer je naslovna već linkovala
  ovamo obećavajući objašnjenje naknade a stranica ga nije imala.
- **`/about`** — završetak promenjen sa jednog linka na dva konverziona izlaza.
- **`/truckers-lounge`** — završni CTA; bila je jedina slepa ulica na sajtu.

### ⚠️ Tri predloga audita koje sam odbio, i zašto

Agent je predložio vraćanje četiri „oslabljena" pasusa sa `/how-it-works`. Vratio sam **jedan**;
tri nisam, i to je neslaganje sa auditom, ne propust:

- **„Most recruiters keep the process vague so you keep calling back."** Negativna univerzalna
  tvrdnja o konkurenciji. `verify-claims.mjs` ima pravilo D20 baš protiv te klase, ali njegov
  regex gađa konkretne fraze (`scam and cheat`, `most recruiters lie`) — ova bi **prošla
  kapiju** a prekršila njen smisao.
- **„not the ones paying us most that week"** — implicira da konkurencija to radi. Ista klasa.
- **„But we'll never be the reason you wait."** — apsolutno obećanje o sopstvenom učinku
  („never"), bez ijednog reda u registru.

Nijedna od te tri nema red u `CLAIMS.md` (provereno grep-om). Vraćeno je samo
„Everything between your application and your first load:" — opis obima, bez ocene.

### ⚠️ Otvoreno — traži Pavla ili advokata, ne mene

- **Rok odgovora za carrier-a.** Vozač ga dobija na četiri mesta (15–20 min, uz oba C12
  hedža), carrier nijedan. MAIN-ova formulacija („within 24 hours") je tvrdnja bez reda u
  registru i ovaj projekat ju je svesno izbacio. Nov rok traži Pavlov input.
- **`/terms`: governing law, arbitraža, intelektualna svojina, uslovi prekida.** Sve četiri
  traže kvalifikovanog američkog advokata. Stranica je do njih nepotpuna.
- **C52** ostaje OPEN (vidi Fazu 0).
- **`KnowBeforeYouGo`** — najveći sadržajni gubitak (jedanaest redova registra sa citiranim
  FMCSA/BLS izvorima) i dalje nije vraćen. Po obimu je zaseban posao, ne stavka u fazi.

### Original plana



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

## Faza 4 — ✅ URAĐENO 2026-09-06

Pet commita, grana `faza-4-copy` spojena u `master` (`b3cfb09`, `eb7c469`, `3ece835`,
`11d4484`, `41e277c`, `d012863`).

### Šta je urađeno

**Prolaz 1** — vraćena sva tri odobrena mesta, doslovno iz izvora: C15 lead-brokeri i obim
TCPA pristanka u `lib/faq.js`, i kanonska C21 formulacija na naslovnoj.

**Prolaz 2** — prefiks pristanka ušao u sam `CONSENT_TEXT` uz novu `CONSENT_TEXT_VERSION`;
C12 rečenica svedena na jedan izvor (`CALLBACK_SENTENCE` u `lib/contact.js`); CTA natpis
sveden na jedan (`APPLY_CTA` u `lib/cta.js`); navodnici u `lib/posts.js` ujednačeni.

**Dodato van plana:** hero je dobio „Applying does not commit you to a job." — prenetu iz
bočne trake `/apply`, gde ju je vozač video tek pošto klikne.

### ⚠️ Gde je ovaj dokument bio netačan

Pisan je pre nego što je Faza 3 završena, pa su mu tri brojke odlutale. Izmereno 2026-09-06:

| Ovde piše | Stvarno stanje |
|---|---|
| C12: „šest instanci i tri varijante" | **devet pojava, pet varijanti** (+ `callback`, `Usually within`) |
| prefiks pristanka: „tri od četiri forme" | **dve od tri površine** — četvrta forma ne postoji |
| C21: navodi varijantu iz `ValueCards.jsx` | registar (`CLAIMS.md:300`) imenuje **drugu**, iz `StackingDeck.jsx` — uzeta je ta, registar je merodavan |

⚠️ **A gde je bio u pravu, a ja nisam.** Spisak labela ovde navodi `FIND MY NEXT ROUTE` —
tvrdio sam da ne postoji, jer je moja pretraga išla po pozivima a natpis je stajao kao
**podrazumevana vrednost propa** (`ApplyLink`). Zbog toga je prva konsolidacija promašila
**hero dugme**, najvidljiviji CTA na sajtu. Otkriveno tek gledanjem stranice, ne brojanjem
(`11d4484`).

⚠️ **C53 je presudio pitanje natpisa pre nego što je postavljeno.** Registar kaže da dugme
mora reći **šta radi**, imenuje „Start your application" kao primer, i beleži da je
neodređen CTA već jednom pao kao acceptance FAIL na F5c prototipu. `FIND MY NEXT ROUTE` je
tačno taj tip — vraćanje bi ponovilo grešku koju je projekat sam zapisao.

### ⚠️ Šta ostaje otvoreno iz ove faze

**`KnowBeforeYouGo` — ✅ ZATVOREN u Fazi 6** (`358a812`, 2026-09-07). Vidi sekciju Faza 6.

⚠️ **Opis niže („najveći pojedinačni gubitak") bio je delimično netačan i pre toga.**
Tvrdio je da sadržaj ne postoji nigde na sajtu; izmereno 2026-09-08, pun sadržaj je bio
prenet na `/how-it-works` još u Fazi 3 — nedostajao je samo na naslovnoj. Faza 6 je to
proverila istom merom i zatvorila.

**Navigacioni chrome** — Nav („APPLY NOW"), MobileBar („Apply ↗") i Footer („Apply") nisu
uključeni u konsolidaciju natpisa. Nisu CTA dugmad nego chrome pored jednorečnih suseda
(`Call`, `Text`, `FAQ`); duga rečenica bi tamo bila regresija izgleda. Razlog je upisan u
`lib/cta.js`. **Čeka Pavlovu odluku — jedina preostala stavka iz Faze 4.**

### Original plana

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

## Faza 6 — ✅ URAĐENO 2026-09-07 (spojeno i deploy-ovano 2026-09-08)

Nije bila u originalnom planu od pet faza. Nastala je iz onoga što je Faza 4 ostavila i iz
jednog nalaza o samoj kapiji.

### `8599caa` — kapije prestaju da broje i počinju da porede

⚠️ **Claims kapija je do tada merila PRISUSTVO hedža na stranici, ne njegovu blizinu
tvrdnji.** Stranica sa „15–20 minutes" u jednom pasusu i „usually" u sasvim drugom prolazila
je kao ispravna. To je kapija koja umiruje, ne kapija koja hvata.

Nov `scripts/claims-rules.mjs` (+262) poredi hedž **uz samu tvrdnju**; `verify-claims.mjs`
sveden na pozivaoca. Uz to `lib/routes.js` kao jedan izvor spiska ruta — `verify:nojs` je
time skočio sa 11 na **14 ruta**, jer su tri postojale a nisu bile merene. Testovi 120 → 132.

### `358a812` — `KnowBeforeYouGo` dobija stranicu

Pun sadržaj na `/how-it-works#know-before-you-go`: tri trampe sa hedžom, devet „Ask the
carrier" pitanja, blok „Where you are right now" sa tri modifikatora. Redovi registra
C23-C25, C27, C40, C30-C33, C34, C35, C37.

Naslovna: kicker `02 / KNOW BEFORE YOU GO` → **`02 / WHAT TO COMPARE`**, uz link ka
preseljenoj sekciji. Kartice ostaju — rade svoj posao na naslovnoj — ali naslov više ne
obećava ono čega tu nema. **Obećanje i odredište spojeni**; razdvojeni su već jednom koštali.

⚠️ **CTA iz izvora („Review your choices") NIJE prenet** — vratio bi varijantu natpisa koju
je Faza 4 upravo svela na `APPLY_CTA`. Prenos koji poništava prethodnu fazu nije prenos.

⚠️ **C41 (OPEN) zatvorena usput:** `„the drivers we place right now"` → `„the first drivers
who come to us"`. C41 zabranjuje svaku konstrukciju u prezentu koja tvrdi aktivno plasiranje;
GROWTH je nova firma bez zabeleženih plasmana. **Promaklo kroz sedam claims batch-eva** jer je
pasus zaveden pod C16 još u CL1, a C41 je nastao tek u L1.

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
