import { validateEnvironment } from "../src/lib/environment";

// Print field names and status only; never values or provider response bodies.
const result = validateEnvironment(process.env);
if (!result.success) {
  for (const issue of result.error.issues) console.error(`FAIL ${issue.path.join(".")}: invalid or missing`);
  process.exit(1);
}
const env = result.data;
console.log("PASS environment formats (values redacted)");
console.log(env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? "PASS GA4 ID format; property access is not verified" : "INFO GA4 disabled");
const url = new URL(env.NEXT_PUBLIC_SITE_URL);
if (process.argv.includes("--production") && url.protocol !== "https:") {
  console.error("FAIL production site URL must use HTTPS");
  process.exit(1);
}
if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
  console.log("INFO site origin is configured for local development; change it before deployment");
}

if (process.argv.includes("--remote")) {
  const checks = [
    { label: "Brevo authentication", path: "account" },
    { label: "Brevo newsletter list", path: `contacts/lists/${env.BREVO_NEWSLETTER_LIST_ID}` },
    { label: "Brevo double opt-in template", path: `smtp/templates/${env.BREVO_DOI_TEMPLATE_ID}` },
  ];
  let failed = false;
  for (const check of checks) {
    try {
      const response = await fetch(`https://api.brevo.com/v3/${check.path}`, {
        headers: { "api-key": env.BREVO_API_KEY, Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        console.error(`FAIL ${check.label}: HTTP ${response.status}`);
        if (response.status === 401) {
          const body = await response.json().catch(() => null);
          const message = typeof body?.message === "string" ? body.message : "";
          console.error(/ip address|unrecogni[sz]ed ip|unauthori[sz]ed ip/i.test(message)
            ? "INFO Brevo requires this request's IP to be authorized in its API security settings"
            : "INFO check that the configured REST API key is active and valid");
        }
        failed = true;
        continue;
      }
      const data = await response.json();
      console.log(`PASS ${check.label}: accessible`);
      if (check.path.startsWith("smtp/templates/")) {
        if (data.isActive !== true) {
          console.error("FAIL Brevo template is inactive");
          failed = true;
        }
        if (!/\{\{\s*(?:params\.DOIurl|doubleoptin)\s*\}\}/i.test(data.htmlContent || "")) {
          console.error("FAIL template lacks a recognized double opt-in confirmation link");
          failed = true;
        }
      }
    } catch {
      console.error(`FAIL ${check.label}: request failed or timed out`);
      failed = true;
    }
  }
  console.log("INFO read-only checks: no contacts created and no emails sent");
  if (failed) process.exit(1);
}
