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
