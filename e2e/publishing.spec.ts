import { expect, test } from "@playwright/test";
import slugs from "../src/content/journal-routes.json";

test.skip(!["published", "withdrawn"].includes(process.env.PUBLISHING_TEST || ""), "Run bun run test:release to prepare and remove synthetic Markdown safely");
test("Markdown publication and withdrawal agree across HTML, routes, metadata and discovery", async ({ browser, request }) => {
  const published = process.env.PUBLISHING_TEST === "published";
  const context = await browser.newContext({ javaScriptEnabled: false, userAgent: "OAI-SearchBot" });
  const page = await context.newPage();
  const slug = "mic28-published-fixture", path = `/blog/${slug}`;
  const response = await page.goto(`http://127.0.0.1:3109${path}`);
  expect(response!.status()).toBe(published ? 200 : 404);
  if (published) {
    await expect(page.locator("h1")).toHaveText("MIC-28 published publishing fixture");
    await expect(page.locator("article")).toContainText("Synthetic content confirms");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.mikilombardi.com${path}`);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema).toMatchObject({ "@type": "BlogPosting", headline: "MIC-28 published publishing fixture", datePublished: "2026-01-01", author: { name: "Miki Lombardi" } });
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `https://www.mikilombardi.com${path}/share`);
  }
  const card = await request.get(`${path}/share`);
  expect(card.status()).toBe(published ? 200 : 404);
  if (published) {
    expect(card.headers()["content-type"]).toContain("image/png");
    const bytes = await card.body(); expect(bytes.readUInt32BE(16)).toBe(1200); expect(bytes.readUInt32BE(20)).toBe(630);
  }
  await page.goto("http://127.0.0.1:3109/blog?q=mic28-fixture");
  const link = page.getByRole("link", { name: "MIC-28 published publishing fixture", exact: true });
  await expect(link).toHaveCount(published ? 1 : 0);
  await page.goto("http://127.0.0.1:3109/blog");
  const archive = page.getByRole("list", { name: "Archive articles" });
  const discovered: string[] = [];
  for (let number = 1; number <= Math.ceil(slugs.length / 8); number++) {
    discovered.push(...await archive.locator("h3 a").evaluateAll(anchors => anchors.map(a => a.getAttribute("href")!)));
    if (number < Math.ceil(slugs.length / 8)) await page.getByRole("link", { name: "Next page", exact: true }).click();
  }
  expect(discovered).toEqual(slugs.map(slug => `/blog/${slug}`));
  expect(discovered.includes(path)).toBe(published);
  const rss = await (await request.get("/rss.xml")).text();
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(rss.includes(path)).toBe(published); expect(sitemap.includes(path)).toBe(published);
  for (const hidden of ["draft", "future"]) {
    const hiddenPath = `/blog/mic28-${hidden}-fixture`;
    expect((await request.get(hiddenPath)).status()).toBe(404);
    expect((await request.get(`${hiddenPath}/share`)).status()).toBe(404);
    expect(rss).not.toContain(hiddenPath); expect(sitemap).not.toContain(hiddenPath);
    await expect(page.locator(`a[href="${hiddenPath}"]`)).toHaveCount(0);
  }
  await context.close();
});
