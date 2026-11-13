import { test, expect } from "@playwright/test";

for (const path of ["/", "/play"]) test(`${path} requests responsive palette media without raw fallback downloads or initial animation/font services`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = []; page.on("request", request => requests.push(request.url()));
  await page.goto(path); await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const stage = page.getByRole("region", { name: "Chromatique palette comparison", exact: true });
  await stage.scrollIntoViewIfNeeded();
  for (const image of await stage.locator("img").all()) {
    await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const source = new URL(await image.evaluate(el => (el as HTMLImageElement).currentSrc));
    expect(source.pathname).toBe("/_next/image"); expect(Number(source.searchParams.get("w"))).toBeLessThanOrEqual(1080);
  }
  // Small SVG diagrams remain native; raster originals are the duplicate downloads.
  expect(requests.filter(url => /^\/media\/.*\.(png|jpe?g)$/.test(new URL(url).pathname))).toEqual([]);
  expect(requests.some(url => /\.wasm|\.lottie|fonts\.google|fonts\.gstatic|api\.brevo/.test(url))).toBe(false);
  await expect(stage.getByRole("slider", { name: "Palette reveal" })).toBeEnabled();
  await stage.getByRole("slider").focus(); await page.keyboard.press("End"); await expect(stage.getByRole("slider")).toHaveValue("100");
});

test("image optimizer serves smaller phone derivatives while full-size originals remain available", async ({ request }) => {
  for (const source of ["/media/chromatique/irises-original.jpg", "/media/chromatique/irises-nord.png"]) {
    const original = await request.get(source);
    const optimized = await request.get(`/_next/image?url=${encodeURIComponent(source)}&w=828&q=75`, { headers: { Accept: "image/webp" } });
    expect(original.status()).toBe(200); expect(optimized.status()).toBe(200);
    expect(optimized.headers()["content-type"]).toContain("image/webp");
    expect((await optimized.body()).length).toBeLessThan((await original.body()).length * .7);
  }
});
