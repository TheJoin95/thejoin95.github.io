import { expect, test } from "@playwright/test";
const stories = [
  { id: "imagegonord", title: "ImageGoNord", status: "Open-source project", role: "co-authored ImageGoNord with Wabri", media: 3 },
  { id: "supermarket", title: "Supermarket waiting times", status: "Archived project · 2020", role: "evolved it from a Raspberry Pi", media: 1 },
  { id: "chromatique", title: "Chromatique", status: "In development", role: "lightness-preserving palette selection", media: 2 },
];
for (const width of [320, 390, 834, 1440]) test(`all project stories are readable without JavaScript at ${width}px`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 1000 } });
  const page = await context.newPage();
  for (const story of stories) {
    const response = await page.goto(`http://127.0.0.1:3109/work/${story.id}`);
    expect(response!.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(story.title);
    await expect(page.locator("article")).toContainText(story.role);
    await expect(page.locator("article header")).toContainText(story.status);
    await expect(page.getByRole("region", { name: `${story.title} project media`, exact: true }).locator("img")).toHaveCount(story.media);
    for (const img of await page.locator("article img").all()) {
      expect(await img.getAttribute("alt")).toBeTruthy(); expect(await img.getAttribute("width")).toBeTruthy(); expect(await img.getAttribute("height")).toBeTruthy();
    }
    expect((await page.locator("article").innerText()).length).toBeGreaterThan(2500);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width !== 320) {
      await page.screenshot({ path: `/tmp/mic16-${story.id}-${width}.png`, fullPage: true });
      await page.screenshot({ path: `/tmp/mic16-${story.id}-${width}-opening.png` });
    }
    await expect(page.getByRole("navigation", { name: "More project stories" }).getByRole("link")).toHaveCount(19);
    await page.getByRole("link", { name: "← All work", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected work.");
  }
  await context.close();
});
test("Home and Work lead to real detail routes and missing or unsupported stories return HTTP 404", async ({ page, request }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Read the ImageGoNord story", exact: true });
  await link.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/imagegonord$/);
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work", exact: true })).toHaveAttribute("aria-current", "location");
  await page.getByRole("navigation", { name: "More project stories" }).getByRole("link", { name: "Chromatique", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chromatique");
  await expect(page.getByRole("region", { name: "Reproduce the palette conversion", exact: true })).toContainText("--space oklab --dither none --indexed");
  for (const path of ["/work/missing", "/work/hop", "/work/draft", "/work/imagegonord/missing"]) expect((await request.get(path)).status()).toBe(404);
});
test("project metadata and schema match visible identity, roles and actual social PNGs", async ({ page, request }) => {
  for (const story of stories) {
    await page.goto(`/work/${story.id}`);
    const url = `http://127.0.0.1:3109/work/${story.id}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", url);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema.headline).toBe(story.title); expect(schema.mainEntityOfPage).toBe(url);
    expect(schema.author.name).toBe("Miki Lombardi"); expect(schema.datePublished).toBeUndefined(); expect(schema.dateModified).toBeUndefined();
    const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(imageUrl).toBe(`http://127.0.0.1:3109/share/projects/${story.id}`);
    const image = await request.get(imageUrl!); expect(image.status()).toBe(200); expect(image.headers()["content-type"]).toContain("image/png");
    const png = await image.body(); expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  }
  const crawler = await request.get("/work/chromatique", { headers: { "User-Agent": "OAI-SearchBot" } });
  expect(await crawler.text()).toContain("Choose lightness deliberately");
});
test("failed project media keeps the story, explanation and onward navigation usable", async ({ page }) => {
  await page.route("**/_next/image?**", route => new URL(route.request().url()).searchParams.get("url") === "/media/chromatique/irises-study-nord.png" ? route.abort() : route.continue());
  await page.goto("/work/chromatique");
  await page.getByRole("region", { name: "Chromatique project media", exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByText("Image unavailable", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose lightness deliberately", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "← All work", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the original decision record extracts", exact: true })).toBeVisible();
});

test("large text reflows while the recipe scrolls within its own region", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/chromatique");
  await expect(page.getByRole("button", { name: /Next media/ })).toBeVisible();
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const recipe = page.getByRole("region", { name: "Reproduce the palette conversion", exact: true });
  await recipe.focus(); await expect(recipe).toBeFocused();
  expect(await recipe.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
});

test("Lab and Play expose the named project stories and their branded share cards", async ({ page, request }) => {
  for (const path of ["/lab", "/play"]) {
    await page.goto(path);
    if (path === "/lab") await expect(page.getByRole("heading", { name: "Project case studies" })).toBeInViewport();
    for (const [title, slug] of [["Certo", "certo"], ["Vitni", "vitni"], ["Ambisonic Audio", "ambisonic-audio"]]) {
      await expect(page.getByRole("link", { name: title, exact: true })).toHaveAttribute("href", `/work/${slug}`);
    }
  }
  const githubIndex = page.getByRole("region", { name: "GitHub project index", exact: true });
  await expect(githubIndex.getByRole("link", { name: "Search all my public pull requests on GitHub" })).toBeVisible();
  await githubIndex.getByText("Projects I contributed to", { exact: true }).click();
  await expect(githubIndex.getByRole("link", { name: "puppeteer/puppeteer", exact: true })).toHaveAttribute("href", "https://github.com/puppeteer/puppeteer");
  await expect(githubIndex.getByRole("link", { name: "View my contribution to puppeteer/puppeteer", exact: true })).toHaveAttribute("href", "https://github.com/puppeteer/puppeteer/pull/11434");
  await page.getByRole("link", { name: "Puppeteer", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Puppeteer");
  await expect(page.getByRole("link", { name: "Read the Docusaurus migration pull request" })).toHaveAttribute("href", "https://github.com/puppeteer/puppeteer/pull/11434");
  await page.goBack();
  await page.getByRole("link", { name: "Ambisonic Audio", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ambisonic Audio");
  await expect(page.getByRole("link", { name: "Read the original journal article" })).toHaveAttribute("href", "/blog/2018-10-28-how-make-8d-ambisonic-audio-track-python");
  await expect(page.locator("article img")).toHaveCount(0);
  const card = await request.get("/share/projects/ambisonic-audio");
  expect(card.ok()).toBe(true);
  expect(card.headers()["content-type"]).toContain("image/png");
  const fallback = await request.get("/opengraph-image");
  expect((await card.body()).equals(await fallback.body())).toBe(false);
});

test("Lab and Play render optimized project covers and local share-card fallbacks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lab");
  const primary = page.getByRole("img", { name: /Certo’s public share card/ });
  await primary.scrollIntoViewIfNeeded();
  await expect.poll(() => primary.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const primaryUrl = new URL(await primary.evaluate((image: HTMLImageElement) => image.currentSrc));
  expect(primaryUrl.pathname).toBe("/_next/image");
  expect(primaryUrl.searchParams.get("url")).toBe("/media/project-covers/certo.webp");

  const audioCard = page.getByRole("link", { name: "Ambisonic Audio", exact: true }).locator("../..");
  const fallback = audioCard.locator("img");
  await fallback.scrollIntoViewIfNeeded();
  await expect.poll(() => fallback.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const fallbackUrl = new URL(await fallback.evaluate((image: HTMLImageElement) => image.currentSrc));
  expect(fallbackUrl.searchParams.get("url")).toBe("/share/projects/ambisonic-audio");
  await expect(fallback).toHaveAttribute("alt", "");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto("/play");
  const screenshot = page.getByRole("img", { name: /garden photograph preview beside Nord palette/ });
  await screenshot.scrollIntoViewIfNeeded();
  await expect.poll(() => screenshot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});
