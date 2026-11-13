# Miki fox — original vector model and motion set

MIC-21 asset handoff. This is an original, code-authored vector construction for
the portfolio, built with Codex. It is not traced from the mockup fox, downloaded
stock, generated raster artwork, a portrait of Miki, or Miki-authored comic work.
The parent mockups supply the small side-profile placement direction only. No
third-party character artwork, font, photograph, sound or motion template is used.
Public reuse terms for the new artwork remain the project owner's decision;
this record does not assign a third-party licence to their mascot.

## Identity rules

- Side profile facing right, long pointed muzzle, two upright ears, single quiet
  eye, dark nose, cream cheek/throat and a broad cream-tipped brush tail.
- Slender, low body and dark stockings; forelegs and hind legs keep their own
  articulation. The seven named layers remain back-to-front: tail, far hind leg,
  far foreleg, body, near hind leg, near foreleg, head.
- Use the existing character tokens: fur `#d87332`, cream `#fff3df`, ink
  `#263445`. Do not recolour this fox with an image experiment's chosen palette.
- Curiosity reads through the head/ear angle and small tail/paw responses. No
  exaggerated grin, bouncing entrance, clothing, speech bubble, extra companion,
  fur texture or facial detail that disappears at 40px.
- Keep all markings and contours consistent across poses. On dark surfaces the
  orange silhouette and cream markings carry recognition; dark stockings are a
  supporting detail, never the sole feature needed to identify the character.

## Source and exports

`model.ts` is the editable master: ordinary SVG cubic paths, semantic parts,
pivots, the three-colour palette, pose angles and clip timing. Change this source
and run `bun run build:fox`; do not independently redraw exported frames.
`fox-layered.svg` is an additional clean vector editing source with named
Inkscape-compatible layers. Static pose SVGs retain the same groups and paths.
The original paths have generous negative space and no raster assets, masks,
filters, gradients, font dependencies, expressions or 3D layers.

| Deliverable | Location |
| --- | --- |
| Editable master and pivots | `assets/fox/model.ts` |
| Layered vector source | `assets/fox/fox-layered.svg` |
| File sizes and SHA-256 provenance | `assets/fox/manifest.json` |
| Rest / notice / follow / settle posters | `public/characters/fox/*.svg` |
| Inspectable animation sources | `public/animations/fox/*.json` |
| Compressed production clips | `public/animations/fox/*.lottie` |
| Runtime asset map | `src/content/fox.ts` |

The 192×160 artboard stays identical for every export. Use the intrinsic ratio;
do not stretch it into a square. Preview at 40, 48, 64 and 96px wide on both white
and charcoal. At most one fox per public page, 40–64px on phones and 64–96px on
desktop, with space from controls/copy. Do not place the proof contact sheet or
all poses together on a public page. MIC-23 places one companion in each Home/Play introduction;
other pages keep their existing composition.

## Motion and expression vocabulary

| Clip | Duration at 30fps | Expression / motion |
| --- | --- | --- |
| Notice | 1.0s | Head/ears lift slightly, tail responds, then return to rest. |
| Follow | 1.2s | Head follows one connection, forepaw lifts subtly, tail counterbalances. |
| Settle | 1.4s | Small head dip and tail release, then quiet rest. |

Each clip begins and ends at the exact same rest frame. Peaks occur at frames
10, 14 and 18. Layer rotation/position keyframes use the installed animate skill's
on-screen ease-in-out curve `(0.77, 0, 0.175, 1)`; there is no perpetual loop,
auto audio or continuous pointer tracking. Static peak poses are supplied for
inspection; the normal reduced-motion/error/no-script alternative is `rest.svg`.

Use `LottieAnimation` with the resting poster and reserved dimensions. Mount it
only for a deliberate reaction, using a new React key for each authorized
interaction. It loads in the viewport, completes once and returns to the
poster. Leaving the observed region or enabling reduced motion cancels that
reaction to the poster; returning does not replay it. Hidden-tab visibility
events pause/resume an unfinished clip. This is decorative and `aria-hidden`;
essential success/error/status information must remain ordinary visible text.

## Tooling and third-party notices

SVG paths are normalized with `svg-pathdata` (MIT), then adapted to Lottie's
vertex/tangent representation. `fflate` (MIT) creates the dotLottie archive; its
fixed DOS timestamp makes bytes reproducible across timezones. Paint order is
reversed for Lottie's group convention so cream/ink markings remain in front.
No rendering library or animation engine was reimplemented.

The existing `@lottiefiles/dotlottie-react` player is retained. Build resolves its
locked `@lottiefiles/dotlottie-web` 0.83.0 engine, copies the 1.2MB WASM file and
full MIT licence to `public/animations/runtime/`, and serves it locally. The
runtime is a separate reusable dependency, not part of the ~1.8KB fox clips; do
not report only the clip size as the full cost of enabling animation. It is
loaded behind the existing lazy client boundary and omitted when only a static
poster is rendered. The runtime directory is build-generated and gitignored.

Sources: [dotLottie](https://github.com/LottieFiles/dotlottie-web),
[SVGPathData](https://github.com/nfroidure/svg-pathdata),
[fflate](https://github.com/101arrowz/fflate). Dependency licences remain theirs;
the runtime's full notice ships beside the WASM file. No hosted design service,
asset upload, deployment or domain change was used to produce this set.
