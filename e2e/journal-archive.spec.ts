import { test, expect } from "@playwright/test";
import slugs from "../src/content/journal-routes.json";

for (const width of [320, 390, 834, 1440]) test(`Journal discovery works without JavaScript at ${width}px`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3109/blog");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes & experiments.");
  await expect(page.getByRole("region", { name: "Featured writing." }).getByRole("heading", { level: 3 })).toHaveText("Micro Frontends - From the 00s to 20s");
  await expect(page.locator("#sketchbook")).toContainText("No drawings or sketchbook articles are published here yet.");
  await expect(page.locator("#sketchbook img, #sketchbook time")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Subscribe via RSS" })).toHaveAttribute("href", "/rss.xml");
  await page.screenshot({ path: `/tmp/mic18-journal-${width}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel("Search writing", { exact: true }).fill("micro frontends");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/q=micro\+frontends/);
  await expect(page.getByRole("list", { name: "Archive articles" }).getByRole("heading", { name: "Micro Frontends - From the 00s to 20s", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("matching “micro frontends”");
  await page.getByLabel("Search writing", { exact: true }).fill("no-such-writing-xyz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching articles." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("0 articles");
  await expect(page.getByRole("navigation", { name: "Archive pagination" })).toHaveCount(0);
  await page.getByRole("link", { name: "Clear filters", exact: true }).first().click();
  await expect(page.getByLabel("Search writing", { exact: true })).toHaveValue("");
  await expect(page.getByRole("list", { name: "Archive articles" }).getByRole("listitem")).toHaveCount(8);
  await page.getByLabel("Tag", { exact: true }).selectOption({ index: 1 });
  const tag = await page.getByLabel("Tag", { exact: true }).inputValue();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(`tagged “${tag}”`);
  await expect(page.getByRole("list", { name: "Archive articles" }).getByRole("listitem").first()).toContainText(tag);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("keyboard search, URL restoration, page reset and 200% type remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog?page=2#archive");
  const search = page.getByLabel("Search writing", { exact: true });
  await search.focus(); await page.keyboard.type("python"); await page.keyboard.press("Tab");
  await expect(page.getByLabel("Tag", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(page.getByRole("button", { name: "Search", exact: true })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page).toHaveURL(/q=python/);
  expect(new URL(page.url()).searchParams.has("page")).toBe(false);
  await expect(search).toHaveValue("python");
  await page.getByRole("link", { name: "Clear filters", exact: true }).first().click();
  await expect(search).toHaveValue(""); await page.goBack(); await expect(search).toHaveValue("python");
  await page.reload(); await expect(search).toHaveValue("python");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await search.fill("nothing-xyz"); await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching articles." })).toBeVisible();
});

test("crawler HTML, pagination canonicals, schema, social image and filter indexing agree", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, userAgent: "OAI-SearchBot" });
  const page = await context.newPage();
  for (const [path, canonical, position] of [["/blog", "/blog", 1], ["/blog?page=2", "/blog?page=2", 9], ["/blog?page=999", "/blog?page=2", 9]] as const) {
    expect((await page.goto(`http://127.0.0.1:3109${path}`))!.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `http://127.0.0.1:3109${canonical}`);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema["@type"]).toBe("CollectionPage"); expect(schema.mainEntity.numberOfItems).toBe(8);
    expect(schema.mainEntity.itemListElement[0].position).toBe(position);
    expect(schema.mainEntity.itemListElement.map((entry: { item: { headline: string } }) => entry.item.headline)).toEqual(await page.locator('#archive h3').allTextContents());
  }
  await page.goto("http://127.0.0.1:3109/blog?q=%3Cscript%3E&tag=missing");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3109/blog");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const image = await request.get((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
  expect(image.status()).toBe(200); const png = await image.body();
  expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  await expect(page.getByLabel("Search writing", { exact: true })).toHaveValue("<script>");
  await expect(page.getByRole("heading", { name: "No matching articles." })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`http://127.0.0.1:3109/blog?q=${"W".repeat(160)}&tag=${"W".repeat(80)}#archive`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "/tmp/mic18-long-query-320.png", fullPage: true });
  const feed = await request.get("/rss.xml"); expect((await feed.text()).match(/<item>/g)).toHaveLength(slugs.length);
  await context.close();
});
