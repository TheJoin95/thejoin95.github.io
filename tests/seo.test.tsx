import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { seoConfiguration } from "@/lib/seo-config";
import { articleMetadata, pageMetadata, publicPages, serializeStructuredData } from "@/lib/seo";
import { journalFeed, sitemapEntries } from "@/lib/discovery";
import { parseArticle, publishedArticles } from "@/lib/journal";
import { TitleCard } from "@/components/social/title-card";
import { workStructuredData } from "@/content/work";
import robots from "@/app/robots";
const origin = "https://example.com";
const now = new Date("2026-11-12T00:00:00Z");
const release = { NEXT_PUBLIC_SITE_URL: origin, SITE_INDEXING: "enabled", NETLIFY: "true", CONTEXT: "production" };
describe("canonical origin and indexing policy", () => {
  test("local development is usable and indexing is an explicit release decision", () => {
    expect(seoConfiguration({})).toEqual({ origin: "http://localhost:3000", indexable: false });
    expect(seoConfiguration({ NEXT_PUBLIC_SITE_URL: origin })).toEqual({ origin, indexable: false });
    expect(seoConfiguration(release)).toEqual({ origin, indexable: true });
    for (const CONTEXT of ["deploy-preview", "branch-deploy", "dev", ""]) expect(seoConfiguration({ ...release, CONTEXT }).indexable).toBe(false);
    expect(seoConfiguration({ ...release, NEXT_PUBLIC_SITE_URL: `${origin}/` }).origin).toBe(origin);
  });
  test("bad release origins and configuration fail without reflecting secrets", () => {
    for (const NEXT_PUBLIC_SITE_URL of [undefined, "", "invalid", "https://user:secret@example.com", "file:///tmp/site", "https://example.com/path", "https://example.com/?x=1", "https://example.com/#a", "http://example.com", "http://localhost:3000", "https://127.0.0.1", "https://demo.netlify.app"]) {
      expect(() => seoConfiguration({ ...release, NEXT_PUBLIC_SITE_URL })).toThrow();
    }
    expect(() => seoConfiguration({ NEXT_PUBLIC_SITE_URL: origin, SITE_INDEXING: "yes" })).toThrow();
    for (const NEXT_PUBLIC_SITE_URL of ["http://example.com", "https://localhost", "https://demo.netlify.app"]) expect(() => seoConfiguration({ NEXT_PUBLIC_SITE_URL, SITE_INDEXING: "enabled" })).toThrow();
    expect(() => seoConfiguration({ NETLIFY: "true", NEXT_PUBLIC_SITE_URL: "http://example.com" })).toThrow();
  });
});
describe("shared metadata, schema and discovery", () => {
  test("page metadata has absolute canonical/social/feed URLs and a working default image contract", () => {
    for (const path of publicPages) {
      const metadata = pageMetadata({ title: "Test", description: "Useful summary", path });
      expect(metadata.alternates?.canonical).toBe(new URL(path, origin).href);
      expect(metadata.openGraph).toMatchObject({ type: "website", url: new URL(path, origin).href, description: "Useful summary", images: [{ url: `${origin}/opengraph-image`, alt: expect.any(String), width: 1200, height: 630 }] });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: `${origin}/opengraph-image` }] });
    }
    expect(pageMetadata({ title: "Project", description: "Summary", path: "/work", image: "/share/projects/imagegonord", imageAlt: "ImageGoNord" }).openGraph).toMatchObject({ images: [{ url: `${origin}/share/projects/imagegonord`, alt: "ImageGoNord" }] });
  });
  test("article metadata dates agree with the preserved writing and genuine updates remain optional", () => {
    const article = publishedArticles()[0];
    const metadata = articleMetadata(article);
    expect(metadata.openGraph).toMatchObject({ type: "article", title: article.title, publishedTime: article.date, authors: [`${origin}/about`] });
    expect(metadata.openGraph).not.toHaveProperty("modifiedTime");
    expect(articleMetadata({ ...article, updated: "2022-01-01" }).openGraph).toMatchObject({ modifiedTime: "2022-01-01" });
    expect(metadata.authors).toEqual([{ name: "Miki Lombardi", url: `${origin}/about` }]);
    expect(serializeStructuredData({ text: "</script><script>bad()</script>" })).not.toContain("<");
  });
  test("only public canonical pages and published articles enter the release sitemap", () => {
    const articles = publishedArticles();
    const hidden = [ { ...articles[0], slug: "draft", draft: true }, { ...articles[0], slug: "future", date: "2999-01-01" } ];
    expect(sitemapEntries([...articles, ...hidden], origin, false, now)).toEqual([]);
    const map = sitemapEntries([...articles, ...hidden], origin, true, now);
    expect(map).toHaveLength(22);
    expect(new Set(map.map(item => item.url)).size).toBe(22);
    expect(map.every(item => item.url.startsWith(origin) && !/[?#]/.test(item.url))).toBe(true);
    expect(map.some(item => /draft|future|confirmed|whoami|2021-04-16/.test(item.url))).toBe(false);
    expect(map.slice(0, 6).every(item => !item.lastModified)).toBe(true);
    expect(sitemapEntries([{ ...articles[0], updated: "2022-01-01" }], origin, true, now).at(-1)?.lastModified).toBe("2022-01-01");
  });
  test("RSS escapes authored values and excludes private/future records without synthetic freshness", () => {
    const article = parseArticle('---\ntitle: "A & B < C"\ndescription: "A useful & accurate <summary>"\ndate: 2020-01-01\ntags: ["A & B"]\n---\nBody', "test");
    const xml = journalFeed([article, { ...article, slug: "draft", draft: true }, { ...article, slug: "future", date: "2999-01-01" }], origin, now);
    expect(xml.match(/<item>/g)).toHaveLength(1);
    expect(xml).toContain("<![CDATA[A & B < C]]>");
    expect(xml).toContain("<category>A &amp; B</category>");
    expect(xml).toContain("miki.lombi@gmail.com (Miki Lombardi)");
    expect(xml).toContain('rel="self"');
    expect(xml).toContain(`${origin}/blog/test`);
    expect(xml).toContain("Wed, 01 Jan 2020");
    expect(xml).not.toContain("12 Nov 2026");
    expect(journalFeed([], origin, now)).not.toContain("<item>");
  });
  test("robots allows crawlers to read noindex responses and announces only an indexable sitemap", () => {
    const previous = process.env.PORTFOLIO_INDEXABLE;
    try {
      process.env.PORTFOLIO_INDEXABLE = "false";
      expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" } });
      process.env.PORTFOLIO_INDEXABLE = "true";
      expect(robots().sitemap).toBe(`${origin}/sitemap.xml`);
    } finally { process.env.PORTFOLIO_INDEXABLE = previous; }
  });
  test("project schema shares truthful contributor and image references without invented detail pages", () => {
    const projects = workStructuredData(origin).hasPart;
    expect(projects).toHaveLength(3);
    for (const project of projects) {
      expect(project.url).toMatch(/^https:\/\/example.com\/work#/);
      expect(project.image).toMatch(/^https:\/\/example.com\/share\/projects\//);
      expect(project.contributor).toEqual({ "@id": `${origin}/#miki` });
      expect(project).not.toHaveProperty("aggregateRating");
    }
  });
  test("title cards wrap long headings with consistent identity and real detail text", () => {
    for (const title of ["ImageGoNord", "A detailed article title ".repeat(5), "A long project title ".repeat(11)]) {
      const html = renderToStaticMarkup(<TitleCard title={title} label="JOURNAL" detail="2020-01-01" />);
      expect(html).toContain(title.trim());
      expect(html).toContain("MIKI LOMBARDI");
      expect(html).toContain("2020-01-01");
    }
  });
});
test("a very long title produces real image bytes without a remote artwork dependency", async () => {
  const previousFetch = globalThis.fetch;
  // Next’s WASM loader probes fetch(file:), then falls back to local filesystem.
  globalThis.fetch = (async () => { throw new Error("No network in image test"); }) as unknown as typeof fetch;
  try {
  const { ImageResponse } = await import("next/og");
  const title = "How a small engineering experiment grew into a geographically distributed service: architecture, constraints, decisions, and the lessons learned while building and maintaining it with a small team and limited resources";
  const response = new ImageResponse(<TitleCard title={title} label="JOURNAL" detail="Miki Lombardi · Engineering notes" />, { width: 1200, height: 630 });
  const png = Buffer.from(await response.arrayBuffer());
  expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  await Bun.write("/tmp/mic25-long-title.png", png);
  } finally { globalThis.fetch = previousFetch; }
});
