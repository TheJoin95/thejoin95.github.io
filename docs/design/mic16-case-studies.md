# Case-study reader and first project stories — MIC-16

## Direction and composition

This implements the approved shared-reader contract from MIC-11 and the three
featured drafts from MIC-10. It extends the existing white/charcoal editorial
world; it does not introduce a new visual direction or an unrelated product UI.
The reader's job is to understand Miki's contribution, follow a technical decision
and inspect the evidence. No new component library or dependency was required.

The page composes existing site primitives, the shared gallery with native-media
fallback, existing real project media, title cards and the global shell. Server
Components provide the story and metadata. The only client behaviour is the
already tested gallery. Tailwind handles layout; global CSS/tokens are unchanged.

Reading order: All work link → one oversized H1 → introduction → lifecycle and
author → contribution/project context → charcoal media band → four distinct
technical sections → other published stories and hub link → contact footer.
Body sections reuse the editorial label/body grid and a 68ch reading measure;
phone stacks in DOM order. Code scrolls in its own focusable labelled region.
At 200% text the shared gallery's button group now wraps instead of expanding the
page width. That regression was found after hydration and is covered by a browser
test; the fix improves the same gallery on other pages too.

## Routes and content

| Story | Route | Evidence and boundary |
| --- | --- | --- |
| ImageGoNord | `/work/imagegonord` | Co-authorship with Wabri/community; package/API/queue separation; authentic interface captures, web/package source and demo |
| Supermarket waiting times | `/work/supermarket` | Archived 2020 service; Raspberry Pi → regional VPS decisions; source-derived labelled diagram, preserved articles and EuroPython talk |
| Chromatique | `/work/chromatique` | In-development shared Rust core; lightness-selection tradeoff and explicit errors; licensed input/actual CLI output, reproducible recipe and original decision extracts |

Runtime narrative lives in `src/content/case-studies.ts`. Identity, existing source
URLs, lifecycle, contribution and media references come from the existing selected
project objects. The stories contain problem/constraints, alternatives/decisions,
implementation and evidence/lessons. They do not turn all eleven index entries
into thin detail pages. A publication predicate rejects draft/incomplete records;
only eligible stories appear in static params, related-story links and discovery.
Unknown or unsupported `/work/` slugs are rejected before streaming via the same
proxy mechanism already used for the blog, so they return HTTP 404 rather than a
200 with an error message. No draft-preview feature is introduced.

Home and Work features now offer the case-study destination while retaining the
existing source/output CTA. The complete index links its three featured entries
to these details. Existing `/work#imagegonord`, `#supermarket` and `#chromatique`
fragment targets remain intact for old gallery links. Detail pages return to Work
and link to the other two published stories.

Public prose is adapted from the approved drafts and checked sources. The public
ImageGoNord README supports its queue/worker description. The preserved old-site
articles support the supermarket progression and contributor credit. Chromatique
ADR-0001/0010 and authored history support the shared-core and lightness-selection
choices. Conditional architectural alternatives are explained as tradeoffs, not
as invented historical experiments. No employer outcomes, traffic counts,
benchmarks, testimonials, project dates or recent update dates were invented.
The exact supermarket shutdown month remains unasserted. Chromatique's partially
superseded structure decision is not described as universally absent.

The Chromatique repository still has no verified anonymous public destination in
this content handoff, so no broken repository CTA is emitted. The owner-approved
original decision extracts are downloadable instead. Their source revision,
section boundaries and hash are in `docs/content/media-provenance.md`. A period
supermarket map capture is not available: the page explicitly presents a diagram,
not a reconstructed product screenshot. Existing image rights/credits remain in
visible HTML captions and the provenance record.

## SEO and discovery

Each detail has a self-referencing absolute canonical, specific title/description,
OG/Twitter large-image metadata and the existing corresponding project PNG. An
Article JSON-LD record identifies the story author and visible subject project;
it does not imply that writing the story means sole authorship of the project.
Work's CreativeWork references now use the published detail URLs, preserving their
fragment IDs as identifiers. No fictitious publication/modified date is emitted.

The release sitemap grows from 22 to 25 canonical entries: six pages, three case
studies and sixteen articles. The prelaunch sitemap stays empty and indexing stays
disabled. RSS remains a Journal-only feed. Hosted verification and domain cutover
stay with MIC-30/MIC-31; this task performs neither.

## Verification

- `bun run check`: lint, type generation/TypeScript and 90 Bun tests pass. New tests
  cover the exact approved set, shared identity, publication eligibility, roles,
  lifecycle, meaningful media, source links, reusable rendering, metadata/schema,
  unknown routes and no fabricated dates. Existing tests now expect detail links
  and the expanded canonical sitemap rather than the superseded gallery anchors.
- `bun run build`: succeeds and generates the three detail routes. The existing
  nonfatal Next unknown-fallback pathname diagnostic remains tracked in MIC-31.
- Full Playwright suite: 46 pass, two special context tests deliberately skipped
  in the ordinary local run. New tests cover all stories without JavaScript at
  320/390/834/1440px, navigation from Home/Work and onward links, real missing 404s,
  social PNG bytes, crawler-visible content, failed optimized media and hydrated
  200% text reflow with keyboard-accessible local code scrolling.
- Screenshots for all three stories at 390/834/1440 were inspected, including the
  opening, oversized media and full reading composition. The design detector
  reports no findings on the new reader/route/feature composition or gallery fix.

Screenshots: `/tmp/mic16-{imagegonord,supermarket,chromatique}-{390,834,1440}.png`
and corresponding `-opening.png` captures. Chromium is the automated engine;
these checks are not a claim of physical-device Safari/Android validation.

No deployment, push, hosted-setting change, DNS change or source-repository
modification was performed. The old application remains preserved on origin/old.
