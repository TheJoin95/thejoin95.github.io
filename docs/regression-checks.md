# MIC-28 — Regression and publishing checks

The suite protects routes, preserved writing, discovery and critical interactions
using the real production build. It reuses the Bun and Playwright suites from the
page tickets rather than duplicating their assertions. No new website feature,
visual system, external test service or package was needed.

## Local commands

Install the pinned Bun version and frozen lockfile. Fetch the preserved history
before the migration checks; do not switch the current checkout:

```sh
bun install --frozen-lockfile
git fetch origin old
bun --bun playwright install chromium firefox webkit
bun run check
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run build
bun run test:e2e
bun run test:release
```

Stop development and production servers first; Playwright deliberately refuses
to reuse an existing server. Do not run unit tests, builds, performance benchmarks
or these browser suites concurrently in the same checkout. Some unit tests create
temporary Markdown, and production build/cache snapshots must remain isolated.
Service variables are overridden empty by the server configuration and release
runner. No newsletter message, live provider check, deployment or DNS change occurs.

`test:release` performs three production-mode indexing builds (production,
deploy-preview and branch-deploy), then temporarily writes three clearly marked
synthetic Markdown files with exclusive creation. It verifies published/draft/
future behaviour and regular code/content gates with the extra article,
including a third archive page. It removes only files it created, restores the original route
inventory and rebuilds the normal noindex local artifact in `finally`. A final
withdrawal check verifies the synthetic route/share card and discovery disappear.
SIGINT/SIGTERM are handled through cleanup; a forced OS kill cannot run cleanup.
If forcibly terminated, remove only the three generated `mic28-*-fixture.md`
files after confirming they are synthetic, then run `build:journal` and the normal
local build before any further work. Never deploy a synthetic fixture build.
The command refuses to run inside an actual Netlify deployment.

## Coverage and actionable failures

| Behaviour | Proof |
| --- | --- |
| Code/build integrity | ESLint, TypeScript, Bun coverage thresholds, Next Turbopack build |
| Route graph and fragments | `e2e/links.spec.ts`: start at Home, follow local HTML anchors, request linked documents/assets, check fragment IDs and reachability of every public page/story/article; failure prints source → destination and link text |
| Legacy preservation | All sixteen original Markdown files, titles/dates/routes, media/Gists and CV compared with the preserved Git snapshot/manifest; HTTP responses and raw downloads checked |
| New Markdown publication | `e2e/publishing.spec.ts`: real rebuild admits new article, crawler HTML, correct date/author/canonical/OG metadata, real social PNG, searchable archive, RSS and sitemap; draft/future article/card remain HTTP 404 and absent from discovery |
| Withdrawal | Rebuild after removal returns HTTP 404 for article/card and removes archive/RSS/sitemap references |
| Search/indexing policy | Dedicated builds test canonical production indexing and noindex/empty sitemap in both preview contexts despite indexing-enabled input |
| Navigation and recovery | Skip link, active navigation, no-script routes, CV download, unknown routes, actual error retry callback and newsletter 503/400/200 feedback |
| Gallery and palette | Independent galleries, keyboard/native touch, boundaries/live status, media failure, endpoint/reset pixels, responsive image requests, no restored 3D |
| Fox and animation | Keyboard/close-focus, reduced motion, offscreen cancellation, hidden-tab pause and clip/player/WASM/poster failures |
| Responsive/accessibility | 52 axe page scans, five-size enlarged text/spacing, forced colors, contrast and representative Firefox/WebKit journeys; automation is not assistive-technology certification |

The full prelaunch suite intentionally skips the two special SEO-context tests
and publishing fixture test; `test:release` runs them in their matching builds,
including publication and withdrawal as separate runs. None of those five
special runs should be skipped. Migrated-content cardinality tests use the fixed
historical subset, protecting the sixteen originals without imposing a permanent
sixteen-post limit on the live blog.

## Continuous integration and reports

`.github/workflows/ci.yml` runs on main pushes and pull requests using `.bun-version`
and the frozen lockfile. Full Git history is fetched because migration tests read
the manifest's original commit; a depth-one checkout cannot supply that evidence.
CI runs check → noindex build → full browser suite → release/publishing checks.
Chromium, Firefox, WebKit and their system dependencies are installed. The runner
restores a clean noindex build; fixtures are not a deployment artifact.

CI rejects focused tests (`test.only`) and flaky tests that pass only on retry.
Retries retain diagnostic evidence; they do not turn a flaky run green. Each run
writes a separate directory, so later contexts do not overwrite earlier results:

- `test-results/regression/`
- `test-results/production/`
- `test-results/deploy-preview/`
- `test-results/branch-deploy/`
- `test-results/publishing/`
- `test-results/withdrawal/`

Each includes `junit.xml`, an HTML report and per-test artifacts/attachments.
Screenshots and traces are retained on failures. The link crawl attaches its
visited targets and statuses; axe attaches its raw summaries, including incomplete
checks. CI uploads `browser-test-results` and Bun coverage even after failure.
Open a local report with `bun --bun playwright show-report <directory>/html`.

## Verification record

Recorded 2026-11-13. Local execution of the same commands used by CI is recorded
below. A local pass is not a claim that a GitHub Actions run for
these unpushed changes has occurred. The workflow publishes results on its next
push/PR run; inspect that run before release approval.

- `bun run check`: lint, TypeScript, 124 unit tests and 1,601 assertions passed.
  The same gate also passed with the seventeenth synthetic article present.
- Explicit noindex `bun run build`: passed. All five builds in the release
  runner passed, including the clean restoration build.
- `CI=true bun run test:e2e`: 114 passed, three expected special-build skips,
  zero failed/flaky tests. Includes the complete local link/fragment crawl.
- `bun run test:release`: all five focused runs passed, none skipped:
  production, deploy-preview, branch-deploy, publication and withdrawal.
- An early publication run exposed the legacy-only minimum-body-length check
  being applied to a new short article. It is now scoped to preserved history,
  along with the fixed sixteen-record assertions. That failed run exercised
  cleanup; no generated fixture or route inventory change remained afterward.
- Final checkout has no synthetic Markdown, and the generated route inventory
  matches its original bytes. No application content, assets or source hashes
  were changed. YAML parsed successfully with the installed parser; actual Linux
  workflow execution remains a release-review requirement.

The build still emits the previously recorded nonfatal `CLIENT_HOOK_DYNAMIC`
diagnostics for unknown article/story fallbacks. Build exits successfully and
real missing-route checks assert HTTP 404; no validation was disabled. The hosted
adapter follow-up remains in MIC-31.

Keep physical-device/assistive-technology tests, hosted Netlify adapter checks,
provider delivery, field performance and DNS cutover in MIC-31 and their existing
release tickets. External historical URLs are deliberately not crawled: changing
external services must not make local integrity checks nondeterministic.
