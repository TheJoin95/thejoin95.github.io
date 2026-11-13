Owner update — 2026-11-13: the website 3D/Three.js parts were removed during
MIC-26. The palette comparison now uses HTML only, `/experience` redirects to
`/play`, and the 3D dependencies are removed. Earlier GPU verification below is
a historical implementation record, not the current requirement. The sparse
2D fox remains. See `docs/a11y/mic26-audit.md` for the current audit.

# MIC-23 — Sparse fox reactions and a quiet corner

Extend the approved design, without changing its visual system. Place one
48px phone / 80px desktop fox beside the Home and Play introduction, using the
original 192:160 model and unchanged character palette. Home/Play opt into top-aligned intro columns so opening the corner never moves
the H1; other pages retain their existing composition. The reserved fox row also
fits the hydrated trigger without a layout jump. Other pages stay quiet.
A visible “Meet the fox” button opens an optional inline quiet corner: a short
notice reaction, two deliberate actions (look around / take a breath) and an
explicit close button. No audio, game score, hidden essential destination,
continuous pointer tracking or automatic page animation is added.

Use the installed Radix Collapsible for its disclosure state/semantics and shared
shadcn buttons. Inline content avoids an overlay or focus trap. Escape and the
explicit close return focus to the trigger; the only custom keyboard behaviour
is that Escape contract, which the Collapsible primitive does not supply.
The content enters with a 200ms opacity/4px transition using the installed motion
skill’s strong ease-out curve. Base HTML remains visible, and reduced motion
removes the entry and pressed translation. Existing gallery/range feedback and
native reduced-motion scrolling remain intact; do not add repeated section
entrances or animate reading/navigation merely for decoration.

Reuse `LottieAnimation`, mount only on an explicit interaction, and remount with
a new reaction key. Notice/follow/settle finish at rest; actual viewport exit or reduced
motion cancels to the static poster, with no replay when returning. Closing also
cancels the reaction. Hidden-tab events pause/resume an unfinished clip. Keep the
poster during lazy module loading and failures, including failed player chunks.
Static artwork is decorative and cannot substitute for visible state or copy.
Without scripts, keep the fox and normal page content, hiding inoperative
controls. A failed poster omits the decoration while controls/text remain usable.

Verification covers the actual public Home/Play integration, native keyboard and
touch controls, focus/Escape/close/reopen, source sizes/counts, no autoplay fetch,
no-script content, preference changes, offscreen/hidden lifecycle, failed player,
clip/WASM/poster, and existing metadata/discovery/media. Review phone/tablet/
desktop closed/open compositions with independent scoped review. Run
`bun run check`, `bun run build` and the full browser suite. Hosted/physical-device
verification remains MIC-26/27/31; deployment and DNS are separate release work.

## Implementation details

The installed [Radix Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible)
handles disclosure and `aria-expanded`/`aria-controls`; shared shadcn buttons
provide focus and feedback. The corner stays inline, so Tab follows document
order and scrolling remains native. Escape is scoped to the companion, avoiding
a global keyboard shortcut. No new UI or motion dependency was installed.

The entrance lives on a child of Collapsible.Content because Radix temporarily
disables transitions while measuring its content element. Tailwind’s
`@starting-style` transition uses opacity and a real `transform` declaration
(rather than the separate `translate` property), 200ms and
`cubic-bezier(0.23,1,0.32,1)`. A browser test records actual transition events;
reduced motion removes those events and the shared button press translation.
There are no timers, observers or hidden-first states on reading content.

`LottieAnimation` uses React lazy/Suspense and an error boundary to keep the
poster during module download or failure. Its server reduced-motion snapshot
prevents loading the browser player during SSR. The observation margin is now
zero: an explicit reaction loads only while the fox is actually onscreen and
cancels on viewport exit. The player also checks initial visibility after load,
so entering a hidden tab does not start an unseen reaction. No source art,
colours, clip timing, deployed runtime or project image output was changed.

The Home/Play companion is decorative (`alt=""`, hidden from assistive tech).
The labelled controls and explanatory text carry all meaning. A failed poster
omits the broken image, retaining reserved dimensions; failed player/chunk/clip/
WASM keeps the same static alternative. Existing canonical, structured data,
OG/Twitter images and discovery policies are preserved, with no invented media,
personal facts or new indexable easter-egg route.

The new introduction also exposed a pre-existing palette pixel-test weakness.
Endpoint-control scrolling could hide the canvas before capture. The test now
requires a visible canvas for every GPU capture, normalizes both renderers to
160px width with a 6/255 tolerance for expected GPU mipmap/native sampling differences, and
requires meaningful endpoint separation. The exact crop unit checks, hover and
actual renderer lifecycle tests remain intact. No palette shader/media changes
were required; see the MIC-22 verification addendum.

## Final local verification — 2026-11-13

- `bun run check`: 120 tests passed, 1,587 assertions; lint/typecheck passed.
- `bun run build`: exit 0. The existing unknown dynamic-route prerender
  diagnostic remains tracked under MIC-31; published routes and actual 404
  regressions pass.
- Full production browser suite: 98 passed, two intentionally gated
  release/preview-context checks skipped for this local prelaunch build.
- The twelve integrated motion tests cover both Home/Play, all three actual
  clips, no autoplay requests, Tab/Enter/Space/Escape and close/reopen, touch,
  200% text, preference changes, strict offscreen cancellation/no replay,
  simulated hidden-tab pause/resume, failed clip/WASM/poster/player chunk,
  no-script content, real transition events and stable H1 coordinates.
- Six settled Home introduction captures at 320/834/1440px, closed and open,
  are produced as `/tmp/mic23-intro-{width}-{state}.png`. Play has actual browser
  interaction/touch coverage and shares the reviewed component/composition.
- Independent scoped finish review: **Ship**, no material findings after all
  six captures and source/test review. Documentation check: no remaining
  corrections. The design detector returned no findings.

Stateful character/player lifecycle files are exercised in the real browser and
explicitly excluded from Bun unit line coverage. This is not a claim of complete
application unit coverage. No hosted performance, real physical-device GPU or
actual background-tab measurement is implied by simulated visibility events.
No deployment, hosted setting or domain cutover was performed. The existing
DESIGN.md and design system are preserved.
