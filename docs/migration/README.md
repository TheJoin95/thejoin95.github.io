# Legacy writing migration — MIC-24

The preserved source is `origin/old`, pinned to
`22bad0992edf92a28898d8645d6621d993b14fdf` in `legacy-manifest.json`.
All sixteen Markdown files and index entries are accounted for. The old sitemap
omits two supermarket articles, so it is not the migration inventory.

## Preserved material and deliberate rendering changes

- `content/journal/<canonical-slug>.md` contains byte-identical legacy source.
- `/articles/<original-filename>.md` retains each original downloadable file,
  including frontmatter, historical cover URLs, Liquid and script embed source.
  These downloads return `X-Robots-Tag: noindex`; the HTML reader is canonical.
- Original titles, descriptions, publication dates, code, links and writing
  remain intact. Historical mistakes, obsolete instructions, spelling and
  encoding artefacts have not been silently edited. An archival notice explains
  that these are historical instructions. No invented update dates are emitted.
- The article template supplies the original metadata title as the single H1.
  A few original body H1s differ typographically or in wording from metadata;
  those original lines remain in the raw Markdown. The rendering adapter omits
  that redundant first H1. It removes obsolete Vue-era cover wrappers and all
  sixteen decorative `source.unsplash.com` covers; it does not replace them with
  guessed photos. No meaningful article illustration is omitted.
- Liquid `highlight` wrappers become code fences. Literal Liquid examples inside
  code (notably the AMP article) remain literal examples.
- The three external GitHub Gist scripts become locally captured, readable code
  plus links to the original Gists. No third-party script executes in the reader.
  Captures may differ from the Gists' 2019 revisions: they were recovered from
  the public Gists on 2026-11-12, not from a historical snapshot. Their hashes
  now pin this recovered version. Original embed URLs remain in raw source.
- Four Medium illustrations and the embedded PNG are captured losslessly under
  `/media/blog/`, with SHA-256 hashes, alt text and dimensions. Below-fold images
  are lazy loaded. The two supermarket diagrams are retained independently even
  where their content overlaps.
- `/images/*`, `/lotties/*` and `/miki-lombardi-resume.pdf` preserve all seven old
  assets. The CV bytes were already correct and did not change. The new favicon
  intentionally remains the site's current favicon. The old Vue index, app,
  sitemap and robots rules are not restored into Next.js.

## Route mapping

The manifest lists every source filename, canonical article URL and alias.
All historical slug spellings are preserved, including `argumented` and `conver`.

The recap file starts `2021-04-16`, but its frontmatter and archive entry publish
it on **2021-04-17**. The April 17 URL is canonical; the April 16 filename URL
redirects there in one permanent HTTP 308. The original April 16 raw download
remains available. `/whoami` redirects permanently to `/about`. Next normalizes
`/blog/` to `/blog`; `/not-found` returns a real 404. Home's featured writing link
now uses its local migrated article route.

Full article HTML, author, original date, canonical, Open Graph/Twitter metadata,
BlogPosting JSON-LD and a branded 1200 × 630 title card are server generated.
The title cards use article metadata without depending on unavailable artwork.
They require no remote font/image request and the existing site default card
remains available for other pages. No company endorsement or additional claims
are inferred from the author attribution.

## Repeat and recover

Run `bun run migrate:legacy` from the project root. With the checked-in manifest
and captured media present, it makes no network requests and recreates the
sixteen Markdown copies, raw downloads and old assets from the pinned commit.
If the old ref is missing, use `git fetch origin old`; do not change checkouts.
The script reads the pinned commit after the first run even if the branch moves.
It fails on changed media hashes or index/file count discrepancies rather than
silently accepting them. Re-running restores imported source files: preserve any
intentional later editorial edits in Git before using this recovery command.

If a captured media file is missing, the script tries its original source and
requires the recorded hash. If the remote file has changed/disappeared, recover
that path from the migration commit in this repository, then repeat. Do not
regenerate the manifest to bless changed media without reviewing it. Gist
historical recovery is limited to the captured version noted above.

