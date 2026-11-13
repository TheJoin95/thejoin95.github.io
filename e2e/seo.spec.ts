import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import slugs from "../src/content/journal-routes.json";
const pages = ["/", "/work", "/about", "/blog", "/play"];
const article = "/blog/2019-12-21-microfrontend-from-00-to-20s";
test("all public pages serve consistent metadata, noindex and social PNGs to crawlers without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of [...pages, article]) {
    const response = await page.goto(`http://127.0.0.1:3109${path}`);
    expect(response!.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(`http://127.0.0.1:3109${path}`);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(`http://127.0.0.1:3109${path}`);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", path === article ? "article" : "website");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toMatch(/^http:\/\/127.0.0.1:3109\//);
    expect(await page.locator('meta[property="og:image:alt"]').getAttribute("content")).toBeTruthy();
    await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute("href", "http://127.0.0.1:3109/rss.xml");
    const png = await request.get(image!);
    expect(png.status()).toBe(200); expect(png.headers()["content-type"]).toContain("image/png");
    const bytes = await png.body(); expect(bytes.readUInt32BE(16)).toBe(1200); expect(bytes.readUInt32BE(20)).toBe(630);
  }
  for (const userAgent of ["Twitterbot", "facebookexternalhit/1.1", "Googlebot", "OAI-SearchBot", "PerplexityBot"]) {
    const response = await request.get(article, { headers: { "User-Agent": userAgent } });
    const html = await response.text();
    expect(html).toContain('property="og:url"'); expect(html).toContain('application/ld+json');
    expect(html).toContain("Micro Frontends"); expect(response.headers()["x-robots-tag"]).toContain("noindex");
  }
  await context.close();
});
test("RSS parses as XML, contains the 16 public articles and prelaunch sitemap stays empty", async ({ page, request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(rss.headers()["x-robots-tag"]).toContain("noindex");
  const parsed = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return { errors: doc.querySelectorAll("parsererror").length, links: [...doc.querySelectorAll("item > link")].map(item => item.textContent), dates: [...doc.querySelectorAll("item > pubDate")].map(item => item.textContent) };
  }, await rss.text());
  expect(parsed.errors).toBe(0); expect(parsed.links).toHaveLength(slugs.length);
  expect(parsed.links.every(link => link?.startsWith("http://127.0.0.1:3109/blog/"))).toBe(true);
  expect(parsed.dates.every(date => Number.isFinite(Date.parse(date!)))).toBe(true);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200); expect(await sitemap.text()).not.toContain("<loc>");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Allow: /"); expect(await robots.text()).not.toContain("Sitemap:");
  await page.goto("/blog"); await expect(page.getByRole("link", { name: "Subscribe via RSS" })).toHaveAttribute("href", "/rss.xml");
  for (const path of ["/newsletter/confirmed", "/missing-page", "/articles/2017-02-16-how-to-backup-all-collections-from-mongodb-on-raspberry.md"]) {
    expect((await request.get(path)).headers()["x-robots-tag"]).toContain("noindex");
  }
});
test("three specific project cards and the missing-project fallback return real PNGs", async ({ request, page }) => {
  for (const id of ["imagegonord", "supermarket", "chromatique", "missing-project"]) {
    const response = await request.get(`/share/projects/${id}`);
    expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toContain("image/png");
    const bytes = await response.body(); expect(bytes.readUInt32BE(16)).toBe(1200); expect(bytes.readUInt32BE(20)).toBe(630);
    writeFileSync(`/tmp/mic25-share-${id}.png`, bytes);
  }
  await page.goto("/work");
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(schema.hasPart).toHaveLength(3);
  for (const project of schema.hasPart) expect(project.image).toMatch(/^http:\/\/127.0.0.1:3109\/share\/projects\//);
});
