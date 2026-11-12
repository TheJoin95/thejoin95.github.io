import { mock } from "bun:test";
mock.module("server-only", () => ({}));
// Tests must never use credentials from a developer's .env or contact a service.
process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
process.env.BREVO_API_KEY = "";
process.env.BREVO_NEWSLETTER_LIST_ID = "";
process.env.BREVO_DOI_TEMPLATE_ID = "";
globalThis.fetch = (() => {
  throw new Error("Unexpected network request in unit test. Mock fetch explicitly.");
}) as unknown as typeof fetch;
