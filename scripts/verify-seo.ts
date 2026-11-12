import { seoConfiguration } from "../src/lib/seo-config";
try {
  const config = seoConfiguration(process.env);
  console.log(`PASS canonical origin format; indexing ${config.indexable ? "enabled" : "disabled"} (values redacted)`);
} catch (error) {
  console.error(`FAIL SEO configuration: ${error instanceof Error ? error.message : "invalid"}`);
  process.exit(1);
}
