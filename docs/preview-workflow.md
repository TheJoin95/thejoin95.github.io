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
NEXT_PUBLIC_SITE_URL=http://localhost:3109 NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run build
NEXT_PUBLIC_SITE_URL=http://localhost:3109 NEXT_PUBLIC_GA_MEASUREMENT_ID= BREVO_API_KEY= BREVO_NEWSLETTER_LIST_ID= BREVO_DOI_TEMPLATE_ID= bun run start -- --hostname 127.0.0.1 --port 3109
```

The explicit empty variables override any local service configuration. Public
variables are baked into the build, so set them before both build and start.
Use `http://localhost:3109` in the browser so form origins match the configured
site origin. Stop the server with Ctrl-C when review is complete. No deployment
or production configuration change is involved.

| Check | Expected result in the existing scaffold |
| --- | --- |
| Direct visit and refresh of `/` | 200, holding page, experience link and newsletter form |
| `/experience` | 200, lazy 3D demo, usable fallback if WebGL fails |
| `/newsletter/confirmed` | 200, confirmation page |
| An unknown URL | 404 |
| Invalid newsletter email | Validation message; no email |
| Valid email with the service variables empty | 503, unavailable message; no email |
| Valid JSON POST with a different Origin | 403 |
| Reduced motion | 3D automatic motion reduced; Lottie static fallback when used |

Check keyboard focus/order and the browser console. The Lottie component exists
but has no supplied artwork or rendered demo; do not report its visual review as
complete. A confirmation page visit alone does not prove double opt-in delivery.

The fixture set for MIC-6/MIC-14–20 should include one verified project, one real
legacy article (the microfrontend article is referenced by the Journal mockup), an
archived project and one local-only draft. Use the same data retrieval paths
as production. Include sketchbook content only once authorship is confirmed.
Until those tickets are implemented, `/work`, `/play`, `/blog` and `/about` are
planned routes and are expected to return 404.

## Hosted review handoff — MIC-7

Netlify deployment is already configured. A read-only project lookup on 2026-11-11
confirmed a ready current deploy for `mikilombardi`; the user reports the custom
domain still points at the old version. Open a pull request from a feature
branch. CI uses the pinned Bun version, frozen install, `bun run check` and
`bun run build`. Netlify should create a Deploy Preview using the existing build
configuration. Pull-request Deploy Previews still need to be exercised in MIC-7;
a ready current deploy alone does not prove that workflow.

Set the preview's public origin before building. Keep GA4 blank (already configured
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
