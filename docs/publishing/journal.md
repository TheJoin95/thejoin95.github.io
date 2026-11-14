# Publish articles and sketchbook notes

Writing lives in `content/journal/<slug>.md`. Both kinds use `/blog/<slug>` and
the same archive, RSS, canonical metadata and social image pipeline. No CMS or
MDX JavaScript is required. Existing migrated files and their raw downloads must
retain their source bytes; write new entries instead of rewriting the archive.

For project updates, deployments, recovery and the current release state, start
with the [maintenance guide](../maintenance/README.md).

## Create a blog post, step by step

The blog already exists at `/blog`. Creating a post means adding one Markdown
file; do not create a Next.js route or install a CMS. From the repository root:

```sh
git switch -c codex/blog-my-first-post
cp docs/publishing/templates/article.md content/journal/my-first-post.md
bun run build:journal
bun run dev
```

Use a new filename; do not overwrite an existing post. Replace the template's
title, description, example date, tags and body with your actual writing.
`my-first-post.md` becomes `/blog/my-first-post`; the filename is the complete
slug, with lowercase letters, digits and single hyphens. A date prefix is optional
for new posts. Keep a published slug stable when editing its title.

The copied template has `draft: true`, so visiting that route correctly returns
404. There is no authenticated draft-reader UI. To review the real reader locally,
stop the server, temporarily set `draft: false` and a date no later than today,
then run `bun run dev` again and open `http://localhost:3000/blog/my-first-post`.
Use local preview only for material not yet approved for public access. Restore
`draft: true` before sharing or committing an unfinished draft. Do not run a
public preview deploy while that local-only publication switch is enabled.

Once the post is approved, set `draft: false` and its real publication date,
stop the server and run these commands sequentially:

```sh
bun run check
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run build
bun run test:e2e
bun run test:release
git diff -- content/journal/my-first-post.md src/content/journal-routes.json
git add content/journal/my-first-post.md src/content/journal-routes.json
git commit -m "feat(journal): publish my first post"
```

Add any new approved image files explicitly too. `build:journal` updates
`src/content/journal-routes.json`; commit that generated inventory with the post.
Do not edit it by hand. `test:release` temporarily tests synthetic content and
restores a clean local build. It does not deploy your post. Push the content branch
and open a PR when ready; check CI and the real preview before the approved
production-branch merge. See [deployment and recovery](../maintenance/deployment.md).

The page, article-specific share card, archive/search, related writing and RSS
discover approved Markdown automatically after a rebuild. The release sitemap
includes it only in an indexable production build; an empty preview sitemap is
intentional. There is no automatic article-to-newsletter send.

For a drawing study, copy [the sketchbook template](templates/sketchbook.md)
instead and complete the panel fields below before changing `draft` to false.

## Start with a draft

```yaml
---
title: A specific, honest title
description: A short summary of what this entry actually contains.
date: 2026-11-13
draft: true
language: en
tags: [learning]
---

## The problem

Write the article here.

## What I tried

Describe the decisions and evidence.

## What I learned

Record the actual outcome and remaining questions.
```

The date above is an example draft date. Set `date` to the real publication date
when publishing. Leave `updated` absent until a substantive revision happens;
then set its real date, no earlier than publication. Dates are ISO calendar dates
(`YYYY-MM-DD`), not build timestamps. English and Italian are supported. `kind`
defaults to `article`; there is no need to add it to technical posts.

The template owns the title/H1, author and date. Start body sections at `##`.
Three or more second/third-level headings get an “On this page” navigation with
stable unique links. Duplicate heading text works. Markdown headings, lists,
quotes, links, fenced code and GFM tables render on the server. Code and wide
tables have focusable, labelled local scrolling regions. Scripts and event
handlers are removed; Markdown is not a way to run arbitrary components.

For an image with a semantic caption in an ordinary article, use safe HTML:

```html
<figure>
  <img src="/media/journal/my-diagram.png" width="1200" height="800"
       alt="Describe the meaningful relationships in the diagram." loading="lazy">
  <figcaption>Explain what this shows and credit its actual creator/source.</figcaption>
</figure>
```

Supply an owned or licensed file, accurate dimensions, and a useful description.
The figure and caption survive sanitization; JavaScript does not.

## Add a sketchbook

Add `kind: sketchbook` and a `panels` sequence to the draft's frontmatter:

```yaml
kind: sketchbook
panels:
  - src: /media/journal/my-study/panel-1.png
    width: 1200
    height: 1600
    alt: Describe the visual action, composition, and meaningful text in this panel.
    caption: Explain the experiment and what the reader should notice.
    credit: Replace with the actual creator and source or licence.
  - src: /media/journal/my-study/panel-2.png
    width: 1200
    height: 1600
    alt: Describe the second panel, including how it follows the first.
    caption: Explain the next observation without claiming unmeasured progress.
    credit: Replace with the actual creator and source or licence.
```

