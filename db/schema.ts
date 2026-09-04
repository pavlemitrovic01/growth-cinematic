import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Kocnica za javne POST endpointe — sloj 1 iz `lib/rate-limit.js`.
 *
 * ⚠️ Ovde su ISKLJUCIVO brojaci po IP-u i vreme isteka prozora. Nista licno.
 * `key` je `rl:<bucket>:<ip>`, dakle IP jeste u kljucu — ali red zivi najvise
 * `WINDOW_SECONDS` i ne vezuje se ni za jednu prijavu.
 *
 * `lib/rate-limit.js` ovu tabelu gadja SIROVIM SQL-om preko D1 bindinga, ne kroz
 * drizzle. Razlog: upsert sa `RETURNING` u jednoj izjavi je jedan round-trip, a
 * drizzle-ov `onConflictDoUpdate` ovde ne daje nista osim sloja. Schema postoji da
 * `npm run db:generate` proizvede migraciju — ne kao pristupni sloj.
 */
export const rateLimit = sqliteTable(
  "rate_limit",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),
    resetAt: integer("reset_at").notNull(),
  },
  // ⚠️ Indeks postoji ZBOG BRISANJA, ne zbog citanja. Citanje ide po primarnom kljucu.
  // `lib/rate-limit.js` povremeno brise istekle redove (`WHERE reset_at <= ?`); bez ovog
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
 * dokaz o pristanku nije — prva prijava se osporava kao i stota. D1 je ovde vec
 * dostupan, pa zapis ide u bazu od prvog dana.
 *
 * ⚠️ Mejl notifikacija OSTAJE nosilac. Baza je drugi zapis, ne zamena: ruta sme da
 * vrati uspeh samo ako je mejl stvarno otisao (isto pravilo kao u MAIN-u), a neuspeo
 * upis u bazu se loguje i ne obara odgovor vozacu.
 */
export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    // 'apply' | 'callback' | 'carrier-inquiry' — koja ruta je primila
    source: text("source").notNull(),
    payload: text("payload", { mode: "json" }).notNull(),

    // ── TCPA dokazni zapis ───────────────────────────────────────────────────
    // Sta je tacno pisalo iznad dugmeta u trenutku pristanka, ko ga je dao i odakle.
    // Verzija teksta se cuva da se kasnija izmena formulacije ne prepise preko
    // starijih pristanaka.
    consentGranted: integer("consent_granted", { mode: "boolean" }).notNull(),
    consentText: text("consent_text"),
    consentVersion: text("consent_version"),
    consentIp: text("consent_ip"),
    consentUserAgent: text("consent_user_agent"),

    emailDelivered: integer("email_delivered", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("leads_created_at_idx").on(table.createdAt)],
);
