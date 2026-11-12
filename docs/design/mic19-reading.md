# MIC-19 — Article and sketchbook reading templates

This extends the approved editorial Read surface and preserves the shared visual
system. `ReadingTemplate` composes the article header, optional contents,
ordered panels, Markdown body and onward writing. The reading measure stays
72ch; the white surface, regular-weight type, section spacing, semantic media and
shared footer remain consistent with `DESIGN.md`. No global CSS or theme change
was needed. Client motion, galleries and fox artwork remain their own tickets.

## Reading behavior

The template renders one H1, the actual source summary/date, confirmed author,
tag discovery links, optional genuine updated date and the existing historical
notice. Legacy source files, dates, downloads, URLs and media remain untouched.

Contents navigation appears for three or more H2/H3 headings. The established
unified pipeline now uses maintained `rehype-slug` with a safe `section-` prefix;
`unist-util-visit` and `hast-util-to-string` read the sanitized tree rather than
parsing HTML with regular expressions. Duplicate headings get stable unique
IDs; body H1s become H2s so the template retains the sole page title. Contents
links work without scripts, and targets accept native keyboard focus. There is
no custom scroll-spy, sticky overlay, progress bar or motion requirement.

Code blocks and tables receive labelled, keyboard-focusable scrolling regions.
Tables preserve readable column widths instead of reducing headings to a few
characters per line; excess width remains local. Safe `figure`/`figcaption`
elements survive sanitization. Scripts, events and unsafe URLs remain stripped.

Related writing selects at most three other published entries, prioritizing
shared tags (and sketchbook kind for sketches), then original dates and slug.
The current post never repeats. The empty related state keeps the Journal and
RSS links usable. No new article content or artificial freshness was generated.

## Sketchbook and publication

`kind: sketchbook` enables ordered panels and learning notes through the same
repository Markdown workflow. Each panel requires a local path, positive integer
dimensions, useful alt description, caption and explicit credit. It composes the
existing `MediaFrame` and adds native full-size links. Published empty panels,
missing public files, traversal/external paths and incomplete credits fail
validation. Draft/future entries remain outside the publication loader and the
early route gate, including their social cards and discovery entries.

The Journal sketchbook section now consumes actual published sketchbooks and
otherwise preserves the honest unpublished state. No real comic material was
supplied. The only new content specimen is `tests/fixtures/sketchbook.md`, which
clearly identifies synthetic test notes and reuses the existing source-derived
technical diagram. It is outside production content/public directories and
reaches the browser only through a locally generated test HTML specimen. It is
neither an authentic drawing nor a claimed personal learning event.

BlogPosting structured data retains the actual author, original date, optional
genuine update, canonical and image. Sketchbooks additionally describe visible
panels as ImageObjects with their exact descriptions/captions/credits. The share
card uses a branded textual fallback labelled Sketchbook and learning notes;
it does not attempt to crop unseen art. No draft is made indexable to test this.

The source-to-HTML and metadata policy follows
[Google's article guidance](https://developers.google.com/search/docs/appearance/structured-data/article).
The heading implementation follows the
[rehype-slug documentation](https://github.com/rehypejs/rehype-slug), including its
DOM-clobbering guidance. Local Next documentation for page params and metadata
was reviewed before editing the App Router routes.

## Validation and handoff

Tests cover sanitizer/heading invariants, unique destinations, real metadata,
sequential descriptions/captions/credits, panel validation, draft/missing-file
publication gates, related writing, discovery, schema and actual social PNG bytes.
Browser specimens cover the real article and sketchbook template at
320/390/834/1440px without scripts and with reduced motion, keyboard contents and
code/table scrolling, 200% text, failed media and inaccessible test routes.
Existing tests preserve all sixteen legacy articles and validate their cards.

An independent review identified semantic caption stripping and unreadable table
columns. Both received fixes and automated regressions; the final scoped verdict
scored both resolved and approved shipping at that scope. `bun run check` passed
106 unit tests and the coverage gate; `bun run build` succeeded. The full browser
suite passed 65 tests (two context-specific checks intentionally skipped), and
after the final caption/table fixes all 20 reading, migration, archive and SEO
regressions passed again. The preservation test now waits for the actual rendered
second archive page before collecting its links, removing a navigation race.
Responsive captures are saved under
`/tmp/mic19-{article,sketchbook}-<width>.png` for this local run. The UI detector
returned no findings. The existing shared tokens and `DESIGN.md` remain unchanged.

Authoring instructions: `docs/publishing/journal.md`. Actual hosted adapter
verification and the existing successful-build fallback `CLIENT_HOOK_DYNAMIC`
diagnostics remain MIC-31. This task makes no deployment, hosted settings or domain
cutover change. The production content remains sixteen articles, the RSS sixteen
items and the release sitemap twenty-five canonical URLs until real new material
is published.
