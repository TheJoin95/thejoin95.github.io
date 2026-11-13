# Miki Lombardi website

Next.js App Router + React + TypeScript, managed with Bun. Tailwind CSS and
Radix-based shadcn/ui provide the UI foundation. Google Analytics 4 handles optional
analytics; Brevo handles newsletter double opt in. The palette comparison uses
HTML images and native controls; dotLottie supports small animations.

The [technical approach](docs/technical-approach.md) records the portfolio/Journal
content and route contracts, existing-work review and remaining ticket handoffs.
Use the [preview runbook](docs/preview-workflow.md) to review a production-mode
build locally with analytics and newsletter delivery disabled.

The [MIC-10 content handoff](docs/content/README.md) contains the sourced project
inventory, featured case-study drafts, page copy and authentic-media requirements.
The existing CV is preserved at `/miki-lombardi-resume.pdf`; content integrity and
CV preservation checks run with the Bun test suite.

The [MIC-11 design contract](docs/design/responsive-layouts.md) specifies phone,
tablet and desktop compositions, shared tokens, interaction/failure states,
motion, social images and the acceptance tests required by implementation tickets.

The shared editorial shell now provides navigation, footer, page intros, semantic
sections, media frames and empty/loading/error states. Work, Journal, Play and
About provide galleries, preserved articles, the HTML palette stage, original
character artwork and social images. Palette tokens live in `src/app/globals.css`;
contact/navigation destinations live in `src/lib/site.ts`.

Browser checks run against a production build:

```sh
bun --bun playwright install chromium firefox webkit
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3109 SITE_INDEXING=disabled bun run build
bun run test:e2e
```

CI installs the three browser engines and runs these checks after the unit suite and build.
Tests cover six viewport widths, keyboard/skip navigation, no-script access,
large text/reduced motion, the CV and 404. They do not replace physical-device
touch or screen-reader review.

The [MIC-27 performance record](docs/performance/mic27-performance.md) contains
repeatable mobile lab measurements, before/after data and the remaining hosted
and field checks. Use `bun scripts/measure-performance.ts` and
`bun scripts/measure-interactions.ts` with a production server running locally.

Reusable project galleries now live in `src/components/gallery`; Work includes
the first gallery with credited ImageGoNord UI captures. See the
[gallery API and verification](docs/design/mic13-galleries.md) and
[media provenance](docs/content/media-provenance.md). Browser checks also build
an isolated test fixture under `.test-fixtures` (never served by the website).
Interactive gallery coverage is verified in Playwright; Bun coverage remains
scoped to the pure model, server fallback and other imported unit-tested modules.

The [MIC-14 homepage record](docs/design/mic14-homepage.md) documents the editorial
Home, real static palette study, shared selected-project records, selected writing
and branded social image. The signature HTML comparison and original mascot
have their own implementation records. Static page content works without JavaScript; opt into
the shared loading presentation only at an enhancement boundary.

## Local development

Use Bun **1.4.4 or newer** (the expected version is in `.bun-version`).

