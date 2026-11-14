# Update projects, case studies and assets

Return to the [maintenance index](README.md) for publishing and release steps.
Work from a content branch, keep changes focused, and retain the approved
editorial design and atomic component composition.

## Edit or add a project

1. Find its record in `src/content/work.ts`. Edit the actual title, status,
   summary, your contribution and verified destination. `src/content/play.ts`
   derives its directory from this index, excluding comic learning, which has
   its own section. Do not create a second independently maintained Play record.
2. Record supporting sources/decisions in the MIC-10 handoff under
   `docs/content/`. Separate personal contribution from team work. Preserve Hop,
   Broskis and the other confirmed identities. Add an `href` only for a real,
   reachable, approved destination; an unavailable prototype remains honest text.
3. If featured on Home/Work, edit the shared record in
   `src/content/selected-projects.ts`, not the rendered page. Its order controls
   feature order. Use stable IDs; changing an ID changes related story/card URLs.
4. For new featured work, supply a publishable case study at the same time or
   explicitly change the schema/routing design and tests. The current Work schema
   describes selected projects through their case-study URLs, so featuring a
   project with no story can otherwise create a structured-data link to a 404.
5. Add real gallery media through `src/content/featured-media.ts`, following the
   fields below. Confirm the story, index, directory and share card still agree.
6. Run check/build/browser tests sequentially. Update tests when deliberately
   adding a real record or publishing original drawings, while preserving the
   requested project coverage, attribution and historical-content assertions.

A plain index entry uses this shape; replace every example with verified facts:

```ts
{
  id: "my-project",
  title: "My project",
  status: "In development",
  summary: "What it actually does and for whom.",
  contribution: "What I personally built or contributed.",
  // Add href only when the real public destination is verified.
}
```

## Add a case study

Add a typed story in `src/content/case-studies.ts` using the existing project
record. Supply `introduction`, `team`, `mediaNote`, and at least four sections
with unique anchor IDs, titles and nonempty paragraphs. The published-story gate
requires `published: true` plus that substantive content; empty stories do not
publish. Problem, alternatives/constraints, decisions, implementation, evidence
and lessons should be clear even when combined into four or more sections.

`/work/<project-id>` and `/share/projects/<project-id>` use that stable identity.
Story links and discovery use the shared published list. Test direct refresh,
the contributor/team boundary, real sources, gallery failure states, all section
anchors, onward navigation and the actual social PNG. Do not invent metrics or
dates to fill a template. Keep retired services visibly archived and avoid a
“try live” link for them. Existing stories are examples of structure, not claims
you can copy to another project.

## Images, video and evidence

Store approved files under a meaningful `public/media/<project>/` directory.
For each gallery item provide a unique `id`, `kind`, actual intrinsic `width` and
`height`, caption and creator/source credit. Images also need meaningful `alt`,
and optional `fit` (`contain` for UI/diagrams; `cover` only when cropping is safe)
or `focalPoint`. Videos use native controls, `preload="none"`, a transcript and
caption tracks when speech/audio conveys meaning. Do not add autoplay.

Document source, capture date, licence/permission and any transformation in
[media provenance](../content/media-provenance.md). Check files contain no private
customer/resident records. A diagram newly drawn from an old article must say it
is a source-derived illustration, not a historical screenshot. Mockup artwork is
a design reference, not project evidence. Keep full-size source links useful.

Responsive gallery fallbacks must keep the same optimized image requests as
the enhanced gallery. Keep dimensions/aspect ratios, native scrolling, keyboard
controls, live status and failed-media alternatives. Don't replace a small shared
component with a new carousel/dialog library without a concrete need.

## Fox, palettes and accessibility

The original fox source is `assets/fox/model.ts`. Edit the model/pivots/poses there
and regenerate with `bun run build:fox`; do not independently hand-edit exported
SVG/JSON/dotLottie files. Inspect generated diffs and preserve the manifest and
provenance in [the fox source guide](../../assets/fox/README.md). The generated
runtime directory is ignored and recreated from locked dependencies at build.

Keep the small sparse fox, its coordinated palette and one-shot clips. Home/Play
share the existing companion and HTML palette comparison. Preserve lazy player
loading, reduced-motion/static alternatives, offscreen cancellation, hidden-tab
pause, no automatic audio and scoped dismissal/focus return. No WebGL/Three.js
replacement belongs in this website. Do not make decorative character art the
only way to understand a control or project.

After changes, check phone/tablet/desktop, long text, light/charcoal contrast,
visible focus, keyboard and touch controls, honest empty/error states and no
page-wide overflow. Use semantic HTML and existing Radix/shadcn/native behaviour.
Keep component styling in Tailwind and globals for shared tokens/global rules.
Shared site/character tokens and the responsive contract remain the authority.

Metadata comes from the visible records. Titles, descriptions, canonical URLs,
Person/project attribution, JSON-LD and Open Graph/Twitter cards must agree.
Default, article-specific and selected-project PNGs have a branded fallback;
verify real 1200×630 responses and long-title/thumbnail layouts. See the
[Journal guide](../publishing/journal.md) for readable HTML, GEO and discovery
checks. No unsupported outcomes or AI-citation promises belong in metadata.
