import { expect, test } from "@playwright/test";

for (const width of [390, 834, 1440]) {
  test(`homepage composition and real destinations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Engineering, with curiosity.", exact: true })).toBeVisible();
    await expect(page.getByText(/I’m Miki, a Senior Software Engineer at Adobe/)).toBeVisible();
    const stage = page.getByRole("region", { name: "Chromatique static palette comparison", exact: true });
    await expect(stage.locator("img")).toHaveCount(2);
    await expect(stage.getByRole("button")).toHaveCount(0);
    const surface = stage.locator("figure > div");
    const size = await surface.boundingBox();
    expect(size!.width / size!.height).toBeCloseTo(width >= 1200 ? 3 : width >= 768 ? 16 / 9 : 4 / 3, 1);
    await stage.getByRole("link", { name: /explore the palette study/ }).click();
    await expect(page).toHaveURL(/#chromatique$/);
    await expect(page.getByRole("heading", { name: "Chromatique", exact: true })).toBeVisible();
    for (const region of ["ImageGoNord media", "Supermarket waiting times media", "Chromatique media"]) {
      await expect(page.getByRole("region", { name: region, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const output = await page.request.get("/media/chromatique/irises-nord.png");
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
  await expect(page.getByRole("region", { name: "Chromatique static palette comparison", exact: true }).locator("img").first()).toBeVisible();
  await expect(page.getByRole("region", { name: "ImageGoNord media", exact: true }).locator("li")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Micro Frontends - From the 00s to 20s", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Explore all work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await context.close();
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

test("failed static-stage images do not hide the profile or project evidence", async ({ page }) => {
  await page.route("**/media/chromatique/*", route => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const stage = page.getByRole("region", { name: "Chromatique static palette comparison", exact: true });
  const image = stage.locator("img").first();
  await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).complete)).toBe(true);
  expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(0);
  await expect(page.locator("h1")).toBeVisible();
  await expect(stage.getByText("Static comparison · original / actual CLI output")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore all work", exact: true })).toBeVisible();
  const box = await stage.locator("figure > div").boundingBox();
  expect(box!.height).toBeGreaterThan(250);
});
