# GROWTH Cinematic

Independent CDL-A recruiting website. Work here does not change C:/dev/growth (MAIN).
Forest/cream cinematic design, desktop Three.js story, static phone/reduced-motion
fallback, driver applications, carrier inquiries and practical driver resources.

Runs on Next.js, deployed to Vercel, with Neon (Postgres) for lead storage and rate
limiting. It previously targeted Cloudflare Workers through vinext; that layer was
removed on 2026-09-04 and only the database seam and the worker's cross-origin check
needed rewriting — see docs/STATUS.md for what moved and what it cost.

## Local development

Requires installed dependencies and Node.js >=22.13.0.

    npm run dev

Open http://localhost:3000.

Production build and serve, which is what the runtime gates measure against:

    npm run build
    npm start

## Checks

    npm run typecheck
    npm run lint
    npm test
    npm run verify         # needs a running server on :3000
    npm run test:rendered  # needs a running server on :3000
    npm run build

`verify` (no-JS content plus the claims register) and `test:rendered` both drive a live
server over HTTP and start nothing themselves — the caller decides whether dev or the
production build is under test. Both take `--port`.

Browser screenshots and Lighthouse reports are local ignored artifacts in outputs/step6;
audit tools live in work/qa.

## Project state

- See docs/STATUS.md for where the project stands and what comes next.
- See docs/STEP4.md, docs/STEP5.md and docs/STEP6.md for implementation and verification.
- NEXT_PUBLIC_SITE_LIVE defaults false: HTML/HTTP noindex, blocked robots and empty sitemap.
- NEXT_PUBLIC_SITE_URL defaults to the local origin. No domain switch is made.
- DATABASE_URL is injected by the Vercel Marketplace Neon integration. Without it the
  routes still work: the lead is not stored permanently and rate limiting falls back to
  its weaker in-memory layer.
- Mail is not activated. A submission is successful only after configured delivery
  succeeds; unavailable delivery shows an honest error. Local tests mock all submissions.
- Lead storage and redaction behavior are documented in the privacy page and source.
- No analytics or advertising trackers are active. No public deployment has been made.
- Contact details, FAQ, articles and social metadata are centralized under lib/.

The current scope is complete local review. Launch configuration and owner review are
separate work; keep MAIN untouched.
