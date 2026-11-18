import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { paletteImages } from "../src/content/featured-media";

test("Play requests responsive palette media without raw fallback downloads or initial animation/font services", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = []; page.on("request", request => requests.push(request.url()));
  await page.goto("/play"); await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const stage = page.getByRole("region", { name: "Chromatique palette comparison", exact: true });
  await stage.scrollIntoViewIfNeeded();
  for (const image of await stage.locator("img").all()) {
    await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const source = new URL(await image.evaluate(el => (el as HTMLImageElement).currentSrc));
    expect(source.pathname).toBe("/_next/image"); expect(Number(source.searchParams.get("w"))).toBeLessThanOrEqual(1080);
  }
  const imageUrls = await stage.locator("img").evaluateAll(images => images.map(image => (image as HTMLImageElement).currentSrc));
  const assets = await Promise.all(imageUrls.map(url => page.request.get(url, { headers: { Accept: "image/webp" } })));
  const imageBytes = await Promise.all(assets.map(asset => asset.body()));
  expect(imageBytes.reduce((total, bytes) => total + bytes.length, 0)).toBeLessThan(180 * 1024);
  // Small SVG diagrams remain native; raster originals are the duplicate downloads.
  expect(requests.filter(url => /^\/media\/.*\.(png|jpe?g)$/.test(new URL(url).pathname))).toEqual([]);
  expect(requests.some(url => /\.wasm|\.lottie|fonts\.google|fonts\.gstatic|api\.brevo/.test(url))).toBe(false);
  await expect(stage.getByRole("slider", { name: "Palette reveal" })).toBeEnabled();
  await stage.getByRole("slider").focus(); await page.keyboard.press("End"); await expect(stage.getByRole("slider")).toHaveValue("100");
});

test("image optimizer serves smaller phone derivatives while full-size originals remain available", async ({ request }) => {
  for (const source of [paletteImages.original, paletteImages.palette]) {
    const original = await request.get(source);
    const optimized = await request.get(`/_next/image?url=${encodeURIComponent(source)}&w=828&q=75`, { headers: { Accept: "image/webp" } });
    expect(original.status()).toBe(200); expect(optimized.status()).toBe(200);
    expect(optimized.headers()["content-type"]).toContain("image/webp");
    expect((await optimized.body()).length).toBeLessThan((await original.body()).length * .7);
  }
});

test("desktop 2× stage derivatives resolve the display area without upscaling the source", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage();
    await page.goto("/play");
    const images = page.locator("[data-palette-surface] img");
    let transferBytes = 0;
    for (const image of await images.all()) {
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const url = await image.evaluate(element => (element as HTMLImageElement).currentSrc);
      const response = await context.request.get(url, { headers: { Accept: "image/webp" } });
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
      const bytes = await response.body();
      transferBytes += bytes.length;
      const { width } = await sharp(bytes).metadata();
      expect(width).toBeGreaterThanOrEqual(2880);
      expect(width).toBeLessThanOrEqual(paletteImages.width);
    }
    expect(transferBytes).toBeLessThan(1.6 * 1024 * 1024);
  } finally {
    await context.close();
  }
});

test("the 2× converter capture serves a sharp derivative and a full-size link", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage();
    await page.goto("/work");
    const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
    const image = gallery.getByRole("img", { name: /garden photograph preview/ });
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const displayWidth = (await image.boundingBox())!.width;
    const url = await image.evaluate(element => (element as HTMLImageElement).currentSrc);
    const response = await context.request.get(url, { headers: { Accept: "image/webp" } });
    expect(response.ok()).toBe(true);
    const bytes = await response.body();
    const { width } = await sharp(bytes).metadata();
    expect(width).toBeGreaterThanOrEqual(displayWidth * 2);
    expect(width).toBeLessThanOrEqual(2400);
    expect(bytes.length).toBeLessThan(600 * 1024);
    await expect(gallery.getByRole("link", { name: /full-size image.*browser preview/ })).toHaveAttribute("href", "/media/imagegonord/converter-preview-2x.png");
  } finally {
    await context.close();
  }
});
