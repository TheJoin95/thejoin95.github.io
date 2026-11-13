# MIC-26 — Responsive and accessibility audit

Recorded 2026-11-13. Local production build, following DESIGN.md and the existing
editorial gallery direction. No deployment or domain change.

## Implementation integrity

Pass at the reviewed scope: existing typography, real project media, shared
Radix/native controls, sparse fox and white/charcoal section rhythm are retained.
The Impeccable source detector returned zero findings across the seven changed
UI/token files. This is a scoped implementation review, not a WCAG certification.

| Dimension | Score / 4 | Evidence and limits |
| --- | --- | --- |
| Accessibility | 3 | Automated scans, keyboard, native input and error semantics pass; human assistive-technology testing remains a release check. |
| Performance | 3 | GPU code/dependencies removed; animation remains lazy. Full measurements belong to MIC-27. |
| Theming | 4 | Shared charcoal hover tokens now preserve foreground/background contrast. No independent dark-mode switch is offered. |
| Responsive | 3 | Reflow, enlarged text/spacing and synthesized touch pass; physical devices remain untested. |
| Integrity | 4 | Existing design preserved; detector found no source issues in changed targets. |
| Total | **17 / 20** | Good; scores describe this audit, not universal compliance. |

## Findings and resolutions

No P0 findings. Three P1, three P2 and one P3 findings were resolved:

| Priority | Location | Finding, impact and resolution | Standard / appropriate follow-up |
| --- | --- | --- | --- |
| P1 | `src/app/globals.css` | Charcoal galleries inherited light hover backgrounds while retaining light text. Defined shared muted/accent/secondary dark-surface tokens. Hover text now meets 4.5:1 in a real browser measurement. | WCAG 1.4.3; colorize |
| P1 | `src/components/newsletter-form.tsx` | Without hydration the client-only form could submit an email in a GET URL. Controls remain disabled until hydration and an RSS alternative stays available without scripts. | Functional/privacy failure; harden |
| P1 | `src/components/ui/button.tsx`, `site/styles.ts`, `palette/palette-reveal.tsx` | At 320px with 200% text plus text spacing, the fox button/palette labels and long words could overflow. Bound shared buttons, allow word breaks and wrap palette labels. | WCAG 1.4.10 / 1.4.12; adapt |
| P2 | `src/components/newsletter-form.tsx` | Service failures incorrectly marked a valid email invalid and did not focus their explanation. Focus the error summary, retain entered email, distinguish field errors and announce success once. | WCAG 3.3.1 / 4.1.3; harden |
| P2 | `src/lib/reading.ts` | Multiple code/table regions shared spoken names. Number each region within a document while retaining native keyboard scrolling. | Landmark best practice, not an asserted AA failure; clarify |
| P2 | `src/components/site/error-state.tsx`, `src/app/error.tsx` | Make the route-error heading visible and announce the error state. The original already had a screen-reader-only H1; no missing-H1 claim is made. Test the actual Retry callback with an isolated fixture. | Error discovery; harden |
| P3 | `src/lib/journal.ts` | A Sorting Hat screenshot repeated its adjacent caption as alt text. Use its verified descriptive archival media alternative; preserve the authored caption and original Markdown bytes. | Image alternative quality; clarify |

The old autoplay/drag-only 3D demo was also identified during the audit. The
owner subsequently requested removal of all 3D. Its route, components, palette
renderer and Three.js/R3F/drei dependencies are removed. `/experience` returns a
permanent 308 to `/play`; discovery excludes it. The palette uses the same
HTML images before and after hydration. Original/Palette/Reset, keyboard range,
mouse preview and native touch input remain tested. No replacement canvas ships.
Current design guidance and repository instructions record this decision.

## Verification

- `bun run check`: 123 tests passed, 1,587 assertions; lint and TypeScript passed.
- `bun run build`: passed, with the browser suite's explicit local canonical
  origin and indexing disabled. Existing Next dynamic-hook fallback diagnostics
  remain a separate release/adapter check; published routes and real 404s pass.
- `bun run test:e2e`: 110 passed, two release-context tests intentionally skipped
  in this prelaunch build. Includes gallery, fox, article, SEO/OG, native palette,
  no-script, network failure, retry and media-preservation regressions.
- 52 axe scans: 26 HTML paths at 320/1440px, including all sixteen original
  articles, three project stories, the five public pages, confirmation and 404.
  Zero reported violations with WCAG A/AA through 2.2 and best-practice tags.
  Raw summaries retain incomplete results in [mic26-evidence.json](mic26-evidence.json).
- 75 reflow cases at 320×844, 390×844, 844×390, 834×1112 and 1920×1080 with
  200% root text, 1.5 paragraph line-height, 2em paragraph spacing, .12em letter
  spacing and .16em word spacing. All sixteen articles tested at 320px;
  representative article at the other widths; 160-character query included.
  No page-wide horizontal overflow. Code/table scrolling remains local.
- Keyboard skip-to-content and visible focus across templates; real Next error
  component recovery callback, newsletter 503/400/200 states, forced colors,
  gallery live status and hover contrast, open fox, empty search and failed media.
- Chromium 158.0.8127.18; Firefox 159.0 and WebKit 27.2 phone/desktop journeys.
  Native touch range and vertical image/gallery swipe synthesized in Chromium.
- Visual inspection of 320/1440px dark gallery and 320/834/1440px HTML palette
  captures. Actual comparison pixels match endpoint image halves at all three
  widths. Screenshots are reproducible through the browser tests.
- Original Markdown, assets and CV preservation tests pass against origin/old.
  No authored article content or migration manifest hashes were changed.

Axe leaves nine page-level color-contrast checks incomplete: clipped, offscreen
gallery captions and two long Bash code blocks. Their source styles use the same
verified charcoal foreground/background tokens and readable local code surfaces;
these are retained for manual release review rather than presented as automatic
passes. Axe also missed the original hover-token defect; the dedicated measured
hover regression is necessary. Client state lifecycle is exercised in browser
tests rather than included in Bun's server-rendered unit coverage percentage.

## Practical limits and release handoff

These checks exercise browser accessibility snapshots, labels, live regions,
focus and actual keyboard controls. No human VoiceOver/NVDA/speech-control or
inclusive user session, physical iOS/Android device, hosted Netlify adapter,
field Core Web Vitals or real newsletter delivery was tested. Complete those
checks under MIC-31. No live newsletter messages were sent. A 320 CSS-pixel
viewport checks the reflow width associated with 400% zoom at 1280px; it does not
claim an actual browser zoom or screen-magnifier session.

Firefox's Playwright locators hung after revisiting a cached article following
a streamed search and changing device widths. Direct DOM evaluation showed a
complete document and visible correct H1; a diagnostic screenshot also rendered
it. Independent phone and desktop browser contexts pass. This resembles the
navigation-bookkeeping class described in
[Playwright issue 42183](https://github.com/microsoft/playwright/issues/42183);
that comparison is an inference, not a confirmed identical upstream bug. No
application caching was disabled to satisfy the test. Include back/forward
article navigation in the physical Firefox release check.

Keep the scoped fixes and their regressions. Use Impeccable audit to repeat the
same checks after material changes; use polish only for a concrete visual defect.
The performance measurement and image-delivery work continues in MIC-27.
