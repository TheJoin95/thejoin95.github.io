import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import manifest from "../docs/migration/legacy-manifest.json";
const hash = (data: Buffer) => createHash("sha256").update(data).digest("hex");
test("all historical routes, source downloads, aliases and assets survive in the production server", async ({ request, browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const record of manifest.articles) {
    const response = await page.goto(`http://127.0.0.1:3109${record.canonical}`);
    expect(response!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(record.title);
    await expect(page.locator("article time")).toHaveAttribute("datetime", record.date);
    expect((await page.locator("article").innerText()).length).toBeGreaterThan(500);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`http://127.0.0.1:3109${record.canonical}`);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema.headline).toBe(record.title);
    expect(schema.datePublished).toBe(record.date);
    expect(schema.dateModified).toBeUndefined();
    const raw = await request.get(`/articles/${record.filename}`);
    expect(raw.status()).toBe(200);
    expect(raw.headers()["x-robots-tag"]).toContain("noindex");
    expect(hash(await raw.body())).toBe(record.sha256);
    for (const alias of record.aliases) {
      const redirect = await request.get(alias, { maxRedirects: 0 });
      expect(redirect.status()).toBe(308);
      expect(redirect.headers().location).toBe(record.canonical);
    }
    for (const image of await page.locator("article img").all()) {
      expect(await image.getAttribute("src")).toMatch(/^\/media\/blog\//);
      expect(await image.getAttribute("alt")).toBeTruthy();
      expect(await image.getAttribute("width")).toBeTruthy();
      expect(await image.getAttribute("loading")).toBe("lazy");
    }
    const shareUrl = (await page.locator('meta[property="og:image"]').getAttribute("content"))!;
    expect(shareUrl).toBe(`http://127.0.0.1:3109${record.canonical}/share`);
    const share = await request.get(shareUrl);
    expect(share.headers()["content-type"]).toContain("image/png");
    const png = await share.body();
    if (record.title === manifest.articles.reduce((a, b) => a.title.length > b.title.length ? a : b).title) writeFileSync("/tmp/mic24-long-title.png", png);
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  }
  for (const asset of [...manifest.media, ...manifest.assets]) {
    const response = await request.get(asset.path);
    expect(response.status()).toBe(200);
    expect(hash(await response.body())).toBe(asset.sha256);
  }
  const about = await request.get("/whoami", { maxRedirects: 0 });
  expect(about.status()).toBe(308); expect(about.headers().location).toBe("/about");
  for (const path of ["/blog/missing", "/blog/missing/share", "/articles/missing.md"]) expect((await request.get(path)).status()).toBe(404);
  await context.close();
});
for (const width of [390, 834, 1440]) test(`archive and long article work without JavaScript at ${width}px`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3109/blog");
  const archive = page.getByRole("list", { name: "Archive articles" });
  await expect(archive.getByRole("listitem")).toHaveCount(8);
  const links = await archive.locator("h3 a").evaluateAll(anchors => anchors.map(a => a.getAttribute("href")));
  await page.getByRole("link", { name: "Next page", exact: true }).click();
  await expect(page).toHaveURL(/\/blog\?page=2#archive$/);
  await expect(page.getByRole("navigation", { name: "Archive pagination" })).toContainText("Page 2 of 2");
  links.push(...await archive.locator("h3 a").evaluateAll(anchors => anchors.map(a => a.getAttribute("href"))));
  expect([...new Set(links)].sort()).toEqual(manifest.articles.map(a => a.canonical).sort());
  await archive.locator("h3 a").first().click();
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/mic24-article-${width}.png` });
  await page.goto("http://127.0.0.1:3109/blog/2017-05-17-automatically-connect-wifi-raspberry-dhcp-and-staticip");
  await expect(page.locator("pre")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "← Journal", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Notes & experiments.");
  await context.close();
});
