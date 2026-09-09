# LOG — audit trail (growth-cinematic)

> Jedan unos po batchu, dodaje se na `/close`. **Najnoviji na vrhu.**
> Non-batch i release unosi se označavaju kao takvi i legitimno dolaze posle poslednjeg batcha.
> Postavljeno 2026-09-09.

---

## M1 (STANDARD) — rečnik pokreta: `OTKRIVANJE` + `CRTA` · 2026-09-09

**Code:** `396d28c` · **Fix:** `30f471d` · **Docs:** `e425557` · **Grana:** `m1-motion-vocabulary`
**Manifest:** `batches/M1.md` — **prvi batch ovog projekta koji je prošao ceo `/plan → /execute →
/close` ciklus.**

**Changed files (6):** `app/globals.css` · `components/Motion.tsx` · `components/CinematicHome.tsx` ·
`docs/MOTION.md` · `batches/M1.md` · `ROADMAP.md` *(+ `STATE.md`, `LESSONS.md`, ovaj `LOG.md` na close)*

Dva primitiva — `[data-wipe]` (OTKRIVANJE, `clip-path`) i `[data-line]` (CRTA, `scaleX` na
`::before`) — uz **jednu dokaznu primenu** na `values`.

⚠️ **Odstupanje od `MOTION.md`, odobreno:** plan je tražio `M1` „bez ijedne primene". Njegov
sopstveni ugovor merenja traži dokaz **polariteta** i **`reduce`**-a; batch bez primene ostavlja
obe kapije prazne. Isti slab dokaz koji je `D4` razotkrio.

⚠️ **Nezavisan dizajn pregled našao je defekt koji je prošao SVE kapije** i koji bih bez njega
merge-ovao. Bazno `[data-wipe]{clip-path:inset(-.3em)}` stajalo je **van obe kapije**, pa je svaki
takav element nosio containing block **trajno** — i bez JS-a, i pod `reduce`. Komentar je pritom
tvrdio „fail-safe po konstrukciji". Popravljeno u `30f471d`; još šest manjih nalaza uz to
(1px regresija, preuska carve-out maska, `+90ms` pečen u primitiv, srpski naziv promenljive u
kodu protiv `RULES §12`). → `LESSONS` L15–L18.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 ·
`verify:nojs` PASS 14 ruta (`/` **6343 znakova, nepromenjeno** — pokret ne dodiruje serverski
HTML) · `verify:claims` PASS 13 ruta · `test:rendered` 9/9 — **lokalno i protiv deploy-a**.
U živom build-u potvrđeno: `clip-path` na `[data-wipe]` postoji **isključivo** iza
`html.js-motion` unutar `no-preference`.

✅ **`manual` PASS (Pavle)** — pogledao u pravom browseru, ne vidi grešku.

**Izmereno protiv deploy-a posle push-a:** `verify:nojs` PASS 14 ruta (`/` 6343, isto kao
lokalno) · `verify:claims` PASS 13 ruta · `test:rendered` 9/9. Na živom CSS-u potvrđeno da
`clip-path` na `[data-wipe]` postoji **isključivo** iza `html.js-motion`, i da nema **nijednog**
pravila van kapije. `noindex` drži. Deploy živ ~30 s posle push-a.

⚠️ **Zamka `L1` uhvaćena uživo, četvrti put:** port je držao server iz `D4` batcha sa build-om od
**pre** ovih izmena. Da PID nije proveren, merio bi se pogrešan build.

**NEXT STEP:** `G1` (LEAN) — pretvoriti ograničenje „`data-wipe` samo na listne elemente" iz
komentara u mašinsku kapiju. Pavlova odluka: zaseban batch, ne proširenje `M1`-a.

---

## non-batch — WORKFLOW postavljen · 2026-09-09

**Changed files:** `workflow/**` (nov) · `docs/STATUS.md` · `docs/STATUS-ARCHIVE.md` (nov)

Postavljen minimalni workflow: `OPERATING.md`, `RULES.md` (12 sekcija, ne MAIN-ovih 18),
`STATE.md`, ovaj `LOG.md`, i projektni ugovor u `workflow/projects/growth-cinematic/`
(`CONTEXT.md` 92/120, `ROADMAP.md`, `DECISIONS.md`, `LESSONS.md`, `batches/`).

`docs/STATUS.md` podeljen **735 → 338** redova; osam sesijskih blokova preseljeno u
`docs/STATUS-ARCHIVE.md` (410 redova, bez cap-a).

