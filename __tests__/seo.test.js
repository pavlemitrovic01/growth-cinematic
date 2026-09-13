import { it, expect, vi } from 'vitest';
it('uses distinct absolute canonicals and matching social metadata without a missing image', async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'false');
  vi.resetModules();
  const { pageMeta } = await import('../lib/seo');
  const m = pageMeta({ path: '/about', title: 'About', description: 'Our story' });
  expect(m.alternates.canonical).toBe('https://preview.example/about');
  expect(m.openGraph.url).toBe(m.alternates.canonical);
  expect(m.twitter.title).toBe('About');
  expect(m.openGraph.images[0].url).toBe('https://preview.example/og.jpg');
  expect(m.twitter.card).toBe('summary_large_image');
  const article = pageMeta({ path: '/truckers-lounge/test', title: 'Article', description: 'Article details', article: true });
  expect(article.openGraph.images).toEqual([]);
  expect(article.twitter.images).toEqual([]);
  expect(article.twitter.card).toBe('summary');
  vi.unstubAllEnvs();
});

// Sirina i visina iz JPEG SOF markera (0xC0-0xCF bez DHT 0xC4, JPG 0xC8 i DAC 0xCC); null ako nije JPEG.
function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  for (let i = 2; i + 9 < b.length; i += 2 + b.readUInt16BE(i + 2)) {
    if (b[i] !== 0xff) return null;
    const t = b[i + 1];
    if (t >= 0xc0 && t <= 0xcf && t !== 0xc4 && t !== 0xc8 && t !== 0xcc) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
  }
  return null;
}
it('social image file exists, stays within 150 KB and matches its declared dimensions', async () => {
  /**
   * ⚠️ Test iznad obecava "without a missing image", a proverava samo URL. Ovaj proverava FAJL:
   * `og:image:width/height` citaju samo crawleri, pa bi nesklad sa stvarnom slikom prosao
   * nevidljivo, a slika od 1,5 MB tiho. Dimenzije se citaju iz fajla, ne prekucavaju (B1).
   */
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'false');
  vi.resetModules();
  const { SOCIAL_IMAGE } = await import('../lib/seo');
  const { existsSync, readFileSync } = await import('node:fs');
  const file = 'public' + new URL(SOCIAL_IMAGE.url).pathname;
  expect(existsSync(file), `${file} ne postoji`).toBe(true);
  const bytes = readFileSync(file);
  expect(bytes.length, `${file} ima ${bytes.length} B, a limit je 150000`).toBeLessThanOrEqual(150000);
  expect(jpegSize(bytes), `dimenzije ${file} se ne slazu sa SOCIAL_IMAGE`).toEqual({ width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height });
  vi.unstubAllEnvs();
});
it('keeps preview sitemap empty and exposes pages plus articles only at launch', async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'false');
  vi.resetModules();
  expect((await import('../app/sitemap')).default()).toEqual([]);
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'true');
  vi.resetModules();
  const { PAGE_PATHS } = await import('../lib/routes.js');
  const { POSTS } = await import('../lib/posts.js');
  const urls = (await import('../app/sitemap')).default().map(x => x.url);
  // ⚠️ Broj se IZVODI iz izvora, ne prekucava. Tvrdo `13` je do 2026-09-06 prolazilo i kad bi
  // nova ruta ostala van sitemap-a — test je merio sam sebe. Da spisak i dalje prati stablo
  // ruta cuva zaseban test ispod; ovde se cuva da sitemap ne ispusti nista iz oba izvora.
  const expected = PAGE_PATHS.length + POSTS.length;
  expect(urls).toHaveLength(expected);
  expect(new Set(urls).size).toBe(expected);
  for (const path of PAGE_PATHS) {
    expect(urls).toContain('https://preview.example' + (path === '/' ? '/' : path));
  }
  expect(urls.every(url => url.startsWith('https://preview.example/'))).toBe(true);
  vi.unstubAllEnvs();
});

it('svaka staticka ruta u app/ ima svoj red u lib/routes.js', async () => {
  /**
   * ⚠️ OVO JE PRAVA INVARIJANTA. Sitemap i obe `verify` kapije citaju `lib/routes.js`, pa se
   * medjusobno slazu bez obzira na to sta je u njemu — slazu se i kad je nepotpun. Jedino
   * stablo ruta u `app/` moze da kaze da spisku nesto NEDOSTAJE.
   *
   * Scenario koji ovo hvata: neko doda `app/nova-stranica/page.tsx` i ne dopise je u
   * `lib/routes.js`. Do 2026-09-06 su sitemap, oba `verify`-ja i ovaj test ostajali zeleni,
   * a stranica ne bi bila ni objavljena ni izmerena.
   */
  const { readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { PAGE_PATHS } = await import('../lib/routes.js');

  const found = [];
  const walk = (dir, segments) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === 'api') continue;        // API rute nisu indeksabilne stranice
        if (entry.name.startsWith('[')) continue;  // dinamicke rute pokriva POSTS
        // `_folder` iskljucuje sebe i sve podfoldere iz rutiranja; `@slot` je paralelna ruta,
        // ne samostalan URL. Oba po `next/dist/docs/01-app/01-getting-started/02-project-structure.md`.
        // (Segment sa doslovnom donjom crtom pise se `%5F…` i pocinje procentom, pa ovde ne upada.)
        if (entry.name.startsWith('_') || entry.name.startsWith('@')) continue;
        // Rutne grupe `(ime)` ne ucestvuju u URL-u.
        walk(join(dir, entry.name), entry.name.startsWith('(') ? segments : [...segments, entry.name]);
      } else if (/^page\.(?:tsx|jsx|ts|js)$/.test(entry.name)) {
        found.push('/' + segments.join('/'));
      }
    }
  };
  walk('app', []);

  expect([...found].sort()).toEqual([...PAGE_PATHS].sort());
});
