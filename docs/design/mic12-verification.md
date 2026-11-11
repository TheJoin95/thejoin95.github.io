# Shared shell — MIC-12

Implemented and verified 2026-11-12 against the MIC-11 specification.

## Delivered

- Semantic root header/main/footer, skip link and visible keyboard focus.
- Responsive primary navigation with server-rendered links and exact/nested
  active states. Phone links remain visible; no menu or animation is required.
- Confirmed contact/social destinations and preserved CV with explicit PDF label.
- Shared editorial typography, spacing, square media and white/charcoal surfaces.
  UI colours remain separate from experiment and fox/character palette tokens.
  Character colours are a starting implementation palette for MIC-21 artwork,
  not a claim that final character artwork has been produced.
- PageIntro, Section, ContentState, MediaFrame and ErrorState primitives. Media
  reserves intrinsic dimensions, defaults to contain, keeps captions/credits in
  HTML and provides a missing-source state. Gallery-specific failed-load handling
  and controls remain with MIC-13; native image alt remains available on failure.
- Useful global 404, error/retry and loading patterns. Existing experience and
  newsletter-confirmation routes now use the single shared main landmark.
- Introductory Work, Journal, Play and About routes using MIC-10 facts so every
  primary link has a real destination. Home uses the shared shell and retains
  the newsletter and experience link. This does not complete those page tickets.

## Verification

- `bun run check`: lint, generated route types, TypeScript and **51 unit tests**
  pass (10 added). Reported unit coverage is 100% for imported/exercised modules;
  it does not measure all application code or browser behaviour.
- `bun run build`: production Turbopack build passes. Analytics and Brevo values
  were explicitly disabled; no email, contact, deployment or DNS change occurred.
- `bun run test:e2e`: **9 Chromium browser tests** pass. The browser suite visits
  six routes at 320, 390, 768, 1024, 1200 and 1440 CSS px, checking a single main/H1,
  usable primary links, 44px targets, active pages and no body overflow. Separate
  checks cover keyboard skip/navigation, client transitions, no-script navigation,
  a 200 PDF response, a 404 response/recovery, 200% text and reduced motion.
- Captured 15 local full-page screenshots: five introductory pages at 390, 834
  and 1440px. Inspected representative Home/Play desktop, Journal tablet and
  Work/About phone renders. Found and corrected crowded desktop social links.
  Capture session reported no browser page errors.
- Impeccable mechanical detector returned no findings. `git diff --check` passes.
- CI now installs Chromium and runs browser checks after the existing unit
  checks/build, preserving failure traces/screenshots as artifacts.

## Remaining work

MIC-13–20 implement real galleries, full page content, readers, migrated articles
and the sketchbook. MIC-21–23 supply original characters and the signature Three.js
palette experience; the current demo is retained, not treated as that finished
experience. MIC-25 implements complete SEO/GEO, OG image/card and discovery routes.

MIC-26/29 still need physical touch, screen-reader, cross-engine and final full-page
mockup comparison. Resized Chromium views are layout evidence, not physical iOS or
Android gesture evidence. The shared empty/error/loading primitives have unit
coverage; forced production server failures have not been injected in the browser.

Use `bun --bun playwright install chromium`, `bun run build`, then
`bun run test:e2e` to reproduce browser checks. The config starts a local production
server on port 3109 with service delivery disabled; tests do not submit live email.
