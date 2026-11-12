# Editorial gallery design

The latest five mockups attached to MIC-8 are the visual authority. Preserve their
oversized regular-weight typography, white/charcoal section rhythm, narrow project
descriptions, square oversized media, expressive palette opening and sparse fox.

Owner reminder (2026-11-12): colour palettes, a Three.js experiment, the mascot
and website characters are explicit deliverables. MIC-12 defines coordinated
site, interaction and character colour tokens. MIC-22 develops a working Three.js
experiment using the existing React Three Fiber/drei foundation, with a useful
static alternative. MIC-21 defines the fox-led character language, palette,
expressions and poses; MIC-23 integrates it sparingly into the website. Keep the
editorial white/charcoal base while making these expressive elements deliberate.
Every implementation includes automated behaviour tests and visual review.

Component design follows atomic composition: shared primitives → small component
groups → reusable sections → templates/pages. Reuse the existing UI and tokens;
extract shared responsibilities as they emerge. Prefer established, maintained
libraries for standard interaction patterns, starting with Radix/shadcn. Check
accessibility, server rendering, no-script behaviour and bundle cost before
choosing a library or custom code. Keep component layout/states in Tailwind and
reserve global CSS for theme tokens and global defaults. This is a composition
principle, not a requirement to rename every folder or wrap every HTML element.

Use the [MIC-11 responsive and interaction contract](docs/design/responsive-layouts.md)
for page compositions, tokens, component states, accessibility, motion, social
cards and implementation acceptance tests. The [composition board](docs/design/composition-board.svg)
is a schematic companion, not final UI artwork.

Page copy, project status, evidence and media provenance come from the
[MIC-10 content handoff](docs/content/README.md). Runtime, route and publishing
contracts come from the [technical approach](docs/technical-approach.md).

This file describes the approved target. MIC-12 implements the shared tokens,
navigation, footer, primitives and introductory routes. Full editorial galleries,
article publishing and character/interaction assets remain with the page tickets;
MIC-29 owns the complete rendered comparison with the source mockups. See the
[shell verification record](docs/design/mic12-verification.md) for scope and proof.
