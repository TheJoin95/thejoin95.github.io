# Play directory and comic-learning preview — MIC-17

## Composition and reuse

Play now follows the approved MIC-11 composition: white title/lead, shared
full-width palette stage, spacious project/community directory, charcoal comic
learning preview, passions line and contact footer. The existing type, spacing,
white/charcoal surfaces and responsive grid remain the design authority. No new
library, client bundle, global CSS or animation implementation was added.

The directory rendering was extracted from Work into the server component
`ProjectDirectory`. Work still renders its complete eleven-entry index with the
same markup and behaviour. Play composes that component with ten shared records
and gives comic learning its own section, so all eleven approved entries appear
once without repeating the same content in two places on the page.

The eight requested side projects are Schrödinger Hat, Broskis, Chromatique,
HolyCard AI, CoproSync, Alerting, Hop and Social post. ImageGoNord and the archived
supermarket project remain in the directory. Names, lifecycle, summaries,
contributions and link decisions are the same objects used by Work, rather than
independently maintained Play copy.

The directory is a semantic list of large text entries with restrained top rules,
not a set of generic boxed cards. It stacks on phones, uses two columns on tablet
and three on desktop, in DOM order. Standard Next links and the existing Lucide
external-link icon provide navigation; unavailable destinations remain plain text
with their status and “No public link yet.” There is no drawer, filter control,
disabled link or custom interaction to reimplement.

## Destinations and truthful states

Five directory entries have usable destinations: Broskis, Schrödinger Hat and the
three existing case studies. Broskis uses the owner's supplied Substack URL.
Broskis and Schrödinger Hat both returned HTTP 200 in direct read-only checks on
2026-11-12. Automated tests cover the local story routes; unit tests preserve the
exact external links without making network requests.

HolyCard AI, CoproSync, Alerting, Hop and Social post have no verified public
repository/demo destination in the approved inventory. Their descriptions and
beta/in-development/prototype/in-progress states remain visible. The task does
not manufacture five thin detail pages or use unrelated links to satisfy a
mechanical “destination” requirement. These are the already approved safe
content defaults; links can be added when real public destinations are available.

Comic learning is explicitly a work in progress: original drawings are being
developed, and no drawings are published here yet. There is no generated concept,
borrowed illustration, fake sketchbook article, blank image frame or claimed
finished artwork. “Explore the Journal” goes to the actual archive and “Follow by
RSS” goes to the working feed. A future sketchbook can be connected through
MIC-18/MIC-19 when original content exists. Cycling and photography appear as the
confirmed passions, with a link to About.

## Shared media stage

Play reuses `PaletteStage` from Home, including its real licensed photograph,
actual Chromatique output, static comparison label and visible photo/palette
credits. Its new optional destination prop keeps Home's `#chromatique` behaviour
unchanged and sends Play to `/work/chromatique`, avoiding a dangling fragment.
The original input/output and asset provenance remain unchanged.

This is the existing useful static stage, with no fake slider or hover controls.
The full Three.js palette interaction remains MIC-22 and must enhance the shared
stage rather than introduce a separate implementation. The existing Three.js
experiment at `/experience` is also linked from the passions section. Original
fox/character assets and their placements remain MIC-21/MIC-23; none was invented
as a substitute for the comic work.

## Search and sharing

Play retains its canonical `/play` destination, accurate page-specific metadata
and the existing branded default OG/Twitter PNG. New server-rendered
CollectionPage/ItemList JSON-LD matches the ten directory entries, order, roles,
statuses and five real destinations. The separate comic CreativeWork description
states that it is in progress and supplies no fictitious image, article URL or
date. JSON-LD uses the existing safe serializer. Readable HTML works without
JavaScript; no extra pages or query variants are generated for search/AI systems.
The release sitemap remains 25 URLs and RSS remains Journal-only. Indexing stays
disabled locally; no deployment or domain-cutover action is included.

## Verification

- `bun run check`: lint, generated route types/TypeScript and 94 Bun tests pass.
  Four new tests cover exact inventory/shared-object coverage, names/statuses and
  known URLs, plain unlinked entries without arrows/actions, stage destination,
  comic honesty and working Journal/RSS links, metadata and schema consistency.
- `bun run build`: production build succeeds. The existing nonfatal Next.js
  unknown-fallback pathname diagnostic remains separately tracked in MIC-31.
- Full browser suite: 52 pass, two context-specific suites intentionally skipped
  in the ordinary local build. Six new Play tests cover no-JavaScript behaviour
  at 320/390/834/1440px, directory column counts and complete coverage, local story
  navigation, keyboard/200% text reflow, comic links, crawler-visible schema and
  actual default PNG bytes/dimensions.
- Phone/tablet/desktop screenshots reviewed:
  `/tmp/mic17-play-{390,834,1440}.png`. No body overflow at tested sizes or 200%
  text. The design detector reports no findings on the changed page/components.
- Existing Home stage, Work index, galleries, case studies, Journal, shell,
  newsletter, SEO and environment regressions remain passing. Chromium is the
  automated engine; physical-device verification remains MIC-26/MIC-29.

No push, deployment, hosted setting, DNS or source-repository change was performed.
No unrelated SEO audit artifact was included in the implementation commit.
