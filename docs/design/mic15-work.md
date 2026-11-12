# Work gallery and complete index — MIC-15

Implemented 2026-11-12 against the approved Work direction and MIC-11 responsive
contract: charcoal introduction, three compact project summaries with oversized
media, complete text index, Play link and the shared footer.

## Content and destinations

The index covers all eleven MIC-10 inventory IDs exactly once. Featured copy and
contributions reuse `selected-projects.ts`, shared with Home. ImageGoNord explicitly
credits Wabri and the community; Schrödinger Hat is identified as collective work.
Supermarket waiting times is archived, with a source-code destination rather than
a live-service claim. Chromatique stays in development and shows actual CLI output.
Media credits and provenance remain in the shared galleries.

Anonymous URL checks on 2026-11-12 returned 200 for Schrödinger Hat, Broskis,
ImageGoNord's demo and source, and the supermarket source repository. HolyCard AI,
CoproSync, Alerting and Chromatique repository URLs returned 404. These are not
published as public repository links. Featured index links lead to their real Work
gallery anchors; other projects with no verified public destination remain text,
with their known lifecycle and “No public link yet.” No disabled or placeholder links.
Private availability is not inferred from permission to publish.

Company publication permission is confirmed, but no specific company project story
or evidence has been supplied. No Adobe case study, metrics, release dates or
current maintenance commitments are invented. Social post and comic learning
remain explicitly in progress. Adding public destinations or company stories is a
content follow-up when evidence is available, not a missing gallery implementation.

## Composition and implementation

`ProjectIndex` is a server-rendered section composed from existing Section, styles
and tokens; project headings form a semantic list. Native links and an installed
Lucide external-link icon need no new library or custom interaction. The index has
one column on phones, two at the tablet breakpoint and three at desktop, in DOM
row order. Linked titles retain 44px minimum targets. Existing ProjectFeature and
ProjectGallery own all media behaviour, captions, failure states and no-script
fallbacks. No new client boundary, global CSS or dependency was added.

## Search and sharing

Work has a specific description, canonical, Open Graph and Twitter large-card
metadata. Both explicitly reference the branded 1200×630 PNG as a reliable fallback;
project-specific images and site-wide discovery routes remain MIC-25. CollectionPage
and ItemList JSON-LD mirror all eleven visible entries, including lifecycle and
contribution text. Only the five linked entries have URLs. JSON-LD escapes `<`.
No unsupported authorship, ratings, metrics or search/AI-citation promises are made.

## Verification

- `bun run check`: lint, route types, TypeScript and 66 unit tests passed.
- `bun run build`: production Turbopack build passed; Work is prerendered.
- Browser regression coverage: all 26 existing Chromium tests passed in the full
  run; all five Work tests passed on the final build after the image fix.
  Work checks include 390, 834 and
  1440px, index column counts and coverage, real fragment navigation, no JavaScript,
  keyboard activation, overflow, schema and social PNG response/dimensions.
- Existing gallery interaction, failure, video, reduced-motion, Home and shared
  shell checks remain in the suite. These checks cover Chromium emulation, not a
  claim of physical-device or all-browser testing.
- Impeccable detector reported no findings in the new index and Work route.
- The social metadata regression test caught that a page-level Open Graph object
  dropped the parent's image metadata. Work now explicitly supplies its image;
  tests assert both the metadata object and the actual rendered PNG destination.

Local screenshots are captured by the Work tests under `/tmp/mic15-work-*.png` for
visual review; the index is also captured separately. Reviewed all three rendered
layouts and the phone/tablet index text. No deployment, domain cutover, live newsletter send or push belongs
to this change.
