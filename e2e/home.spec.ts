import { expect, test } from "@playwright/test";
import sharp from "sharp";

for (const width of [390, 834, 1440]) {
  test(`homepage composition and real destinations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "I’m Miki, a Senior Software Engineer at Adobe.", exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Chromatique palette comparison" })).toHaveCount(0);
    const work = page.getByRole("region", { name: "Selected work", exact: true });
    const firstFrame = work.getByRole("region", { name: "ImageGoNord media", exact: true }).locator("img").first();
    await expect(firstFrame).toBeInViewport();
    await expect(page.locator("main img").first()).toHaveAttribute("alt", /garden photograph preview/);
    await work.getByRole("link", { name: "Read the ImageGoNord story", exact: true }).click();
    await expect(page).toHaveURL(/\/work\/imagegonord$/);
    await page.goBack();
    for (const region of ["ImageGoNord media", "Supermarket waiting times media", "Chromatique media"]) {
      await expect(page.getByRole("region", { name: region, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const output = await page.request.get("/media/chromatique/irises-study-nord.png");
    expect(output.status()).toBe(200);
    await page.getByRole("link", { name: "All writing", exact: true }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });
}

test("homepage stays readable and navigable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the ImageGoNord story" })).toBeVisible();
  await expect(page.getByRole("region", { name: "ImageGoNord media", exact: true }).locator("li")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Micro Frontends - From the 00s to 20s", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Explore all work", exact: true }).click();
  await expect(page).toHaveURL(/\/work#project-index-title$/);
  await expect(page.getByRole("heading", { name: "The complete index." })).toBeInViewport();
  await context.close();
});

test("Home opens the collection directly during client navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore all work", exact: true }).click();
  await expect(page).toHaveURL(/\/work#project-index-title$/);
  await expect(page.getByRole("heading", { name: "The complete index." })).toBeInViewport();
});

test("homepage exposes canonical, structured data and actual social image bytes", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Miki Lombardi | Software engineering and open source");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).href).toBe("http://127.0.0.1:3109/");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || "{}");
  expect(schema["@graph"][0].worksFor.name).toBe("Adobe");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(imageUrl).toMatch(/^http:\/\/127\.0\.0\.1:3109\//);
  const response = await page.request.get(imageUrl!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  const bytes = await response.body();
  expect(bytes.toString("ascii", 1, 4)).toBe("PNG");
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", "Portrait of Miki Lombardi. Software engineering & open source.");
  const portrait = await sharp(bytes).extract({ left: 700, top: 40, width: 460, height: 550 }).removeAlpha().toBuffer();
  const { channels } = await sharp(portrait).stats();
  expect(channels.slice(0, 3).every(channel => channel.stdev > 30)).toBe(true);
  const twitter = await page.locator('meta[name="twitter:image"]').getAttribute("content");
  expect((await page.request.get(twitter!)).status()).toBe(200);
  const crawler = await page.request.get("/", { headers: { "User-Agent": "Twitterbot/1.0" } });
  const html = await crawler.text();
  expect(html).toContain('property="og:image"');
  expect(html).toContain(homeTitle);
});
const homeTitle = "Miki Lombardi | Software engineering and open source";

test("homepage galleries keep independent controls and accessible IDs", async ({ page }) => {
  await page.goto("/");
  const first = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  const second = page.getByRole("region", { name: "Chromatique media", exact: true });
  await first.getByRole("button", { name: /Next/ }).click();
  await expect(first.getByRole("status")).toContainText("2 of 3");
  await expect(second.getByText("1 of 2", { exact: true })).toBeVisible();
  const ids = await page.locator('[role="region"] ol[id]').evaluateAll(elements => elements.map(el => el.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test("failed opening project images leave the introduction and story links usable", async ({ page }) => {
  await page.route("**/_next/image?**", route => decodeURIComponent(route.request().url()).includes("/media/imagegonord/") ? route.abort() : route.continue());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  await expect(gallery.getByText("Image unavailable.").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the ImageGoNord story" })).toBeVisible();
});
