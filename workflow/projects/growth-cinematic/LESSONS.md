# LESSONS — growth-cinematic

> **Jedna činjenica = jedan unos.** Piše se na `/close`, čita jednom na `/kickoff` (poslednjih
> sedam, od kraja fajla). Najstarije na vrhu, **najnovije na dnu**.
> Cap: 300 linija (upozorenje, ne bloker). Postavljeno 2026-09-09 iz `docs/STATUS.md`.

---

## L1 — Zaostali server daje lažan prolaz. Tri puta.
Kapije su prijavljivale zeleno dok je pozadinski server pao na zauzet port, pa se merio
**prethodni build**.
**Pravilo:** pre svakog merenja `netstat -ano | grep 3000`, pa `taskkill /PID <pid> /T /F`
(na Windows-u `kill` iz Git Bash-a **ne gasi** Node), pa potvrdi da je port slobodan.

## L2 — `node --test` ne prosleđuje argv, pa meta merenja mora ići kroz env.
Sa `-- --base https://nepostojeci` test je i dalje prolazio 9/9 — tiho je merio `localhost`.
**Kapija koja meri pogrešnu metu a prijavi PASS je gora od kapije koja padne.**
**Pravilo:** `VERIFY_BASE=<origin>`, nikad `-- --base`, i **meta se uvek ispisuje** (`2accf84`).

## L3 — Element koji se menja imperativno van React-ovog rendera pravi hidracioni nesklad.
`MOTION_GATE` skripta i `Motion.tsx` dodaju klase van rendera; React pri hidraciji zatiče atribut
koji njegovo stablo ne deklariše. Rešenje je `suppressHydrationWarning` na **tačno tom** elementu.
⚠️ **Prvo je zatvoreno kao „dev artefakt" — pogrešno**, na osnovu pretpostavke umesto dokaza.
Pavlov screenshot Next overlay-a pokazao je suprotno.
⚠️ **Zašto je vredelo:** da je React skinuo `js-motion`, ceo rečnik pokreta bi tiho ne radio
ništa, a **nijedna kapija to ne bi uhvatila** — `verify-nojs` gleda inline stilove, ne klase.

## L4 — Deljeni CSS selektor se skraćuje, ne briše.
`.home-steps p,.home-value-grid p,.home-founder p` — brisanje celog reda bi oborilo dva živa
selektora. Isti obrazac je jednom zamalo oborio `.af` kroz `.proof-section`.
**Pravilo:** iz deljenog selektora se skida **samo prefiks**; pojavio se **tri puta**.

## L5 — Konsolidacija prijavljena kao gotova a nije bila, jer je vrednost bila u default-u propa.
`FIND MY NEXT ROUTE` nije stajao ni na jednom pozivu nego kao **podrazumevana vrednost propa**,
pa ga pretraga po pozivima nije našla — i hero dugme, najvidljiviji CTA, ostalo je staro.
Otkriveno **gledanjem stranice**, ne brojanjem po izvoru (`11d4484`).

## L6 — Vizuelna odluka se ne verifikuje čitanjem koda.
`pay` figura je dobila `.66fr` (411 px na 1280) i `$0` je u njoj **plivao**. Kod ispravan,
brojevi ispravni, **pretraga po izvoru to ne bi našla nikad**. Nađeno gledanjem, ispravljeno na
`.42fr`. **Druga pojava iste klase greške** posle `L5`.

## L7 — Browser panel nije merni instrument za skrol, i ume da otkaže potpuno.
Panel drži tab u `visibilityState:"hidden"`, pa se `IntersectionObserver` ne okida i watchdog
uvek odradi svoje. **Gore od toga:** 2026-09-09 je usred provere `D4` **izgubio layout u celini**
— `docH=900`, svi elementi nulte visine, iako DOM ima svih 9 sekcija. Nije se oporavio ni posle
zatvaranja taba, ni posle `resize`-a, ni posle fronting-a.
**Pravilo:** sve što zavisi od skrola, `IntersectionObserver`-a, sticky-ja ili 3D scene traži
`manual` kapiju — **bez obzira na tier** (`RULES §3`).

