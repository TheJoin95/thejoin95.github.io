# MIC-29 — Complete preview and five-mockup comparison

Reviewed 2026-11-13 against the five latest MIC-8 attachments and the MIC-11
responsive contract. Review scope: Home, Work, Journal, Play and About, with real
content and the owner's later removal of all 3D. This records an implementation
review and a preview for the owner; it is not the owner's final production approval.

## Preview and artifact

- [Shareable review preview](https://mic29-review--mikilombardi.netlify.app)
- [Immutable reviewed deploy](https://6af72fcaea42b736c5a1bb47--mikilombardi.netlify.app)
- [Netlify deploy record](https://app.netlify.com/projects/mikilombardi/deploys/6af72fcaea42b736c5a1bb47)
- Deploy `6af72fcaea42b736c5a1bb47`, site `cebe5896-585b-41a4-b7e6-6c07af66f2ff`.
  Netlify reports it ready, with `published_at: null` and branch-deploy context.
  It was built using the deploy-preview configuration and uploaded with a CLI
  alias; it is not a pull-request Deploy Preview.
- Next.js 16.4.6/Turbopack, Bun 1.4.4, Netlify adapter 5.16.6. The platform reports
  a Node.js 24 function runtime; that runtime is controlled by Netlify.
- Preview indexing and analytics are disabled. Newsletter delivery variables are
  overridden empty for this deploy. No email was sent. Canonicals retain the
  approved HTTPS custom origin, not the preview alias.
- Read-only site lookup after deployment still reports production deploy
  `6af6e6e4a1b7313d86878826`; the production site and DNS were not changed.

The screenshot package contains fifteen full-page hosted captures, obtained by
scrolling through each page to load real media, then returning to the top. Resting
captures use reduced motion; interaction tests separately use normal browser
behaviour. Every retained capture returned HTTP 200, loaded its images and had
no page-wide horizontal overflow. [Raw capture evidence](capture-evidence.json)
records the route, viewport, headings and media. Images below are WebP copies of
those PNG captures; they are review evidence, not pixel-diff golden baselines.

| Page and approved attachment | Mockup | Phone 390×844 | Tablet 834×1112 | Desktop 1440×1000 |
| --- | --- | --- | --- | --- |
| Home · `c02f2156-fb66-4ac5-9bf6-e80ef83ba9dc` | [Reference](references/home.webp) | [Capture](captures/home-390.webp) | [Capture](captures/home-834.webp) | [Capture](captures/home-1440.webp) |
| Work · `faacef0a-5716-40c0-bf8b-85d945979844` | [Reference](references/work.webp) | [Capture](captures/work-390.webp) | [Capture](captures/work-834.webp) | [Capture](captures/work-1440.webp) |
| Journal · `fd779237-e635-4397-8cc6-b43f52e5f5f3` | [Reference](references/journal.webp) | [Capture](captures/journal-390.webp) | [Capture](captures/journal-834.webp) | [Capture](captures/journal-1440.webp) |
| Play · `c270444d-257e-4a21-b615-4f3a93b2c920` | [Reference](references/play.webp) | [Capture](captures/play-390.webp) | [Capture](captures/play-834.webp) | [Capture](captures/play-1440.webp) |
| About · `6641d5b1-4b44-410b-88b4-21ac6be2206f` | [Reference](references/about.webp) | [Capture](captures/about-390.webp) | [Capture](captures/about-834.webp) | [Capture](captures/about-1440.webp) |

Reference copies came from the MIC-8 Linear attachments; their generated imagery
is illustrative design material. None was used as authentic website project media.
The mockups are desktop references. Phone/tablet comparisons use their hierarchy
and the explicit MIC-11 adaptations, not invented mobile reference images.

## Comparison and deliberate deviations

| Page | Preserved direction | Recorded difference and reason |
| --- | --- | --- |
| Home | Oversized regular-weight introduction, expressive full-width comparison, narrow descriptions beside horizontal media, charcoal work, white writing strip and contact ending. | Credited Johnston garden/actual Chromatique output replaces illustrative mountains. Visible native controls and provenance occupy more vertical space than the mockup. Three featured projects, newsletter and footer expand the composition as required by later tickets. One small original fox sits beside the introduction rather than over the photograph. |
| Work | Charcoal surface, quiet navigation, oversized title, media-dominant 2/10 rows, archived label and onward Play link. | Genuine ImageGoNord UI and a labelled source-derived supermarket architecture diagram replace invented mountain/map screenshots. Chromatique and the complete eleven-entry index extend the two-example mockup. Captions/credits and full-size links make rows taller; they preserve evidence and accessibility. |
| Journal | White introduction, featured Micro Frontends story with a fitted diagram, editorial archive, sketchbook entry and RSS. | A charcoal feature/sketchbook rhythm, search/tag controls, dates and eight-item pagination extend the compact mockup under MIC-18. The diagram is explicitly a new illustration of the original article's example. Original article titles/dates are preserved. No fabricated comic drawing fills the empty sketchbook. |
| Play | Oversized introduction, panoramic comparison, text-based project/community directory, comic-learning entry and passions line. | Shared HTML comparison replaces the mockup's separate mountain banner. Verified current names include Hop, HolyCard AI and CoproSync. Status/contribution copy expands the directory. Unverified public URLs remain text; Social post and comic learning are visibly in progress. No fictional drawing or dead external arrow. |
| About | White personal introduction/career, charcoal passions and contact/CV finish. | Confirmed Adobe role, supported career/community/talks replace generic mockup copy and unsourced “Since 2014”. The longer biography wraps and creates a taller introduction. No owner-selected cycling/photography or comic assets exist; the approved text-only fallback replaces the mockup's illustrative bicycle and sketchbook. No repeated portrait or extra mascot is added. |

Across all pages, Arial/Helvetica, regular weight, square media, spacing tokens,
underlined links and light/charcoal contrast preserve the shared system. Titles
wrap naturally instead of reproducing generated mockup line breaks. Header and
control targets have accessible sizes, so the layout is less compressed than the
reference. These differences are explicit; no pixel-perfect match is claimed.
The absence of original passion/comic media is a documented content decision,
not a claim that supplied artwork was implemented.

Content review retains Miki Lombardi, Senior Software Engineer at Adobe,
`miki.lombi@gmail.com`, co-founded/community attribution, archived supermarket
status and the original CV destination. Project stories distinguish individual
contribution from team results. Existing preservation checks cover all sixteen
articles, assets and the exact CV hash. No metrics, employer duties, dates,
public URLs or artwork authorship were invented for this review.

## Findings and resolution

1. **P2 layout drift — fixed.** Shared PageIntro used Home's 7/5 desktop split
   for all pages. Inner pages now follow the specified 8/4 split; Home explicitly
   retains 7/5. Phone and tablet compositions stay one column and 5/3 respectively.
   A real computed-layout regression checks all five pages at all three sizes.
2. **P1 preview asset routing — fixed.** A separate offline adapter build followed
   by `deploy --no-build` uploaded pages without generated asset routing. The
   initial hosted smoke check caught unstyled HTML and 404 CSS/JS. Rebuilding and
   uploading in one Netlify adapter lifecycle supplied the routes. Final captures
   are styled and the hosted visitor journey passes; the failed deploy is not the
   reviewed artifact.
3. **P1 preview build configuration — fixed.** The inherited hosted canonical
   setting failed URL validation during CLI builds. The approved public canonical
   origin is now explicit only under `context.deploy-preview.environment` in
   `netlify.toml`. No production environment setting was changed.
4. **P2 generated artifacts in code checks — fixed.** Local adapter output and
   failed-test HTML trace assets were being linted/typechecked as application
   source. Only `.netlify`, `test-results` and `playwright-report` are now excluded.
   Application checks remain enabled and pass with those generated files present.
5. **Hosted automation limitation — open for human release review.** Netlify's
   connection-verification page returned HTTP 403 during rapid repeated navigation,
   including a serial rerun. It says “We are verifying your connection” and provides
   a challenge ID; this is platform protection, not an application HTTP 403. No
   challenge was solved and no protection was disabled. All fifteen separate
   screenshot captures returned normal pages, and the hosted visitor journey
   passed, but the complete hosted grid test is not recorded as a pass. Verify
   normal human phone/tablet/desktop browsing and protection behaviour before
   cutover under MIC-31. Keep any access-control change a separate explicit decision.

## Functional and visual proof

Hosted visitor journey: native palette End/Reset; fox open/Escape/focus return;
Next gallery with live count; Journal search using the article's actual spaced
title words; direct reading; About/contact jump; PDF response and genuine 404.
A broader literal `microfrontend` body search legitimately matches another
article, so the reading-journey test uses `micro frontends` and asserts the title.
The test also fails if a requested Next static asset returns an HTTP error.

Resting images were inspected against each reference and the responsive contract:
full-page section order, typography, white/charcoal rhythm, gallery continuation,
media fitting, captions, directory row order, sparse fox and readable controls.
No further product redesign or new decorative artwork was introduced.
The scoped UI detector returned zero findings. General guidelines were checked
against [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md),
with the approved design and native/Radix semantics taking precedence over
inapplicable generic copy/style suggestions.

Final local verification: `bun run check` passed lint, TypeScript, 124 unit tests
and 1,601 assertions with generated adapter/report files present. The normal
noindex `bun run build` passed. `CI=true bun run test:e2e` passed 116 tests with
three expected special-build skips; both new design-review tests pass locally.
The MIC-28 release-context/publishing checks were not repeated for this layout
change. The Netlify adapter build and final draft upload also completed.

Hosted result: the complete visitor-journey test passed. The repeated viewport
grid test failed on Netlify connection verification, so the hosted suite result
remains **one passed, one platform-blocked failure**, not a green suite. The
independent capture pass produced fifteen valid HTTP-200 screenshots. Retain
these distinctions in release review. Local reports are in
`test-results/regression`; hosted evidence is in `test-results/design-preview`.

Review disposition: ready for the owner's production review with the documented
content/design deviations. Do not treat this as approval to cut over. Human
browser verification of the Netlify challenge behaviour remains a release gate
under MIC-31. The failed first upload was corrected; no unresolved local layout,
asset or visitor-journey defect was found in the final reviewed scope.

This review does not establish
human assistive-technology use, physical touch devices, real email delivery,
field Core Web Vitals, GitHub Actions for an unpushed commit or production acceptance.

To repeat local/hosted checks, stop local servers and use the commands in
[the regression guide](../../regression-checks.md). For the hosted smoke only:

```sh
REVIEW_BASE_URL=https://mic29-review--mikilombardi.netlify.app CHECK_NAME=design-preview bun run test:e2e e2e/design-review.spec.ts --workers=1
```

`REVIEW_BASE_URL` disables Playwright's local server; it does not bypass platform
protection. A connection challenge remains a failed hosted check requiring
review. For draft deployments, use a single build/deploy command with
`--context deploy-preview --alias mic29-review`, the approved canonical origin
and empty analytics/newsletter values. Never use `--prod` for this review.
