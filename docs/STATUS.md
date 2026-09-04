# STATUS — gde je projekat i šta je sledeće

Poslednji put ažurirano: 2026-09-04. Piše se na kraju sesije, čita se na početku sledeće.

## Šta je ovo

Novi CDL-A sajt (`C:/dev/growth-cinematic`), izgrađen na cinematic prototipu, uz prenos
svega upotrebljivog iz postojećeg sajta. **Ovo je poseban projekat sa sopstvenim git-om**, a
ne grana postojećeg.

**Stek: Next.js → Vercel, Neon (Postgres) za bazu.** Do 2026-09-04 je ciljao Cloudflare
Workers kroz `vinext`; taj sloj je uklonjen (vidi „Prelazak na Vercel" niže).

## ⚠️ Tvrdo ograničenje

**`C:/dev/growth` (MAIN) se NE DIRA.** To je živ sajt na `growthcdl.com` koji prima prave
prijave. Čita se slobodno kao izvor; ne piše se u njega ni na granu.

Provereno na kraju ove sesije: `main` na `391fde3`, čisto radno stablo.

**`C:/dev/GROWTH-B`** nije zaseban folder nego **git worktree MAIN-a** na grani
`batch/pb1-cinematic-home`. Nosi `DECISIONS.md` unos **D28** — zapis zašto ovaj projekat
postoji i šta ga obavezuje — i `PB1.md` manifest. **Grana se nikad ne merge-uje.** Ako se
folder briše, D28 i PB1.md odlaze s njim.

## Stanje

Sajt je funkcionalno kompletan i nikad nije deploy-ovan.

| | |
|---|---|
| Ruta | 14 (+3 API) |
| Sadržaj | ~85% obima originala; podstranice na paritetu ili iznad |
| Testovi | 120 u 8 fajlova (vitest) + 9 HTTP testova nad renderovanim HTML-om |

**Kapije** — sve moraju biti zelene pre commita:

```
npm run typecheck
npm run lint
npm test
npm run build
npm run verify         # verify:nojs + verify:claims, traži pokrenut server
npm run test:rendered  # traži pokrenut server
```

Poslednje dve gađaju `:3000` po difoltu (`--port` menja) i ne pokreću server same —
pokreni `npm run build && npm start` pa meri protiv njega.

## Prelazak na Vercel (2026-09-04)

Otkriveno merenjem: `app/` i `components/` nisu bili vezani za Cloudflare uopšte — uvoze
samo standardni Next, pa `next build` prolazi bez izmene izvora stranica. Uklonjeno je
`worker/index.ts`, `vite.config.ts`, `build/`, `.openai/hosting.json`, `env.d.ts`,
`examples/d1/`, `app/chatgpt-auth.ts`, pet `scripts/` pomoćnika i 123 npm paketa.

**Tri stvari su bile stvarni posao, ne brisanje:**

1. **`middleware.ts`** — `rejectCrossOrigin` se u celom projektu zvao isključivo iz
   workera. Bez zamene bi migracija tiho otvorila javne POST rute za cross-origin zahteve.
   Middleware sam pečati bezbednosna zaglavlja jer odgovor koji u njemu nastane ne prolazi
   kroz `headers()` iz `next.config.ts`.
2. **`lib/rate-limit.js` → `clientIp`** — redosled zaglavlja je **obrnut**. Na Cloudflare-u
   je `cf-connecting-ip` išlo prvo jer ga edge prepisuje; Vercel ga ne postavlja, pa bi ga
   posetilac slao sam i kočnica bi se zaobilazila jednim zaglavljem. Sada prvo idu
   platformska zaglavlja, a `x-forwarded-for` uzima **poslednji** unos, ne prvi.
3. **`dynamicParams = false`** na članku — sa `true` je nepostojeći `/truckers-lounge/<bilo
   šta>` vraćao **200 sa telom 404 stranice**, jer se `notFound()` okida pošto je odgovor
   već streamovan. Pretraživaču bi svaka izmišljena putanja izgledala kao validna stranica.

Baza: D1 (SQLite) → Neon (Postgres). Šema prevedena, migracija regenerisana.
**Zamka koja je uhvaćena u prevodu:** `reset_at` drži epoch u milisekundama (~1.8e12);
SQLite `INTEGER` je 64-bitni, ali Postgres `integer` je int4 sa granicom ~2.15e9 —
doslovan prenos tipa bi dao overflow na prvom upisu i kočnica bi otkazala u celosti.
Kolona je zato `bigint`.

## Zamke koje su već jednom pojele vreme

- **Proveri koji proces sluša na portu pre merenja.** Zaostali server je dvaput dao lažne
  nalaze. `netstat -ano | grep 3000`. Na Windows-u `kill <pid>` iz Git Bash-a **ne gasi**
  Node proces — ide `taskkill /PID <pid> /T /F`, pa tek onda merenje.
- **Browser panel drži tab u `visibilityState: "hidden"`**, pa se 3D scena namerno ne
  pokreće i `rAF` ne radi. Hero se ne može proveriti odatle — traži pravi browser.
- **Migracija nikad nije puštena ni na jednu živu bazu.** Na D1 je bila primenjena samo
  lokalno; Neon baza još ne postoji.

## Šta je namerno ugašeno

- **`NEXT_PUBLIC_SITE_LIVE`** — dok nije `true`, sajt je `noindex` na tri mesta (HTML, HTTP
  zaglavlje, `robots.txt`) i `sitemap` je prazan. `lib/seo.js:5` baca grešku ako neko upali
  indeksiranje bez pravog HTTPS origin-a. **Original je živ i indeksiran na istom domenu** —
  dva izvora za isti sadržaj štete sajtu koji prima prave prijave.
- **`NEXT_PUBLIC_CONSENT_REQUIRED`** — consent baner, kontrola u footeru i puna verzija
  privacy sekcije pale se zajedno. Dok je ugašeno, sajt ne učitava nijedan tracker i privacy
  tekst to tačno kaže. Pali se **u istom trenutku kad i analitika**, ne pre.
- **Resend** (`RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`) — rute rade i bez njega: vraćaju
  503 „pozovite nas", nikad lažnu potvrdu.
- **`DATABASE_URL`** — bez njega rute rade, ali se lead ne upisuje trajno i kočnica pada na
  slabiji in-memory sloj. Vercel Marketplace Neon integracija ubacuje promenljivu sama.

## Sledeće, po redosledu

1. **Vercel projekat + Neon baza.** Nalog je isti na kom živi original
   (`team_lFVUISCch3euonXJEBmOdfiA`, projekat `growth`) — novi sajt ide kao **zaseban
   projekat**, domen se ne dira. Uz projekat: Neon kroz Marketplace, pa migracija
   `drizzle/0000_steep_hannibal_king.sql` na pravu bazu.
2. **Deploy sa `noindex`.** Otključava četiri stvari koje se lokalno ne mogu proveriti: 3D
   na pravom hardveru, Lighthouse na hostingu, prijava kroz ceo lanac (forma → Neon →
   Resend → inbox), i pokazivanje sajta bilo kome.
3. **Resend ključ i adresa za notifikacije** — čeka Pavla.
4. **Analitika**, pa uz nju upaliti consent kapiju.
5. **Odluka o prelasku** — tek kad postoje brojke.

## Otvoreno, svesno

- **`npm audit`: 4 high u produkcijskim zavisnostima** (`postcss`, `sharp`), sve rešive
  podizanjem `next`-a na 16.3.4. ⚠️ **Ovo je sada hitnije nego na Cloudflare-u.** Ranije
  je stajalo da nijedna nije u worker bundle-u; na Vercelu Next-ov optimizator slika radi u
  deploy-ovanom runtime-u i `sharp` je u njemu. Bump je namerno ostavljen izvan migracije
  da ne meša dva izvora regresije — ide kao prvi sledeći posao, sa svojim prolaskom kapija.
- **Cold start baze pada u putanju POST-a forme.** Neon gasi compute posle 5 min mirovanja
  i budi se sam za ~300–800 ms, a prvi dodir baze u zahtevu je rate-limit provera. Prva
  prijava posle zatišja je sporija za oko sekundu; ne pada, jer in-memory sloj stoji ispod.
- **Chatbot** nije prenet. Odluka o obimu, ne propust.
- **Next vraća 200 na uhvaćenu serversku grešku** (odgovor je već streamovan). Isti
  mehanizam koji je proizveo 404-bug iz ovog prelaska; bitno kad se uključi monitoring.
- **`env.IMAGES` stavka je zatvorena** — `/_vinext/image` je nestao sa workerom, a Next-ov
  `/_next/image` na Vercelu radi nativno.
- **Privacy i TCPA tekstovi su nacrti za pravni pregled.** Sekcija 05 („Where Your
  Information Is Stored") opisuje stvarno skladištenje u bazi — original je nema jer tamo
  prijava živi samo u mejlu.

## Pravila sadržaja koja i dalje važe

Procesna pravila originala ne obavezuju ovaj projekat (D28), ali `docs/CLAIMS.md` u originalu
nije stil nego FCC/FTC. Sprovodi se automatski: `npm run verify:claims` gađa renderovani HTML,
7 zabranjenih obrazaca i 2 uslovna koja moraju nositi hedž. Copy je prenet doslovno baš zato
što je već prošao kroz sedam claims batch-eva.

**Class A only** — Pavlova odluka 2026-09-04: „prima ali za sad neka ostane samo A".
`lib/form-options.js` ne nudi Class B; vrednost je izvedeno uklonjena i iz serverskog
whitelist-a.
