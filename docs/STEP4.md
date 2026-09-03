# Step 4 — SEO and response protection

Work remains local; no public launch or domain switch was performed.

- NEXT_PUBLIC_SITE_URL is the build-time origin for canonical, Open Graph, Twitter and structured data. Local default: http://localhost:5173. Set the actual preview origin before a preview build.
- NEXT_PUBLIC_SITE_LIVE defaults false. HTML and HTTP responses use noindex; robots denies crawling; sitemap is empty. Set true only for the intended public origin.
- Public sitemap contains ten pages and three articles, not API endpoints or 404s. Article dates come from the content, not build time.
- Organization/WebSite, FAQPage and Article JSON-LD use existing content. No JobPosting, salaries, ratings or invented address.
- Removed broken og.jpg metadata. No social image generated.
- CSP is enforced in next.config.ts and on Worker responses, including error responses. API responses are no-store. Cross-origin browser POSTs are rejected at the Worker boundary.
- CSP retains unsafe-inline for App Router hydration and styles. This is not a nonce-based XSS defense. Production does not permit unsafe-eval or arbitrary third-party script origins.
- Step 5 removed the temporary jsDelivr exception. The hero is now bundled locally and deferred on eligible desktop viewports.
- Analytics and advertising remain disabled; no unused consent banner is presented.
- Privacy now describes optional delivery and the database's actual consent scope/version fields. The database does NOT currently store the full consent text, despite earlier progress messages claiming otherwise.
- Legal copy remains a draft for owner review before launch.

References: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src
https://developers.google.com/search/blog/2023/08/howto-faq-changes
FAQ markup is semantic data, not a promise of rich results.
