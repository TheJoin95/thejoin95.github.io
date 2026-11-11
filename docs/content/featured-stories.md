# Featured case-study drafts

Use the text under each “Reading copy” heading for the reader. Evidence and
capture notes are editorial handoff material and must not leak into the public
page. These drafts avoid unverified usage counts, speed claims and company
outcomes. Longer technical sections can link to the supplied evidence.

## 1. ImageGoNord

### Reading copy

**A small tool for finding a different color language.**

ImageGoNord converts images into a chosen color palette. It brings the conversion
engine into a Python package and a browser experience, so the same idea can be
used from code or tried with an image.

**My contribution.** I co-authored ImageGoNord with Wabri. It is an open-source
project, and the work of its contributors is part of the story.

**Engineering decisions.** The conversion package is separate from the web and
API layer. The documented web architecture uses queued conversion jobs and
workers, keeping image processing separate from the request that starts it.

**What to explore.** Try a real image in the demo, compare the result with its
input palette, or read the package and web source. The public implementation is
the evidence; the gallery should show reproducible outputs from licensed inputs.

### Evidence and capture notes

- Attribution and package boundary: inventory sources `image-web` and
  `image-package`; the README credits TheJoin95 and Wabri.
- Queue architecture: `image-web`. Describe it as the documented project
  architecture; do not attribute every later deployment change to Miki.
- Demo: `https://ign.schroedinger-hat.org/`, HTTP 200 on 2026-11-11.
- Required gallery: original image, actual conversion, palette swatches and one
  genuine interface capture. Record input rights, version/recipe and credits.
- Avoid old traffic counts and GitHub star counts without a dated source. Current
  README and community-site star wording differ; no number is needed for this story.

## 2. Supermarket waiting times

### Reading copy

**From a Raspberry Pi to regional infrastructure during lockdown.**

In 2020, I built a map to help people check estimated waiting times at supermarkets
and pharmacies. It combined available place data with corrections from people
using the map. The project is now archived.

**My contribution.** I created the service and evolved its infrastructure as use
grew, with contributor help on the graphics. My technical articles document the
implementation and the decisions made along the way.

**Engineering decisions.** Redis supplied geospatial lookup and expiring cached
data. The first version ran on a Raspberry Pi. As that setup became insufficient,
I moved the backend to VPS instances in Europe and America and served the frontend
through GitHub Pages. The change followed observed demand rather than an assumed
need for a complex deployment from the start.

**What I learned.** The interesting part was adapting a small personal tool to a
different scale while keeping it understandable and affordable. The source and
archived articles preserve that process. This is a historical case study, not a
live source of waiting-time or health information.

### Evidence and capture notes

- Role, contributor credit and progression: Miki's own preserved articles,
  `legacy-recap` and `legacy-architecture`.
- Public repository: `waiting-readme`. The README says end of life July 2020;
  the article says June. Use “archived 2020 project” until reconciled.
- Original descriptions use users, sessions and visits inconsistently. Keep
  metrics out until the original analytics can substantiate the specific measure.
- EuroPython talk: [official 2021 page](https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/).
- Required gallery: a genuine period map capture, a source-derived diagram of
  the deployment progression, and an article/talk reference. A newly drawn
  architecture diagram must be labeled as a diagram, not a historic screenshot.
- Retain the legacy blog URLs during article migration; the recap's two dated
  paths are already recorded in the foundation document.

## 3. Chromatique

### Reading copy

**One color engine, several ways to use it.**

Chromatique is an open-source ecosystem for transforming visual media into a
target palette. It explores how the same color-processing behavior can be reused
through a command line, language bindings and creative-tool interfaces.

**My contribution.** My repository work includes image analysis, image comparison
and lightness-preserving palette selection. The development history and decision
records make those choices visible. The project is still in development.

**Engineering decisions.** A shared Rust core keeps the algorithmic behavior in
one place, with other languages using bindings. The CPU path stays deterministic;
optional acceleration must not change that contract. Performance needs measured
benchmarks rather than a claim that Rust is automatically fast.

For lightness preservation, the palette mapper first chooses the color closest
in lightness and then uses color distance to resolve ties, measured in OKLab.
That gives a defined selection
rule while keeping output colors inside the requested palette. Unsupported options
produce an explicit error rather than silently changing the requested behavior.

**What to explore.** The useful evidence is a real input, its palette, the chosen
operation and the resulting output. The case study should pair that comparison
with the decision record and tests, keeping unfinished integrations clearly named.

### Evidence and capture notes

- Authored implementation: `f7913e7` luminance preservation, `4eab3b4` analysis
  and `2a42673` comparison, credited to `thejoin95` in local Git history.
- Rust/binding choice and alternatives: `chromatique-rust` (ADR-0001).
- Lightness selection and explicit unsupported options:
  `chromatique-luminance` (ADR-0010). Its structure-preservation section is partly
  superseded; do not describe structure preservation as still universally absent.
- The local Git remote identifies `ChromatiqueLab/chromatique`; anonymous access
  was not established. Keep repository CTA conditional until verified.
- Required gallery: an owned/licensed original, actual output, palette/recipe,
  real Studio/CLI capture and a diagram of the shared engine/bindings.
- Do not convert a documented component list into a claim of independently tested
  releases on every supported platform. MIC-10 did not build or benchmark this repo.

## Company work

Miki has approved showing his work. Keep the current Adobe role in About and
preserve historical Adobe Stock context as historical evidence. A dedicated
company case study still needs a concrete project, precise contribution, artifacts
and supported outcome. Approval to show work does not supply those facts. Use the
three evidenced stories above rather than inventing an Adobe project narrative.