These paths, dimensions and descriptions are placeholders, not supplied artwork.
Use the actual files and facts before publication. Images must live under
`public/media/journal/`, with simple names and optional subdirectories. Supported
extensions are PNG, JPEG, WebP, AVIF and SVG. External URLs, traversal, missing
dimensions, empty descriptions/captions/credits and published empty panel lists
fail validation. A draft may have no panels yet. Published panel files must exist.

Panels display vertically in source order with their number, caption and credit,
followed by learning notes from the Markdown body. Native full-size links allow
closer inspection without a modal. Meaningful alt text, captions and notes remain
available if a picture fails. Attribute learning notes to yourself only when they
are yours; retain explicit image credits for other creators. Do not present a
reference, generated concept or diagram as an original drawing.

Use the body for “What I tried”, “What I noticed”, and “Next attempt”, with actual
observations. Published sketchbooks appear automatically in the Journal archive,
search, related writing, RSS and the sketchbook discovery section. Until one is
published, the current honest “no drawings or sketchbook articles” state remains.

When publishing the first genuine sketchbook, update the page tests that currently
assert this site-wide empty state to cover the real published work. Keep isolated
empty-state tests too; do not remove draft exclusion or image/credit validation.

## Validate and publish

1. Keep `draft: true` while preparing content. A future publication date also
   stays out of public loaders, routes, share cards, RSS and sitemap.
2. Run `bun run check` and `bun run build`. Fix invalid metadata or missing panel
   files. Rebuild/restart development when publication status or slugs change.
3. Set `draft: false` (or remove it) and the real date only when ready. Run checks
   and build again; verify the direct route, readable panels/captions and share
   image on the preview deployment before releasing.

Visibility uses the UTC calendar date at build time. A future date is not a
scheduler: rebuild/redeploy once that date arrives. Restart development after
changes to publication status or filenames, because the early route inventory
and cached readers must agree. Use `updated` only for an actual substantive edit;
do not replace publication dates with build dates. Do not rename migrated files
or alter their original raw downloads to correct historical copy.

## SEO, GEO and social sharing before release

Write a clear title and accurate description, introduce the subject in readable
prose and use meaningful headings, sources and internal links. Credit people and
state limitations. Keep original dates on historical writing. These make the
article understandable to people and search/AI crawlers; they do not guarantee
rankings or citations.

Verify the direct `/blog/<slug>` response, one H1, body without JavaScript,
canonical URL, real author/date and BlogPosting JSON-LD. The shared implementation
generates Open Graph/Twitter large-image metadata and `/blog/<slug>/share` as a
1200×630 PNG, with a branded fallback. Inspect the actual image for long titles
and a thumbnail crop. It is a title card, not an automatically generated article
hero; there is no supported per-post `ogImage` frontmatter field. If custom share
art is needed, change the shared implementation and its image/metadata tests.

After an update, verify archive/search and RSS; on an indexable release also
verify the sitemap. Search/tag queries stay noindex while ordinary archive pages
have their own canonicals. Check actual hosted headers as well as HTML, and use
the relevant social platform's preview/debugger to refresh its independent cache.
Do not add fake FAQs, dates, claims or AI-only files to chase rich results.

## Correct, withdraw or remove writing

For a new post, edit its existing file and retain the slug. Add the actual
`updated` date for a substantive correction. To withdraw it, set `draft: true`,
rebuild and verify that its page/card return HTTP 404 and discovery excludes it.
An already indexed URL may remain in search caches temporarily. For a permanent
rename, add a deliberate redirect in `next.config.ts`, preserve its old URL in a
regression and rebuild; do not silently break shared links. Historical migrated
articles and raw downloads have byte-preservation tests: record a correction in
a new entry or a separately reviewed presentation change instead of rewriting
their original source.

Draft status is an editorial publication gate, not private storage or an
authenticated preview. Files committed under `public/` are directly accessible
even if a draft references them. Keep private/unreleased artwork outside public
deployment assets until it is approved for public access. Draft Markdown belongs
in `content/`, never `public/articles/` (reserved for immutable legacy downloads).

Author identity is the site's confirmed Miki Lombardi profile. Per-image credits
are visible and included as `creditText` in sketchbook ImageObject schema. The
article's dates, author, canonical URL and actual title card remain consistent
across HTML, Open Graph, Twitter, RSS and BlogPosting structured data. No new
special SEO/AI file is required, and markup makes no ranking or citation promise.
