# ROADMAP — growth-cinematic

> Jedan red po batchu. **Ne nabraja fajlove** — to je posao manifesta (`RULES §4`).
> Postavljeno 2026-09-09. Cap: 200 linija (bloker).

## Gde smo

Sajt je **funkcionalno kompletan, deploy-ovan i izmeren protiv deploy-a**, pod `noindex`.
Kolosek je od 2026-09-08 **dizajn i pokret** (Pavlova odluka, ispred Resenda). `D1` je zatvoren
2026-09-09 — sve četiri strukturne izmene su u `master`-u.

## Aktivan kolosek — pokret

| ID | Posao | Tier | Zavisi od | Status |
|---|---|---|---|---|
| `M2b` | Naslovna: šest sekcija na nov rečnik + brojke stižu pre sadržaja | STANDARD | `M2` | **SLEDEĆI** |
| `M3` | Naslovi — maska po **reči** (ne po slovu) | STANDARD | `M1` | OPEN |
| `M4` | Hero sekvenca — čist CSS na `load`, bez `js-motion` kapije | STANDARD | `M1`, `M3` | OPEN |
| `M5` | View Transitions — usmeren prelaz rute + shared naslov kartice | STANDARD | — (nezavisan) | OPEN |
| `M6` | Pritisak (`MobileBar` nema `:active`) i kartice (hover koji nije `translateY`) | LEAN | `M1` | OPEN |
| `D2` | Outline tipografija svedena na 2–3 mesta | LEAN | — | OPEN |

✅ **`G1` + `G2` su zatvorili ono što je `M2` moglo da prekrši.** Od 2026-09-09
`npm run test:rendered` sprovodi tri tvrdnje: `data-wipe` samo na listnim tekstualnim tagovima
(**allowlist**, ne denylist) i nijedan `data-line` unutar `data-wipe` — oboje na **14 ruta**
(`PAGE_PATHS` + tri članka + 404) — plus **tačan broj** motion atributa na `/` (6/4/3/3).

⚠️ **Dva ograničenja koja je `M2` ostavio za sobom, važe i za `M2b`.**
`[data-stagger]>*:nth-child(n)` (0,2,0) gazi `[data-wipe]` (0,1,0) — wipe **nikad** kao direktno
dete stagger kontejnera, inače `--wipe-lead` tiho nestaje. I `CRTA` na `.sub-hero` pada tačno na
Nav-ovu ivicu. Detalji u `batches/M2.md`.

⚠️ **`M2b` će oboriti census čim doda pokret na `/` — to je namerno.** Broj se ispravlja **u
istom batchu koji menja markup**, nikad kao zaseban „fix testa". Ako neki batch traži tag van
allowliste, pad kapije je **decision point**, ne prepreka.

⚠️ **Plan pokreta (`docs/MOTION.md`) je stariji od koda.** Površine 3 i 4 opisuju „osam
`data-reveal` fade-up-ova" i vezuju pokret za brojke. Naslovna sada ima **devet** sekcija,
`stories` je obrisana, a `pay` i `values` nose podatke drugačije. **Pročitati ponovo pre `M1`.**

⚠️ **`D5` („What we don't do" kao manifest) — proveriti da li je već zatvoren.** `guard` je
2026-09-09 postao cinematic (`a1a43d3`), što je bilo pola te stavke. Odluka pre planiranja.

## Posle pokreta — poslovno, po redosledu efekta

| ID | Posao | Tier | Status |
|---|---|---|---|
| `R1` | **Resend** — sajt skuplja prijave a **nikoga ne obaveštava** | STRICT | OPEN |
| `A1` | Analitika + paljenje consent kapije (idu **zajedno**, ne odvojeno) | STRICT | OPEN |
| `V1` | Selidba Vercel projekta sa ličnog Hobby naloga na tim | STRICT | OPEN |
| `P1` | Lighthouse na hostingu + 3D hero na pravom telefonu | LEAN | OPEN |
| `X1` | Odluka o prelasku — **tek kad postoje brojke** | — | čeka `A1` |

⚠️ **`R1` je najveći efekat po uloženom vremenu i manje je blokiran nego što se dugo tvrdilo.**
Izmereno 2026-09-06: **verifikovan domen NE treba** (`lib/email.js:106` pada na sandbox
pošiljaoca). Traži samo `RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`. Petnaest minuta, i lanac
forma → Neon → Resend → inbox je zatvoren. **Poslednja nedokazana karika u celom sistemu.**

## Blokirano — ne planira se dok odluka ne padne (`RULES §8`)

| ID | Posao | Vlasnik | Status |
|---|---|---|---|
| `C-ROK` | Rok odgovora za carrier-a | **Pavle** | ⚠️ **odlučen u načelu, formulacija OPEN** |
| `LEG-1` | `/terms`: governing law, arbitraža, IP, uslovi prekida | **advokat** | OPEN |
| `LEG-2` | Pravni pregled privacy i TCPA teksta | **advokat** | OPEN |
| `C52` | Državljanstvo / radna dokumenta / engleski kao uslov | **advokat** | OPEN, i **živ u MAIN-u** |

Detalji i obrazloženja → `DECISIONS.md`.

## Zatvoreno

| ID | Posao | Zatvoren |
|---|---|---|
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
