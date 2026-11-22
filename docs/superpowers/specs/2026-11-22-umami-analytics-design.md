# Umami analytics

Status: approved for implementation, 2026-11-22.

## Intent and scope

Add the requested Umami website tracker to the Next.js site so visits and
interactions are visible in Umami, without adding a cookie-consent prompt. Keep
the existing GA4 integration and its named contact, CV download and newsletter
events; the user chose both providers. Restrict Umami to the canonical
production origin, matching the current GA4 policy, so preview and local
activity do not pollute production analytics.

Use Umami's automatic pageviews for direct loads and App Router navigation.
Also record link/button interactions sitewide and continue sending the existing
named events to both providers. Generic click events include only a safe element
kind and current pathname; do not send form values, click text, or target URLs.
The tracker uses the supplied script URL and website ID. Do not collect
identifying user/session data or bypass browser Do Not Track settings.

## Approaches

The user selected retaining GA4 and adding Umami. Replacing GA4 would avoid
duplicate provider collection but discard the existing integration and its
historical continuity. Keeping both preserves it, at the cost of duplicate
analytics collection. Do not add a new analytics library or consent UI.

## Implementation and verification

Load the Umami script from the root layout using the installed Next.js script
component, with deferred/after-interactive loading and the supplied website ID.
Extend the existing analytics boundary to send click and named interaction
events to Umami while preserving GA4 behavior. Document the two providers and
the production-origin rule in the README.

Add automated coverage for provider gating, script attributes, automatic
pageview/navigation tracking, clicks and existing named events; ensure the
preview origin remains excluded. Run `bun run check` and `bun run build`.

## Non-goals and remaining implementation calls

No consent banner, event-property collection from form inputs, user
identification, session replay, or unrelated analytics redesign. The builder
may choose the smallest testable implementation consistent with the site's
existing patterns.
