import { expect, test } from "@playwright/test";

for (const [width, columns] of [[390, 1], [834, 2], [1440, 3]]) {
  test(`Work index and galleries at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/work");
    const index = page.getByRole("region", { name: "The complete index.", exact: true });
    await expect(index.getByRole("listitem")).toHaveCount(11);
    await expect(index.getByRole("heading", { level: 3 })).toHaveCount(11);
    expect(await index.locator("ul").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(columns);
    await expect(index.getByText("No public link yet.", { exact: true })).toHaveCount(6);
    await expect(index.getByRole("link")).toHaveCount(5);
    for (const name of ["ImageGoNord media", "Supermarket waiting times media", "Chromatique media"]) {
      await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
    }
    await index.getByRole("link", { name: "Chromatique", exact: true }).click();
    await expect(page).toHaveURL(/\/work#chromatique$/);
    await expect(page.locator("h2#chromatique")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/tmp/mic15-work-${width}.png`, fullPage: true });
    await index.screenshot({ path: `/tmp/mic15-index-${width}.png` });
  });
}

test("Work index is readable and keyboard navigable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work");
  const index = page.getByRole("region", { name: "The complete index.", exact: true });
  await expect(index.getByRole("listitem")).toHaveCount(11);
  const anchor = index.getByRole("link", { name: "ImageGoNord", exact: true });
  await anchor.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#imagegonord$/);
  await expect(page.locator("h2#imagegonord")).toBeInViewport();
  await expect(page.getByRole("region", { name: "Chromatique media", exact: true }).locator("img")).toHaveCount(2);
  await context.close();
});

test("Work exposes canonical, accurate index schema and a real social image", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work$/);
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(schema["@type"]).toBe("CollectionPage");
  expect(schema.mainEntity.itemListElement).toHaveLength(11);
  expect(schema.mainEntity.itemListElement.filter((item: { url?: string }) => item.url)).toHaveLength(5);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toMatch(/^https?:\/\//);
  const crawler = await page.request.get("/work", { headers: { "User-Agent": "Twitterbot/1.0" } });
  const html = await crawler.text();
  expect(html).toContain('property="og:image"');
  expect(html).toContain("The complete index.");
  expect(html).toContain("Archived project · 2020");
  const response = await page.request.get(image!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
  const bytes = await response.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
});
