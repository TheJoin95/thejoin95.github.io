# Publish articles and sketchbook notes

Writing lives in `content/journal/<slug>.md`. Both kinds use `/blog/<slug>` and
the same archive, RSS, canonical metadata and social image pipeline. No CMS or
MDX JavaScript is required. Existing migrated files and their raw downloads must
retain their source bytes; write new entries instead of rewriting the archive.

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

## Validate and publish

1. Keep `draft: true` while preparing content. A future publication date also
   stays out of public loaders, routes, share cards, RSS and sitemap.
2. Run `bun run check` and `bun run build`. Fix invalid metadata or missing panel
   files. Rebuild/restart development when publication status or slugs change.
3. Set `draft: false` (or remove it) and the real date only when ready. Run checks
   and build again; verify the direct route, readable panels/captions and share
   image on the preview deployment before releasing.

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
