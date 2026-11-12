# MIC-21 — Original fox vector and Lottie set

This asset task defines the approved sparse recurring character. It does not
place the fox on public pages; MIC-23 owns placement, deliberate interaction
triggers and the easter egg. No additional public route, sitemap entry, article,
comic illustration, SEO schema or social-card claim is needed for decorative
assets. Existing website content/discovery remains unchanged.

## Model and source

The new right-facing fox has a pointed muzzle, upright ears, cream cheek/throat,
cream-tipped brush tail and dark stockings. It uses the three existing character
tokens, not colours selected by the image experiment. Seven independently
editable named layers share one 192×160 artboard and exact original contours.
There is no traced third-party mascot, generated raster rig, portrait, external
font/image or borrowed motion template.

The layered SVG can be opened in a vector editor; `assets/fox/model.ts` is the
reproducible master with geometry, pivots and timing. Four static poses and three
inspectable Lottie JSON/compressed dotLottie pairs are exported from it. The
asset manifest records source/export sizes and SHA-256 hashes. The full model,
markings, palette, expression/pose rules, authorship/rights record, third-party
notices and usage instructions are in [the asset handoff](../../assets/fox/README.md).

## Motion and runtime

Notice, follow and settle last 1.0, 1.2 and 1.4 seconds at 30fps. They use small
head, tail and forepaw movements, begin and end at the identical resting frame,
and carry non-looping/autoplay-disabled archive metadata. The caller must trigger
one reaction deliberately; there is no continuous tracking or automatic page
decoration. The original `.lottie` clips are each below 3KB. The separately loaded
player runtime is about 1.2MB uncompressed; that dependency cost is not hidden
inside the small clip-size claim.

The existing dynamic client boundary and dotLottie React player are retained.
`build:fox` runs before dev/build, regenerates original exports and copies the
exact locked WASM engine plus its full MIT licence locally. No runtime CDN request
is required. The static poster remains during loading and failed assets/runtime.
Completion settles to that same poster. Offscreen exit or enabling reduced
motion cancels the current reaction; re-entry cannot replay it. Hidden-tab
visibility events pause/resume an unfinished clip. A new deliberate trigger uses
a new React key. The whole fox remains decorative/aria-hidden, never a substitute
for visible status messages or a new essential control.

## Verification

Unit checks verify palette agreement, named editable layers, shared static paths,
closed cubic contour conversion, non-looping/self-contained archives, timing,
identical start/end transforms, source/export hashes, byte reproducibility and
runtime-copy identity/licence. Server rendering provides the static alternative.
Stateful client lifecycle is covered by browser tests rather than mirrored unit
implementations; the coverage configuration explicitly documents that boundary.

Browser proof uses the installed engine to render every compressed clip, samples
actual nontransparent pixels, compares moving/rest frames and exact final frames,
and compares SVG/Lottie silhouette **and interior colours** at rest. It exercises
the chosen React helper's single completion, no replay on re-entry, reduced-motion
changes, offscreen cancellation, failed clips, failed WASM and simulated
visibility-change pause/resume. The latter is an automated event simulation,
not a claim of physical-device/background-tab testing.

The no-script model sheet checks all four poses at 40/48/64/96px on white and
charcoal. Local proof: `/tmp/mic21-fox-sheet.png` and the three
`/tmp/mic21-<clip>-peak.png` captures. The test harness lives in `.test-fixtures/`
and has no public application route. It intentionally displays multiple foxes
for asset inspection; public integration must keep at most one per page.

Independent review found two material issues: per-part paint order initially
covered the animated markings, and helper remounts could replay a completed
reaction. Both received focused fixes and regressions. The reviewer scored both
resolved and issued a scoped ship verdict. `bun run check` passes 115 unit tests
and the coverage gate; `bun run build` succeeds. The full browser suite passes
78 tests, with two context-specific SEO checks intentionally skipped. The model was recognisable
at its actual intended sizes. Shared UI tokens and `DESIGN.md` remain unchanged;
this modelbook supplies the character-specific rules.

No push/deployment, hosted asset upload or custom-domain change was performed.
Successful builds retain the previously recorded fallback CLIENT_HOOK_DYNAMIC
diagnostics; hosted adapter verification remains MIC-31. MIC-23 should verify
sparse placement and trigger behavior in the actual page journey, including
poster behavior with no script/motion, actual hidden tabs and mobile devices.
