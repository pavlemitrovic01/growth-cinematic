# ROADMAP — growth-cinematic

> Jedan red po batchu. **Ne nabraja fajlove** — to je posao manifesta (`RULES §4`).
> Postavljeno 2026-09-09. Cap: 200 linija (bloker).

## Gde smo

Sajt je **funkcionalno kompletan, deploy-ovan i izmeren protiv deploy-a**, pod `noindex`.
Kolosek je od 2026-09-08 **dizajn i pokret** (Pavlova odluka, ispred Resenda). `D1` je zatvoren
2026-09-09 — sve četiri strukturne izmene su u `master`-u.

**Od 2026-09-11 kolosek je završetak po auditu** — `docs/AUDIT-2026-09.md`. Ocene: kvalitet
urađenog 82, završenost 61 (~72 posle `R1`), spremnost za produkciju 34.

## Redizajn — Pavlova lista (2026-09-15)

Cilj (Pavle): **što bolji cinematic osećaj, uz ozbiljno dobre i logički povezane informacije** (`DECISIONS`).
Telefon je za sada po strani. Obim stavki **nije planiran**, redosled bira Pavle. Pavle je prvo tražio scenu
u heroju („Prvo to") — urađen `S1`; greška sa naslovima (`RD1`) zatvorena 2026-09-16; kamera (`RD2`) i izgled
scene (`RD10`) zatvoreni, spojeni i pušeni 2026-09-17; američki tegljač (`RD12`) zatvoren, spojen i pušen 2026-09-19; američki put (`RD11`) zatvoren, spojen i pušen 2026-09-19; svetlo scene (`RD3`) zatvoreno 2026-09-19, spojeno i pušeno 2026-09-20. Predlog pre `RD4`–`RD7`: jedna stranica „smer redizajna" sa 2–3 pravca
(navigacija, zaglavlje podstranice, smena sekcija, paleta — Pavle 2026-09-19 želi da menja tamnozelenu `--forest` —, slike), da batch-evi ne odu svaki na svoju stranu.

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `RD4` | Navigacija manje „oldschool", cinematic, po mogućstvu sa strane | STANDARD + `manual` | `SMER-B`: sa strane (posle `RD7`) | OPEN |
| `RD5` | Podstranice: nov šablon (`PageShell`, 13 površina) — zaglavlje sa vizualom, ritam, pokret | STANDARD + `manual` | `SMER-B`: zaglavlje sa kadrom; `T1b` | OPEN |
| `RD6` | Naslovna: tamna traka sa brzom formom posle heroja (spojiti, ukloniti ili premestiti) i „maslinasta" boja | STRICT (forma, pristanak) | `U2`; boja rešena u `RD17`, forma ide na kraj sa `RD7` | **rešen:** boja u `RD17`, traka premeštena na kraj u `RD7` |
| `RD7` | Ostatak sajta „basic": smena svetlo/tamno, pokret, šta vodi oko; „How it works" istaći (gde — Pavle) | STANDARD + `manual` | `SMER-B`: krem posle heroja (sledeći); `T1b`, kolosek pokreta | **deo zatvoren** 2026-09-22 (`RD7`: ritam naslovne, „How it works" posle heroja); ostaju pokret i podstranice |
| `RD8` | Slike: nijedne van rezervne slike heroja — izvor (svoje, licencirane, kadrovi iz scene) | — | odluka Pavla | OPEN |
| `RD9` | Sadržaj za vozače: više stranica i konteksta, copy pregledati i pojačati, uključujući naslov heroja | STRICT (registar) | Pavlov sadržaj; gde živi registar posle gašenja MAIN-a | čeka sadržaj |

## Aktivan kolosek — završetak po auditu (od 2026-09-11)

Izvor: `docs/AUDIT-2026-09.md` (nalazi, kriterijumi prihvatanja, redosled). Release `M2b` urađen 2026-09-11 (census `0/4/9/9` na deploy-u). Pravni tekstovi advokatu idu paralelno sa
batch-evima (audit `:51`), nezavisno od ovog koloseka.

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `T1b` | Hijerarhija na Arial-u — skala umesto 55 veličina, nadnaslovi kao putokazi, gde obris ostaje (`D2`); **prvo stranica sa predlogom**, pa plan (`L-02`, `VD-03`) | STANDARD + `manual` | predlog skale | OPEN |
| `U2` | Naslovna: redosled poverenja, jedna numeracija, kickeri, skip link (`IA-05`, `POS-01`, `L-08`, `L-09`) | STANDARD + `manual` | redosled rešen u `RD7` (`SMER-B`) | OPEN — ostalo |
| `U3` | Uspešna stanja formi — sledeći korak, broj za čuvanje (`IA-06`) | STRICT | — | OPEN |
| `U4` | `/for-carriers` iz početka (`POS-02`, `IA-01`–`IA-03`) | STRICT | copy + registar (`RULES §9`) | čeka sadržaj |
| `U5` | „jobs" u naslovima i `h1` (`L-22`) | STRICT | registar (`RULES §9`) | čeka sadržaj |
| `H1` | Higijena: `data-reveal`, starter SVG-ovi, komentari sa „90%" i `SITEMAP.md`, `NoFallbackError` (`L-18`, `L-21`) | LEAN | — | OPEN |
| `G3` | Claims kapija: pravilo za `C41`, pokrivenost upisana u `CONTEXT` (`L-23`) | STRICT | `AUD-OBIM` | blokirano odlukom |

⚠️ **`K1` je zatvoren merenjem, ne čišćenjem** (`LESSONS` L26): od 109 preklapanja samo jedno se
dalo spojiti bez promene izgleda — redosled u `globals.css` nosi izgled. `T-FONT` je odlučen
2026-09-14 (**Arial ostaje**), pa `T1` više ne čeka; `U2` više ne čeka `K1`.

⚠️ **`K1` i `T1` su razdvojeni**, iako ih je audit predložio kao jedan batch — `RULES §2`
(„1 tema = 1 batch"), i da svaka vizuelna razlika u `T1` bude pripisiva samo pismu.

⚠️ **Kolosek pokreta (`M2c`–`M6`) čeka `T1b`** — svako trajanje je podešeno na metriku teksta
koja se menja — i **usklađen `docs/MOTION.md`** (non-batch), jer je `M2c` specificiran iz
dokumenta koji opisuje sekcije kojih više nema.

## Kolosek pokreta — posle `T1b`

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `M2c` | Brojke stižu pre sadržaja — kickeri `01 / …` pre naslova (`MOTION.md` površina 4) | STANDARD | `M2b`, `T1b`, `MOTION.md` | čeka `T1b` |
| `M3` | Naslovi — maska po **reči** (ne po slovu) | STANDARD | `M1` | OPEN |
| `M4` | Hero sekvenca — čist CSS na `load`, bez `js-motion` kapije | STANDARD | `M1`, `M3` | OPEN |
| `M5` | View Transitions — usmeren prelaz rute + shared naslov kartice | STANDARD | — (nezavisan) | OPEN |
| `M6` | Pritisak (`MobileBar` nema `:active`) i kartice (hover koji nije `translateY`) | LEAN | `M1` | OPEN |
| `D2` | Outline tipografija svedena na 2–3 mesta — obris je od `T1` 2 px; ostaje pitanje gde | LEAN | `T1b` | rešava se u `T1b` |

✅ **`G1` + `G2` su zatvorili ono što je `M2` moglo da prekrši.** Od 2026-09-09
`npm run test:rendered` sprovodi tri tvrdnje: `data-wipe` samo na listnim tekstualnim tagovima
(**allowlist**, ne denylist) i nijedan `data-line` unutar `data-wipe` — oboje na **14 ruta**
(`PAGE_PATHS` + tri članka + 404) — plus **tačan broj** motion atributa na `/` (6/4/3/3).

⚠️ **Dva ograničenja koja je `M2` ostavio za sobom, važe i za `M2b`.**
`[data-stagger]>*:nth-child(n)` (0,2,0) gazi `[data-wipe]` (0,1,0) — wipe **nikad** kao direktno
dete stagger kontejnera, inače `--wipe-lead` tiho nestaje. I `CRTA` na `.sub-hero` pada tačno na
Nav-ovu ivicu. Detalji u `batches/M2.md`.

⚠️ **`M2c` traži novo CSS pravilo, i zato je izdvojen iz `M2b`** (Pavlova odluka 2026-09-09).
`--wipe-lead` se **nasleđuje** od `[data-line]`, pa kicker i `<h2>` u istoj sekciji dobijaju
**isto** kašnjenje; razdvajanje traži novu promenljivu — u zoni specifičnosti koja je već jednom
oborila `M2` plan.

⚠️ **Census se menja samo u batchu koji menja markup**, nikad kao zaseban „fix testa". `M2b` ga je
oborio namerno i falsifikovao **po atributu** (L19). Ako neki batch traži tag van allowliste, pad
kapije je **decision point**, ne prepreka.

⚠️ **Plan pokreta (`docs/MOTION.md`) je stariji od koda.** Površine 3 i 4 opisuju „osam
`data-reveal` fade-up-ova" i vezuju pokret za brojke. Naslovna sada ima **devet** sekcija,
`stories` je obrisana, a `pay` i `values` nose podatke drugačije. **Pročitati ponovo pre `M1`.**

⚠️ **`D5` („What we don't do" kao manifest) — proveriti da li je već zatvoren.** `guard` je
2026-09-09 postao cinematic (`a1a43d3`), što je bilo pola te stavke. Odluka pre planiranja.

## Pred lansiranje — poslovno

| ID | Posao | Tier | Status |
|---|---|---|---|
| `A1` | Analitika + paljenje consent kapije (idu **zajedno**, ne odvojeno) | STRICT | OPEN |
| `V1` | Selidba Vercel projekta sa ličnog Hobby naloga na tim | STRICT | OPEN |
| `P1` | Lighthouse na hostingu + 3D hero na pravom telefonu | LEAN | OPEN |
| `X1` | Odluka o prelasku — **tek kad postoje brojke** | — | čeka `A1` |

✅ **`R1` zatvoren 2026-09-13** — lanac forma → Neon → Resend → inbox dokazan merenjem (`503 → 200`
na deploy-u, mejl potvrđen u inbox-u). Sa „poslednji" prebačen na „prvi" Pavlovom odlukom
2026-09-12: jedina nedokazana karika je rizik, ne rad. **Ostatak lanca lansiranja: `V1` i pravni
tekstovi advokatu.**

Nalaz iz `R1` — prijave sa starog i novog sajta se u inbox-u ne razlikuju (isti pošiljalac, isti
naslov) — **Pavle 2026-09-13: nebitno, stari sajt uskoro ide offline.** Ne radi se.

## Blokirano — ne planira se dok odluka ne padne (`RULES §8`)

| ID | Posao | Vlasnik | Status |
|---|---|---|---|
| `C-ROK` | Rok odgovora za carrier-a | **Pavle** | ⚠️ **odlučen u načelu, formulacija OPEN** |
| `LEG-1` | `/terms`: governing law, arbitraža, IP, uslovi prekida | **advokat** | OPEN |
| `LEG-2` | Pravni pregled privacy i TCPA teksta | **advokat** | OPEN |
| `C52` | Državljanstvo / radna dokumenta / engleski kao uslov | **advokat** | OPEN, i **živ u MAIN-u** |
| `SAP-TEKST` | Čuva li se obavezno objašnjenje o prekršajima/SAP-u (`CC-2`) | **Pavle** (+ advokat za privacy) | OPEN |
| `CB-API` | `/api/callback` bez pozivaoca: dokumentovati ili ukloniti | **Pavle** | OPEN |
| `AUD-OBIM` | Zadržati ili odbaciti `L-23`, `D-03`, `D-04` (nastali čitanjem MAIN dokumenata) | **Pavle** | OPEN — blokira `G3` |

Detalji i obrazloženja → `DECISIONS.md`.

## Zatvoreno

| ID | Posao | Zatvoren |
|---|---|---|
| `RD7` | **Ritam naslovne** (pravac B, `SMER-B`) — posle heroja krem „How it works", pa naplata tamna, vrednosti, guard tamna, osnivač krem, FAQ svetlo siva, završni poziv sa brzom formom; traka sa formom posle heroja uklonjena (`RD6`), `#get-started` ide sa formom; redosled zamenio auditov za `U2`; nova `rendered` kapija (19); `manual` PASS (formu nije slao Pavle — dokaz je presretnut zahtev); nije spojen ni pušen | 2026-09-22 |
| `RD17` | **Paleta asfalt** (pravac B, `SMER-B`) — `--forest` → `--asphalt #121314`, tamni tekst i siva neutralni, ivice heroja u asfalt; noćne boje scene ostale (blag šav navigacija → nebo, prikazan); oznaka u guard-u 3,18 → 4,70:1; `manual` PASS; spojen i pušen 2026-09-22, izmeren na deploy-u | 2026-09-22 |
| `RD16` | **Boja završnog kadra** — maslinasto-braon (topli ton `RD13` preko zelenog tla) zamenjen tamnim neutralnim tlom, svetlim putem i toplim horizontom; pet varijanti uživo PRE plana, Pavle „4"; finale 49,0 → 56,0 prosečne svetline, tlo 63° s34 → 27° s15, 02 89,2, noć ista; `manual` PASS; spojen i pušen 2026-09-21, izmeren na deploy-u | 2026-09-21 |
| `RD15` | **Centriran finale sa većim naslovom** — puna smena strana iz prototipa odbačena merenjem (tekst desno u 01 ili 02 šalje mesec, odnosno sunce, van kadra ili iza brda); isporučeni centriran finale (naslov do 104 px, kolona `min(56vw, 820px)`), ogledalo tamnog preliva i strane poglavlja kao podatak (`BEAT_SIDES`); test kompozicije meri kolonu na strani poglavlja; kamion ispod teksta u finalu 0–16,4 %; `manual` PASS; spojen i pušen 2026-09-21, izmeren na deploy-u | 2026-09-21 |
| `RD14` | **Skala i prored heroja — NAPUSTEN.** Merenje iz prototipa (`09269bb`) i tri varijante uzivo: na 1440 px naslov ide 92 -> 91 px (vlada `vw` deo `clamp`-a), pa se menjaju samo broj i podnaslov; Pavle: „ne vidim neke promene… danas mi se vise svidja". Kod vracen, nista nije spojeno; nalaz ostaje — pismo i skala nisu poluga, ostaju smena strana i svetla sekcija | 2026-09-20 |
| `RD13` | **Zora na tlu** — posle izlaska sunca kadar je padao u noć (prelaz 0,88 na 24,7 prosečne svetline, ispod noći 28,6), jer albedo terena toplo svetlo zore pod ~17° jedva podiže, a donji deo preliva guta 44 % kadra; sada ambijent u zoru nosi boju neba, teren i asfalt se podižu uz topao ton, jedno svetlo bez senke pada sa strane sunca, preliv guta 20 %; 03 prosek 44,7 → 63,1, dno 20,2 → 47,5; chunk +148 B gzip; `manual` PASS, dva odstupanja prihvaćena; spojen i pušen 2026-09-20, izmeren na deploy-u tek posle redeploy-a bez build keša (`L37`) | 2026-09-20 |
| `RD3` | **Svetlo scene** — Pavlova zamerka „kao da je magla i da se sunce jedva probija kroz maglu" (izmereno: disk 66 % boje magle); sada mesec, sunce i zvezde van magle, meki oreoli oko farova, zadnjih svetala, lampi i truck stop-a, sjajniji asfalt, u zoru ređa topla magla i nebo u prelazu, bez svetlog vela na dnu heroja; nov `lib/hero-light.ts`; draw 30–37, chunk +1,7 KiB gzip; test 171 → 173, novi uslovi crveni pa zeleni; `manual` PASS (varijanta 3 od šest); spojen i pušen 2026-09-20, izmeren na deploy-u | 2026-09-19 |
| `RD11` | **Američki put** — linije se nisu čitale kao američke; sada žuta leva ivica, bela desna, duge pauze, ograda u deonicama, stubići sa reflektorima i dva truck stop-a bez teksta i marke (noćni u 01, jutarnji u 03, niža tabla) u novom `lib/hero-road.ts`, tlo sa platoom; skrol heroja `380svh` → `460svh` (odobreno proširenje); draw 28/34/34/34/33, chunk +1,9 KiB gzip; test 168 → 171, novi uslovi crveni pa zeleni; `manual` PASS („konacno je"); spojen i pušen 2026-09-19, izmeren na deploy-u | 2026-09-19 |
| `RD12` | **Američki tegljač** — kamion se nije čitao kao američki; sada klasična duga hauba (četvrtasta, visoka uska hromirana rešetka, lučni blatobrani, okrugli farovi, filteri vazduha, visoki auspusi, retrovizori na nosačima, spavaći deo odvojen), bez marke; samo `lib/hero-truck.ts`; draw isti 28/29/29/28, chunk +0,9 KiB gzip, test 168 bez izmene; `manual` PASS („Novi kamion je vrh"); spojen i pušen 2026-09-19, izmeren na deploy-u | 2026-09-19 |
| `RD10` | **Izgled scene** — piramide od kupa i kamion od kutija delovali su kao „lego kockice"; sada meka viša brda iz čiste funkcije `terrainHeight`, američki tegljač kao niz delova spojen po materijalu, put sa teksturom; mesec u 01 i sunce koje u 02 izlazi nagore kao pravci od kamere, po Pavlovim oznakama; draw 58–59 → 28–29, chunk +4,5 KiB gzip; test 156 → 168; `manual` PASS; spojen i pušen sa `RD2` 2026-09-17, izmeren na deploy-u | 2026-09-17 |
| `RD2` | **Kamera u heroju** — prolazila je kroz prikolicu (52,84–59,90 % skrola) i 0,34 jedinice od stuba, dok se čita 02; sada plan kadrova „Kran" sa kamionom desno od teksta (ispod teksta 0–4,4 % umesto 65–82 % na 1440×900), jedna blaga pauza u 02 (9,5 % putanje umesto 26,7 %), razmak kamion 4,24 / stub 2,44 / brdo 5,98; testovi crveni pa zeleni, test 145 → 156; `manual` PASS; spojen i pušen sa `RD10` 2026-09-17, izmeren na deploy-u | 2026-09-17 |
| `RD1` | **Naslovi sa `data-wipe`** — izmereno u pravom browseru: posmatrač na meti isečenoj na nultu površinu javlja presek 0×0 i nikad više, pa se nisu videli naslovi na 12 ruta sa `PageShell` ni 9 na naslovnoj (i na produkciji); `Motion.tsx` posmatra roditelja (`lib/motion-reveal.ts`); kapija crvena pa zelena, test 140 → 145; `manual` PASS; spojen i pušen 2026-09-16, izmeren na deploy-u, naslovi vidljivi i na produkciji | 2026-09-16 |
| `S1` | **Hero svetlo i čitljivost scene** — postojeća tri svetla (hladni fill spreda-levo čija senka prati kamion, topli rim iza-desno), niža metalnost, svetlija kabina i vidljiv hrom/staklo, sjajniji put i farovi ispred kabine, blaža `.journey-shade`; draw pozivi nepromenjeni (58/49/53/35), telefon identičan do piksela; Pavle birao kamion `1` i sjaj `b`; spojen i pušen 2026-09-15, izmeren na deploy-u | 2026-09-15 |
| `T1` | **Arial svuda** — Arimo (OFL) samo gde nema Arial-a, porodica „Growth Sans" sa `local()` prvim; drugi red naslova ivica 2 px i težina 800 na 17 naslova; `rendered` 17 → 18; hijerarhija izdvojena u `T1b`; spojen i pušen 2026-09-15, izmeren na deploy-u, Android PASS | 2026-09-14 |
| `B1` | **Social slika i keš** — `og.png` 1,53 MB → `og.jpg` 129 KB (baseline 1200×630); keš 1 h za `/images/*` i `/og.jpg` u `next.config.ts`; `_headers` obrisan; tier LEAN → STRICT (LOCK `seo.js`); keš izmeren i na deploy-u (2026-09-14) | 2026-09-13 |
| `R1` | **Resend upaljen** — sandbox pošiljalac; `POST /api/apply` `503 → 200` na deploy-u, mejl potvrđen u inbox-u; `R1-DOMEN` zatvoren | 2026-09-13 |
| `K1` | **`globals.css`** — izmereno da preklapanja nose kaskadu: 109 → samo 1 spojivo bez vizuelne promene; obrisane 3 mrtve klase, uveden census kapija | 2026-09-12 |
| `U1` | **FAQ struktura** — osam pitanja postalo naslovi sa sidrima; `/faq` sa `h1`+3 `h2` na `h1`+11 `h2`, sidara 0 → 8 | 2026-09-12 |
| `M7` | **Hero prelaz** — kriva „drži pa predaj" umesto `1 − d·1.65`; zbir dva najbliža 0,35 → 1,00, puno poglavlje ~0% → 80% | 2026-09-12 |
| `M2b` | **Naslovna na nov rečnik** — šest sekcija sa `data-reveal` na `CRTA`+`OTKRIVANJE`; census `6/4/3/3` → `0/4/9/9`, falsifikovan po atributu | 2026-09-09 |
| `M2` | **`PageShell` ritam** — `<h1 data-wipe>` na svih 14 ruta + stagger na dve mreže u `/how-it-works`; tri atributa, nula CSS-a | 2026-09-09 |
| `G2` | **Kapija pokriva sve što `PageShell` renderuje** — obuhvat 10 → 14 ruta, izveden iz `PAGE_PATHS` + `allPostSlugs()` | 2026-09-09 |
| `G1` | **Kapija za `data-wipe` placement** + census pokreta na `/` — dokazano pocrvenela pre priznanja | 2026-09-09 |
| `M1` | **Rečnik pokreta** — `OTKRIVANJE` + `CRTA` kao primitivi, uz dokaznu primenu na `values` | 2026-09-09 |
| `D1` | **Taksonomija sekcija** — `pay`+`values` → utility, `guard`+`founder` → cinematic, `stories` obrisana, sticky `process` | 2026-09-09 |
| `D4` | Sticky `process` (poslednji deo `D1`) | 2026-09-09, `manual` PASS |
| Faza 6 | Claims kapija poredi hedž **uz tvrdnju**; `KnowBeforeYouGo` dobio stranicu | 2026-09-07 |
| Faza 4 | Copy — dva prolaza, `CONSENT_TEXT`, `lib/cta.js`, C12 u jedan izvor | 2026-09-06 |
| Faze 0–3 | Prelazak na Vercel + Neon, tokeni, rečnik pokreta, podstranice | 2026-09-05 |

Puna istorija po sesiji → `docs/STATUS-ARCHIVE.md`. Audit po stranici → `docs/AUDIT.md`.
