# Portfolio foundation — MIC-9

Recorded 2026-11-11 against scaffold commit `e3d4ecf`.
Scope: preserve the working foundation and define the contracts for the remaining
[MIC-8 implementation](https://linear.app/michelino-experiment/issue/MIC-8/build-and-deploy-the-personal-portfolio-with-the-editorial-gallery).
This document records implementation defaults, not approval of new content or a
claim that the redesigned pages and publishing system already exist.

## Existing work and design baseline

The checkout already has Next.js 16.4.6 App Router, React 19, TypeScript,
Tailwind 4, Radix-based shadcn primitives, GA4, a Brevo double-opt-in route and
form, a Three.js demo, and lazy dotLottie components. Bun 1.4.4 is pinned in
`.bun-version`, `packageManager`, CI and Netlify. Retain these tested pins in this
task; upgrades require a separate version check and coordinated pin changes.

Existing pages are `/`, `/experience` and `/newsletter/confirmed`; the server
endpoint is `/api/newsletter`. The home page is a holding page. There is no
current content repository, journal renderer, CMS, editorial shell or original
fox animation asset. CI already installs the frozen lockfile, checks and builds.

Reviewed all five latest MIC-8 attachments: Home, Work, Journal, Play and About.
They call for white and deep charcoal sections, regular-weight sans-serif type,
large square-edged media, narrow project descriptions and quiet navigation.
Home and Play share the image/palette interaction; Work uses project galleries;
Journal mixes featured writing, archive rows and a sketchbook entry point; About
combines career, passions and contact. Keep one sparse recurring fox and minimal
portrait use. Mockup images and apparent drawings are references, never project
evidence or proof of Miki's authorship. Responsive specifications belong to MIC-11,
tokens/navigation to MIC-12, original artwork to MIC-21.

## Framework and rendering decisions

Keep one Next.js application and one origin for portfolio and Journal. Use Server
Components for page content, metadata and content retrieval; small client
components own galleries, filtering and animation. Use semantic links and
readable HTML before progressive enhancement. A portfolio visit must not require
Three.js or an animation to access its content.

Retain the lazy client boundaries in `components/experience` and
`components/animations`. The 3D demo is reusable infrastructure, not the approved
hero. Future image interaction needs pointer, keyboard and touch operation plus a
static alternative. Preserve fixed media dimensions, reduced-motion behaviour,
offscreen pausing and failed-asset fallbacks. Build shared galleries once rather
than embedding separate implementations in Home, Work and Play.

Bun handles installs, scripts, tests and the environment-checker bundle.
Turbopack builds the Next.js application. Keep a server deployment for newsletter
and future draft preview. Netlify's Next.js integration owns its deployed runtime.

Alternatives considered: restoring Vue loses the current foundation and conflicts
with project instructions; static export needs a replacement newsletter backend
and complicates private preview; a separate blog application duplicates navigation,
metadata and deployment. The existing App Router application supports the approved
direction without those changes.

## Content contract

The user selected repository Markdown and Next.js article routes. Keep project
records separate from writing, with shared media and stable IDs for relationships.
No Markdown parser is installed yet. MIC-6 will implement file-based authoring,
validation and draft handling; a CMS is not required. Publishing means merging
reviewed Markdown and rebuilding the site. See the
[blog design](superpowers/specs/2026-11-11-markdown-blog-design.md) for the concrete
backfill, SEO/GEO and test requirements awaiting implementation review.

Suggested implementation locations: `content/projects`, `content/journal`,
`content/site` for repository data; `src/lib/content` for server-only validation and
retrieval; `public/media` for versioned assets. These are planned locations.

| Record | Required information | Optional information |
| --- | --- | --- |
| Project | Stable ID, slug, title, summary, lifecycle (`active`, `archived`, `in-progress`), Miki's role/contribution, Work/Play placement | Dates, technology, repository/demo links, related writing IDs, ordered media, case-study body, feature order |
| Writing | Stable ID, slug, kind (`article`, `sketchbook`), title, summary, author, language, draft/published state, body, categories/tags | Published/updated dates, legacy paths, related project IDs, ordered media, feature order |
| Media | Stable ID, source path, width/height, alt text (empty only for decorative media), provenance | Caption, credit/license, poster/static fallback, variants |
| Site/profile | Name, introduction, navigation destinations | Verified career copy, passions, contact/social links, CV asset |

A published entry requires a publication date and reviewed content. Preserve the
original publication date; record edits separately. Never replace unknown roles,
dates, links or outcomes with invented values. Projects may appear in both Work
and Play using one record. A case study is optional: directory entries must not
link to an empty detail page. Case-study bodies cover problem, role, constraints,
alternatives, decisions, implementation, evidence and lessons.

Media provenance distinguishes authentic project evidence, Miki's original work,
licensed third-party material and illustrative/generated material. Do not infer
authorship from an asset's appearance. Original sketchbook posts require confirmed
authorship. Missing media gets an honest empty/static state, not a generated
product screenshot presented as evidence.

Pages consume a common retrieval layer: list published projects/writing, retrieve
one record by slug, and resolve related IDs/media. Public queries, search, RSS,
sitemap and related links exclude drafts and future publications. Validate unique
IDs/paths, dates, relationships, media and metadata at the content boundary.
Keep file access server-side and normalize metadata in this retrieval layer.
Render Markdown through an explicit safe pipeline; do not execute remote MDX or
carry legacy raw HTML directly into rendering without review/sanitization.

## Route contract

These are implementation defaults for the page tickets, not routes added by MIC-9.
The navigation label Journal can coexist with the established `/blog` URLs.

| Route | Purpose / owner |
| --- | --- |
| `/` | Editorial home, MIC-14 |
| `/work` | Work gallery and complete project index, MIC-15 |
| `/work/[slug]` | Optional case study using the shared project record, MIC-16 |
| `/play` | Side projects and sketchbook entry point, MIC-17 |
| `/blog` | Journal archive and discovery, MIC-18 |
| `/blog/[slug]` | Article/sketchbook reader, MIC-19; legacy date-prefixed slugs retained |
| `/about` | About, passions, contact and CV, MIC-20 |
| `/whoami` | Permanent redirect to `/about` during migration, MIC-24/MIC-7 |
| `/newsletter/confirmed`, `/api/newsletter` | Preserve existing confirmation and server endpoint |
| `/experience` | Preserve the existing demo during implementation; review public navigation in MIC-12 |
| `/sitemap.xml`, `/rss.xml` | Published canonical content only, MIC-25 |

Use one shared header/footer, active navigation and identity across every public
page. Link Play/About into Journal's sketchbook view using a `sketchbook` category
(for example `/blog?category=sketchbook`), and link articles back to their related
projects. Keep taxonomy/filter query parameters out of canonical content URLs.
Unknown content must return HTTP 404, not a successful empty article or SPA shell.
MIC-6 defines private draft entry/exit routes if needed; draft responses bypass
public caches and indexing and require authenticated access. A hidden URL alone
does not protect unpublished content.

## Legacy preservation findings

`origin/old` is the read-only source of truth. Inspected its router, article index,
article loader, archive template, sitemap and representative Markdown. There are
16 Markdown articles and 16 metadata records. The old archive constructs links as
`/blog/<date>-<permalink>`; using just the undated permalink would break those links.
Keep the existing spelling of published slugs, including typos.

The supermarket recap file starts `2021-04-16-`, while its frontmatter and index
say `2021-04-17`. MIC-24 must map both dated variants to the same article without
silently changing the recorded publication date. The old sitemap omits the two
supermarket articles, so it is not a complete migration inventory. Inventory the
index and files as well as sitemap URLs. Preserve downloadable Markdown paths
under `/articles/` or explicitly map them during migration.

The archive uses `source.unsplash.com` media URLs. Inventory and replace or credit
legacy remote media after availability/rights review; do not assume old URLs work.
Preserve or deliberately redirect `/whoami`, `/miki-lombardi-resume.pdf`, old image
paths and any inbound URLs. The old resume/career copy needs current review before
reuse. MIC-24 owns the full route/media manifest and redirect tests.

```sh
git ls-tree -r --name-only origin/old
git show origin/old:src/assets/articles.json
git show origin/old:src/router/index.js
```

Fetch `origin old` if missing. Do not switch branches or restore the Vue app.

## Setup, preview and deployment boundaries

SEO, GEO and social sharing are shared page requirements. MIC-25 owns canonical
metadata, structured data, sitemap/RSS, Open Graph and Twitter cards, including
a branded default share image and article/project-specific images with a fallback.
Use absolute image URLs, meaningful image alt text and readable title/identity
composition. Share-image artwork must not imply authentic product evidence.
MIC-28/page tests must verify crawler-visible metadata, valid image responses,
fallbacks, long-title layouts and correct canonical-origin handling before launch.

Use the [local preview runbook](preview-workflow.md). Existing CI and `netlify.toml`
remain the reproducible baseline. The local production build validates the
foundation without an account, public deployment, DNS change or live email.
It does not prove Netlify adapter compatibility; MIC-7 verifies that in a deploy
preview, including the current Cache Components/Partial Prefetching configuration.

Netlify deployment is already configured by the user. A read-only project lookup
on 2026-11-11 found `mikilombardi` with a ready current deploy. The custom domain
still serves the old version, per the user; no DNS cutover was requested.
MIC-7 owns preview access, context-specific secrets, route/media
checks, cost/limit review and concrete rollback preparation. MIC-30 owns production
cutover and MIC-31 live verification. Keep the old public site working during
review. Do not add a GitHub Pages publishing action or an SPA catch-all redirect.

MIC-6 must demonstrate create draft → add media files → preview locally → merge
to publish → retrieve published content, with recovery instructions. Repository
Markdown has no new service dependency. Authenticated hosted draft preview is a
future feature; public deploy previews must not expose drafts. Hosting costs and
limits still need review before cutover.

## Remaining content decisions and handoffs

- MIC-10: verify the requested project inventory, titles, roles, company permissions,
  supported outcomes, selected case studies, contact destinations and current CV.
- MIC-6: implement repository Markdown authoring, media-by-file workflow and draft
  isolation; document edit/preview/publish steps. No CMS selection is outstanding.
- MIC-11/MIC-12: settle responsive gallery behaviour, typeface, spacing and tokens.
- MIC-21/MIC-22: supply original fox assets and approved imagery for the interaction.
- MIC-24: resolve the recap URL discrepancy, media replacements and complete legacy
  redirect manifest before release.

These decisions do not block installing or previewing this scaffold. They remain
explicit prerequisites for their owning publishing/content/release tickets.

## Verification — 2026-11-11

- Working checkout: frozen install made no dependency changes; `bun run check`
  passed lint, generated route types, TypeScript and all 35 tests. Coverage was
  100% for the two tested modules, not the whole application.
- Working checkout: `bun run build` passed with analytics/Brevo disabled after
  moving generated `.next` output aside and allowing local worker ports. An
  earlier sandboxed build failed because Turbopack could not bind a worker port;
  no framework or application change was needed.
- Clean tracked-source copy in a temporary directory, with no `.env` files or
  existing dependencies: `bun install --frozen-lockfile`, `bun run check` and
  `bun run build` all passed on Bun 1.4.4. Development startup and a request to `/`
  passed; the production server also started successfully.
- Isolated production HTTP checks: `/`, `/experience` and
  `/newsletter/confirmed` returned 200 with expected page content; an unknown URL
  returned 404. Newsletter returned 503 when unconfigured, 400 for an invalid
  email and 403 for a foreign origin. No live email or contact was created.
- Reviewed all five design reference images and legacy source without modifying
  either. Only documentation changed. No public deployment, DNS, hosting account,
  production configuration or source dependency changed.

Hosted adapter verification, full responsive/visual review, real publishing,
email delivery and migration tests remain with their implementation tickets.

## MIC-9 closure audit

All three foundation acceptance criteria are satisfied:

1. Fresh-source installation, development startup, production build and HTTP
   preview passed using the documented commands; CI also defines checks/build.
2. The recorded framework, content/route contracts and shared portfolio/Journal
   approach support the five approved mockups, user-selected Markdown publishing,
   SEO/GEO requirements and the Netlify migration without replacing existing work.
3. Existing application/source dependencies and `origin/old` remain unchanged.
   Validation used local servers without production deployment or DNS changes.

The application is still scaffold commit `e3d4ecf`; subsequent changes in this
chat are documentation and project instructions, so the recorded application
verification still applies. Blog implementation/design approval, legacy backfill,
SEO/discovery routes and their new tests remain separate implementation work.
Closing MIC-9 does not claim those features are built or authorize domain cutover.
