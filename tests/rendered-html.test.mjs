import assert from 'node:assert/strict';
import test from 'node:test';
const { default: worker } = await import('../dist/server/index.js');
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const get = (path, init) => worker.fetch(new Request('http://localhost:5173' + path, init), env, ctx);
test('production responses carry preview and security policy', async () => {
  for (const path of ['/', '/about', '/faq', '/apply', '/privacy', '/truckers-lounge', '/missing-page']) {
    const r = await get(path);
    assert.equal(r.status, path === '/missing-page' ? 404 : 200);
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.ok(r.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    assert.ok(!r.headers.get('content-security-policy').includes('unsafe-eval'));
    const html = await r.text();
    assert.ok(!html.includes('codex-preview'));
    if (path !== '/missing-page') assert.ok(html.includes('http://localhost:5173' + path));
  }
});
test('preview robots denies crawling and sitemap excludes public URLs', async () => {
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Disallow: \/\s/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.ok(!(await sitemap.text()).includes('<loc>'));
});
test('worker rejects a cross-origin submission before reaching delivery', async () => {
  const r = await get('/api/apply', { method: 'POST', headers: { Origin: 'https://evil.example' } });
  assert.equal(r.status, 403);
  assert.equal(r.headers.get('cache-control'), 'no-store');
});
test('FAQ schema matches visible questions, no fabricated jobs', async () => {
  const html = await (await get('/faq')).text();
  assert.ok(html.includes('FAQPage'));
  assert.ok(!html.includes('JobPosting'));
  assert.ok(!html.includes('AggregateRating'));
});
