# Step 6 — Complete site review

Completed locally on September 3, 2026. All changes are in growth-cinematic.
C:/dev/growth (MAIN) was not modified. No site was deployed, mail was not activated,
and preview noindex/robots/sitemap behavior remains in place.

## Design and navigation
- Shared dark forest page headers, cream content areas, consistent outline headings,
  readable 16–18px body text and 14px form labels.
- Short application headers bring the form closer to the first viewport. Driver and
  carrier forms explain their distinct next steps without promising a placement.
- Contact offers direct call/text/email and the existing quick callback form.
- Resources use short article descriptions and readable editorial rows; articles
  retain their own metadata and show truthful publication/update dates.
- Current-page navigation, Contact link, keyboard skip links on every page, Escape
  and outside-click menu closing, focus entering the opened menu, native FAQ.
- The same vector brand mark is used in the header and footer. Mobile call/text/apply
  actions respect safe areas and hide while a form control is focused.
- Standard materials replace unnecessary physical/clearcoat shader variants.
  First desktop chapter reserves its final position before WebGL loads to avoid
  moving the visible headline. The existing desktop 3D and static fallback remain.

## Copy and form behavior
- Removed blanket accusations, unsupported promises and ambiguous hiring language.
  The hidden-costs article now explains concrete questions about pay and agreements.
- FAQ distinguishes recruiting fees from carrier deductions and coverage from actual
  openings. Start dates and carrier eligibility remain conditional.
- Training article states that ELDT is not retroactive and exceptions can apply.
  SAP article separates traffic violations from drug/alcohol program violations and
  explains follow-up testing in months of safety-sensitive duty, including breaks.
- Privacy adds the carrier-inquiry fields and purpose. Consent text/version and the
  existing backend validation, delivery policy and sensitive-note handling remain.
- Duplicate submissions are locked while pending; requests time out after 15 seconds.
  Errors retain inputs and receive keyboard focus. A malformed successful HTTP
  response cannot trigger a success message; an explicit success payload is required.
- Quick-form consent precedes the submit action in DOM and mobile reading order.
- Unknown article URLs now render the complete branded accessible 404 with HTTP 404;
  the previous static-parameter restriction returned only a bare text response.

## Validation
- Production build, TypeScript and ESLint pass.
- 117 unit/API tests and 8 built-Worker HTTP tests pass.
- 60 route/viewport checks: 13 content pages plus 2 missing routes at 320, 390, 768
  and 1440px. No broken internal links, duplicate IDs or horizontal overflow.
- First accessibility sweep: zero violations on all 13 existing content pages at
  desktop/mobile. The missing-article response was fixed and rechecked with axe.
- Final targeted checks at 320, 390, 640, 768 and 1280px cover homepage, application,
  contact and unknown article. Keyboard navigation and 200% text enlargement on eight representative routes at 640px pass.
- Full/quick driver and carrier forms tested with mocked responses only: required
  fields, conditional fields, optional carrier email, error focus, retained input,
  network failure, malformed HTTP 200 and explicit success. No real submissions.
- No-JS: all four form locations have the phone fallback, navigation is usable,
  and FAQ expands. Reduced motion makes no 3D request and creates no canvas.

## Lighthouse 13.4.1 — local lab measurements
Chrome headless, default simulated mobile/desktop presets. The final desktop run
uses a completely fresh browser profile to exclude cached GPU shaders. Desktop permits software
WebGL on this machine. These are local lab results, not field Core Web Vitals or
measurements of a deployed site. Saved JSON/HTML and screenshots are in outputs/step6.

| Page/profile | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| home-mobile-final | 96 | 100 | 100 | 66 | 2.5 s | 0 ms | 0 |
| home-desktop | 86 | 100 | 100 | 66 | 0.6 s | 310 ms | 0 |
| apply-mobile | 98 | 100 | 100 | 66 | 1.8 s | 0 ms | 0 |

SEO is 66 because this preview intentionally blocks indexing in HTML, HTTP and robots.
The other scored SEO audits pass. No indexing guard was removed to increase a score.

Initial mobile performance was 78: the local adapter did not compress text responses.
The adapter now applies gzip to negotiated text responses and cache policy to static
assets. public/_headers carries the corresponding static cache policy for later
hosting; hosted behavior must be verified after a deployment. This is a serving
improvement, not a change to Lighthouse throttling or the site's public status.
An initial desktop run measured CLS 0.14; reserved chapter positioning addresses it.
One complete CLI audit hit a Windows temporary-profile cleanup error after reports
were saved. Later audits used explicit audit profiles to avoid that cleanup problem. A reused
profile scored 100 on desktop; a fresh-profile run scored 86. The table uses the
fresh-profile result. Startup on software WebGL remains the main desktop cost;
actual GPU/device and hosted measurements remain separate. An attempted audit
during a preview restart was discarded; only completed valid runs are listed above.

## Social preview
Built-in Imagegen created public/og.png (1731 x 909). Inspected text and composition.
Site pages use the trusted configured origin for its URL. Articles explicitly clear
the generic image and keep their own title/description, since they have no primary image.

Exact generation prompt:
> Use case: ads-marketing.
> Create ONE finished premium cinematic social sharing card for GROWTH, a CDL-A recruiting brand. Wide landscape canvas, approximately 1200x630, aspect ratio 1.91:1.
> Photorealistic unbranded American semi truck driving on a highway at dawn, occupying the right third, with convincing proportions and warm dawn rim light. Cohesive cinematic photography fading smoothly into a minimal very dark left area.
> Palette: deep forest-black #08110d, warm cream #f1e7d5, restrained burnt orange #c8662e in the dawn light.
> Exquisite clean sans-serif typography in warm cream, high contrast, crisp and fully readable at thumbnail scale. Left aligned. Keep all text inside generous safe margins of at least 6% on every edge, with ample breathing room and no overlap with the truck.
> Top left: plain typographic wordmark "GROWTH".
> Large headline below, exactly two lines:
> "Your next route."
> "Straight answers."
> Smaller supporting line beneath, exactly:
> "CDL-A recruiting. Free for drivers."
> Render those four text elements verbatim, including capitalization, punctuation, and the headline line break; quotation marks are instructions and must not appear.
> No other text, URL, fake badges, people, icons, additional logos, truck branding, watermarks, or company claims. A cohesive finished social card, not a web page screenshot or mockup.

## Sources reviewed
- [FMCSA ELDT](https://www.fmcsa.dot.gov/registration/commercial-drivers-license/entry-level-driver-training-eldt)
- [FMCSA training requirements FAQ](https://tpr.fmcsa.dot.gov/FAQ/Topics/drivers,training-requirements)
- [FMCSA return to duty](https://www.fmcsa.dot.gov/regulations/drug-alcohol-testing/return-duty)
- [US DOT §40.307](https://www.transportation.gov/odapc/part40/40-307)
- [Lighthouse documentation](https://github.com/GoogleChrome/lighthouse/blob/main/readme.md)

The remaining launch work is separate: final owner review, public origin/hosting,
runtime delivery/storage setup when wanted, and then deliberate indexing activation.
