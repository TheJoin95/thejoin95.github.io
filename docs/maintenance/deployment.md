# Preview, deploy and recover

Start with the [maintenance index](README.md) and keep a
[release record](release-record.md). These are procedures, not evidence that a
production release or DNS change has already occurred. MIC-30/31 remain open.

## Local validation and preview

Use the pinned Bun version, `bun install --frozen-lockfile`, and the preserved
`origin/old` history for migration tests. Install Chromium/Firefox/WebKit once:
`bun --bun playwright install chromium firefox webkit`. Never commit `.env*`
files or credentials. `.env.example` documents names and empty service values.

Stop other servers and run check/build/browser commands sequentially:

```sh
bun run check
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run build
bun run test:e2e
bun run test:release
```

The first command validates code and content; the full browser suite uses a real
production-mode local server. `test:release` separately tests production/preview
indexing and a synthetic publication/withdrawal, then restores a noindex build.
It does not deploy, cut over a domain or send a newsletter. Don't run it during
a Netlify deployment or alongside other builds. Read the
[regression guide](../regression-checks.md) for cleanup, skips and report paths.

For manual development preview, override services rather than relying on a
possibly configured local environment:

```sh
NEXT_PUBLIC_SITE_URL=http://localhost:3000 SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run dev
```

Restart after changing slugs or publication state. To manually inspect a finished
local build, use `bun run start -- --hostname 127.0.0.1 --port 3109` with the same
empty service variables and open `http://127.0.0.1:3109`.

## Netlify previews

The existing project is `mikilombardi`, site ID
`cebe5896-585b-41a4-b7e6-6c07af66f2ff`. Link to that project; do not create a new
site for an update. `.netlify` is already gitignored and contains local linkage,
adapter and deploy output. It is not application source.

Preferred routine workflow: push an approved content branch, open a PR, require
green GitHub Actions and inspect its Netlify Deploy Preview. Check the configured
production branch in Netlify before merging; do not infer it from the Git branch
name or assume a local green run proves hosted CI.

For an explicit manual draft review, the verified CLI procedure used by MIC-29
was a **single** build/deploy lifecycle (27.17.0 was verified on 2026-11-13):

```sh
bunx --bun netlify-cli@27.17.0 link --id cebe5896-585b-41a4-b7e6-6c07af66f2ff
NEXT_PUBLIC_SITE_URL=https://www.mikilombardi.com SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bunx --bun netlify-cli@27.17.0 deploy --context deploy-preview --alias content-review --env NEXT_PUBLIC_SITE_URL=https://www.mikilombardi.com --env SITE_INDEXING=disabled --env NEXT_PUBLIC_GA_MEASUREMENT_ID= --env BREVO_API_KEY= --env BREVO_NEWSLETTER_LIST_ID= --env BREVO_DOI_TEMPLATE_ID=
```

This creates a draft; do not add `--prod` or `--prod-if-unlocked`. An alias can be
overwritten by a later draft; record its immutable deploy URL and ID too. Share
only approved public content. A CLI alias is not a Git PR Deploy Preview, and its
reported context can be branch-deploy even when built with preview settings.

The MIC-29 separate offline build plus `deploy --no-build` attempt omitted
generated asset routing. Do not repeat that path: the complete adapter lifecycle
must provide CSS/JS, redirects, headers, functions and image routes. Check actual
styled responses, not only a ready status or HTTP-200 HTML. Never deploy just the
static `public` folder or add an SPA catch-all.

Netlify's [Next.js adapter](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
handles server rendering, API routes, middleware and image delivery. The repository
uses Bun locally and Turbopack for Next builds; Netlify controls the deployed
server runtime. `NODE_VERSION` in the build configuration is not proof of a
particular function runtime. Record what the actual deploy reports.

## Configuration and release gates

| Variable | Where/when | Rule |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Builds and Functions | Approved HTTPS custom canonical origin, no path/query; currently `https://www.mikilombardi.com`. It is public configuration, not a credential. |
| `SITE_INDEXING` | Builds | Keep disabled until the approved custom-host release; enable only for production and rebuild. Preview/alias responses must stay noindex. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Builds | Optional real GA4 web-stream ID; empty in previews. Rebuild after changing. |
| `BREVO_API_KEY` | Functions | Private provider credential, never `NEXT_PUBLIC_`, never issue/commit text. |
| `BREVO_NEWSLETTER_LIST_ID`, `BREVO_DOI_TEMPLATE_ID` | Functions | Actual positive integer IDs for the configured double-opt-in list/template. Empty in read-only previews. |