The remote `old` branch and byte-identical raw sources are the writing backup;
the migration commit is the media backup. Rollback before cutover means returning
to the preceding application commit. After a hosted release, select the previous
Netlify deploy if required. DNS/deploy changes are separate release work. This
migration does not delete anything from the old site or alter the custom domain.

## Simple Markdown publishing

Add a unique `content/journal/<slug>.md` file:

```markdown
---
title: A useful article title
description: An accurate summary of what this article covers.
date: 2026-11-12
language: en
tags: [engineering]
draft: true
---

An opening paragraph.

## A descriptive section

Article text, code, links and tables.
```

Use section headings from H2 down; the template owns H1. Dates are calendar dates
in UTC; impossible dates, invalid metadata and unsafe slugs fail the build.
Set `draft: false` (or omit it) and rebuild to publish. Start `bun run dev`
after creating the file; restart it after adding a new slug or changing publication
visibility so its generated route list is refreshed. Future dates and drafts
are omitted from the archive, generated route inventory and article/share routes.
Scheduled posts require a rebuild on/after their publication date. No online or
production draft preview is exposed. New draft source belongs only in `content/`,
never `public/articles/`; that directory is exclusively the immutable old archive.
Use owned/licensed local media and alt text. Keep an `updated` date only when the
writing actually changes, not for deployment or migration timestamps.

`bun run build` first validates all Markdown and regenerates
`src/content/journal-routes.json`. The server loader has an explicit server-only
boundary and cached publication checks. Proxy uses the build's public slug list
to reject unknown/draft/future pages before Next streams a cached shell; otherwise
Cache Components can return HTTP 200 for a streamed not-found page. This is a
publication boundary, not a private preview or authentication system.

## Verification and remaining tickets

- `bun run check`: lint, types and Bun tests, including source-to-manifest hashes,
  old index coverage, original dates/titles, all local media/assets, Markdown/code
  rendering, sanitization, publication visibility and route gate behavior.
- `bun run build`: validates content and prerenders all sixteen article/card pairs.
- `bun run test:e2e`: direct HTTP/content/schema/metadata/image checks for all
  sixteen articles, raw file and asset hashes, 308 aliases, true unknown 404s,
  no-JavaScript archive/reader navigation and widths 390/834/1440. Existing shell,
  gallery, Work and Home tests remain included.

Production-build verification uses localhost as the explicit test origin with
GA4/Brevo disabled. Hosted canonical origin, preview noindex, robots, sitemap,
RSS and domain cutover remain MIC-25/MIC-30/MIC-31. This migration's reader and
archive provide the preservation baseline; search/pagination, sketchbook layouts
and the complete editorial reader review remain MIC-18/MIC-19. Those tickets are
not marked complete by this migration.

Metadata follows [Google's article guidance](https://developers.google.com/search/docs/appearance/structured-data/article);
URL preservation/mapping follows [Google's migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
Markup and readable HTML help describe the archive; search rankings and AI
citations still require post-launch observation (MIC-85).

### Framework diagnostic observed

The installed Next 16.4.6 build exits successfully and produces all article/card
routes, but logs `CLIENT_HOOK_DYNAMIC` for `usePathname()` while generating the
unknown `/blog/[slug]` fallback shell. The existing navigation already has its
Suspense boundary. Moving that boundary inside the client navigation or changing
page-level static/instant flags did not remove the diagnostic; those experiments
were reverted. Published routes, no-JavaScript content and unknown-route 404s pass
production HTTP tests; the early route gate prevents serving that unknown shell.
Check this diagnostic against the hosted adapter/runtime during MIC-31 rather than
silently disabling navigation validation globally or changing the shared shell.

### Editorial reader follow-up

MIC-18 adds archive search, tags, pagination and discovery; MIC-19 adds the shared
article/sketchbook reader, native contents, related writing and described,
credited sequential panels. The original migration files and URL manifest remain
unchanged. For current authoring and draft/media rules, use the
[publishing guide](../publishing/journal.md). Verification and design details are
in [MIC-18](../design/mic18-journal.md) and [MIC-19](../design/mic19-reading.md).
