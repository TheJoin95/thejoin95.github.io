# Metadata, social previews and discovery — MIC-25

## Implementation

All six current public pages use the same metadata builder for accurate titles,
descriptions, absolute canonicals, social URL/type, image alt/dimensions and RSS
advertisement. Experience now has its own description. Home retains its approved
identity title and branded default PNG. Sixteen published articles add their real
author and original dates, article Open Graph metadata and individual title cards.
No migration timestamp is presented as an editorial update.

`TitleCard` composes the existing dark/lime visual language for article and project
PNGs at 1200 × 630, adapting font size to long titles. Cards are text-only and do
not fetch remote fonts or artwork at request time. Three selected-work cards live
at `/share/projects/{imagegonord,supermarket,chromatique}`. An unavailable project
record falls back to the existing branded default PNG. Unknown/private article
routes remain actual 404s, including their image routes. A long synthetic title
was rendered with network disabled and visually inspected alongside project cards.

Person/WebSite schema remains on Home. BlogPosting schema matches visible article
identity, title, date and language. Work's existing CollectionPage/ItemList now
also describes its three visible featured projects as CreativeWork with accurate
contributor, summary and image references. These are portfolio entries, not new
case-study pages or claims of sole authorship. No ratings, outcomes or dates were
invented. The shared JSON-LD serializer escapes `<` to prevent script termination.
The project cards are ready for MIC-16 detail-page metadata; no unpublished detail
URL was invented or added to discovery.

Native Next metadata routes generate `/robots.txt` and `/sitemap.xml`. The RSS
route uses the maintained `feed` library for XML serialization and escaping.
Journal has a visible RSS subscription link; page head metadata advertises it.
The sitemap includes six real pages and the sixteen published canonical articles
when indexing is enabled. It excludes utility/confirmation/error routes, aliases,
raw Markdown, image endpoints, query variants, drafts and future posts. Page dates
are not invented; article lastmod uses a real update date or original publication.
RSS includes published entries with their original publication dates and stable
canonical GUIDs, a self link and the owner’s approved public email in the RSS 2.0
author field. Its channel update uses the latest genuine article date, not the
build timestamp when articles exist. No full-body RSS feature is implied: feed
items contain titles, summaries, links, author, tags and publication dates.

## Indexing policy

| Build context | Canonical origin | Indexing / discovery |
| --- | --- | --- |
| Local development | Explicit local HTTP(S) allowed; localhost fallback | Noindex by default; RSS available, empty sitemap |
| Netlify production before cutover | Required HTTPS custom origin | Noindex unless explicitly enabled; empty sitemap |
| Netlify deploy-preview or branch-deploy | Same required HTTPS custom canonical origin | Always noindex, even if enabled is requested; empty sitemap |
| Production release | Required HTTPS custom origin and `SITE_INDEXING=enabled` | Canonical host indexable; sitemap has public canonical pages |
| Alias of a release artifact | Canonicals remain on configured custom origin | Incoming noncanonical host gets noindex header |

`bun run build` and `bun run dev` execute `verify:seo`, which rejects missing hosted
origins, credentials/path/query/hash in origin URLs, invalid switches and unsafe
release origins before Next builds. Netlify canonical origins cannot be localhost,
HTTP or a `.netlify.app` alias. `SITE_INDEXING` defaults to disabled in code; the
Netlify preview/branch overrides explicitly disable it. Netlify TOML has no global
SITE_INDEXING override, so a later production-only UI build variable can enable
release indexing without being silently overridden by TOML precedence.

Next config inlines the validated origin and non-secret indexing decision so
static pages, Functions and Proxy use one build policy. These values are public;
no Brevo/service credential is included. Netlify TOML variables are build inputs,
not a way to configure runtime service credentials. Rebuild after changing origin
or indexing context; do not promote the same release build into a preview context
and expect its already-generated metadata to change.