**Povod, doslovno:** Pavlovo pitanje *„zašto nam se ovo dešava, da nije zato što radimo bez
workflow-a"*. Izmereno pre odgovora: `C:/dev/growth` ima ceo sistem (`RULES` 18 sekcija, `LOG`
3795 redova, `STATE` 383), a ovaj repo **nijedan takav fajl** — samo `docs/STATUS.md`. Skillovi
`/plan` `/execute` `/close` `/kickoff` `/audit` stajali su neiskorišćeni jer nisu imali šta da
čitaju.

⚠️ **Retroaktivni manifesti NISU napravljeni.** Rad pre danas nema manifest jer workflow tada
nije postojao; fajl koji tvrdi da je Pavle odobrio scope u formatu koji nije postojao je
**izmišljen zapis, ne evidencija** (`OPERATING.md`).

**NEXT STEP:** `M1` — rečnik pokreta, kroz `/plan`.

---

## pre-workflow — D4 · sticky `process` · 2026-09-09

**Code:** `3dbcc26` · **Docs:** `8e84841`, `e7ac551` · **Grana:** `d4-sticky-process` (ff u `master`)

Poslednja strukturna stavka `D1`. Naslov `process` sekcije stoji dok četiri koraka prolaze pored
njega. **Nije čekao `M1`** iako ga plan tako vodi — `position:sticky` već živi na `.card--cta` i
na hero sceni, pa se ništa ne uvozi u rečnik pokreta.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9 — **i lokalno i protiv deploy-a**. `/` 6343 znakova, **nepromenjeno** (sticky je
čista prezentacija). U živom CSS-u na deploy-u stoje sva tri pravila uključujući
`@media (max-height:640px)`.

⚠️ **`manual` PASS (Pavle).** Prva stavka koju agent **nije mogao** da potvrdi — panel je izgubio
layout u celini. Agent je dokazao da se pravilo **primenjuje** (`getComputedStyle`, build), ali ne
i da se **ponaša**; grana je ostala nespojena i vraćena Pavlu. **Postupak je odradio svoje** →
`LESSONS` L7, L12.

---

## pre-workflow — D1/3 · `guard`+`founder` cinematic, `stories` obrisana · 2026-09-09

**Code:** `a1a43d3` · **Docs:** `9a0806f`, `7798beb` · **Grana:** `d1-cinematic-guard-founder`

⚠️ **Pavlov override same `D1` odluke:** rečenica *„No stock photos. No invented reviews."* **ne
seli** u `guard`. Posledica — **u batch-u nije napisana nijedna nova reč, samo je brisano**, pa je
registarski rizik nula. Naslovna sa 10 na **9** sekcija; `faq` `06` → `05`.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` **6725 → 6343** znakova (razlika = obrisana
sekcija). Potvrđeno da obrisanog teksta nema nijedne pojave na živoj stranici. → `LESSONS` L8, L11.

---

## pre-workflow — D1/2 · `values` → utility · 2026-09-09

**Code:** `08debb5` · **Docs:** `4297a82`, `814ff46` · **Grana:** `d1-values-utility`

Display element su **imena osa** (`PAY`/`HOME TIME`/`EQUIPMENT`, 44.8 px), **ne broj** — sekcija
tvrdi *„A bigger number isn't the whole offer."* **Copy nepromenjen do slova**, provereno frazu po
frazu nad renderovanim HTML-om.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` 6725 znakova. → `LESSONS` L9, L10.

---

## pre-workflow — D1/1 · `pay` → utility · 2026-09-09

**Code:** `f541b72` · **Docs:** `2217eb3`, `f4d819e` · **Grana:** `d1-pay-utility`

Prva sekcija iz editorial u utility. `h2` pada na caption skalu, `$0` uzima raspon koji je naslov
imao. **Copy se nije pisao** — sve četiri vrednosti prenete (tri iz zatečene proze, `$0` iz `C5`
dozvoljenih formulacija). Dve rečenice namerno ispale, obe bez reda u registru.

**VERIFICATION:** `quick` 0 · `typecheck` 0 · `test` 132/132 · `full` 0 · `verify` PASS 14 + 13 ·
`rendered` 9/9, lokalno i protiv deploy-a. `/` 6731 znakova. → `LESSONS` L6.

---

> **Starije od 2026-09-09** nije u ovom fajlu — workflow tada nije postojao.
> Puna istorija po sesiji → `docs/STATUS-ARCHIVE.md`.
