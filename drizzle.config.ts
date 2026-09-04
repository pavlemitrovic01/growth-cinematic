import { defineConfig } from "drizzle-kit";

// ⚠️ `postgresql` umesto `sqlite` — Cloudflare D1 je bio SQLite, Neon je Postgres.
// Migracije generisane pre prelaska (`drizzle/0000_*.sql`) su SQLite dijalekt i ne vaze;
// zamenjuje ih ponovo generisana migracija za ovu semu.
export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
});
