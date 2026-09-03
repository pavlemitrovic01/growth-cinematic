/**
 * Deklaracija Workers bindinga.
 *
 * `@cloudflare/workers-types` isporucuje PRAZAN `Cloudflare.Env` i sam kaze (index.d.ts:14460)
 * da ga projekat prosiruje ponovnim deklarisanjem — TypeScript spaja deklaracije.
 * Bez ovoga `db/index.ts` ne moze da procita `env.DB` bez greske, iako binding stvarno postoji.
 *
 * ⚠️ Ovo je GLOBALNA deklaracija namespace-a, ne augmentacija modula `cloudflare:workers`.
 * Taj modul radi `export = CloudflareWorkersModule`, a `env` u njemu je tipa `Cloudflare.Env` —
 * pa se prosiruje namespace, ne modul.
 *
 * Bindinzi se ukljucuju u `.openai/hosting.json` (`d1: "DB"`), a `vite.config.ts` ih simulira
 * lokalno. Ovaj fajl samo opisuje TIP onoga sto je tamo vec ukljuceno — ne ukljucuje nista sam.
 * Ako se doda R2, dodaje se i ovde.
 */
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    ASSETS: Fetcher;
  }
}