Use Netlify's protected environment settings for runtime credentials. Values in
`netlify.toml` are build configuration, not a replacement for Function secrets.
The deploy-preview context pins the approved public canonical origin. Keep that
in sync if the real canonical host changes. Do not set the canonical to a
`netlify.app` preview URL: hosted builds intentionally reject it. The current
newsletter checks Origin against the configured canonical, so preview-host
submissions can be rejected; don't weaken that guard to make a demo send email.

`bun run verify:seo` checks the indexing/origin policy. `bun run verify:env`
requires the service configuration and validates formats, not accessibility.
It is expected to fail for a deliberately unconfigured newsletter preview.
`bun run verify:services` performs read-only provider checks using real local
credentials; run it only in the intended service-check environment. It does not
prove email delivery or GA4 access. A real opt-in test must use an explicitly
chosen address/list/template and verify confirmation; it is not part of routine
publishing and no post automatically sends a campaign.

Before initial cutover: obtain owner approval of the reviewed preview, green CI
for the exact commit, normal human browsing through Netlify protection, and the
MIC-31 hosted checklist. Record the configured production branch, current deploy,
rollback source, DNS records/TTL and unrelated services before changing routing.
Do not replace DNS records from an example: MIC-30 must supply actual before/after
values, TLS checks and host-specific redirect decisions. Keep the old site
recoverable without copying Vue into the Next.js app.

For subsequent approved updates, merge the reviewed PR into the **configured**
production branch and let Git continuous deployment build it. Confirm which
commit actually became published. A manual production deploy can be replaced by
the next production-branch push; don't mix those workflows casually. Publication,
indexing and domain changes are distinct decisions.

After a real release, record the commit, immutable deploy, hostname, UTC time,
human/automated evidence and outcome. Check direct routes, legacy/date aliases,
real 404s, full article and case-study content, media/CV, keyboard/touch, search,
RSS/sitemap, canonical/schema and actual default/article/project share PNGs.
Check headers as well as HTML on custom and alias hosts. Local simulation and a
social cache preview are not evidence of live indexing or field performance.

## Recovery: fix forward to a known-good state

| Symptom | First action and recovery |
| --- | --- |
| Build fails before publishing | Read the failed build log; the existing published deploy remains live. Fix the source/configuration and submit a new reviewed commit. There is no failed release to roll back. |
| Bad published content/code | Identify the exact bad Git commit and last verified release, revert the change in Git, rerun checks and deploy the new corrective commit through the same pipeline. |
| Unstyled page or static-asset 404 | Check deploy identity and actual CSS/JS URLs. Rebuild through the full adapter lifecycle; don't patch an SPA rewrite or silence the smoke test. |
| Article remains 404/missing | Check slug, `draft`, UTC date, generated inventory and rebuild/restart. For renamed published URLs, add a deliberate redirect and preservation test. |
| Empty preview sitemap/noindex | Expected in a preview. For an approved production release, verify build context, canonical host and `SITE_INDEXING`, then rebuild; don't globally remove noindex. |
| Newsletter error | Inspect redacted server logs, Origin policy and intended Function configuration. Don't print keys, duplicate contacts or resend real messages as a diagnostic. Reading/publishing does not require Brevo. |
| Netlify verification screen/403 | Record request/challenge ID and ask for normal human review; do not bypass the challenge, disable protection or label the hosted suite green. |
| Layout/animation failure | Preserve readable HTML/static art and reduced motion. Reproduce with the existing gallery, palette, fox and accessibility tests; fix the responsible component. |
| Domain/TLS/routing failure | Follow the recorded MIC-30 DNS recovery plan using its actual saved values and unrelated-service inventory; no generic record values are safe. |

For an ordinary bad commit, use a new recovery branch, replacing `BAD_COMMIT_SHA`
with the verified commit (the following is a procedure, not a command run here):

```sh
git switch -c codex/recover-release
git revert --no-commit BAD_COMMIT_SHA
git diff --cached
git commit -m "revert(release): recover the last verified behaviour"
```

Resolve any conflicts deliberately, then run the same check/build/browser gates
and review the correction before merging. For a merge commit, inspect parents
and choose the correct mainline rather than blindly applying this single-commit
recipe. Do not reset shared history, hand-edit generated exports or treat
`origin/old` as a Next.js application rollback. Reverting a publishing change
cannot retract already sent email, cached social previews or external data.

This recovery procedure creates a new deploy from corrected Git state; it does
not republish an old Netlify deploy pointer or restore its cached settings. Keep
the prior release identity and DNS plan as evidence. A suspected leaked credential
must be removed from output and rotated in its provider/platform; never disable
secret scanning to ship it.
