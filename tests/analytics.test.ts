import { expect, test } from "bun:test";
import { analyticsEnabled, analyticsMeasurementId, umamiScriptUrl, umamiWebsiteId } from "@/lib/analytics";

test("GA4 requires a production build on the canonical origin with a valid measurement ID", () => {
  const origin = "https://portfolio.example";
  const production = {
    NODE_ENV: "production",
    NEXT_PUBLIC_SITE_URL: origin,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TESTPORTFOLIO",
  };
  expect(analyticsMeasurementId(origin, production)).toBe("G-TESTPORTFOLIO");
  for (const otherOrigin of ["https://deploy-preview-42--portfolio.netlify.app", "https://www.portfolio.example", "http://portfolio.example"]) {
    expect(analyticsMeasurementId(otherOrigin, production)).toBeUndefined();
  }
  for (const override of [
    { NODE_ENV: "development" },
    { NEXT_PUBLIC_VERCEL_ENV: "preview" },
    { NEXT_PUBLIC_GA_MEASUREMENT_ID: "" },
    { NEXT_PUBLIC_GA_MEASUREMENT_ID: "invalid" },
  ]) {
    expect(analyticsMeasurementId(origin, { ...production, ...override })).toBeUndefined();
  }
});

test("Umami is enabled by default only on the canonical production origin", () => {
  const origin = "https://portfolio.example";
  const production = { NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: origin };
  expect(analyticsEnabled(origin, production)).toBe(true);
  expect(umamiScriptUrl).toBe("https://analytics.chromatique.cc/script.js");
  expect(umamiWebsiteId).toBe("919eff20-33a5-4c0a-a86b-0b574960ecc9");
  for (const otherOrigin of ["https://deploy-preview-42--portfolio.netlify.app", "https://www.portfolio.example", "http://portfolio.example"]) {
    expect(analyticsEnabled(otherOrigin, production)).toBe(false);
  }
  for (const localOrigin of ["https://localhost", "https://127.0.0.1", "https://preview.netlify.app", "https://preview.vercel.app"]) {
    expect(analyticsEnabled(localOrigin, { ...production, NEXT_PUBLIC_SITE_URL: localOrigin })).toBe(false);
  }
  expect(analyticsEnabled(origin, { ...production, NODE_ENV: "development" })).toBe(false);
  expect(analyticsEnabled(origin, { ...production, NEXT_PUBLIC_VERCEL_ENV: "preview" })).toBe(false);
});
