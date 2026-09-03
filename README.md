# GROWTH Cinematic

Independent CDL-A recruiting website. Work here does not change C:/dev/growth (MAIN).
Forest/cream cinematic design, desktop Three.js story, static phone/reduced-motion
fallback, driver applications, carrier inquiries and practical driver resources.

## Local preview on Windows

Requires installed dependencies and Node.js >=22.13.0.

    node node_modules/vinext/dist/cli.js build
    npm run preview:local

Open http://localhost:5173. Restart the preview after rebuilding. The local adapter
serves the built Worker and static files, including compression, without patching
dependencies. The existing bash build/validation helpers target Linux.

## Checks

    npm test
    npm run typecheck
    node --test tests/rendered-html.test.mjs
    node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next --ignore-pattern work

Build before running the rendered-HTML tests. Browser screenshots and Lighthouse
reports are local ignored artifacts in outputs/step6; audit tools live in work/qa.

## Project state

- See docs/STEP4.md, docs/STEP5.md and docs/STEP6.md for implementation and verification.
- NEXT_PUBLIC_SITE_LIVE defaults false: HTML/HTTP noindex, blocked robots and empty sitemap.
- NEXT_PUBLIC_SITE_URL defaults to the local preview origin. No domain switch is made.
- Mail is not activated. A submission is successful only after configured delivery
  succeeds; unavailable delivery shows an honest error. Local tests mock all submissions.
- D1 storage and redaction behavior are documented in the privacy page and source.
- No analytics or advertising trackers are active. No public deployment has been made.
- Contact details, FAQ, articles and social metadata are centralized under lib/.

The current scope is complete local review. Launch configuration and owner review are
separate work; keep MAIN untouched.
