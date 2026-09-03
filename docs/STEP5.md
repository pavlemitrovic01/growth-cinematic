# Step 5 — Complete cinematic homepage

Implemented locally in growth-cinematic. MAIN was not edited; nothing was deployed.

## Experience
- Server-rendered homepage: complete story, callback form, four-step process, offer details,
  founder statement, FAQ, driver/carrier CTAs, navigation, footer and mobile actions.
- Desktop retains the prototype's stylized truck, camera journey and night-to-dawn lighting.
- Local Three.js 0.160.1 with matching types. Dynamically imported only at >=1024px wide,
  >=650px high, no reduced-motion preference and no Save-Data request.
- Phones/reduced-motion/no-JS use existing photography and readable story content.
- No CDN exception in CSP. No global window.THREE or untyped any.
- Native details/summary FAQ and a compact no-JS navigation fallback.
- Forms preserve existing delivery/error behavior; no-JS users get a phone link.
  Forms explicitly use POST so a browser cannot fall back to putting personal details in a GET URL.

## Lifecycle
Lazy import cancellation, preference/breakpoint changes, route navigation and context loss
restore readable content and dispose geometry, materials, textures, instancing buffers,
shadow maps and the renderer. Invisible chapters are inert; focused content is preserved.
Rendering is on demand. No perpetual animation at rest.

## Verification
Chrome headless on the local built preview, software WebGL permitted:
- 1440x900 CTA bottom 747px; 1366x768 bottom 677px; 1920x1080 bottom 853px.
- 390x844 CTA bottom 559px; 360x740 bottom 525px. No horizontal overflow.
- Mobile and reduced-motion: no canvas and zero requests for the 3D chunk.
- No-JS mobile after compact navigation: CTA bottom 665px; FAQ expands natively.
- Fully offscreen frame counter stayed 4 -> 4. Hidden-tab guard stopped rendering.
- Reduced-motion, breakpoint and route changes dispose/recreate exactly one canvas.
- Aborted module load and context loss both restore the complete static story.
- Resize while the module import is pending creates no canvas.
- Mocked 503 delivery response displays the error and retains form values. No mail sent.
- Current scene: 58 draw calls on the first frame, including shadow rendering.
- Deferred 3D bundle: 485,505 bytes raw / 122,147 bytes gzip (~119 KiB).
- One local, unthrottled LCP observation: 564ms. This is NOT a field Core Web Vitals
  result or a Lighthouse/mobile performance score. Mobile avoids the 3D bundle entirely.

The first offscreen test used smooth scrollIntoView and measured while the scene was still
partly visible; it was not a valid pause measurement. Replaced by an instant scroll fully
past the hero plus a stable frame-count assertion.

## Windows preview
vinext 0.0.50 uses backslashes as URL keys in its production asset cache on Windows.
Its built HTML worked but nested CSS/JS paths returned 404.
`npm run preview:local` serves unchanged dist/client assets and the built Worker on
http://localhost:5173 without changing node_modules. Run a build before starting/restarting.
The Worker also tolerates missing local runtime bindings. Hosted build behavior is unchanged.

## References
Three.js cleanup: https://threejs.org/manual/en/cleanup.html
Disposal: https://threejs.org/manual/en/how-to-dispose-of-objects.html
Instancing: https://threejs.org/docs/#api/en/objects/InstancedMesh
