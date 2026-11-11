import { describe, expect, test } from "bun:test";
import { validateEnvironment } from "../src/lib/environment";

const configured = {
  NEXT_PUBLIC_SITE_URL: "https://example.com",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST123",
  BREVO_API_KEY: "test-key",
  BREVO_NEWSLETTER_LIST_ID: "12",
  BREVO_DOI_TEMPLATE_ID: "34",
};

describe("environment validation", () => {
  test("accepts valid config and converts IDs", () => {
    const result = validateEnvironment(configured);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.BREVO_NEWSLETTER_LIST_ID).toBe(12);
  });
  test("allows local development and analytics disabled", () => {
    expect(validateEnvironment({ ...configured, NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "" }).success).toBe(true);
  });
  test.each(["file:///tmp/site", "https://user:pass@example.com", "https://example.com/path",
    "https://example.com/?email=private", "https://example.com/#fragment", "invalid"])(
    "rejects unsafe or incorrect origin: %s", (origin) => {
      expect(validateEnvironment({ ...configured, NEXT_PUBLIC_SITE_URL: origin }).success).toBe(false);
    },
  );
  test.each(["0", "-1", "1.2", "1e2", "9007199254740992", "", "abc"])(
    "rejects invalid Brevo IDs: %s", (id) => {
      expect(validateEnvironment({ ...configured, BREVO_NEWSLETTER_LIST_ID: id }).success).toBe(false);
      expect(validateEnvironment({ ...configured, BREVO_DOI_TEMPLATE_ID: id }).success).toBe(false);
    },
  );
  test("rejects missing credentials", () => {
    expect(validateEnvironment({ ...configured, BREVO_API_KEY: " " }).success).toBe(false);
  });
  test("rejects invalid measurement ID", () => {
    expect(validateEnvironment({ ...configured, NEXT_PUBLIC_GA_MEASUREMENT_ID: "UA-123" }).success).toBe(false);
  });
});
