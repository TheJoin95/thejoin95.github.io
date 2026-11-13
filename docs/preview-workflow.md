# Local and hosted preview workflow

## Fresh checkout

Install the exact Bun version in `.bun-version` (currently 1.4.4), then run:

```sh
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000`. Keep Brevo and GA4 empty for an isolated preview.
External services are optional for page rendering. Do not copy production secrets
into review environments. `.env.local` is ignored; never commit it.

## Production-mode local preview

Stop the development server before building in the same checkout. Run:

```sh
bun run check
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run build
bun run test:e2e
bun run test:release
```

The explicit empty variables override local service configuration during build;
the test server and release runner also clear credentials and analytics. The
release runner restores a clean noindex build after testing synthetic content.
Public variables are baked into the build. Do not run these commands concurrently
or leave another server listening on port 3109.

For manual review after the checks, start `bun run start -- --hostname 127.0.0.1
--port 3109` with the same empty service variables and open
`http://127.0.0.1:3109`. Stop the server with Ctrl-C when review is complete.

| Check | Expected current result |
| --- | --- |
| Direct visit/refresh of `/`, `/work`, `/play`, `/blog`, `/about` | 200, readable page and native navigation |
| `/experience` | 308 to `/play`; no 3D runtime |
| Original article and published project story | 200, correct title/content/metadata |
| `/newsletter/confirmed` | 200, confirmation page |
| Unknown article/story/URL | HTTP 404 |
| Invalid newsletter email | Validation message; no email |
| Valid email with service variables empty | 503, unavailable message; no email |
| JSON POST with a different Origin | 403 |
| Reduced motion | Static fox; direct HTML palette controls stay available |

Check keyboard/focus, gallery and native touch controls, original fox reactions,
media failures and console errors. A confirmation page visit does not prove
actual double-opt-in delivery. The [regression coverage map](regression-checks.md)
records automated proof, report locations and remaining human/hosted checks.
The local-only publishing fixtures are removed automatically; do not deploy them.

## Hosted review handoff — MIC-7

The [MIC-29 review](design/mic29/README.md) now links a ready, noindex Netlify
draft of the implemented site, with comparison captures and known limitations.
Its production deploy and DNS were left unchanged. Use one build/deploy lifecycle
for the Next.js adapter; a separate `deploy --no-build` upload omitted generated
asset routes during this review. The preview context pins the approved public
canonical origin in `netlify.toml`; it is separate from production configuration.

Netlify deployment is already configured. A read-only project lookup on 2026-11-11
confirmed a ready current deploy for `mikilombardi`; the user reports the custom
domain still points at the old version. Open a pull request from a feature
branch. CI uses the pinned Bun version, frozen install, `bun run check` and
`bun run build`. Netlify should create a Deploy Preview using the existing build
configuration. Pull-request Deploy Previews still need to be exercised in MIC-7;
a ready current deploy alone does not prove that workflow.

Set the approved HTTPS custom canonical origin before building; preview contexts stay noindex. Keep GA4 blank (already configured
for deploy previews/branch deploys). Leave Brevo blank for read-only review; any
delivery testing needs a separate list/template and an explicitly chosen address.
Never expose production drafts or credentials in a public preview. Implement
private content preview/access as part of MIC-6/MIC-7.

Review direct URL loads, refreshes, assets, 404 status, server endpoint behaviour
and the content publishing cycle. Once the page tickets exist, compare all five
mockups at phone/tablet/desktop widths and test galleries with keyboard, touch and
reduced motion. Record commit, preview URL, check results, screenshots and known
deviations in the review. A local build is not Netlify runtime verification.

Do not change the live domain, production routing or GitHub Pages during this
workflow. Hosting cutover and rollback belong to MIC-30 after preview review.
