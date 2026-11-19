import { expect, test } from "bun:test";
import { analyticsMeasurementId } from "@/lib/analytics";

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