HTML carries robots metadata and prelaunch responses carry `X-Robots-Tag`.
Proxy also applies noindex to aliases using the incoming Host header, rather than
Next's normalized/internal URL host. Raw article downloads and RSS remain noindex
even on release. Robots permits crawling so bots can actually read noindex rules;
it advertises the sitemap only in an indexable release. This is search-indexing
control, not private-content authentication. No separate model-training policy is
introduced; search discovery and training controls are different decisions.

## Configuration and release

Keep `SITE_INDEXING=disabled` or unset while the custom domain serves the old site.
Set `NEXT_PUBLIC_SITE_URL=https://www.mikilombardi.com` in Netlify build settings
for the new application, including preview contexts. When MIC-30 authorizes the
custom-domain release, enable `SITE_INDEXING=enabled` for **production builds only**
and rebuild. Verify actual deployed HTML, headers, canonical host, redirects,
sitemap/feed and card responses in MIC-31. No domain or deployed setting was
changed during this implementation.

A read-only Netlify lookup on 2026-11-12 found `mikilombardi`, site
`cebe5896-585b-41a4-b7e6-6c07af66f2ff`, serving deploy
`6af59742d6a68834af372acf` from commit `78c0cfd` (MIC-24), using the Next adapter
5.16.6 and Node 22 Functions. This establishes that the new MIC-25 code was not the
hosted artifact when checked; local simulations below are not hosted response
verification. No production publish, push or DNS change was performed.

## Verification

- `bun run check`: lint/types and unit tests cover URL configuration, production /
  preview / branch decisions, metadata, JSON-LD serialization, accurate projects,
  published-only discovery, XML escaping and safe long-title image rendering.
- `bun run build`: Next prerenders metadata, feeds, sitemap, article and project
  PNGs. The existing nonfatal `usePathname` unknown-fallback diagnostic is already
  tracked in MIC-31; no validation was disabled to conceal it.
- `bun run test:e2e`: full regression suite plus no-JavaScript metadata checks on
  every current public page, crawler HTML for Twitter/Facebook/Google/OAI search/
  Perplexity, real PNG responses, fallback, parseable RSS and noindex headers.
- Separate production-mode builds exercised `production`, `deploy-preview` and
  `branch-deploy` with `NETLIFY=true`, `SITE_INDEXING=enabled` and the real HTTPS
  canonical origin. Release tests parse the 22-entry XML sitemap, check canonical
  and alias headers, robots sitemap announcement, RSS/raw noindex and missing
  article 404. Both preview contexts test actual rendered noindex HTML/headers
  and empty sitemaps despite the enabled input. These are local simulations.
- The CLI verifier was run with an empty hosted origin and correctly exited 1.

To repeat the context checks, set all service/analytics variables empty. Build
with `NETLIFY=true CONTEXT=production SITE_INDEXING=enabled` and
`NEXT_PUBLIC_SITE_URL=https://www.mikilombardi.com`, then run
`SEO_RELEASE_TEST=true bun run test:e2e e2e/seo-release.spec.ts` with the same build
environment. For each preview context, build with CONTEXT `deploy-preview` or
`branch-deploy`, then run
`SEO_CONTEXT_TEST=true bun run test:e2e e2e/seo-context.spec.ts` with that environment.
Stop previous test servers before rebuilding. Restore a noindex localhost build
before running the normal full suite; its expected origin is
`http://127.0.0.1:3109` and both special suites are skipped deliberately.

## Search guidance

This implements crawlable, truthful content and metadata, not a visibility
promise. Search Console indexing/traffic and AI answers remain post-launch MIC-85.
No `llms.txt`, fabricated FAQs or special AI-only content were added.

Official guidance checked for this work:

- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: Article markup](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Netlify: build environment variables](https://docs.netlify.com/build/configure-builds/environment-variables/)

- [RSS Advisory Board: RSS 2.0 specification](https://www.rssboard.org/rss-specification)
