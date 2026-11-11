import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3109", screenshot: "only-on-failure", trace: "retain-on-failure" },
  webServer: {
    command: "bun run start -- --hostname 127.0.0.1 --port 3109",
    url: "http://127.0.0.1:3109",
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: "", BREVO_API_KEY: "", BREVO_NEWSLETTER_LIST_ID: "", BREVO_DOI_TEMPLATE_ID: "" },
  },
});
