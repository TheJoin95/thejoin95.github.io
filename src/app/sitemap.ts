import { publishedArticles } from "@/lib/journal-server";
import { sitemapEntries } from "@/lib/discovery";
import { siteOrigin, siteIndexable } from "@/lib/seo-config";
export default async function sitemap() {
  "use cache";
  return sitemapEntries(await publishedArticles(), siteOrigin(), siteIndexable(), new Date());
}
