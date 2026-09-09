# Batch manifesti — growth-cinematic

> Jedan fajl po batchu: `workflow/projects/growth-cinematic/batches/<batch-id>.md`.
> Manifest je **trajni odobreni scope batcha** (`RULES §4`). `/plan` ostaje read-only; `/execute`
> ga pravi iz Pavlovog odobrenog plana **pre** prve implementacione izmene. Ostaje u repou posle
> zatvaranja kao dokaz šta je bilo odobreno.

## Zašto postoji

Plan u čatu je approval artefakt; **manifest je operativni ugovor koji preživljava sesiju.**
`/close` čita tier, EXPECTED-FILES i acceptance iz njega, ne iz chat istorije.

## ⚠️ Zašto je ovaj folder prazan na dan postavljanja

Workflow je postavljen **2026-09-09**, posle četiri završena batcha istog dana. **Manifesti za
njih nisu napravljeni retroaktivno** i neće biti: fajl koji tvrdi da je Pavle odobrio scope u
formatu koji tada nije postojao je **izmišljen zapis, ne evidencija** (`OPERATING.md`).

Ti batch-evi su u `workflow/LOG.md` označeni kao `pre-workflow`, sa stvarnim SHA-ovima i stvarnim
merenjima. **Prvi pravi manifest biće `M1`.**

## Format

~~~
# <BATCH-ID> — <naziv>

- **Tier:** LEAN | STANDARD | STRICT
- **Grana:** <id-lowercase>-<slug>
- **Odobrio:** Pavle, <datum>
- **Status:** OPEN | CLOSED (<implementation SHA>)

## Cilj
<1-3 rečenice>

## Out of scope
<šta se eksplicitno NE radi>

## EXPECTED-FILES
<tačne repo putanje, bez glob-ova i bez „približno">

## GATES
<imena iz RULES §3; komande dolaze iz CONTEXT.md → ## Health gates>

## ACCEPTANCE
<merljivo. Ako traži `manual`, reci TAČNO šta Pavle gleda i na čemu.>

## ROLLBACK
<kako se vraća>

## APPROVED-SCOPE-EXPANSION
<opciono; datum + Pavlovo odobrenje + razlog + dodatne tačne putanje, bez prepisivanja originala>
~~~

## ⚠️ ACCEPTANCE nije formalnost

`D4` je 2026-09-09 pokazao zašto: agent nije mogao da potvrdi skrol jer je alat otkazao, pa je
predaja Pavlu bila **otkriće na kraju** umesto planiranog koraka. Da je stajalo *„acceptance:
Pavle potvrđuje da naslov stoji dok koraci prolaze, u pravom browseru"*, ista predaja bi bila
**deo plana**, ne iznenađenje.
