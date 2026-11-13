import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const articlePath = "/blog/2019-12-21-microfrontend-from-00-to-20s";
async function sketchbookFixture(page: Page) {
  await page.goto(`http://127.0.0.1:3109${articlePath}`);
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => (link as HTMLLinkElement).href));
  await page.setContent(`<html lang="en"><head><base href="http://127.0.0.1:3109/"><meta name="robots" content="noindex">${styles.map(href => `<link rel="stylesheet" href="${href}">`).join("")}</head><body>${readFileSync(".test-fixtures/reader.html", "utf8")}</body></html>`);
}

for (const width of [320, 390, 834, 1440]) test(`articles and sequential sketchbook panels work without scripts at ${width}px`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width, height: 1000 } });
  const page = await context.newPage();
  expect((await page.goto(`http://127.0.0.1:3109${articlePath}`))!.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const contents = page.getByRole("navigation", { name: "On this page" });
  await expect(contents.getByRole("link")).toHaveCount(3);
  for (const link of await contents.getByRole("link").all()) {
    const id = (await link.getAttribute("href"))!.slice(1);
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
  await page.screenshot({ path: `/tmp/mic19-article-${width}.png`, fullPage: true });
  await contents.getByRole("link").first().click();
  await expect(page).toHaveURL(/#section-/);
  const related = page.getByRole("navigation", { name: "Keep reading." });
  await expect(related.locator("li")).toHaveCount(3);
  await expect(related.locator(`a[href="${articlePath}"]`)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await sketchbookFixture(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Reader test fixture — not published artwork");
  await expect(page.getByRole("heading", { name: "Learning notes", exact: true })).toBeVisible();
  const panels = page.getByRole("list", { name: "Sketchbook panels" }).getByRole("listitem");
  await expect(panels).toHaveCount(2);
  await expect(panels.nth(0).locator("figcaption")).toContainText("Panel 1 · First test panel");
  await expect(panels.nth(1).locator("figcaption")).toContainText("Panel 2 · Second test panel");
  for (const image of await panels.locator("img").all()) expect(await image.getAttribute("alt")).toContain("Test fixture");
  await expect(page.locator("#section-what-i-tried, #section-what-i-tried-1")).toHaveCount(2);
  await page.screenshot({ path: `/tmp/mic19-sketchbook-${width}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const table = page.getByRole("region", { name: "Data table 1", exact: true });
  const firstHeader = table.getByRole("columnheader").first();
  expect(await firstHeader.evaluate(node => node.getBoundingClientRect().width)).toBeGreaterThan(100);
  if (width <= 390) expect(await table.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
  await context.close();
});

test("keyboard contents, scrollable code/tables and 200% text retain reading context", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articlePath);
  const contentsLink = page.getByRole("navigation", { name: "On this page" }).getByRole("link").first();
  const target = (await contentsLink.getAttribute("href"))!;
  await contentsLink.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(target)).toBeFocused();
  await sketchbookFixture(page);
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const code = page.getByRole("region", { name: "Code example 1", exact: true });
  await code.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => code.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  const table = page.getByRole("region", { name: "Data table 1", exact: true });
  await table.focus(); await expect(table).toBeFocused(); await expect(table.getByRole("table")).toHaveCount(1);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => table.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("failed panels retain descriptions, captions, authorship and learning notes", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route("**/media/journal/microfrontends.svg", route => route.abort());
  await sketchbookFixture(page);
  const panel = page.getByRole("list", { name: "Sketchbook panels" }).locator("li").first();
  await panel.scrollIntoViewIfNeeded();
  await expect.poll(() => panel.locator("img").evaluate(node => (node as HTMLImageElement).complete)).toBe(true);
  expect(await panel.locator("img").evaluate(node => (node as HTMLImageElement).naturalWidth)).toBe(0);
  await expect(panel.locator("img")).toHaveAttribute("alt", /school application shell/);
  await expect(panel.locator("figcaption")).toContainText("Test use only.");
  await expect(page.getByRole("heading", { name: "Learning notes", exact: true })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Miki Lombardi", exact: true })).toHaveAttribute("href", "/about");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("reader fixtures and unpublished sketches have no public page, share card or discovery entry", async ({ request }) => {
  for (const path of ["/blog/sketchbook-reader-fixture", "/blog/sketchbook-reader-fixture/share", "/tests/fixtures/sketchbook.md", "/.test-fixtures/reader.html"]) expect((await request.get(path)).status()).toBe(404);
  const html = await (await request.get(articlePath, { headers: { "User-Agent": "OAI-SearchBot" } })).text();
  expect(html).toContain("On this page"); expect(html).toContain("Keep reading.");
  expect(await (await request.get("/rss.xml")).text()).not.toContain("sketchbook-reader-fixture");
});
