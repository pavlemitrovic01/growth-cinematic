# TTI5 — prijava u prozoru: glavno dugme heroja otvara punu prijavu

- **Tier:** STRICT (površina sa formom)
- **Grana:** tti5-prijava-u-prozoru
- **Odobrio:** Pavle, 2026-09-24 — posle pregleda u kopiji van repoa: *„Moze to je okej, moze push"*. Plan je izveden iz
  odobrenog pregleda i prikazan u čatu pre aktivacije; „moze push" pokriva izvršenje, zatvaranje i release.
- **Status:** CLOSED (`c477068`)

## Cilj
Pavle: *„quick apply kao prozorcic na HERO ... da mozes da kliknes i odma tu da apliciras"*, pa *„premalo informacija se
dobija iz quick apply"*. Crveno „Start your application" u heroju otvara prozor (`<dialog>`) sa **punom** prijavom
(ista forma kao `/apply`: ime, prezime, telefon, mejl, CDL, iskustvo, prekršaji, SAP, pristanak). Bez JS-a dugme ostaje
link na `/apply`.

## Out of scope
- `components/ApplyForm.tsx`, `app/api/**`, tekst pristanka (TCPA), `lib/validation.js` — nedirnuti (puna forma je na
  naslovnoj samo jednom, pa `id`-jevi ne kolidiraju; server je već proverava u celosti).
- Brza forma na dnu naslovne (`#get-started`), `/apply`, „APPLY NOW" u navigaciji.
- Probno slanje na produkciji — prava prijava; samo na Pavlovu reč.

## EXPECTED-FILES
- `components/ApplyDialog.tsx` (nov)
- `components/Home.tsx`
- `app/globals.css`
- `tests/rendered-html.test.mjs`
- `__tests__/globals-css.test.js` (samo ako se census `K1/A` pomeri)
- `workflow/projects/growth-cinematic/DECISIONS.md`
- `workflow/projects/growth-cinematic/batches/TTI5.md`
- `workflow/STATE.md`
- `workflow/LOG.md`
- `workflow/projects/growth-cinematic/ROADMAP.md`

## GATES
`quick` · `typecheck` · `test` · `full` · `verify` · `rendered` · `manual`

## ACCEPTANCE
- Kapije exit 0, meta ispisana.
- Nov `rendered` test (dugme = link na `/apply`; u heroju `<dialog>` sa PUNOM formom, pristankom i `action="/api/apply"`;
  tačno jedna puna forma na naslovnoj) — dokazano crven (prozor sa brzom formom → pada) pa zelen.
- Prozor: modal, fokus ulazi, Esc i × zatvaraju, `id`-jevi se ne ponavljaju, konzola bez grešaka.
- Kontrast u otvorenom prozoru, 1440 i 390: nijedan tekst ispod praga.
- Pikseli: repo = pregled (heroj i otvoren prozor, 1440 i 390), osim svesno navedenih razlika.
- **`manual`:** Pavle je video isti UI u pregledu i rekao *„to je okej"*; dokaz da je repo isti je poređenje piksela.

## ROLLBACK
Pre spajanja: brisanje grane. Posle spajanja: `git revert` implementacionog commita.

## APPROVED-SCOPE-EXPANSION
- nema.

## Zatvaranje (2026-09-24)
- Kapije (lokalno, `next start`, PID 25000, meta `http://localhost:3000`): `quick`, `typecheck`, `test` 135/135,
  `full`, `verify` 14 + 13, `rendered` 22/22 (21 → 22, nov test stvarno pokrenut) — sve exit 0. `K1/A` ostaje 139, pa
  `__tests__/globals-css.test.js` nije menjan.
- Nov test `TTI5`: u prozor namerno stavljena brza forma → `rendered` 20/22 (pada `TTI5` i `RD7` „tacno jedna brza
  forma"), exit 1 → vraceno → 22/22, exit 0.
- Prozor na repo buildu, 1440 i 390: modal, fokus na „zatvori", strana zakljucana (`overflow:hidden`), Esc i ×
  zatvaraju, `id`-jevi se ne ponavljaju, konzola 0. Kontrast u otvorenom prozoru: 20 tekstova, 0 ispod praga.
- Pikseli: repo = odobreni pregled, 0,000% razlike (heroj i otvoren prozor, 1440 i 390).
- **`manual`:** Pavle je video isti UI u pregledu (`localhost:3100`) i rekao *„Moze to je okej, moze push"*; da je
  repo isti dokazuje poredjenje piksela. Slanje prijave nije probano (lokalno nema baze; na produkciji je to prava
  prijava).
