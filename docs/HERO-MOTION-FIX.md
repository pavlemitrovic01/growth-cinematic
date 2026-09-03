# Hero motion correction — September 3, 2026

The user reported jerky movement after the full-site review. This change is local
to C:/dev/growth-cinematic. MAIN, hosting, indexing and mail settings were not changed.

The scroll controller retained its previous frame timestamp after settling. The
next wheel gesture therefore included idle time in its delta, hit the 64 ms cap,
and jumped 47.27% of the requested movement in its first frame. Three separated
120px wheel gestures reproduced the same 0.02251 jump in normalized hero progress.
The prototype also used a gentler interpolation response than the new controller.

The controller now resets its timestamp when settling and uses a 280 ms response
constant, approximately the prototype's response at 60 Hz but independent of
refresh rate. Scroll events schedule measurement in the next animation frame,
before style writes. Opacity/transform are updated directly instead of through
inherited custom properties; inert/aria-hidden change only when eligibility changes.
The camera's abrupt target switch at 82% progress now blends over 74–90%.

Validation:
- Production build, TypeScript and targeted ESLint pass.
- A real Chrome WebGL context identified Intel Graphics / Direct3D11 in the local
  test (1440 x 900, DPR 1.25; 1800 x 1125 drawing buffer). Rendering quality settings
  were unchanged. This run used hardware acceleration; the earlier Step 6 Lighthouse
  software-rendering measurement remains a separate historical result.
- After full settling, two forward wheel gestures and one reverse gesture each
  advanced 5.7792% of the requested movement in their first frame, without overshoot.
- Pointer movement alone produces no new frames. The scene stops rendering offscreen.
- All four chapter anchors and positions around the camera transition checked for
  visible content, expected focus eligibility, one canvas, and no horizontal overflow.
- Keyboard focus remains usable when the corresponding chapter would otherwise hide.
- Resizing to mobile removes the canvas and resets all chapter styles/accessibility;
  returning to desktop creates exactly one scene. Reduced motion resets similarly.
- A fresh reduced-motion page downloads no renderer; the no-JS page shows all chapters.
- No browser page errors. The in-app browser was reloaded and visually checked.

Local evidence and screenshots are under outputs/hero-fix (ignored by Git).
verification.json contains the completed assertions; verify.mjs retains the local
test harness. Exploratory before.json/after.json record frame samples, including
startup noise; they are not a controlled sustained-FPS benchmark. The completed
verification waits for actual scroll events and fully settled motion before testing
idle gestures. These checks do not establish smoothness on every device.
