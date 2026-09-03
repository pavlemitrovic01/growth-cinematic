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
  expect(m.openGraph.images).toBeUndefined();
  vi.unstubAllEnvs();
});
it('keeps preview sitemap empty and exposes pages plus articles only at launch', async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example');
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'false');
  vi.resetModules();
  expect((await import('../app/sitemap')).default()).toEqual([]);
  vi.stubEnv('NEXT_PUBLIC_SITE_LIVE', 'true');
  vi.resetModules();
  const urls = (await import('../app/sitemap')).default().map(x => x.url);
  expect(urls).toHaveLength(13);
  expect(new Set(urls).size).toBe(13);
  expect(urls.every(url => url.startsWith('https://preview.example/'))).toBe(true);
  vi.unstubAllEnvs();
});
