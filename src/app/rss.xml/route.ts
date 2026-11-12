import { publishedArticles } from "@/lib/journal-server";
import { journalFeed } from "@/lib/discovery";
import { siteOrigin } from "@/lib/seo-config";
async function feedXml() {
  "use cache";
  return journalFeed(await publishedArticles(), siteOrigin(), new Date());
}
export async function GET() {
  return new Response(await feedXml(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "X-Robots-Tag": "noindex" } });
}
