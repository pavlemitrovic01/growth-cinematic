import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Pristup bazi. Zamenjuje Cloudflare D1 binding posle prelaska na Vercel.
 *
 * ⚠️ ZASTO `neon-http` A NE OBICAN POSTGRES DRAJVER. Vercel izvrsava rute u serverless
 * funkcijama kojih pod saobracajem ima mnogo i koje krace zive od konekcije. Klasican
 * `pg`/`postgres.js` bi svaka instanca otvarala svoj TCP socket i baza bi ostala bez
 * konekcija pre nego sto bi ostala bez kapaciteta. `neon-http` ide preko HTTP-a i nema
 * pool koji moze da se iscrpi — to je isti razlog iz kog je na Workers-u biran D1 umesto
 * `ioredis`, samo druga platforma.
 *
 * ⚠️ `getSql()` VRACA `null` UMESTO DA BACI kad `DATABASE_URL` ne postoji. To nije
 * nemarnost nego prenet ugovor: na D1 su `lib/leads.js` i `lib/rate-limit.js` citali
 * binding kroz `try`, jer `cloudflare:workers` postoji samo u Workers runtime-u — pa je
 * u vitest-u (obican Node) uvoz padao i moduli su prelazili na svoj rezervni put. Isti
 * oblik ostaje ovde: bez `DATABASE_URL` testovi mere in-memory sloj, a ne pucaju na uvozu.
 *
 * Posledica koju treba drzati na umu: `getDb()` BACA, jer njega zove kod koji bez baze
 * nema sta da radi. Rezervni put je posao pozivaoca, ne ovog modula.
 */

/** @type {ReturnType<typeof neon> | null} */
let cached: ReturnType<typeof neon> | null = null;
let cachedUrl: string | null = null;

/** Sirov Neon klijent (tagged template), ili `null` kad baza nije konfigurisana. */
export function getSql(): ReturnType<typeof neon> | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // Kes se vezuje za URL da promena okruzenja izmedju testova ne ostavi stari klijent.
  if (!cached || cachedUrl !== url) {
    cached = neon(url);
    cachedUrl = url;
  }
  return cached;
}

/** Drizzle instanca za tipizovan pristup. Baca kad baza nije konfigurisana. */
export function getDb() {
  const sql = getSql();
  if (!sql) {
    throw new Error(
      "DATABASE_URL nije postavljen. Neon baza se vezuje kroz Vercel Marketplace integraciju, koja tu promenljivu ubacuje sama; lokalno je upisi u `.env.local`.",
    );
  }
  return drizzle(sql, { schema });
}
