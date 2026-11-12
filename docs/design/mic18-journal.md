# MIC-18 — Journal archive and discovery

The existing Journal now follows the approved Read surface in `DESIGN.md` and
`docs/design/responsive-layouts.md`: white oversized introduction, charcoal
featured writing with contained media, chronological editorial archive, honest
sketchbook state, RSS and the shared footer. This extends the established system;
no theme, global CSS, animation, library or design-system change was needed.

## Source and composition

All sixteen migrated articles remain repository Markdown. The archive uses the
existing cached server loader, which excludes drafts and future publication dates
and orders articles by original date, with slug as a deterministic tie-breaker.
Titles, descriptions, dates, tags and article destinations come from those records.
Legacy tags are preserved even where their categorisation looks surprising.

`JournalArchive` renders semantic dated rows and native discovery controls;
`FeaturedWriting` composes the existing `Section` and `MediaFrame`. The feature
reuses Home's selected article by destination, while obtaining its title, summary
and date from the published Markdown. If that selection disappears, the most
recent published article is featured; an empty publication list has no feature.

The micro-frontends diagram is a new explanatory vector, derived from the school
application example in the featured article. Its caption identifies it as drawn
in 2026, not an original product screenshot. Other feature selections fall back
to their actual article share cards. See `docs/content/media-provenance.md`.

No original comic drawings or sketchbook articles have been supplied for
publication. The sketchbook says this explicitly and connects to the existing
Play comic-learning section. It invents no date, article route or artwork.

## Discovery and states

Search is a native GET form at `/blog`, using existing shadcn `Input`, `Label`
and `Button` primitives. A native select provides exact tag matching, avoiding
the JavaScript dependency of a custom combobox. No new search library is needed
for sixteen locally loaded articles. Search matches all whitespace-separated
terms across titles, descriptions, tags and article bodies, ignoring case and
diacritics. It treats user input as text, not regular expressions or HTML.

Query values are trimmed and bounded to 160 characters; tags to 80. Repeated
parameters use the first value. Invalid pages return page one; pages past the end
show the last page with its correct canonical. Eight articles appear per page.
Pagination preserves search/tag values, while a new form submission resets to
page one. Native URLs retain discovery state through refresh and browser history.

All results arrive as server-rendered HTML, including with JavaScript disabled.
There is no request on each keystroke, separate client index or transient empty
list. The request-specific page opts out of instant-navigation shell validation
using this installed Next version's documented `instant = false`. The existing
error boundary provides retry if server rendering fails, retaining the URL.

Visible result counts distinguish the complete archive, active filters, no
matches, and a globally empty publication list. Clear filters returns to the
archive; an empty publication list offers Play. There are no disabled pagination
links or controls for nonexistent pages. Long query/tag values wrap at 320px.

## SEO, GEO and social discovery

Ordinary pagination has unique URLs and self-canonicals such as `/blog?page=2`,
with crawlable sequential anchors. Search/tag combinations use `noindex, follow`
and canonical `/blog`, preventing combinatorial index pages. Preview/alias
noindex protection remains in place. The canonical sitemap still contains 25
public page/story/article destinations; pagination is discovered via links.

CollectionPage/ItemList JSON-LD describes only the visible archive entries, their
real dates, titles, language, author and absolute article URLs. It supplies
semantic context, with no claim to a special Google rich result or guaranteed AI
citation. The HTML contains the same useful content for people and crawlers.
Default branded Open Graph/Twitter metadata remains absolute, and article pages
retain their individual cards. The visible RSS link and metadata alternate point
to the complete sixteen-article feed regardless of current filters.

Primary references checked on 2026-11-12:

- [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)
- Installed Next documentation: App Router `page`, `generateMetadata` and
  `route-segment-config/instant` guides under `node_modules/next/dist/docs`.

## Verification and release boundary

Unit tests cover source preservation across pagination, search/combined filters,
accent handling, input bounds and escaping, invalid pages, native form/link
contracts, empty states, feature fallback media, publication gates, metadata and
visible-result schema. Browser checks cover no-JavaScript discovery at 320, 390,
834 and 1440px, keyboard operation, URL restoration, pagination reset, 200% type,
long unbroken filters, crawler HTML, canonical URLs, actual PNG responses and RSS.
The migration browser regression now traverses both archive pages and verifies
all sixteen unique historical destinations rather than counting duplicate links.

The independent review identified long-query wrapping; the fix has a dedicated
browser regression and was scored resolved in the reviewer's scoped ship verdict.
Existing tokens, responsive composition, reading measure,
contained media and charcoal/white surfaces were checked against the incumbent
system. `DESIGN.md` and its system files remain unchanged.

`bun run check` passed with 99 unit tests and the coverage gate. The full browser
suite passed 58 tests (two context-specific checks intentionally skipped); after
the final wrapping fix, all 13 Journal/preservation/SEO regressions passed again.
The separate simulated production release check also passed, including indexable
pagination, noindex search/tags, canonical-host enforcement and the unchanged
25-entry sitemap. The final local build restores indexing disabled. The
Impeccable detector returned no findings for the changed Journal UI files.

Successful builds still
emit the previously tracked `CLIENT_HOOK_DYNAMIC` fallback diagnostics for the
unknown article/project route shells; actual missing routes return HTTP 404 via
the existing gate. Hosted adapter verification remains MIC-31. Nothing in this
task deploys the site, changes Netlify settings, or cuts over the custom domain.
