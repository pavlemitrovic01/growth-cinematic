# OPERATING — growth-cinematic

> Ko odlučuje šta. Postavljeno 2026-09-09. Kratko namerno: `RULES.md` nosi proces, ovaj fajl
> nosi **autoritet**.

## Hijerarhija autoriteta

1. **Pavle** — poslovne odluke, copy, dizajn pravac, šta se objavljuje, šta se meri kao „radi".
2. **Kvalifikovani američki advokat** — `/terms`, privacy tekst, TCPA formulacije, sve pod
   `C52`. **Nijedan agent ne sme doneti taj zaključak sam**, ni kad izgleda očigledno.
3. **`docs/CLAIMS.md` u originalu** — registar tvrdnji. Nije stil nego FCC/FTC.
4. **Mašinske kapije** — `CONTEXT.md → ## Health gates`. Exit code, ne mišljenje.
5. **Agent** — sve ostalo, u granicama odobrenog manifesta.

## Uloge

- **Agent planira, meri i prijavljuje.** Ne odobrava sopstveni scope i ne proglašava gotovim ono
  što nije izmereno.
- **Pavle odobrava plan pre `/execute`-a** i **gleda `manual` kapiju** tamo gde je traži `RULES §3`.

## Provera i autoritet

- **Izmeren dokaz > tvrdnja.** „Prošlo je" bez izlaza komande se ne prihvata.
- **Vizuelna odluka se ne verifikuje čitanjem koda.** Dva puta je greška prošla pretragu po
  izvoru a pala na prvi pogled na stranicu (`11d4484`, `pay` kolone). Vidi `LESSONS` L6.
- **Agent koji ne može da potvrdi — kaže da ne može.** `D4` je tako vraćen Pavlu umesto da bude
  prijavljen kao gotov. To je ispravno ponašanje, ne neuspeh.

## Trajni batch manifesti

Manifest je **dokaz šta je bilo odobreno** i ostaje u repou posle zatvaranja. Plan u čatu je
approval artefakt; manifest preživljava sesiju.

⚠️ **Rad pre 2026-09-09 nema manifeste** — workflow tada nije postojao. Ti batch-evi su u
`LOG.md` označeni kao `pre-workflow`. **Manifesti se za njih ne prave retroaktivno**: fajl koji
tvrdi da je Pavle odobrio scope u formatu koji tada nije postojao je izmišljen zapis, ne evidencija.

## Non-batch commit

Workflow bookkeeping, dokumentacija i release commiti idu bez batcha, ali **uvek u `LOG.md`**
kao `non-batch`. Ne diraju runtime kod.

## ⚠️ Zašto ovaj workflow uopšte postoji ovde

Postavljen je **2026-09-09**, posle pitanja „zašto nam se ovo dešava". Povod je bio konkretan:

- `docs/STATUS.md` je narastao **459 → 735 redova u jednoj sesiji** — jedina memorija projekta,
  već preko granice na kojoj je iko čita celu;
- dve netačne tvrdnje u njemu nađene su **slučajno**, u prolazu, a jedna je protivrečila dvema
  drugim tvrdnjama u istom fajlu;
- Faza 6 je jednom postojala **samo na lokalnoj nepušenoj grani** i zamalo bila napisana ponovo.

⚠️ **Ali nije sve bilo proces.** Otkaz browser panela na `D4` je otkaz alata; nijedan workflow ga
ne sprečava. Ono što workflow menja jeste **kad** se to sazna — kriterijum prihvatanja se piše
pre posla, pa je predaja Pavlu planiran korak, a ne otkriće na kraju.
