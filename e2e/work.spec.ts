import { expect, test } from "@playwright/test";
import { projectIndex } from "../src/content/work";

for (const [width, columns] of [[320, 1], [390, 1], [834, 2], [1440, 3]]) {
  test(`Work masonry and galleries at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/work");
    const index = page.getByRole("region", { name: "The complete index.", exact: true });
    await expect(index.getByRole("listitem")).toHaveCount(27);
    await expect(index.getByRole("heading", { level: 3 })).toHaveText(projectIndex.map(project => project.title));
    const cards = await index.getByRole("listitem").evaluateAll(items => items.map(item => {
      const { x, y, right, bottom, height } = item.getBoundingClientRect();
      return { x, y, right, bottom, height, contained: item.getClientRects().length === 1 };
    }));
    const columnStarts = [...new Set(cards.map(card => card.x))];
    expect(columnStarts).toHaveLength(columns);
    expect(columnStarts).toEqual([...columnStarts].sort((a, b) => a - b));
    expect(new Set(cards.map(card => Math.round(card.height))).size).toBeGreaterThan(3);
    for (const [i, card] of cards.entries()) {
      expect(card.contained).toBe(true);
      expect(card.x).toBeGreaterThanOrEqual(0);
      expect(card.right).toBeLessThanOrEqual(width);
      const previous = cards[i - 1];
      if (previous?.x === card.x) expect(card.y).toBeGreaterThan(previous.bottom);
      if (previous && previous.x !== card.x) expect(card.x).toBeGreaterThan(previous.right);
    }
    await expect(index.getByText("No public link yet.", { exact: true })).toHaveCount(6);
    await expect(index.getByRole("link")).toHaveCount(21);
    for (const name of ["ImageGoNord media", "Supermarket waiting times media", "Chromatique media"]) {
      await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Browse the complete index", exact: true }).click();
    await expect(index.getByRole("heading", { level: 2 })).toBeInViewport();
    await index.getByRole("link", { name: "Chromatique", exact: true }).click();
    await expect(page).toHaveURL(/\/work\/chromatique$/);
    await expect(page.getByRole("heading", { level: 1, name: "Chromatique" })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("Work index is readable and keyboard navigable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/work");
  const index = page.getByRole("region", { name: "The complete index.", exact: true });
  await expect(index.getByRole("listitem")).toHaveCount(27);
  const anchor = index.getByRole("link", { name: "ImageGoNord", exact: true });
  const destinations = projectIndex.flatMap(project => project.href ? [project.href] : []);
  const links = index.getByRole("link");
  await links.first().focus();
  for (const [i, destination] of destinations.entries()) {
    await expect(links.nth(i)).toBeFocused();
    await expect(links.nth(i)).toHaveAttribute("href", destination);
    await page.keyboard.press("Tab");
  }
  await anchor.press("Enter");
  await expect(page).toHaveURL(/\/work\/imagegonord$/);
  await expect(page.getByRole("heading", { level: 1, name: "ImageGoNord" })).toBeInViewport();
  await page.getByRole("link", { name: "← All work", exact: true }).click();
  await expect(page.getByRole("region", { name: "Chromatique media", exact: true }).locator("img")).toHaveCount(2);
  await context.close();
});

test("a failed static preview reveals its cover without shifting the card", async ({ page }) => {
  let failPreview!: () => void;
  const previewBlocked = new Promise<void>(resolve => { failPreview = resolve; });
  await page.route("**/media/previews/certo-*.webp", async route => {
    await previewBlocked;
    await route.abort();
  });
  await page.goto("/work#project-index-title", { waitUntil: "domcontentloaded" });
  const index = page.getByRole("region", { name: "The complete index.", exact: true });
  const card = index.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Certo", exact: true }) });
  const cover = card.locator(":scope > div").first();
  const image = cover.locator("img");
  let before;
  try {
    await card.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    before = await cover.evaluate(el => ({ height: el.clientHeight, width: el.clientWidth }));
  } finally {
    failPreview();
  }
  await expect(image).toBeHidden();
  await expect(cover.getByText("Certo", { exact: true })).toBeVisible();
  expect(await cover.evaluate(el => ({ height: el.clientHeight, width: el.clientWidth }))).toEqual(before);
  await expect(card.getByRole("link", { name: "Certo", exact: true })).toHaveAttribute("href", "/work/certo");
});

test("Work exposes canonical, accurate index schema and a real social image", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work$/);
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(schema["@type"]).toBe("CollectionPage");
  expect(schema.mainEntity.itemListElement).toHaveLength(27);
  expect(schema.mainEntity.itemListElement.filter((item: { url?: string }) => item.url)).toHaveLength(21);
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
