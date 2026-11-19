import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import manifest from "../docs/migration/legacy-manifest.json";
import slugs from "../src/content/journal-routes.json";
const hash = (data: Buffer) => createHash("sha256").update(data).digest("hex");

const mediumArticles = [
  ["2022-09-20-upgrading-to-react18-is-easy", "Upgrading to React18 is easy", "f4c41b0b74a1", 3],
  ["2022-08-17-optimize-user-experience-and-performance-with-lighthouse", "Optimize the User Experience and Performance via Node.js and Lighthouse", "bfd8107fe248", 5],
  ["2022-08-15-upgrading-to-react-18-isnt-that-hard", "Upgrading To React 18 Isn’t That Hard. Here’s How To Do It.", "bf054418b782", 3],
  ["2022-08-03-use-conventional-commit-messages-to-improve-team-communication", "Use Conventional Commit Messages to Improve Team Communication", "4c7d9cc8f939", 3],
  ["2020-08-30-automate-podcast-publishing-with-github-actions", "Automate the Publishing Process of Your Podcast With GitHub Actions", "1dbb0fc90560", 1],
  ["2020-01-03-ambisonic-audio-generator-audio-in-3d", "Ambisonic audio generator — Audio in 3D", "3f649c7669ab", 1],
] as const;

test("the Medium imports expose original titles, dates, source links, figures and social cards to crawlers", async ({ request, browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, userAgent: "OAI-SearchBot" });
  const page = await context.newPage();
  const rss = await (await request.get("/rss.xml")).text();
  const checkedImages = new Set<string>();
  for (const [slug, title, sourceId, figureCount] of mediumArticles) {
    const url = `http://127.0.0.1:3109/blog/${slug}`;
    const date = slug.slice(0, 10);
    expect((await page.goto(url))!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText([title]);
    await expect(page.locator("article time")).toHaveAttribute("datetime", date);
    await expect(page.locator(`article a[href$="-${sourceId}"]`)).toHaveCount(1);
    await expect(page.locator("article iframe")).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema).toMatchObject({ "@type": "BlogPosting", headline: title, datePublished: date, mainEntityOfPage: url });
    expect(rss).toContain(`<link>${url}</link>`);
    const images = page.locator("article figure img");
    await expect(images).toHaveCount(figureCount);
    for (const image of await images.all()) {
      const src = (await image.getAttribute("src"))!;
      expect(src).toMatch(/^\/media\/journal\/medium\/.+\.webp$/);
      await expect(image).toHaveAttribute("alt", /\S/);
      await expect(image).toHaveAttribute("width", /^[1-9]\d*$/);
      await expect(image).toHaveAttribute("height", /^[1-9]\d*$/);
      await expect(image).toHaveAttribute("loading", "lazy");
      if (checkedImages.has(src)) continue;
      const response = await request.get(src);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
      checkedImages.add(src);
    }
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${url}/share`);
    const card = await request.get(`${url}/share`);
    expect(card.ok()).toBe(true);
    const png = await card.body();
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  }
  await context.close();
});

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
      const redirect = await request.get(`${alias}?source=legacy`, { maxRedirects: 0 });
      expect(redirect.status()).toBe(308);
      const destination = new URL(redirect.headers().location, redirect.url());
      expect(destination.href).toBe(new URL(`${record.canonical}?source=legacy`, redirect.url()).href);
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
  const totalPages = Math.ceil(slugs.length / 8);
  for (let number = 2; number <= totalPages; number++) {
    await page.getByRole("link", { name: "Next page", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/blog\\?page=${number}#archive$`));
    await expect(page.getByRole("navigation", { name: "Archive pagination" })).toContainText(`Page ${number} of ${totalPages}`);
    links.push(...await archive.locator("h3 a").evaluateAll(anchors => anchors.map(a => a.getAttribute("href"))));
  }
  expect(links).toHaveLength(slugs.length);
  expect([...new Set(links)].sort()).toEqual(slugs.map(slug => `/blog/${slug}`).sort());
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
