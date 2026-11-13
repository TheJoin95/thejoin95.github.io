import { defineConfig } from "@playwright/test";

const reportDirectory = `test-results/${process.env.CHECK_NAME || "regression"}`;
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  outputDir: `${reportDirectory}/artifacts`,
  reporter: [["list"], ["junit", { outputFile: `${reportDirectory}/junit.xml` }], ["html", { outputFolder: `${reportDirectory}/html`, open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3109", screenshot: "only-on-failure", trace: "retain-on-failure" },
  webServer: process.env.REVIEW_BASE_URL ? undefined : {
    command: "bun run start -- --hostname 127.0.0.1 --port 3109",
    url: "http://127.0.0.1:3109",
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: "", BREVO_API_KEY: "", BREVO_NEWSLETTER_LIST_ID: "", BREVO_DOI_TEMPLATE_ID: "" },
  },
});
