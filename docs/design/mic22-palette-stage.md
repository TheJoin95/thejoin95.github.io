Owner update — 2026-11-13: the website 3D/Three.js parts were removed during
MIC-26. The palette comparison now uses HTML only, `/experience` redirects to
`/play`, and the 3D dependencies are removed. Earlier GPU verification below is
a historical implementation record, not the current requirement. The sparse
2D fox remains. See `docs/a11y/mic26-audit.md` for the current audit.

# MIC-22 — Interactive image and palette stage

The approved MIC-11 interaction contract extends the existing shared Home/Play
stage. It preserves the white/charcoal composition, original image, actual Nord
output, credit, project destinations and responsive 4:3 / 16:9 / 3:1 framing.
No new image, live processing/upload workflow, palette algorithm or dithering
capability is claimed. The same two existing files remain provenance-checked by
the homepage unit tests and `docs/content/media-provenance.md`.

## Interaction and composition

Server HTML contains a centred, correctly sized 50/50 comparison, image alt text,
Original/Nord labels, project CTA and attribution. Hydration adds a native labelled
range (0–100, initially 50), numeric selected value, Original/Palette endpoint
buttons and Reset comparison. Native range behaviour provides touch, arrows,
Home/End and accessible value announcements. Controls are below the image and
phone labels move below it too. No new slider library is needed: the approved
native range already provides the required behaviour; buttons reuse shadcn.

Fine-pointer mouse hover previews the boundary without changing the selected
value; leaving restores it. Mouse down/drag commits with pointer capture.
Reduced motion suppresses hover preview and keeps direct controls immediate.
Touch input on the image preserves vertical page scrolling; the range is its
explicit manipulation surface. No timeline, autonomous motion, scroll lock,
focus trap or gesture-only action is introduced.

## Renderers, loading and failure

`PaletteStage` remains a server composition. Its small `PaletteReveal` client
boundary owns input and lifecycle. The Three.js scene is a separate `next/dynamic`
chunk requested only after the frame enters the viewport. Existing R3F/drei
manage the canvas and texture loading. The HTML renderer remains beneath it at
the same selected/preview fraction; failed chunks, textures, WebGL initialization,
shader compilation or context loss restore it without changing focus or value.
Image-load failure removes unusable controls and shows a concrete explanation
while retaining alt text, the reserved frame, credit and case-study destination.
Without JavaScript there are no inoperative controls or canvas.

The custom shader is specific to this two-texture reveal; a generic comparison
slider would not supply the required Three.js experiment. One full-screen quad
samples the authentic original and palette output, with matching centre/cover UV
crop. sRGB textures and output conversion preserve their colours. It reveals
precomputed CLI output, not an invented live conversion. No post-processing,
shadows, scene lights, models or per-frame state updates are needed.

Rendering is on demand, with DPR capped at 1.5, antialiasing disabled and a
low-power preference. Offscreen/hidden-tab canvases switch to `never`; returning
invalidates the current value. There is no continuous loop, including under
reduced motion. R3F owns renderer, geometry and material disposal; drei caches
only the two fixed source textures for reuse across Home/Play navigation.

Technical references: [R3F on-demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
and [Three.js colour management](https://threejs.org/manual/en/color-management.html).
Installed Next.js client-boundary/lazy-loading guides and installed library code
were checked against the pinned versions.

## Verification and release boundary

Automated unit tests cover input mapping/clamping, crop geometry, initial HTML,
actual image hashes and preservation of metadata/credits. Browser tests exercise
the real installed WebGL renderer, compare its pixels against HTML at phone,
tablet and desktop sizes, and cover endpoint/reset, keyboard, mouse, touch page
scroll, reduced motion, large text, failures and visibility/render activity.
Full website regression checks retain crawler-visible metadata, social images,
legacy article discovery and existing page behaviour.

Local verification is not a hosted deployment or a physical-device GPU audit.
MIC-26/27 and MIC-31 retain real-device, hosted adapter and release performance
verification. No custom-domain cutover belongs to this change.

Local production-build results (2026-11-13): `bun run check` passed 118 tests
(1,569 assertions); `bun run build` exited 0. The full browser suite passed
86 tests with the two intentionally gated release/preview-context tests skipped
for this local prelaunch build. The final focused stage suite passed all eight,
including reduced-motion mouse input, preserved focus after context loss and
settled button-hover contrast at 200% text size. Stateful browser lifecycle files
are explicitly excluded from Bun's unit line-coverage calculation; their proof
is the real-browser suite, not a claim of full application unit coverage.

The current pixel test exercises 0/50/100% reveal at 320/834/1440px, verifies different
endpoint images and a mean GPU/HTML RGB error below 6/255 at a common 160px comparison width. It produces
`/tmp/mic22-stage-{320,834,1440}.png`. The viewport-entry/chunk-failure test proves
scene code is not requested while the frame is offscreen, then retains working
HTML controls when that download is blocked. Local cold-browser resource timing
measured 247,668 encoded bytes (930,944 decoded bytes) for the two additional
scene/Three.js chunks after viewport entry. This is a local compressed payload
measurement, not a hosted transfer budget or field performance claim. The
performance test counts actual WebGL draw calls and requires zero further draws
at rest, while offscreen (including resize), and during simulated hidden-tab
visibility; input/return to visibility resumes rendering.

No new route or metadata policy is introduced; the full SEO/browser regression
suite still verifies crawler-visible HTML, canonical/OG/Twitter metadata,
actual social PNG responses, discovery and legacy content. The existing
unknown `/blog/[slug]` and `/work/[slug]` prerender diagnostic remains tracked
under MIC-31; published routes and actual 404 tests pass.

The independent scoped finish review returned **Ship** with no material findings
after opening all three stage captures and phone/desktop homepage captures,
and checking the approved contract, source and browser tests. The design detector
reported no findings. This is an extension of the existing design system;
DESIGN.md, global tokens and the approved visual direction are preserved.

MIC-23 tightened the pixel test after the intro placement exposed a weakness:
scrolling to endpoint controls could hide the demand-rendered canvas, causing a
fallback/fallback comparison. The test now re-enters the frame and explicitly
requires the canvas to be visible before each GPU capture. WebGL mipmapping
and native image downsampling differ in fine detail (a full-size 320px source
comparison measured 7.38/255). The test compares crop/colour at a common 160px
width, uses a 6/255 tolerance and requires endpoint difference above 10/255.
Exact cover geometry remains unit-tested, and hover/input/lifecycle are separate
real-browser checks. This corrects the verification method, not the media or
renderer implementation.

All nine visible-renderer endpoint/reset states were measured before choosing
the tolerance: at 160px width the maximum observed error was 5.057/255 on the
phone; tablet was at most 2.401 and desktop 1.787. The comparison budget is now
6/255 (2.4% mean absolute RGB error), with actual endpoint separation 18–24/255 and a required
minimum above 10/255. The original 5/255 budget did not describe consistently
visible-GPU captures. This bounded tolerance preserves more detail than reducing
the comparison to an 80px thumbnail, and the independent crop/input checks stay
unchanged.
