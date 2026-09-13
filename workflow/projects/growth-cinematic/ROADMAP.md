# ROADMAP — growth-cinematic

> Jedan red po batchu. **Ne nabraja fajlove** — to je posao manifesta (`RULES §4`).
> Postavljeno 2026-09-09. Cap: 200 linija (bloker).

## Gde smo

Sajt je **funkcionalno kompletan, deploy-ovan i izmeren protiv deploy-a**, pod `noindex`.
Kolosek je od 2026-09-08 **dizajn i pokret** (Pavlova odluka, ispred Resenda). `D1` je zatvoren
2026-09-09 — sve četiri strukturne izmene su u `master`-u.

**Od 2026-09-11 kolosek je završetak po auditu** — `docs/AUDIT-2026-09.md`. Ocene: kvalitet
urađenog 82, završenost 61 (~72 posle `R1`), spremnost za produkciju 34.

## Aktivan kolosek — završetak po auditu (od 2026-09-11)

Izvor: `docs/AUDIT-2026-09.md` (nalazi, kriterijumi prihvatanja, redosled). Release `M2b` urađen 2026-09-11 (census `0/4/9/9` na deploy-u). Pravni tekstovi advokatu idu paralelno sa
batch-evima (audit `:51`), nezavisno od ovog koloseka.

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `T1` | Pismo + tipografski tokeni; rešava i `D2` (`L-02`, `VD-03`) | STANDARD + `manual` | `T-FONT` | blokirano odlukom |
| `U2` | Naslovna: redosled poverenja, jedna numeracija, kickeri, skip link (`IA-05`, `POS-01`, `L-08`, `L-09`) | STANDARD + `manual` | — | **SLEDEĆI** |
| `U3` | Uspešna stanja formi — sledeći korak, broj za čuvanje (`IA-06`) | STRICT | — | OPEN |
| `U4` | `/for-carriers` iz početka (`POS-02`, `IA-01`–`IA-03`) | STRICT | copy + registar (`RULES §9`) | čeka sadržaj |
| `U5` | „jobs" u naslovima i `h1` (`L-22`) | STRICT | registar (`RULES §9`) | čeka sadržaj |
| `H1` | Higijena: `data-reveal`, starter SVG-ovi, komentari sa „90%" i `SITEMAP.md`, `NoFallbackError` (`L-18`, `L-21`) | LEAN | — | OPEN |
| `G3` | Claims kapija: pravilo za `C41`, pokrivenost upisana u `CONTEXT` (`L-23`) | STRICT | `AUD-OBIM` | blokirano odlukom |

⚠️ **`K1` je zatvoren merenjem, ne čišćenjem** (`LESSONS` L26): od 109 preklapanja samo jedno se
dalo spojiti bez promene izgleda — redosled u `globals.css` nosi izgled. `T1` i dalje čeka
`T-FONT`; `U2` više ne čeka `K1`.

⚠️ **`K1` i `T1` su razdvojeni**, iako ih je audit predložio kao jedan batch — `RULES §2`
(„1 tema = 1 batch"), i da svaka vizuelna razlika u `T1` bude pripisiva samo pismu.

⚠️ **Kolosek pokreta (`M2c`–`M6`) čeka `T1`** — svako trajanje je podešeno na metriku teksta
koja se menja — i **usklađen `docs/MOTION.md`** (non-batch), jer je `M2c` specificiran iz
dokumenta koji opisuje sekcije kojih više nema.

## Kolosek pokreta — posle `T1`

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `M2c` | Brojke stižu pre sadržaja — kickeri `01 / …` pre naslova (`MOTION.md` površina 4) | STANDARD | `M2b`, `T1`, `MOTION.md` | čeka `T1` |
| `M3` | Naslovi — maska po **reči** (ne po slovu) | STANDARD | `M1` | OPEN |
| `M4` | Hero sekvenca — čist CSS na `load`, bez `js-motion` kapije | STANDARD | `M1`, `M3` | OPEN |
| `M5` | View Transitions — usmeren prelaz rute + shared naslov kartice | STANDARD | — (nezavisan) | OPEN |
| `M6` | Pritisak (`MobileBar` nema `:active`) i kartice (hover koji nije `translateY`) | LEAN | `M1` | OPEN |
| `D2` | Outline tipografija svedena na 2–3 mesta | LEAN | `T1` | rešava se u `T1` |

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
| `T-FONT` | Pismo: plaćeno (Söhne / Neue Haas) ili OFL (Inter Display) | **Pavle** | OPEN — blokira `T1` |
| `SAP-TEKST` | Čuva li se obavezno objašnjenje o prekršajima/SAP-u (`CC-2`) | **Pavle** (+ advokat za privacy) | OPEN |
| `CB-API` | `/api/callback` bez pozivaoca: dokumentovati ili ukloniti | **Pavle** | OPEN |
| `AUD-OBIM` | Zadržati ili odbaciti `L-23`, `D-03`, `D-04` (nastali čitanjem MAIN dokumenata) | **Pavle** | OPEN — blokira `G3` |

Detalji i obrazloženja → `DECISIONS.md`.

## Zatvoreno

| ID | Posao | Zatvoren |
|---|---|---|
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
