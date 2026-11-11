# Markdown blog, legacy backfill and search discovery

Status: implementation design for user review, 2026-11-11.

## Intent and agreed constraints

Miki wants a simple blog authored as Markdown, rendered through Next.js page
routes, with good SEO/GEO and all articles from the previous site backfilled.
Every implemented feature must have automated tests. The existing Bun/Next.js
scaffold, newsletter and animation boundaries remain in place.

Netlify deployment is configured. A read-only project lookup found `mikilombardi`
with a ready current deploy. The custom domain still serves the old site, as
reported by the user. This work must be reviewable before any domain cutover.

## Approaches

The user selected repository Markdown plus Next.js routes. Use plain `.md` files
with YAML frontmatter and a server-side Markdown renderer. A CMS introduces an
account, integration and access model the requested workflow does not need. MDX
adds executable JSX and framework coupling without a current requirement for
interactive article components. Neither alternative is part of this change.

The builder may select small maintained parsing/rendering dependencies via Bun.
Do not build a custom Markdown parser. Support fenced code, lists, links, images
and tables; safely handle legacy HTML without allowing scripts or unsafe URLs.

## Files and publishing

Store articles under `content/journal/*.md` and media under `public/media/blog`.
Frontmatter includes title, description, publication date, optional genuine
updated date, language, categories/tags and draft state. Stable canonical slugs
come from filenames, preserving the date-prefixed legacy names. Author defaults
to Miki Lombardi for this personal archive; do not invent credentials.

A server-only loader validates every file, rejects duplicate/colliding URLs,
returns publication metadata/body and filters drafts/future posts from every
public surface. Avoid exposing draft source through `public/` or a public API.
The builder may organize internal helpers as needed for testing.

Authoring workflow: copy a documented example → write Markdown and metadata →
add owned/licensed media by file → preview locally → run checks → open a PR →
merge to publish through the existing Netlify integration. No browser CMS or
authenticated online editor is required. Draft preview is local-only in this
iteration, enabled by an explicit development setting that cannot expose drafts
in a production-mode server or public Netlify deploy. Authenticated hosted draft
preview is a separate feature, not implied by a Deploy Preview URL.

## Routes and reading

- `/blog`: server-rendered Journal archive, newest first, title/description/date
  and article links; useful empty state and a link to RSS.
- `/blog/[slug]`: semantic article with one H1, author, original publication date,
  summary, headings, code blocks, accessible images and link back to the archive.
- Keep a clear homepage link into the blog. Use restrained existing styles; the
  complete MIC-8 editorial redesign remains in its page tickets.
- Unknown, draft and future article URLs return HTTP 404 in production.
- Preserve `/articles/<legacy-filename>.md` downloads for published legacy content
  if they were public previously; exclude drafts and avoid duplicated HTML pages.
- `/rss.xml`, `/sitemap.xml` and `/robots.txt` derive from the published records.
  Preserve existing non-blog routes and the server newsletter endpoint.

## Backfill and evidence

Read only from `origin/old` using Git, without switching the checkout. Import all
16 Markdown files and reconcile them against `src/assets/articles.json`, old
archive links, router and sitemap. Keep a checked-in migration manifest containing
the old filename, old linked path, canonical path and intentional adjustments.

Preserve the article text, original titles, dates, language and links. Rendering
cleanup may remove obsolete Vue/Tailwind wrapper markup and redundant H1s, but
must not silently rewrite the writing or modernize historical instructions.
Mark imported posts as archival writing where useful. Do not manufacture recent
`dateModified` values simply because they were migrated.

For the supermarket recap, frontmatter/index date is `2021-04-17` while the file
starts `2021-04-16`. Proposed resolution: use the archive's linked `2021-04-17-…`
path as canonical, permanently redirect the filename's `2021-04-16-…` path there,
and retain the metadata's publication date. Record both paths in tests/manifest.
Keep other published slug spellings, even where they contain typos.

Audit images/embeds in all articles. Preserve available authentic assets. Record
unavailable third-party assets in the manifest and render an honest caption/link
fallback; never substitute generated screenshots as evidence. Remove broken
decorative covers rather than guessing a replacement or asserting ownership.
Keep source content recoverable and document any removed unsafe embed markup.

