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

test('homepage includes the full story, navigation and a real application path in server HTML', async () => {
  const response = await get('/');
  const html = await response.text();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  for (const text of ['Your next route.', 'Partner carriers.', 'Cost to drivers.', 'get-started', '/for-carriers', '/about', '/truckers-lounge']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('cdn.jsdelivr.net'));
  assert.ok(!html.includes('verified carriers'));
  assert.ok(!html.includes('+10000000000'));
  assert.ok(html.includes('method="post"'));
  assert.ok(html.includes('The online form needs JavaScript.'));
  assert.ok(!response.headers.get('content-security-policy').includes('jsdelivr'));
});
test('contact forms have a no-JS contact alternative and never fall back to GET submission', async () => {
  for (const path of ['/apply','/for-carriers','/contact']) {
    const html = await (await get(path)).text();
    assert.ok(html.includes('The online form needs JavaScript.'), path);
    assert.ok(html.includes('method="post"'), path);
  }
});

test('unknown articles render a complete accessible 404, not a bare text response', async () => {
  const response = await get('/truckers-lounge/unknown-article');
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /Wrong exit/);
  assert.match(html, /id="main-content"/);
  assert.ok(html.includes('href="/apply"'));
});
test('article metadata is concise, specific and does not inherit the generic social image', async () => {
  const { POSTS } = await import('../lib/posts.js');
  for (const post of POSTS) {
    const html = await (await get('/truckers-lounge/' + post.slug)).text();
    assert.match(html, /property="og:type" content="article"/);
    assert.ok(!html.includes('property="og:image"'));
    assert.ok(post.description.length <= 180);
    assert.ok(html.includes(post.modified));
  }
});