```sh
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open http://localhost:3000. No external service is needed to run the app.
Newsletter submissions return an unavailable message until configured.

```sh
bun run check   # ESLint, generated Next.js route types, TypeScript, Bun tests
bun run build  # production build
bun run start  # serve the production build
```

### Bun workflow

Bun 1.4.4 is the latest stable version verified for this project. `.bun-version`,
`packageManager`, Netlify, and CI pin that tested release for reproducible builds.
When upgrading, run `bun upgrade`, update those version pins together, and rerun
the checks. `bunfig.toml` uses Bun's runtime and shell for every package script,
including CLI tools with Node shebangs. Bun manages the text lockfile, and new
dependencies are saved with exact versions.

```sh
bun add <package>                # package manager
bun run test:watch               # Bun watch mode
bun run test:coverage            # coverage report and coverage/lcov.info
bun run test:ci                  # coverage thresholds, fail fast
bun run verify:env               # validate .env formats, never print values
bun run verify:services          # read-only Brevo authentication/list/template checks
bun run build:tools              # Bun bundler -> dist/tools/verify-env.js
bun dist/tools/verify-env.js     # run the bundled checker
```

The test preload clears service credentials and blocks unexpected network calls.
Newsletter tests mock Brevo; environment tests cover invalid URLs and IDs. Coverage
thresholds apply to the application modules exercised by unit tests, not the entire
UI. The GitHub Actions workflow installs via Bun, checks types/lint/tests, builds
the app, and uploads coverage without service secrets.

The application remains Next.js: **Turbopack builds its routes and React Server
Components**. Bun's bundler builds the standalone environment checker with
environment inlining explicitly disabled. `bun build` cannot replace the Next.js
application build. Netlify uses Bun for dependencies and builds, and its Next.js
adapter controls the deployed Node.js serverless runtime. A Bun-only application
bundler and deployed runtime would require changing the framework/hosting setup.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the deployed site's origin. Public variables are
embedded at build time; rebuild after changing them. Keep `.env.local` untracked.

### Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your GA4 web stream's measurement ID
(for example, `G-XXXXXXXXXX`). The official `@next/third-parties/google`
integration loads Google Analytics after hydration. Tracking is disabled when
the ID is missing or invalid, in development, and on Vercel preview deployments.
No subscriber email is sent to analytics.

In GA4, enable Enhanced Measurement and its "Page changes based on browser
history events" setting to track Next.js client-side navigation. Do not also
send manual pageviews or install another Google tag for the same stream.
Connect your site's consent management before enabling analytics where required.
After deployment, verify pageviews in GA4 Realtime or DebugView.
See [Next.js's Google Analytics guide](https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics).

### Newsletter

Configure the server environment privately:

- `BREVO_API_KEY`: a Brevo API key with the necessary contact/transactional access.
- `BREVO_NEWSLETTER_LIST_ID`: the destination list's positive integer ID.
- `BREVO_DOI_TEMPLATE_ID`: the double opt-in template's positive integer ID.

The template must contain Brevo's confirmation link and use an authenticated
sender. The browser submits to `/api/newsletter`; only the server contacts Brevo.
Subscribers are added through the confirmation flow, then redirected to
`/newsletter/confirmed`. The route validates inputs, limits request size, checks
the origin, uses a honeypot, and handles provider errors/timeouts. Add hosting-level
rate limiting or bot protection before exposing the endpoint to substantial public
traffic. Origin checks and a honeypot do not replace rate limiting.

No live emails or contacts are created by setup or tests. The tests mock Brevo.
Complete an actual opt-in check with your own address after configuring the service.
See [Brevo's DOI API](https://developers.brevo.com/reference/create-doi-contact).

`bun run verify:services` checks authentication, list access, and an active
template containing a recognized double opt-in link using GET requests only.
If Brevo returns 401 for an unrecognized IP, authorize the request under Brevo's
API security settings. When deploying, check the rules against Netlify's outbound
networking as well. The checker redacts response bodies and credentials. It does
not prove email delivery or GA4 property access.

### Palette comparison and animations

Home and Play share an HTML image/palette comparison with a labelled native
range, endpoint buttons and reset. It works without a canvas or GPU runtime;
without JavaScript it retains the initial comparison and project link.
The owner removed 3D on 2026-11-13. `/experience` permanently redirects to `/play`.

`LottieAnimation` in `src/components/animations` is a lazy, viewport-aware,
decorative player. Put `.lottie` assets in `public/animations` and provide a
static fallback and fixed dimensions. Original fox clips live in
`public/animations/fox`; `build:fox` reproduces them and the local WASM runtime
at `/animations/runtime/dotlottie-player.wasm`. The player does not need a CDN.

```tsx
<LottieAnimation
  src="/animations/check.lottie"
  className="size-12"
  fallback={<span>✓</span>}
/>
```

Add more UI primitives using the Radix configuration in `components.json`:

```sh
bunx --bun shadcn@latest add dialog
```

## Previous website

The old site lives on **`origin/old`**, the reference for all previous articles,
titles, text, assets, and URL structure. This convention is also recorded in
`AGENTS.md` for future project chats.

```sh
git ls-tree -r --name-only origin/old
git show origin/old:src/assets/articles.json
git show origin/old:src/views/About.vue
```

## Deployment

Deploy to a host supporting the Next.js server runtime, such as Vercel, Netlify,
or a Node/Bun server. **GitHub Pages alone cannot run the newsletter API.** This
scaffold deliberately does not use `output: "export"`. To retain GitHub Pages,
move the subscription handler to an external service first.

Set the service variables on the hosting platform and run `bun run build`.
Deployment and the old site's custom-domain migration are outside this scaffold.

### Netlify

`netlify.toml` sets the build command to `bun run build`, publishes `.next`, and
pins Bun 1.4.4 and Node.js 22. Installs use the frozen Bun lockfile. Netlify
automatically applies its Next.js adapter to run the newsletter API.
See [Netlify's Next.js documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

Netlify deployment is already configured for `mikilombardi`. The custom domain
still serves the old site; domain cutover remains a separate release step.
Verify the production branch and pull-request previews before release.
In Netlify's environment variable settings, configure:

| Variable | Scope | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Builds and Functions | Live HTTPS origin, without a path |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Builds | Production GA4 measurement ID, optional |
| `BREVO_API_KEY` | Functions | Private Brevo API key |
| `BREVO_NEWSLETTER_LIST_ID` | Functions | Newsletter list ID |
| `BREVO_DOI_TEMPLATE_ID` | Functions | Double opt-in template ID |

Set production values in the production context. The configuration disables GA4
on deploy previews and branch deploys. To test newsletter signup on previews,
give that context its own site origin matching the preview URL and preferably
a separate Brevo list/template; otherwise leave Brevo unconfigured there.
Runtime secrets belong in Netlify's UI: values in `netlify.toml` are build-time
configuration, not Function secrets. Rebuild after changing public variables.

After the first deployment, test a real newsletter opt-in and check GA4 Realtime.
No Netlify site or deployment is created by adding this configuration.