## SEO and GEO

Serve the full article body as initial HTML; metadata must be available without
client-side fetching. Generate unique titles/descriptions, absolute canonical
URLs, Open Graph/Twitter metadata and `BlogPosting` JSON-LD with matching visible
author/date/title. Escape structured data safely. Do not emit missing images,
invented author profile URLs or unsupported claims.

Use `NEXT_PUBLIC_SITE_URL` as the canonical production origin. Validate it for
discovery generation and avoid localhost/Netlify aliases in a release sitemap.
Default every Netlify URL and deploy-preview/branch context to noindex while the
domain serves the old site. A later explicit release setting may enable indexing
only when the canonical domain is ready; test both states. Return noindex via
response headers on feeds/raw downloads as well as HTML where appropriate, and
do not rely on robots.txt alone to prevent indexing. This setting changes only
the new application, never the old site's indexing or domain routing.

Give crawlers coherent internal links, ordinary readable paragraphs/headings,
accurate dates and clear author attribution. Preserve first-hand material and
sources. Do not insert fabricated FAQs, citations, statistics or rewritten
AI-targeted versions into the imported articles. `llms.txt` is optional and is
not needed for this implementation. Search ranking and AI citations are outcomes
to monitor after cutover, not acceptance guarantees.

Rationale: Google's guidance treats generative search visibility as grounded in
SEO, useful original material and crawlable pages; article markup helps identify
author, title and dates.

- [Google generative search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)

## Required tests and verification

Apply installed skills according to the work being performed, as requested by
the user. Use `seo-audit` for crawlability, canonicalization, redirects, indexing
and on-page review; `ai-seo` for readable/citable content and discovery;
`schema` for accurate server-rendered JSON-LD and validation; and
`web-design-guidelines` for the final reading UI/accessibility review. Use
`site-architecture` when settling navigation/internal links,
`vercel-react-best-practices` for React rendering/performance changes and the
relevant Netlify skill for deployment-context changes. Consult the installed
Next.js guides for framework APIs. Verify time-sensitive search guidance against
official sources rather than treating skill examples as current specifications.
Do not add unrelated marketing features merely because a skill exists.

Every feature includes automated behavioral tests, not just a successful build:

| Feature | Required proof |
| --- | --- |
| Content loader | Metadata validation, stable ordering, duplicate/path rejection, publication visibility, invalid dates |
| Markdown rendering | Headings/code/links/tables/images, legacy HTML handling, unsafe HTML/URL rejection |
| Backfill | All 16 source records accounted for, preserved text/dates/URLs, manifest coverage and recap alias |
| Archive/article routes | Published pages include expected HTML; real HTTP 404 for missing/draft/future entries |
| SEO/GEO | Canonical/OG/JSON-LD agree with visible article metadata; full body present before hydration; safe serialization |
| Discovery | Valid RSS/XML escaping, sitemap contains only canonical published pages, no drafts/future entries |
| Prelaunch controls | Netlify/preview noindex, release indexing opt-in, no draft leaks in production/raw routes |
| Publishing workflow | New valid fixture appears, draft stays private, invalid content fails checks/build |

Use Bun for unit/integration tests and an automated HTTP check of a production
build where route/status/headers are the behavior being tested. Run existing
newsletter/environment tests and retain meaningful coverage thresholds. Document
the preview commands and test suite, then run `bun run check` and `bun run build`.
Verify direct loads/refreshes for every migrated article and the redirect alias.
No actual subscriber email, production publish or DNS operation is required.

## Scope and handoff

This implementation covers the simple publishing path, backfill, readable blog
pages and their discovery infrastructure across MIC-6/18/19/24/25/28. It does not
complete those tickets' broader design/release criteria by itself. Future work
can improve editorial styling and add authenticated hosted draft preview without
changing canonical article URLs or requiring a CMS migration.

The builder chooses dependency details and internal organization. The user still
reviews the resulting design/content preview before a production domain cutover.
