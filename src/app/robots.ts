import type { MetadataRoute } from "next";
import { siteOrigin, siteIndexable } from "@/lib/seo-config";
export default function robots(): MetadataRoute.Robots {
  // Allow retrieval of noindex headers. Disallowing crawl could hide those rules.
  return { rules: { userAgent: "*", allow: "/" }, ...(siteIndexable() ? { sitemap: new URL("/sitemap.xml", siteOrigin()).href } : {}) };
}
