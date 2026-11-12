# Editorial-gallery homepage — MIC-14

Implemented 2026-11-12 using the latest MIC-8 Home attachment and MIC-11 contract.

## Delivered composition

White identity/header → oversized H1 and confirmed Adobe introduction → static
photo/palette stage → charcoal selected projects → white selected writing →
retained newsletter → contact/CV footer. Phone stacks descriptions above media;
tablet keeps the split introduction and broad gallery strips; desktop pairs narrow
project summaries with oversized media. Links reach Work, Journal, Play, About,
contact, source repositories, preserved writing and actual output files.

Home uses three small server-rendered section components in `src/components/home`.
`ProjectFeature` and project records are shared with Work. Existing ProjectGallery
supplies media interaction. Shared MediaSurface/MediaCaption atoms and GalleryCaption
remove duplicated presentation across the enhanced gallery, its native fallback
and MediaFrame. Tailwind owns component layout; global CSS was not expanded.

## Real content and intentional adaptations

- The opening study is an actual Chromatique Nord conversion of a credited Library
  of Congress photograph. It is clearly **static**, with a link to the real output
  study. No range control, pointer instruction or fake processing is presented.
- ImageGoNord uses real interface captures and explicit co-authorship with Wabri.
- Supermarket waiting times remains archived. Its media is a labelled diagram
  based on the technical article, not an invented historical map screenshot.
- Chromatique is still in development. Its repository is anonymously unavailable,
  so its CTA opens the generated PNG rather than a broken GitHub link.
- The three-project selection follows MIC-10. The mockup's placeholder mountain
  images, map, generated dither art and fox are not presented as authentic work.
  The original fox/characters and Three.js stage remain MIC-21–23.
- Selected writing preserves the old title and 2019-12-21 date. The existing
  public URL returned 200 and its article text was verified in a browser. It stays
  on the old site until the Markdown reader/migration tickets are implemented.
  MIC-24 must preserve this same route before the custom-domain cutover.
- The newsletter remains usable with its existing server API. No live delivery
  was triggered by this task. Its extra section is retained functionality beyond
  the minimal writing strip in the illustrative mockup.

Full source/rights/recipe/hash information is in
[media-provenance.md](../content/media-provenance.md). The other repositories were
only read; their existing CLI was run with output paths in this portfolio checkout.

## SEO, GEO and social sharing

Home now has the specific title/description, canonical, Open Graph and Twitter
large-card metadata, plus visible-fact-only Person/WebSite JSON-LD. Identity,
roles, archived/development states, credits and article date are readable HTML.
JSON-LD escapes `<` before embedding. No invented metrics, rankings or AI-citation
promises were added. The semantic sections and real evidence are the GEO baseline.

`src/app/opengraph-image.tsx` generates an actual 1200×630 branded PNG via Next's
built-in ImageResponse. It is also a default image for pages that do not override
it; Home explicitly supplies Twitter metadata. Inspected the full card and a
300px-wide thumbnail. All image URLs tested as absolute against the configured
build origin. MIC-25 still owns per-page/project/article cards, complete site
metadata, sitemap/RSS and deployment-context verification.

## Loading and accessibility

The no-script test exposed the automatic root `loading.tsx` hiding the static Home
behind a streamed replacement. The same loading presentation now lives at
`src/components/site/page-loading.tsx` for explicit enhancement boundaries. Public
static pages no longer opt into that page-wide loading gate. Gallery boundaries
retain their meaningful native-media fallback. All existing loading-state unit
assertions remain; only the component import moved.

No-script browser tests verify the H1, static stage, three-item ImageGoNord strip,
writing and Work navigation. A failed-stage-image check verifies the reserved
frame, profile and project evidence stay usable. Native alt text remains the
fallback when the static files cannot load. The shared keyboard/reduced-motion/
touch-gallery checks continue to pass. Physical devices, real screen-reader speech
and cross-engine final review remain MIC-26/MIC-29.

## Verification

- `bun run check`: lint/type generation/TypeScript and **62 unit tests** pass
  (5 Home tests added). Coverage remains scoped to imported unit-tested modules;
  stateful gallery interactions are exercised in Playwright, not claimed as unit
  coverage of the whole application.
- `bun run build`: production Turbopack build and static social PNG generation pass.
  Analytics and Brevo were explicitly disabled.
- `bun run test:e2e`: **26 Chromium browser tests** pass (7 Home tests added).
  Home tests cover 390/834/1440px composition, static-stage proportions, links,
  independent galleries/IDs, no-script content, failed static images, canonical,
  JSON-LD, crawler-visible OG metadata and valid OG/Twitter PNG bytes/dimensions.
  Shell tests also cover overflow down to 320px and up to 1440px.
- Inspected full-page and first-viewport captures at phone/tablet/desktop widths;
  inspected actual OG image and thumbnail. Compared composition with the approved
  Home reference. Mechanical detector returned no findings; whitespace check passes.

No production deployment, DNS change, push or newsletter/contact action. This
completes Home with the static-stage allowance in MIC-14; it does not complete
MIC-22's signature interaction, original character production or the Journal migration.