## L8 — Kapije ne mere kontrast, pa promena podloge tiho gasi tekst.
`guard` i `founder` su prešli na forest podlogu; sve nasleđeno je računalo na krem — telo u
`--moss`, ivice u `rgba(22,32,25,.22)`, labele u `#5b6659`. **Ništa od toga se ne vidi na
forestu**, a `verify-nojs` gleda inline stilove, **ne kontrast**. Sekcija bi bila tamna i prazna
i **prošla bi zeleno**.

## L9 — Simetrija je pogrešan kriterijum za dizajn; sadržaj je tačan.
`pay` utility nosi broj (`$0`), pa je izgledalo da i `values` treba broj. **Ne sme:** sekcija
tvrdi *„A bigger number isn't the whole offer."* — veliki broj bi oborio sopstvenu rečenicu.
**Pravilo:** „utility" ne znači „ima broj", nego da je display element **ono što podatak jeste**.

## L10 — Verzali idu u CSS, ne u izvor teksta.
Faza 4 je platila to što je `FIND MY NEXT ROUTE` bio verzalan u izvoru: natpis se nije mogao
deliti bez promene izgleda (`3ece835`). Isto rešeno u `values` (`01 — PAY` → `Pay` +
`text-transform`). **Bonus:** čitač ekrana dobija „Pay", ne slovo po slovo.

## L11 — Odbrana od optužbe koju niko nije izneo sama uvodi sumnju.
Plan je tražio da *„No stock photos. No invented reviews."* pređe iz `stories` u `guard`.
Pavlova odluka: ne prelazi. **Obećanje da nema izmišljenih recenzija pretpostavlja optužbu.**
**Pravilo:** brisanje je jače od selidbe kad rečenica brani nešto što niko nije napao.

## L12 — Sticky nije animacija, pa ga `reduce` kill switch ne gasi — i ne treba.
`prefers-reduced-motion` gasi `animation` i `transition`, **ne `position`**. To je **tačan
ishod:** `reduce` postoji zbog vestibularnih tegoba, a sticky element se **ne pomera** — stoji
dok se stranica kreće. Paralaks bi morao da se gasi; zato ga i nema u planu.
⚠️ **Ali sticky ima svoju zamku koju nijedna kapija ne meri:** ako je element viši od vidnog
polja, dno mu ostaje **trajno nedohvatljivo**. Ne dešava se na laptopu, dešava se na 200% zoom-u.
`@media(max-height:...)` vraća normalan tok.

## L13 — Čisto radno stablo ne znači da nema nespojenog rada.
Faza 6 je postojala **samo na lokalnoj nepušenoj grani** dok je sledeća sesija nije otkrila
slučajno — i to tek kad je krenula da piše **isti sadržaj ponovo**. `master` je nije imao,
GitHub je nije imao, `STATUS.md` je nije pominjao.
**Pravilo:** na početku sesije `git branch -vv` **i** `git ls-remote --heads origin`, ne samo
`git status`.

## L14 — Jedan ručno pisan dokument kao jedina memorija projekta ne skalira.
`docs/STATUS.md` je 2026-09-09 narastao **459 → 735 redova u jednoj sesiji** (+60%). Dve netačne
tvrdnje u njemu nađene su **slučajno**, u prolazu; jedna je **protivrečila dvema drugim
tvrdnjama u istom fajlu**. Zato ovaj workflow i postoji.
**Pravilo:** deklaracije žive u `CONTEXT.md`, pozicija u `STATE.md`, istorija u arhivi — i svaki
blocking dokument ima cap.

