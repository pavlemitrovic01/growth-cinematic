import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * ⚠️ PREVEDENO SA SQLITE-A NA POSTGRES pri prelasku sa Cloudflare D1 na Neon (Vercel).
 * Tabele, kolone i njihova namena su iste; tipovi su drugi jer je motor drugi. Razlike
 * koje NISU kozmeticke oznacene su na svom mestu ispod.
 */

/**
 * Kocnica za javne POST endpointe — sloj 1 iz `lib/rate-limit.js`.
 *
 * ⚠️ Ovde su ISKLJUCIVO brojaci po IP-u i vreme isteka prozora. Nista licno.
 * `key` je `rl:<bucket>:<ip>`, dakle IP jeste u kljucu — ali red zivi najvise
 * `WINDOW_SECONDS` i ne vezuje se ni za jednu prijavu.
 *
 * `lib/rate-limit.js` ovu tabelu gadja SIROVIM SQL-om preko Neon klijenta, ne kroz
 * drizzle. Razlog je nepromenjen: upsert sa `RETURNING` u jednoj izjavi je jedan
 * round-trip, a drizzle-ov `onConflictDoUpdate` ovde ne daje nista osim sloja. Schema
 * postoji da `npm run db:generate` proizvede migraciju — ne kao pristupni sloj.
 */
export const rateLimit = pgTable(
  "rate_limit",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),

    /**
     * ⚠️ `bigint`, NE `integer` — i to je prava zamka ove migracije, ne stilska odluka.
     * Ovde stoji epoch u MILISEKUNDAMA (`Date.now() + WINDOW_SECONDS * 1000`), sto je
     * danas ~1.8e12. SQLite `INTEGER` je 64-bitni pa je to prolazilo bez razmisljanja;
     * Postgres `integer` je int4 sa gornjom granicom ~2.15e9. Doslovan prenos tipa bi
     * dao overflow na PRVOM upisu i kocnica bi otkazala u celosti.
     */
    resetAt: bigint("reset_at", { mode: "number" }).notNull(),
  },
  // ⚠️ Indeks postoji ZBOG BRISANJA, ne zbog citanja. Citanje ide po primarnom kljucu.
  // `lib/rate-limit.js` povremeno brise istekle redove (`WHERE reset_at <= $1`); bez ovog
  // indeksa to je pun skan tabele — a tabela je najveca bas kad je najmanje smes skenirati,
  // pod raspodeljenim napadom sa mnogo IP-ova.
  (table) => [index("rate_limit_reset_at_idx").on(table.resetAt)],
);

/**
 * Trajni zapis prijave.
 *
 * ⚠️ OVO JE RAZLIKA U ODNOSU NA MAIN. Tamo je isti posao (F1c) parkiran 2026-08-30
 * jer ziva baza nikad nije provisionovana, pa TCPA dokaz o pristanku postoji
 * ISKLJUCIVO u telu notifikacionog mejla. Za backup leada je to prihvatljivo; za
 * dokaz o pristanku nije — prva prijava se osporava kao i stota.
 *
 * ⚠️ Mejl notifikacija OSTAJE nosilac. Baza je drugi zapis, ne zamena: ruta sme da
 * vrati uspeh samo ako je mejl stvarno otisao (isto pravilo kao u MAIN-u), a neuspeo
 * upis u bazu se loguje i ne obara odgovor vozacu.
 */
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    // 'apply' | 'callback' | 'carrier-inquiry' — koja ruta je primila
    source: text("source").notNull(),

    /**
     * ⚠️ `jsonb` umesto SQLite `text`-a sa JSON modom. Sadrzaj je isti string koji je i
     * ranije upisivan; dobitak je sto se u Neon konzoli lead moze procitati i filtrirati
     * po polju umesto da bude neprozirna niska. `lib/leads.js` zato upisuje uz izricit
     * `::jsonb` cast — bez njega Postgres tip parametra izvodi, a izvodjenje na kriticnoj
     * putanji nije mesto za pretpostavke.
     */
    payload: jsonb("payload").notNull(),

    // ── TCPA dokazni zapis ───────────────────────────────────────────────────
    // Sta je tacno pisalo iznad dugmeta u trenutku pristanka, ko ga je dao i odakle.
    // Verzija teksta se cuva da se kasnija izmena formulacije ne prepise preko
    // starijih pristanaka.
    //
    // ⚠️ `boolean` umesto SQLite `integer` sa boolean modom — isti ugovor, nativan tip.
    consentGranted: boolean("consent_granted").notNull(),
    consentText: text("consent_text"),
    consentVersion: text("consent_version"),
    consentIp: text("consent_ip"),
    consentUserAgent: text("consent_user_agent"),

    emailDelivered: boolean("email_delivered").notNull().default(false),

    /**
     * ⚠️ `timestamptz` umesto SQLite `text` sa `CURRENT_TIMESTAMP`. U SQLite-u je ovo
     * bila niska bez zone; TCPA zapis kome se osporava vreme je slabiji dokaz, a Neon
     * daje pravi tip bez dodatnog posla.
     */
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [index("leads_created_at_idx").on(table.createdAt)],
);
