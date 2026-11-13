# MIC-27 — Image, font, animation and page performance

Measured 2026-11-13 against the local production server. Baseline is MIC-26
commit `13e17e6`, after the owner's 3D removal. These results do not credit the
image change with removing 3D. No deployment, DNS change or field measurement.

## Findings and changes

The initial mobile view fetched full-size palette JPEG/PNG files. Home's
median lab LCP was 4.284s. Native Suspense gallery fallbacks also requested raw
PNG files before the enhanced galleries requested their optimized counterparts.
That duplicated traffic competed with content the visitor could already see.

- Use Next Image's responsive WebP delivery for both palette images, with
  explicit sizes, intrinsic dimensions and eager loading for the visible stage.
  Keep the original layer's high fetch priority and the genuine source files.
- Use Next's server-compatible `getImageProps` for native gallery fallbacks.
  Their `srcset` and `sizes` now match the enhanced gallery. The browser can reuse
  the same image request rather than download an original and a derivative.
- Use native lazy loading for gallery slides, including each first slide below
  the introductory content. Keep video `preload="none"`, captions and transcript.
  Single-media sizing accounts for full-width layouts; multiple-media sizing
  also covers the wider case-study gallery. Large source downloads remain
  explicit links, not required for initial rendering.
- Keep the approved Arial/Helvetica/system font stack: zero font files or
  external font services, with no font swap. Adding a font would create work.
- Keep existing dotLottie compression and interaction-triggered lazy import:
  three clips are about 1.8KB each instead of about 10KB of source JSON. The
  approximately 1.2MB local WASM (about 500KB encoded in a local response) loads
  only after an explicit fox reaction. Static fallback remains visible while it
  loads. Offscreen completion, hidden-tab pause, reduced motion and failure paths
  remain covered by the existing browser suite. No animation runtime is required
  for reading or first render. No new animation code or exports were needed.
- Initial server HTML has no live third-party API dependency. GA was disabled
  during measurements, and no newsletter calls were made. React/Next route
  splitting remains intact; the measured script payload changed by only 83B.
- CI now installs Firefox/WebKit used by MIC-26's cross-engine tests and builds
  with the explicit local canonical origin expected by browser assertions.

## Before and after

Three fresh browser contexts per page, headless Chromium 158.0.8127.18,
390×844 CSS px at DPR 2, synthesized mobile/touch environment, 4× CPU throttle,
150ms latency, 196,608B/s download and 98,304B/s upload. Browser cache disabled
for navigation samples; the server optimizer cache can be warm. Observe until
`load` plus 2.5 seconds, without scroll or input. These are local lab samples,
not Lighthouse scores, physical-device results or field Core Web Vitals.

Values below are medians of three runs. Payload is the sum of encoded resource
body bytes exposed by Resource Timing; it excludes the document, headers and
later resources outside the observation window. It is not total wire traffic.

| Page | LCP before → after | Resource payload before → after | Payload change |
| --- | --- | --- | --- |
| Home | 4.284s → **2.304s** | 756,626B → **404,589B** | −46.5% |
| Work | 0.588s → 0.644s | 419,655B → **249,494B** | −40.5% |
| Play | 3.348s → **2.216s** | 563,889B → **383,735B** | −31.9% |
| About | 0.644s → 0.636s | 228,286B → 229,258B | +0.4% |
| Microfrontend article | 0.644s → 0.648s | 231,801B → 232,772B | +0.4% |

All initial-view runs recorded zero layout shift. Home FCP remained 0.668s;
median longest observed startup task changed from 135ms to 96ms. Script bodies
were 197,972B before and 198,055B after, so no meaningful JavaScript reduction
is claimed for this change. Work's 56ms LCP increase and other small differences
are retained; this small experiment cannot establish significance for them.
Home requests fell from 35 to 30 and Work from 32 to 28 in the second runs.
No initial font, external API, dotLottie or WASM requests were observed.

Raw data: [before](mic27-before.json), [after](mic27-after.json).

## Interaction observations

Under the same CPU/network profile, three repeated clicks per path produced:

| Action | EventTiming median | Observed range |
| --- | --- | --- |
| Open Home fox corner | 80ms | 56–144ms |
| Next Work gallery media | 48ms | 48–56ms |
| Open Play fox corner | 64ms | 56–104ms |

The actual region/status appeared after each action. These synthetic browser
EventTiming entries are not field INP, a complete interaction census, or a
percentile-based user result. One initial exploratory Play sample was 400ms;
it did not reproduce in the three-run follow-up. Both records are retained:
[initial](mic27-interactions-initial.json) and
[repeated](mic27-interactions-repeated.json). No speculative animation scheduling
change was made from that single sample. Monitor real usage after release.

## Regression proof and visual preservation

- Automated image tests require optimized phone derivatives to be less than
  70% of original bytes, with actual WebP responses and preserved originals.
- Browser tests inspect selected responsive URLs on Home and Play, reject raw
  raster fallback downloads and first-view animation/font service requests,
  and operate the native palette range.
- Server-rendered tests compare native/enhanced image request attributes for
  single and multiple images. Existing gallery/media failure tests now intercept
  the optimized URL and retain their original user-facing assertions.
- Palette pixel tests compare both endpoints with the two halves of the reset
  image at 320/834/1440px. No source image was modified; the delivery derivative
  is lossy WebP, and original full-size outputs remain accessible.
- Source detector: zero findings on the three changed UI files. Phone/tablet/
  desktop capture review checks composition and legibility; this is delivery
  optimization within DESIGN.md, not a new visual system.
- `bun run check`: lint, TypeScript, 124 unit tests and 1,601 assertions passed.
- Production `bun run build` passed. `bun run test:e2e`: 113 passed, two
  release-context checks intentionally skipped in this prelaunch build. Includes
  accessibility, reduced motion, offscreen pause, no-script, SEO/OG and original
  asset preservation. The first run exposed an intercepted-prefetch teardown
  race in the animation failure test; waiting for route cleanup resolved it
  without changing the application or weakening the assertions.
- Independent finish review: ship after the full browser suite passes; that
  condition is satisfied. Review scope: changed source, raw measurements and
  five gallery/palette captures, not whole-site or field certification.

## Reproduce and release follow-up

Use the local preview origin; do not change production indexing for a benchmark:

```sh
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled bun run build
bun run start -- --hostname 127.0.0.1 --port 3109
# In another terminal, with other CPU-intensive checks stopped:
bun scripts/measure-performance.ts /tmp/portfolio-performance.json
bun scripts/measure-interactions.ts /tmp/portfolio-interactions.json
```

Use the preview runbook to disable analytics and newsletter configuration. Run
unit checks before building and browser checks after building. No credentials
are written to measurement files. Both scripts use the installed pinned browser.

Before cutover, verify Netlify's deployed image adapter/cache and compression,
CDN behaviour, cold-cache image optimization, actual low-end iOS/Android devices,
longer sessions and real slow-network gestures. After release, collect field
LCP/INP/CLS distributions if available. This task has no field results and makes
no claim about public-domain performance while it still serves the old site.
Keep these checks in MIC-31, separate from implementation and DNS cutover.