## L15 — Skriveno stanje iza kapije nije dovoljno; i VIDLJIVO mora biti iza nje.
`M1` je `clip-path:inset(-.3em)` stavio u **bazno** pravilo, a samo skriveno stanje iza
`html.js-motion` + `no-preference`. Sadržaj se video svuda, sve kapije zelene, i komentar je
tvrdio *„fail-safe po konstrukciji"*.
⚠️ **Tvrdnja je važila za VIDLJIVOST, ne za posledicu.** `clip-path ≠ none` pravi containing
block za `position:fixed` **i `position:absolute`** potomke — pa ga je svaki `[data-wipe]`
element nosio **trajno**: bez JS-a, pod `reduce`, kod posetioca koji nikad neće videti animaciju.
**Pravilo:** kad primitiv ima posledicu i u vidljivom stanju, **oba** stanja idu iza kapije.
Tada „nema pokreta → nema posledice" važi po konstrukciji, a ne po disciplini.
Uzgred: kad watchdog skine `js-motion` usred otkrivanja, `clip-path` pada na `none`, što se ne
interpolira — sadržaj se otkrije istog frejma. Tačno ono što watchdog i treba da uradi.

## L16 — `position:relative` u primitivu tiho gasi `position:sticky` na istom elementu.
`[data-line]{position:relative}` ima istu specifičnost (0,1,0) kao `.process-lede{position:sticky}`
i `.card--cta{position:sticky}`, a stoji kasnije u fajlu — **pobeđuje**. Nema greške, nema kapije;
element prosto prestane da se lepi. `M2` i `M6` idu baš na te površine.
**Pravilo:** svaki primitiv koji postavlja `position` mora u komentaru imenovati šta gazi.

## L17 — Pokret se ne sme ugnezditi u oba smera, i nijedna kapija to ne vidi.
1. **`data-wipe` nikad ispod skrivenog `data-reveal`/`data-stagger` pretka.**
   `IntersectionObserver` meri **geometriju, ne `opacity`** — unutrašnji wipe se okine i
   **potroši** dok je predak još na `opacity:0`. Kad se predak pojavi, pokret je već gotov.
   To je najjači razlog zašto je `data-reveal` skinut sa `values` sekcije — jači od estetskog.
2. **`data-line` nikad unutar `data-wipe` elementa** — clip guta pseudo-element, pa linija ne
   može da vodi. Zato je jedini ispravan raspored: linija na kontejneru, wipe na tekstu u njemu.

## L18 — Provera koja prijavi defekt može biti pokvarena sama.
Tri puta u `M1` je moj `grep`/regex prijavio problem kojeg nema: `transition:clip-path` sadrži
`clip-path` kao **ime svojstva**, a `[data-wipe]{clip-path` je podstring od
`html.js-motion [data-wipe]{clip-path`. Selektor iza `@media(...){` je uz to lomio regex koji
je isključivao `{`.
**Pravilo:** kad provera prijavi defekt, **prvo proveri proveru**. Lažan negativ košta isto
koliko i lažan pozitiv, a ovde je tri puta poslao u pogrešnom smeru.

## L19 — Više prekršaja u ISTOM testu se ne vidi; petlja puca na prvom.
`G2` je falsifikovan sa dva prekršaja odjednom — jedan na članku, jedan na `/404`. Kapija je
pocrvenela **samo na članku**: obe rute proverava ista tvrdnja (`G1/A`), a `assert` prekida
petlju na prvom pogotku. `/404` nikad nije ni izmeren.
⚠️ **Zeleno na `/404` u tom trenutku ne bi značilo „pokriveno" nego „nije stigao na red".** Da
sam stao tu, prijavio bih obuhvat koji nisam dokazao — a `G2` je celom svojom svrhom baš batch
o nedokazanom obuhvatu.
`G1` je izgledao kao protivprimer (tri prekršaja, tri crvena) samo zato što su tamo bili u
**tri različita** `test()` bloka; `node:test` ih izoluje.
**Pravilo:** falsifikuj **jedan prekršaj po pokretanju** kad više njih pada pod istu tvrdnju.
Dokaz obuhvata je po ruti, ne po batchu. Vidi [[verify-gates-before-commit]].

