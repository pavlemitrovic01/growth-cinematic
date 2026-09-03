import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * ⚠️ Prenet oprez iz MAIN-a (`C:/dev/growth/vitest.config.js`): `next/server` je tamo bio
 * CJS bez "exports" mape, pa plain Node ESM `import` pada, a Vite/Vitest resolver prolazi
 * jer radi extension-guessing. Ovde je Next **16**, ne 14 — moguce je da to vise ne vazi.
 * Config svejedno ostaje kroz Vitest resolver: ako Next 16 ima ispravnu exports mapu,
 * ovo ne smeta; ako nema, ovo je jedino sto testove rute drzi u zivotu.
 *
 * ⚠️ `__dirname` NE postoji ovde — package.json nosi `"type": "module"` (MAIN ga nema).
 * Zato `import.meta.dirname`, i zato je fajl `.mts` a ne `.js`.
 */
export default defineConfig({
  test: {
    environment: 'node',
    // Starterov sopstveni test (`tests/rendered-html.test.mjs`) vozi `node --test` i
    // trazi izgradjen `dist/` — ne sme da upadne u vitest run.
    include: ['__tests__/**/*.test.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
});
