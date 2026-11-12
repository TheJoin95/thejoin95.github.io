import { caseStudyPath, publishedCaseStudies } from "@/content/case-studies";
import type { MetadataRoute } from "next";
import { Feed } from "feed";
import { visibleArticles, type JournalArticle } from "./journal";
import { publicPages } from "./seo";
export function sitemapEntries(articles: JournalArticle[], origin: string, indexable: boolean, now: Date): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return [...publicPages.map(path => ({ url: new URL(path, origin).href })),
    ...publishedCaseStudies.map(story => ({ url: new URL(caseStudyPath(story.project), origin).href })),
    ...visibleArticles(articles, now).map(article => ({ url: new URL(`/blog/${article.slug}`, origin).href, lastModified: article.updated || article.date }))];
}
export function journalFeed(articles: JournalArticle[], origin: string, now: Date) {
  const published = visibleArticles(articles, now);
  const updated = published.map(article => article.updated || article.date).sort().at(-1);
  const feed = new Feed({ title: "Miki Lombardi — Journal", description: "Notes on software, architecture, open source and learning by making.",
    id: new URL("/blog", origin).href, link: new URL("/blog", origin).href, language: "en", copyright: "Miki Lombardi",
    feedLinks: { rss: new URL("/rss.xml", origin).href },
    // Genuine article dates, never a synthetic migration/build freshness signal.
    ...(updated ? { updated: new Date(updated) } : {}),
  });
  for (const article of published) feed.addItem({ title: article.title, id: new URL(`/blog/${article.slug}`, origin).href,
    link: new URL(`/blog/${article.slug}`, origin).href, description: article.description, date: new Date(article.date),
    author: [{ name: "Miki Lombardi", email: "miki.lombi@gmail.com", link: new URL("/about", origin).href }], category: article.tags.map(name => ({ name })) });
  return feed.rss2();
}
