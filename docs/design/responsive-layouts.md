# Responsive layouts and interaction contract — MIC-11

Specified 2026-11-12. Implementation reference for MIC-12–MIC-23, MIC-25–MIC-29.
This is a specification of the approved direction, not a shipped UI or a claim
that browser, accessibility or physical-device tests have already passed.

## Authority and intent

Reviewed the five latest **Home, Work, Journal, Play and About** attachments on
[MIC-8](https://linear.app/michelino-experiment/issue/MIC-8/build-and-deploy-the-personal-portfolio-with-the-editorial-gallery).
Their attachment IDs, in that order, are `c02f2156-fb66-4ac5-9bf6-e80ef83ba9dc`,
`faacef0a-5716-40c0-bf8b-85d945979844`, `fd779237-e635-4397-8cc6-b43f52e5f5f3`,
`c270444d-257e-4a21-b615-4f3a93b2c920`, `6641d5b1-4b44-410b-88b4-21ac6be2206f`.
Use these stable references rather than saving expiring upload signatures.

The audience should understand Miki's work and engineering judgment, then read a
story or contact him. Home/Work/Play are media-led Experience surfaces; Journal
and its reader are Read surfaces; About combines a personal introduction with
clear contact actions. Preserve regular-weight oversized type, square media,
quiet navigation, generous empty space and white/charcoal section changes.
The expressive opening and long project-media strips are the defining moments.
Do not turn the work into equal-sized rounded cards or a dashboard grid.

Use [confirmed copy](../content/personal-copy.md),
[inventory](../content/inventory.json) and [media briefs](../content/assets-and-verification.md).
Mockup images and drawings are illustrative references. Authentic screenshots,
Miki's own photography/drawings or explicitly credited illustrations replace them.
Hop replaces “Round app meeting”; Social post and comic learning remain in progress.

## Layout, type and colour

Values below are implementable design defaults, chosen from the mockup proportions;
they are not font identification or exact pixel measurements of generated images.
MIC-12 should map them to shared tokens instead of duplicating page styles.

| Token / rule | Phone: 320–767 CSS px | Tablet: 768–1199 CSS px | Desktop: 1200+ CSS px |
| --- | --- | --- | --- |
| Page gutter | 20px; 16px below 360 | 32px | 48px; content max 1600px centered |
| Main grid | Single column | 8 columns, 24px gaps | 12 columns, 24px gaps |
| Section padding, block axis | 48px | 72px | 96px |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 72, 96px shared across widths | Same | Same |
| H1 | 48–72px, line height 1.02 | 72–96px, line height 1.0 | 96–144px, line height 0.98 |
| Section/project heading | 28–36px / 1.1 | 36–48px / 1.1 | 40–56px / 1.08 |
| Lead | 20–24px / 1.35 | 24–28px / 1.3 | 28–32px / 1.3 |
| Body / reader | 18px / 1.6 | 18px / 1.6 | 20px / 1.6 |
| Navigation / metadata | 16px / 1.4 | 16px / 1.4 | 18px / 1.4 |
| Reader measure | Available width | Max 68ch | Max 68ch; figures may span wider |
| Media gaps | 12px | 16px | 16px |

Use the existing Arial/Helvetica sans-serif stack for the first implementation,
regular 400 weight; code uses the existing system monospace. This avoids guessing
a licensed font from an image. Headings may use tracking down to -0.04em; body
tracking stays normal. Use rem units and fluid interpolation within each range;
respect text zoom. Let titles wrap naturally with balanced wrapping where useful;
no fixed-height title boxes, clipping, line clamps or forced desktop line breaks
on phones. Keep names such as Schrödinger Hat legible and complete.

| Semantic token | Value | Use |
| --- | --- | --- |
| Paper / ink | `#FFFFFF` / `#111111` | Light sections and text |
| Charcoal / reverse | `#111111` / `#F5F5F5` | Dark gallery sections and text |
| Secondary text | `#595959` on paper; `#BDBDBD` on charcoal | Dates, status, captions |
| Accent | `#D7EF36` on charcoal | Small interaction cue; never body text on white |
| Focus | `#2457E6` on paper; `#D7EF36` on charcoal | 3px outline, 3px offset |
| Control boundary | `#767676` on paper; `#8A8A8A` on charcoal | Necessary input/control borders |

Verify rendered contrast in MIC-12/MIC-26, including disabled/error states and
overlaid image labels. Put overlaid copy on an opaque charcoal backing rather
than relying on the image. Links use an underline, not colour alone. Square
media have no shadows; controls can have a small 4px radius. White/charcoal are
editorial section choices, not an automatic system-theme inversion.

Use the compact layout if content collides, including at enlarged text settings.
At 1200px the full four-group header may wrap each group; never force one line.
At ultrawide widths cap the content and media stage at 1600px, with background
colour continuing to the viewport edge. No body-wide horizontal scrolling;
use `min-width: 0` on media/grid children and local scroll containers.

## Shared navigation and footer

The DOM order is identity → role → primary navigation → contact/social links.
The identity links home. Primary links are Work `/work`, Journal `/blog`, Play
`/play`, About `/about`; nested case/article routes keep their section active
with `aria-current` where appropriate. Hide decorative separators from assistive
technology. External arrows indicate external destinations, not internal routes.
Open links in the same tab by default; label CV as a PDF.

On desktop Home uses the mockup's four groups with vertically listed links.
Interior pages use the same groups in a compact row, wrapping within each group.
On tablet use two rows: identity/role above a wrapping primary-link row; secondary
links remain in the footer. On phone use identity/role, then a visible wrapping
row of the four primary links. This small navigation needs no drawer, hamburger,
focus trap or JavaScript dependency. Preserve at least 44×44px action areas with
8px separation, even when the visible link text is small. Header stays in normal
flow; add a visible-on-focus skip link to the main content.

Footer: contact heading followed by Email Miki, GitHub, LinkedIn, Download CV,
and RSS when implemented. Desktop uses a heading column and link row; tablet
wraps links in two columns; phone stacks them. Safe-area padding applies at
viewport edges. Focus must never be clipped by a gallery or overlap another link.

## Page compositions

Section sequences below are DOM and reading order at every width. Stacking
changes presentation, never removes content. The [composition board](composition-board.svg)
shows these relationships schematically; it is not final artwork.

### Home — `/`

1. White identity/header and “Engineering, with curiosity.” introduction.
2. Full-width image/palette stage, with its title, controls and project link.
3. Charcoal selected work: ImageGoNord, archived Supermarket waiting times, then
   Chromatique when its real media is ready; story links remain usable meanwhile.
4. White writing strip and links to Journal/Play, then shared footer.

| Width | Composition |
| --- | --- |
| Phone | H1 then lead, each full width with 24px separation. Stage 4:3; label/control row below image. Selected-work heading then project summary, gallery and captions/controls; repeat with 48px between projects. Writing label above the full wrapping title and CTA. |
| Tablet | Introduction 5/3 columns (title/lead); stage 16:9. Project rows stack summary above media to protect the picture width. Writing label/title use 2/6 columns, CTA below title. |
| Desktop | Introduction 7/5 columns, lead aligned to lower title lines. Stage about 3:1, min 360px and max 560px high. Project rows use 2-column summary + 10-column gallery, aligned at the top; writing strip uses 2/8/2 columns. |

Keep the first stage visible as part of normal scrolling; no introductory gate,
scroll hijack, artificial full-screen wait or custom cursor required to explore.

### Work — `/work`

Charcoal throughout the primary gallery. H1 “Selected work.” and lead → featured
project rows → complete project index → Play link → footer. Feature order comes
from MIC-10; the mockup's two examples do not limit the inventory.

| Width | Composition |
| --- | --- |
| Phone | H1, lead, then each summary above its gallery; 48px between projects. Index is a single list with name, summary/status and real destination. |
| Tablet | H1/lead 5/3; summaries above galleries. Index has two columns, row-major reading order, with no boxed cards. |
| Desktop | H1/lead 8/4; project rows 2/10 as Home. Index uses three columns of text entries, generous row gaps and underlined links. |

An archived label precedes the supermarket CTA. No “try live” action for a retired
service. A project without a case study links to its verified external destination
or stands as text; it never opens an empty story.

### Journal — `/blog`

White header → H1/lead → featured article with media → archive discovery/list →
sketchbook entry → RSS and footer. Preserve real titles and publication dates.

| Width | Composition |
| --- | --- |
| Phone | H1/lead stacked; featured label/title/date/CTA above 16:9 media. Search label/input above wrapping categories, result count, then single-column archive rows. Dates sit above titles, arrows at the trailing edge without narrowing title to a sliver. Sketchbook text precedes any authentic drawing. |
| Tablet | H1/lead 5/3; featured text/media 3/5, with diagram fitted rather than cropped. Archive spans all columns; sketchbook text/media 4/4. |
| Desktop | H1/lead 8/4; feature 3/9; archive rows have date/title/action columns. Sketchbook text/media 6/6 with RSS visible near the section end. |

The feature is one article, not a carousel that hides other article titles.
Search/category controls, if implemented by MIC-18, use labelled native controls,
shareable query state, a Clear filters action and a polite result count. Never
fetch on every keystroke without keeping the current list usable. Direct archive
links work without scripts; a no-script GET submission can apply search/filtering.
Empty sketchbook state says “A work in progress”; no fictional drawing or link
to a nonexistent post. RSS remains independent of search results.

### Play — `/play`

White title/lead → full-width dark palette stage → project/community directory →
comic-learning entry → passions line and footer. Reuse the Home stage component;
do not create a second interaction implementation.

| Width | Composition |
| --- | --- |
| Phone | Title and lead stacked; stage 4:3 with controls beneath; directory one column. Comic-learning heading, honest WIP copy, then original media only when available. |
| Tablet | Title/lead 5/3; stage 16:9; directory two columns in row-major order. Comic heading/media 3/5 if media exists, otherwise text spans full width. |
| Desktop | Title/lead 8/4; panoramic stage as Home. Directory three columns of large text links, no cards; comic section heading/media 4/8. |

Show Hop, Broskis and the other confirmed names from inventory. Social post and
comic learning get a visible in-progress label and no fake external arrow.
One project record may appear in both Work and Play without duplicate story URLs.

### About — `/about`

White H1/introduction → career/community/talks → charcoal “Beyond the keyboard”
with authentic passion media and sketchbook copy → contact/CV footer.

| Width | Composition |
| --- | --- |
| Phone | H1 then introduction, career and community in reading order; dark-section heading above 4:3 photography (or text-only fallback). Captions and passions wrap, sketchbook CTA follows copy. Contact links stack. |
| Tablet | Intro 5/3 with current role in the side column; career/community two columns. Dark section heading above full-width 16:9 photography. Contact links two columns. |
| Desktop | Intro 8/4; career/community retain readable measures. Dark heading/media 3/9; image about 3:1 with caption below. Contact heading/link row 5/7. |

Use “Senior Software Engineer at Adobe” and confirmed email/CV. Do not preserve
the mockup's “Since 2014” as an unsourced current tenure claim. Avoid a second
portrait; personal photography and the small fox carry the personal details.

### Shared readers — `/work/[slug]`, `/blog/[slug]`

Follow the same shell: breadcrumb/back link → one H1 → summary and visible
author/date/status/role → lead media → structured body → related content/footer.
Phone is one column. Tablet centers the 68ch body. Desktop can place an optional
contents list beside it only if the body keeps its measure; collapse contents
to a native disclosure above the body on smaller screens. Figures can break
out to the main grid; captions stay adjacent. Technical diagrams use contain,
not crop, with a description/transcript for essential detail. Tables and code
scroll locally with labelled regions when needed. Case studies use the MIC-10
story structure and distinguish Miki's role from shared results.

## Media and gallery contract — MIC-13

Photography defaults to cover with a recorded focal point; screenshots, diagrams
and original drawings use contain and keep their full content. No forced crop of
code, labels or credits. Reserve aspect ratio/intrinsic dimensions before loading.
The first meaningful stage image is eager; later media lazy-load. Supply widths
and responsive sizes matching the actual grid; do not serve every image at the
maximum width. Captions/credits are HTML, not tiny text baked into an image.

Gallery frames use 5:3 on desktop/tablet, 4:3 on phone; content can letterbox.
Each phone slide is 88% of the gallery viewport; tablet 76%; desktop 48%. A small
next-frame peek communicates continuation. A single item fills available width.
Scroll stays inside the media column, even when the right edge visually bleeds
to the page gutter. Do not use viewport-wide negative margins that overflow body.

The gallery is a labelled region containing an ordered list of figures, not a
tablist. Native horizontal overflow works before hydration. Proximity scroll
snap may assist, never trap. Previous/Next buttons below the images scroll one
item; no autoplay or infinite loop. Disable the appropriate button at endpoints;
one item hides navigation. Show “1 of 3” plus a caption for the active item;
announce settled button navigation politely, not every scroll event. Keep focus
on the activating button. All media links stay keyboard reachable; focus scrolls
them into view. No arrow-key handler on the whole page or interception of Tab.

Touch swipes may move the strip while vertical swipes over it still scroll the
page. Provide buttons so dragging is optional. A gallery image is not a story
link unless explicitly labelled; the story CTA is always a separate visible link.
No lightbox is required for launch; adding one requires its own accessible dialog
states and tests. Broken media preserves its frame with “Image unavailable” and
caption/credit; other slides and the story link continue working. Zero media
renders the summary and link, without a large fake screenshot frame.

## Opening image/palette interaction — MIC-22

Owner update — 2026-11-13: the website 3D/Three.js parts are removed. Use the
same two authentic images in the HTML comparison before and after enhancement.
Keep its labelled native controls and shared selected value. No canvas, WebGL
renderer or GPU dependency belongs in this stage. Reduced motion suppresses
hover previews while keeping direct input available.

Two views of the same approved image share one frame: Original and Palette.
Initially render a useful static 50/50 comparison and text caption on the server.
Provide an explicitly labelled native range “Palette reveal”, 0–100, initially
50, plus Original/Palette endpoint buttons and a Reset comparison button that
restores 50. Pointer hover inside the image may
preview the reveal only with a fine pointer and hover support; leaving restores
the selected value. Pointer dragging, touch dragging of the range, keyboard
arrows/Home/End and endpoint buttons commit a value. The project CTA is separate.

On touch the image surface itself keeps vertical page scrolling; dragging the
range thumb is the explicit manipulation surface. Never require moving a cursor,
swiping an ambiguous image or discovering an unlabeled hotspot. Show numeric
position/accessibility value but announce only native control changes. Phone
labels and controls sit below the frame; desktop overlays only a backed title
and optional “Move to reveal” hint, leaving controls below for reliable access.

States: static poster → enhancement ready; dragging/focused; original endpoint;
palette endpoint; reset to 50; enhancement unavailable. If scripts or image loading fail, retain the static comparison, explanatory caption
and project link; never leave a blank canvas. Hide inoperative enhancement-only
controls until ready. No upload or live processing workflow is added by this spec.

## Shared states and motion — MIC-12 / MIC-23

| Component/state | Observable behaviour |
| --- | --- |
| Link/button default, hover, pressed | Underlined link or clear button boundary. Hover changes underline/emphasis only; pressed gives immediate feedback. No motion or colour is needed to discover an action. |
| Keyboard focus | Persistent visible focus using the section's focus token; sequential DOM order; skip link works. No focus theft on route loading, filtering or image errors. Route transitions provide a meaningful heading/document title. |
| Disabled control | Native disabled semantics and a muted but identifiable appearance; adjacent status explains endpoint/unavailable action. Avoid disabled links. |
| Loading route/media | Shell, title and layout remain stable. Reserve image frames; loading label if useful. Avoid perpetual animated skeletons or replacing readable text with placeholders. |
| Route/content failure | “This page could not load” with Retry and working navigation. Unknown slug gets a real 404 with Home/Work/Journal links. Missing optional media is handled locally. |
| Search loading/error/empty | Keep prior results during loading, mark busy; failure offers retry without clearing query; no matches shows the query, result count and Clear filters. Distinguish a globally empty archive from filtered zero results. |
| Newsletter idle/invalid/submitting | Explicit email label; inline associated error; submitting prevents duplicate sends and indicates progress; keep entered email on retry. |
| Newsletter success/unavailable | Success asks the visitor to check email, not claims subscription before confirmation. Network/provider/unconfigured errors explain retry; focus error summary on failed submit, polite status on success. Preserve existing API semantics. |
| CV/contact failure | Standard email/PDF link; PDF accessible without scripts. Verify the preserved destination before launch; do not imply the PDF has been refreshed. |

Feedback transitions: 120–180ms opacity/colour. Optional section/media entry:
200–320ms opacity with at most 8px movement, once; never gate content visibility
on an observer or script. No parallax, automatic gallery advance, text scrambling
or scroll locking. Galleries use smooth button scrolling only when motion is
allowed. With `prefers-reduced-motion: reduce`, all movement/smooth scrolling is
removed; content and range control still work, and the fox is static. Listen for
preference changes during the session. Offscreen/hidden-tab animation pauses.

Fox: at most one small original fox visible per page, around 40–64px on phone,
64–96px on desktop, away from copy and controls. Use as a decorative empty-alt
image; no repeated portraits. MIC-21 supplies original vectors/static poster;
missing artwork means omit the fox. Short notice/follow/settle animations play
once on deliberate interaction, never chase the pointer continuously. One optional
easter egg uses a labelled button, keyboard activation and explicit close; Escape
closes it and returns focus. No automatic audio, hidden essential links or modal
interruption. A fox animation cannot be the only signal of success/error.

The mascot and character language are explicit deliverables, not incidental
decoration. MIC-21 defines a consistent fox-led model, expressions, poses and
character colour palette; MIC-23 places the approved characters in the site.
MIC-12 maps the editorial colours above, experiment palettes and character
colours to coordinated tokens. Keep image-transformation palette values separate
from semantic UI colours so an experiment cannot reduce text/focus contrast.
Review palettes in original/transformed comparisons and character poses at their
actual small display sizes. Any supporting characters must use the same visual
language and restrained placement rather than multiply illustrations per section.

## SEO, GEO and social image composition — MIC-25

Server-render the same meaningful headings, project summaries, role/status,
author/date and real links that visitors see. One H1 per page; descending headings
for content structure. Keep text outside canvas; no hidden keyword or FAQ blocks.
JSON-LD must agree with visible facts. Canonical content, sitemap and RSS exclude
drafts; search/category query variants canonicalize to the archive per the route
contract. These support discoverability; no ranking or AI-citation guarantee.

Share-image default: 1200×630, charcoal background, paper title/name, small accent,
optional approved artwork. Keep essential content in a 64px inset. Use the same
regular sans-serif character as the site. Default card: Miki Lombardi + concise
site identity. Article/project cards: actual title + type + Miki Lombardi, optional
authentic image; fallback to the branded default if specific art is missing.
No fictitious project screenshot, metrics, publication date or drawing authorship.

Title range: 1–3 lines around 56–72px. For long titles reduce to at least 40px and
allow up to four lines inside a bounded title area; exceptionally long titles use
a separately reviewed short share title with the full title in metadata. Never
silently overflow or truncate by raw character count. Check long unbroken names
and diacritics. Inspect full 1200×630 and a 300×158 thumbnail plus a center-square
crop as a robustness check; third-party crops vary. Title and identity must remain
readable. Provide Open Graph and Twitter large-image metadata, absolute image
URLs, alt/dimensions and correct canonical origin in crawler-visible HTML.
Image endpoints must return actual image bytes with the correct content type.

## Required proof for implementation tickets

Every implemented feature gets a meaningful automated test alongside its ticket;
do not wait for MIC-28 to begin testing. This specification adds no product code.
Tests of document phrases would not prove responsive or interaction behaviour.

| Test ID / owner | Automated acceptance | Visual/manual acceptance |
| --- | --- | --- |
| R1 · MIC-12/14–20/26 | At 320, 390, 768, 1024, 1200, 1440px, assert body has no horizontal overflow and critical links/headings remain visible; include long title and 200% text fixture. | Capture all five pages at 390×844, 834×1112 and 1440×1000; compare section order, proportions, typography, charcoal/white rhythm and real media with the five references. Inspect 320px, landscape and 400% zoom reflow too. |
| N1 · MIC-12 | Header/footer destinations, active nested section, skip link and keyboard order; navigation works with JS disabled. | Visible focus on light/dark sections; no collisions at 1199/1200 or large text; 44px targets. |
| G1 · MIC-13 | 0/1/many media; next/previous/endpoints; captions, focus retention; failed slide fallback; gallery scroll does not enlarge body. | Swipe strip and scroll page across strip; inspect first/last focus and long captions. Real touch check, not only viewport resize. |
| P1 · MIC-22 | Range initial/endpoints/reset, keyboard arrows/Home/End, pointer preview vs committed value, reduced motion, failed-image explanation and link preservation; no canvas or WebGL required. | Complete a drag on iOS Safari and Android Chrome; vertical swipe across image scrolls page; native range still manipulates reveal; compare selected output. |
| J1 · MIC-18/19 | Direct article refresh/404, full title/date, filters/query/back restoration, no matches/clear/retry, draft exclusion. | Long legacy titles, code/tables/diagrams and empty sketchbook remain readable at all widths. |
| S1 · MIC-12/23 | Loading/error/retry, newsletter validation/provider failures, reduced-motion change, offscreen pause and easter-egg close/focus return if implemented. | Keyboard-only route journey, screen-reader landmarks/status, failed script/media; fox remains sparse and unobtrusive. |
| O1 · MIC-25 | HTML metadata/canonicals/JSON-LD match content; default/specific/fallback image routes return valid images; draft exclusion and absolute origin. | Inspect default, article, project and longest-title OG cards at full/thumbnail size, light/dark source media and missing art. |
| C1 · MIC-16/17/20/24 | All requested names/statuses/destinations, archived/WIP labels, no empty hrefs; CV200 PDF and legacy redirect manifest. | Verify authentic media/provenance, no mockup diagram presented as original evidence; confirm contact/PDF labels. |

MIC-26 records keyboard/screen-reader, contrast and touch evidence; MIC-27 records
actual build performance; MIC-29 owns final reference comparison and intentional
deviations. Browser automation should cover Chromium, WebKit and Firefox where
available. Record exact engine/input/device: WebKit automation is not physical
iOS Safari, and resized screenshots do not prove touch gestures. Outstanding
hardware checks remain explicit release checks; never report them as passed.

## Specification completion and handoff

- Five current attachments inspected; all five pages have phone/tablet/desktop
  compositions, plus shared reader/gallery/stage specifications.
- Type, colours, spacing, media sizing, navigation, failure, keyboard and motion
  states are specified above, with test ownership and observable pass conditions.
- Deliberate adaptations: visible wrapping mobile navigation instead of cramped
  desktop groups; summaries above tablet media; controls below images; added
  complete inventory and current career copy from MIC-10. These preserve the
  approved visual direction while accommodating real content and touch input.
- Remaining assets: authentic project media/photography (page tickets), original
  fox (MIC-21), original comic work when ready. Missing assets have defined
  honest fallbacks and do not require builders to invent evidence.
- Runtime implementation, rendered screenshots and browser/device verification
  remain with the named tickets. MIC-11 completes the specification only.
