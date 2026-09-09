# RULES — workflow (growth-cinematic)

> Univerzalna pravila rada za **ovaj** repo. Mašinski gate gde god je moguće (exit-code, drift).
> Postavljeno 2026-09-09.
>
> ⚠️ **Ovo NIJE kopija MAIN-ovih pravila.** `D28` izričito kaže da procesna pravila originala ne
> obavezuju ovaj projekat. Preuzet je **oblik** koji deljeni skillovi (`/plan`, `/execute`,
> `/close`, `/kickoff`, `/audit`) umeju da čitaju, i samo one sekcije koje oni stvarno traže.
> MAIN-ovih 18 sekcija ovde nema svrhu; 8 ima.

## §1 — Source of truth
- **Kapije, capovi, lock zona → `workflow/projects/growth-cinematic/CONTEXT.md`.** Nigde drugde.
- **Živa pozicija → `workflow/STATE.md`.** Plan → `ROADMAP.md`. Odluke → `DECISIONS.md`.
  Trajne pouke → `LESSONS.md`. Audit trag → `workflow/LOG.md`.
- **Narativ i istorija → `docs/STATUS.md` + `docs/STATUS-ARCHIVE.md`.** Oni ne deklarišu ništa
  mašinsko; ako protivreče `CONTEXT`-u, `CONTEXT` pobeđuje.
- **Registar tvrdnji → `docs/CLAIMS.md` u originalu** (`C:/dev/growth`). Čita se, ne piše.

## §2 — Batch model
- Sav rad ide kroz numerisane batch-eve iz `ROADMAP.md`. **Jedan aktivan batch u datom trenutku.**
- Svaki batch ima: cilj, tier, EXPECTED-FILES, acceptance, verifikacioni korak.
- Ne počinji nov batch dok prethodni nije `/close`-ovan (`STATE.md` = NONE).
- **1 tema = 1 batch.**

## §3 — Tier sistem
Tier određuje **koji** gate-ovi se traže. **Koje su to komande — piše u `CONTEXT.md` →
`## Health gates`.** Ovde se komande NE imenuju (skillovi su deljeni sa drugim projektima).

- **LEAN** — dokumentacija, config, trivijalne izmene. `quick`; `full` samo ako je kod dirnut.
- **STANDARD** — feature rad, više fajlova. `quick` + `typecheck` + `test` + `full` + `verify` +
  `rendered` PASS pre `/close`.
- **STRICT** — forme, API, env, deploy, baza, claims površina, lock zona. Sve iz STANDARD-a
  **plus `manual`**.

⚠️ **`manual` je obavezan i van STRICT-a** kad posao dira skrol, `IntersectionObserver`, sticky
ili 3D scenu — bez obzira na tier. Razlog i dokaz: `LESSONS` L7.

## §4 — /plan, /execute, manifest
- `/plan` je **read-only**: ne pravi granu, ne piše manifest, ne menja STATE.
- Plan navodi tačan EXPECTED-FILES spisak, tier, granu, gate-ove, acceptance i **šta se NE radi**.
- **Manifest je trajni odobreni scope batcha**, u `workflow/projects/growth-cinematic/batches/`.
  `/execute` je jedini opener. `/close` ugovor čita iz manifesta, ne iz chat istorije.
- `ROADMAP` nosi **jedan red po batchu** i nikad ne nabraja fajlove.

## §5 — Drift detection
- Fajl dirnut van EXPECTED-FILES → batch je **BLOCKED**: stani, prijavi, traži odluku.
- Scope veći nego što plan kaže (SCOPE_DRIFT) → **stani, ne širi tiho, prijavi.**

## §6 — /close i verifikacija
- `/close` **ne proglašava PASS bez exit-0 dokaza.** Pokreni komande, pokaži izlaz.
- Gate namerno preskočen prijavljuje se kao **`NIJE POKRENUTO` sa razlogom**, nikad kao PASS.
- ⚠️ **`verify` i `rendered` se mere protiv deploy-a posle push-a**, ne samo lokalno, i **meta se
  ispisuje**. Merenje bez ispisane mete se ne prihvata (razlog: `2accf84`).
- ⚠️ **NOVA KAPIJA SE NE PRIZNAJE DOK DOKAZANO NE POCRVENI.** Zeleno može značiti i „provera
  nikad ništa ne matchuje" — a to je kapija koja ne postoji, samo izgleda kao da postoji. Pre
  `/close`-a se **namerno ubaci prekršaj** koji ona treba da uhvati, izmeri crveni izlaz, pa
  vrati; crveni izlaz ide u `LOG.md`. Vraćanje se dokazuje čistim `git status`-om.
  Uvedeno u `G1` (2026-09-09). Razlog: `M1` je isporučio defekt koji je prošao **sve** kapije
  (`30f471d`), a `LESSONS` L18 beleži tri lažna nalaza iz iste sesije.
- Na `/close`: ažuriraj `STATE.md` i dodaj `LOG.md` unos (CHANGED FILES / VERIFICATION / NEXT STEP).

## §7 — Stop if unclear
- Nejasan zahtev, sadržaj ili dizajn odluka → **stani i pitaj, ne nagađaj.**
- **Nikad ne izmišljaj** kontakt podatke, pravne brojeve (FMCSA/USDOT/MC), founder informacije,
  brojeve plasmana ili rokove odgovora.
- Fali sadržaj → placeholder, **nikad izmišljen podatak**.

## §8 — Decision gate
- Posao koji leži ispod **OPEN** odluke iz `DECISIONS.md` se **ne planira** dok odluka ne padne.
- Poslovnu ili pravnu činjenicu daje **Pavle ili kvalifikovani autoritet** — nikad agent.
  Za `/terms` i pravni tekst to je **američki advokat**.

## §9 — Claims gate
- Svaka nova ili izmenjena **poslovna tvrdnja** (brojka, obećanje, rok, tvrdnja o partnerima)
  traži red u registru **pre** nego što uđe u kod.
- `verify:claims` je mašinska kapija, **ne dozvola**: prolaz znači „nije prekršen poznat obrazac",
  ne „tvrdnja je odobrena".

## §10 — Non-batch commit
- Dozvoljen za: workflow bookkeeping, dokumentaciju, release/merge. Ne dira runtime kod.
- Prijavljuje se u `LOG.md` kao `non-batch`, ne kao batch.

## §11 — Doc cap fallback
- Ako `CONTEXT.md → ## Doc capovi` ne postoji, koristi default **200 linija** za blocking
  dokumente i **reci da je korišćen fallback**. Cap koji je pogrešan a ne okida se je gori od
  nepostojećeg.

## §12 — Jezik
- Dokumentacija, planovi, commit poruke i izveštaji: **srpski**. Kod, imena fajlova i copy sajta:
  **engleski**.