## L20 — Zelena kapija ume da bude zelena zato što nema šta da pregleda.
`G2` je dokazao da `G1/A` i `G1/B` **posećuju** 14 ruta i taj obuhvat je bio tačan. `M2` je
izmerio šta su tamo **nalazile**: `data-wipe` je do tada postojao samo na `/` (3 elementa), pa je
na **13 od 14 ruta** petlja obilazila prazan spisak. Trinaest zelenih kvačica značilo je „nemam
šta da proverim", ne „proverio sam".
⚠️ **Dva različita pitanja:** *„koliko RUTA kapija pokriva"* i *„koliko ELEMENATA je stvarno
pregledala"*. Prvo se vidi iz spiska ruta; drugo traži da se prebroji ono što tvrdnja obilazi.
**Pravilo:** kad kapija štiti ograničenje nad atributom kojeg još skoro nigde nema, ispiši ili
izmeri **broj pregledanih elemenata po ruti**, ne samo broj ruta. Inače prva stvarna upotreba
atributa ulazi u kod uz kapiju koja do tada nije ništa tvrdila. Vidi [[verify-gates-before-commit]].

## L21 — `grep -l` po izvoru broji i komentare, i mene je uhvatio u istom batchu koji to zna.
`M2` je u komentar `PageShell`-a upisao da shell renderuje i `app/error.tsx`. Ne renderuje —
`error.tsx` **namerno** ne koristi shell, i baš ta rečenica („NAMERNO BEZ `PageShell`-a") je ono
što je `grep -rl "PageShell" app/` uhvatio.
⚠️ Netačna tvrdnja je prošla `/plan`, `/execute` i `/close` i **ušla u commit** (`1a3bca5`), iako
je isti batch merio census koji je nju demantovao: 13 ruta × 1 + `/` × 3 = **16**, bez `error.tsx`.
Dokaz je postojao i nije bio pročitan kao dokaz.
**Pravilo:** spisak fajlova koji nešto „koriste" izvodi se iz **poziva** (`grep -l '<PageShell'`),
nikad iz pomena imena. Ista greška je razlog zašto `G1` meri renderovan HTML. Vidi L18.

## L22 — Zamena statičnog stila primitivom donosi i primitivove VREDNOSTI, ne samo njegovo ponašanje.
`M2b` je na šest sekcija zamenio `border-top:1px solid rgba(22,32,25,.2)` primitivom `CRTA`, koji
crta `background:currentColor` na `opacity:.4`. Ponašanje je bilo cilj — linija se iscrtava umesto
da stoji. **Ali je usput udvostručena i težina linije** na svetlim sekcijama: `.2` → `.4`.
⚠️ **Nijedna kapija to ne vidi.** Census broji atribute, `verify:nojs` gleda inline stilove,
`rendered` meri raspored. Ton naslovne se promenio a sve je ostalo zeleno — ista slepa mrlja koju
L8 opisuje za kontrast.
⚠️ Dobra vest je da je polaritet ovde bio ispravan **po konstrukciji**: `currentColor` na
`--forest` podlozi sam daje svetlu liniju, pa tamna-na-tamnom nije bila moguća. Izmereno computed
stilom, ne pogledom: `rgb(241,231,213)` na `rgb(8,17,13)`.
**Pravilo:** kad primitiv menja postojeći statični stil, **izmeri obe vrednosti i stavi razliku
pred Pavla pre `manual`-a**. „Isti gest" ne znači „ista težina", a razliku koju nijedna kapija ne
meri mora neko da vidi namerno. Vidi L8, L4.


## L23 — Kriterijum prihvatanja koji imenuje izlaz alata pada kad alat prestane to da ispisuje.
`M7` acceptance je tražio „First Load JS za `/` nepromenjen (±1 KB)" **iz `npm run build`**. Next
16.3.4 tu kolonu **više ne ispisuje** — tabela ruta nosi samo tip rute. Kriterijum je bio
nemerljiv onako kako je napisan, a izgledao je sasvim konkretno u trenutku pisanja plana.
Zamenjen je merenjem nad artefaktom, koje ne zavisi od formata izlaza: skripte koje `/` stvarno
učitava čitaju se iz prerenderovanog `.next/server/app/index.html`, pa se sabiraju veličine tih
chunkova. A/B preko iste radne kopije (samo `HeroExperience.tsx` vraćen na `master` verziju):
`602.233 B` → `602.266 B`, **+33 B**, uz dokaz da chunk sa three.js (480 KB) nije među njima.
⚠️ **Zamena je jača od originala.** Prag „±1 KB" bi prošao i da je three.js ušao u neki drugi
chunk koji `/` učitava; provera po imenu chunka to vidi direktno.
**Pravilo:** kad acceptance imenuje **izlaz alata** (kolonu, liniju, format), proveri već na
`/plan`-u da alat to i dalje ispisuje. Ako ne ispisuje, ne spuštaj prag — nađi merenje nad
**artefaktom** (build izlaz, renderovan HTML), jer artefakt ne menja format sa verzijom alata.

## L24 — Regex sklopljen u stringu gubi nivo escape-ovanja, i provera tiho prestaje da matchuje.
`U1/B` je prijavio da na `/faq` **nema nijednog sidra**, iako ih je osam stajalo u serviranom
HTML-u. Kriva nije bila implementacija nego provera: helper je gradio regex kao
`new RegExp(` + backtick + `\b${attr}\s*=\s*"([^"]*)"` + backtick + `)`, a u fajl je stigao sa
**jednim** backslash-om — pa je u template literalu `\b` postao **znak backspace** (U+0008), a
`\s` slovo `s`. Regex je ostao sintaksno ispravan i nikad ništa nije matchovao.
⚠️ **Regex literali u istom fajlu su prošli netaknuti** (`/<script[\s\S]*?<\/script>/`). Problem
postoji isključivo tamo gde escape prolazi kroz string pre nego što postane regex.
⚠️ **Da je tvrdnja bila „nema prekršaja" umesto `deepEqual` sa očekivanim spiskom, ovo bi prošlo
kao ZELENO** — kapija bi postojala samo na papiru, isto kao u `L20`. Spasila ju je činjenica da
poredi sa izvorom, a ne da broji.
**Pravilo:** provera koja čita atribute radi na **tokenizeru ili podstringu**, ne na regexu
sklopljenom u stringu. I dalje važi `L18` — kad provera prijavi defekt, prvo proveri proveru; ovo
je drugi put u dva batcha da je ona bila kriva, a ne kod.

## L25 — „Čist `git status`" ne dokazuje vraćanje dok implementacija nije commitovana.
`RULES §6` traži da se posle falsifikacije vraćanje dokaže čistim `git status`-om. To radi samo
kad je implementacija **već u commitu** — kao u `G1`, gde je `git checkout --` vratio fajl na
commitovano stanje. U `M7` i `U1` implementacija u tom trenutku nije bila commitovana
(`/execute` namerno ne commituje), pa je stablo prljavo **po dizajnu**; u `M7` je nov modul bio i
untracked, pa git nije imao šta da poredi.
**Pravilo:** dok je implementacija necommitovana, dokaz vraćanja je **sha256 poklapanje** sa
rezervnom kopijom napravljenom pre ubacivanja prekršaja — i tako se i prijavljuje, umesto da se
tvrdi čist `git status` koji tada ne znači ništa. Formulaciju `RULES §6` treba dopuniti; to je
zaseban non-batch, jer `RULES.md` nije bio u scope-u ni `M7` ni `U1`.

## L26 — Preklapanja u `globals.css` nisu nered nego nosiva kaskada.
`K1` je krenuo da fajl svede na „jedna deklaracija po selektoru" i **merenjem je oboren**: od
**109** preklapanja samo **jedno** se dalo spojiti bez promene izgleda. Tri pokušaja, tri
regresije koje je uhvatio snimak computed style-a:
- svih 68 „samostalnih" klastera spojeno na poslednju poziciju → **6280 elemenata**;
  `nav-links` je prešao iz `display:none` u `flex` — **mobilni meni se otvorio**, jer je između
  dve pojave stajao media blok koji ga skriva;
- uz uslov „nema istog selektora između" → `.btn` je prešao ispred `.btn-ghost` i providnim
  `border`-om mu pojeo boju ivice (**144** elementa);
- uz izuzet `.btn` → `.post-body p{margin:0}` prešao ispred `.post-cta p{margin:0 0 16px}` i
  pojeo 16px po pasusu (**108** elemenata).

**Pravilo koje iz toga sledi:** spajanje dve deklaracije istog selektora je sigurno **samo ako
nijedno pravilo između prve i poslednje pojave ne dira isto svojstvo**. Ako ga dira, ishod se
može okrenuti iako je selektor isti — jer spajanje pomera deklaracije kroz tuđa pravila. Sa tim
uslovom ovde ostaje **1 od 109**, i to je odgovor na nalaz audita `L-10`.

⚠️ **Nijedna postojeća kapija ovo ne bi videla.** Renderovan HTML se ne menja, census pokreta se
ne menja, svih šest kapija ostaje zeleno — a mobilni meni je bio otvoren. Uhvatio ga je jedino
snimak `getComputedStyle`-a nad **9.521 elementom × 57 svojstava × 64 stanja stranice**, koji je
pre upotrebe dokazan kao deterministican (dva ista pokretanja) i osetljiv (promena od 1px).

**Ko sledeći put krene na ovaj fajl:** ne mehanički. Svaki preostali klaster traži analizu po
elementima — koji selektori stvarno stoje na istom elementu — i u dobrom delu slučajeva vizuelnu
odluku, što je posao `T1`-a, ne čišćenja.

## L27 — Na Android-u „Arial" nije ime koje nedostaje, nego alias za sistemsko pismo.
AOSP `fonts.xml` ima `<alias name="arial" to="sans-serif" />` (isto `helvetica`, `tahoma`,
`verdana`). Zato `font-family: Arial, <zamena>, sans-serif` na Android-u ume da stane već na prvom
imenu: sistem ga razreši u svoje pismo i besplatna zamena istih mera se nikad ne učita — a na
desktopu, gde se sve proverava, izgleda ispravno.
**Pravilo:** kad pismo treba da stigne SAMO na uređaje koji ga nemaju, ne slaže se iza njega u listi,
nego ide sopstvena `@font-face` porodica sa `src: local(<pravo ime>), url(<zamena>)`. `local()` traži
instaliran font po imenu fonta: gde ga ima, ništa se ne preuzima; gde ga nema, stiže zamena. Po lice
za svaku kombinaciju (normal i bold, uspravno i kurziv) — inače desktop dobije veštački bold ili
kurziv. (Ponašanje `local()` na samom Android uređaju nije izmereno; mereno je u Chromium-u.)
**Merljivo bez Android uređaja** (`T1`): na stranici nijedan `.woff2` zahtev, a
`new FontFace(x, 'local("Nepostojece"), url(<zamena>)')` mora da učita fajl sa 200.

## L28 — Dev server ume da pošalje stari CSS i posle restarta, jer Turbopack pamti kompilaciju na disku.
Next 16 po podrazumevanom podešavanju ima `turbopackFileSystemCacheForDev: true` i čuva rad u
`.next/dev/cache/turbopack`, a restart „ponovo koristi prethodnu kompilaciju". U `S1` je izmena
`app/globals.css` stajala na disku, a server je i posle dva restarta slao stari `app_globals_*.css`
(nastao u 02:31, pre izmene), dok je izmenu `lib/hero-scene.ts` pokupio. Snimci „posle" su zato
pokazivali novu scenu sa starom senkom, a ni osvežavanje datuma izmene fajla nije pomoglo.
**Pravilo:** posle izmene CSS-a, pre merenja ili pregleda, izvući pravilo iz CSS-a koji server
STVARNO šalje i uporediti ga sa izvorom. Minifikovan CSS menja zapis (`rgba(4,12,8,.93)` →
`#040c08ed`, reč `ellipse` ispada), pa se traži selektor i deo vrednosti koji preživi minifikaciju,
ne doslovan string iz izvora. Ako je staro: ugasiti server, obrisati `.next/dev/cache/turbopack` i
`.next/dev/static`, pokrenuti ponovo i ponovo proveriti.

## L29 — Posmatrač ne vidi element koji je sam isečen na nultu površinu, a watchdog je to krio od svakog alata.
`[data-wipe]` je skriven sa `clip-path: inset(-.3em 100% -.3em -.3em)` na samoj meti, a `Motion.tsx` je
posmatrao baš tu metu. Izmereno u `RD1` (Pavlov browser, Edge, vidljiv tab): naslov je u kadru po geometriji
(okvir 1175×180), a posmatrač odmah javlja `isIntersecting=false` sa presekom 0×0 — i sa pragom 0 bez margine —
i nikad više. Browser računa presek POSLE sopstvenog isecanja mete. `L17` kaže da posmatrač meri geometriju, a ne
`opacity`; `clip-path` jeste geometrija. Ishod: nije se video nijedan naslov sa `data-wipe`, i na produkciji.
Nijedna kapija ni pregled kroz alat to nisu uhvatili, jer u skrivenom tabu (panel, headless) `data-motion-ready`
izostane, watchdog posle 3 s skine `js-motion` i sve se prikaže (`L7`). U vidljivom tabu watchdog je razoružan i
ništa ne spašava. Kada je mehanizam prvi put počeo da skriva naslove nije izmereno.
**Pravilo:** posmatrač nikad ne gleda element koji nosi isecanje koje ga skriva — gleda neisečenog pretka
(`lib/motion-reveal.ts`). Primitiv koji otkriva sadržaj proverava se u pravom, vidljivom tabu; prolaz u skrivenom
tabu dokazuje samo watchdog.

## L30 — Razmak kamere od nepokretnog objekta zavisi od tajminga, pa jedna tačka na liniji stubova ume da ostane zelena.
U heroju kamion vozi po skrolu, a kamera ide po sopstvenom vremenu (`cameraProgress`) u koordinatama kamiona; stubovi
i brda stoje u svetu. Trenutak u kome kamera prođe pored stuba zato se menja sa SVAKOM promenom putanje, pauze ili
težine, i kad nijedna tačka nije blizu stuba. Izmereno u `RD2`: stara putanja je prolazila 0,34 jedinice od stuba na
72,88 %; probne putanje koje tu stranu nisu dirale dale su 0,21–0,45 na novim mestima; ista putanja bez pauze i sa
pauzom 0,83 i 1,25. Falsifikacija koja je JEDNU tačku putanje spustila na liniju stubova ostala je zelena, jer u tom
trenutku pored kamere nije prolazio nijedan stub; crveno (0,06) je dala tek kamera držana na liniji dok kamion pređe
dva stuba.
**Pravilo:** razmak od nepokretnih objekata meri se nad istim mapiranjem vremena koje scena koristi, gustim
uzorkovanjem cele vožnje, i ponovo posle svake promene plana, pauze ili težine (`__tests__/lib/hero-scene.test.js`).
Prekršaj za falsifikaciju takve kapije mora da traje dok prođe bar jedan objekat — tačka koja se nada da će pogoditi
trenutak ne dokazuje ništa.

## L31 — Mesec na mestu u svetu nije na nebu: klizi dok kamera vozi i crta se ispred udaljenih planina.
U `RD10` je disk stajao na (28, y, −135): bliže od grebena, pa se na Pavlovom snimku video ispred planine, a po ekranu
je klizio sa kamerom. Podizanje po y to nije rešilo. **Pravilo:** nebesko telo je pravac od kamere (položaj kamere +
pravac × udaljenost), crta se prvo i ne upisuje dubinu, pa ga svako brdo zaklanja. Gde je na ekranu meri se u NDC iz
istog kadra koji je Pavle označio, a zaklanjanje zrakom kroz tlo iza grebena (`__tests__/lib/hero-scene.test.js`).
