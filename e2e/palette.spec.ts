import { expect, test, type Page, type Locator } from "@playwright/test";
import sharp from "sharp";

const region = (page: Page) => page.getByRole("region", { name: "Chromatique palette comparison", exact: true });
async function start(page: Page, path = "/") {
  await page.goto(path);
  const stage = region(page);
  await stage.locator("[data-palette-surface]").scrollIntoViewIfNeeded();
  await expect(stage.getByRole("slider", { name: "Palette reveal" })).toBeVisible();
  await page.mouse.move(0, 0);
  return stage;
}
async function expectReveal(stage: Locator, percent: number) {
  await expect(stage.locator("[data-palette-output]")).toHaveCSS("clip-path", `inset(0px 0px 0px ${100 - percent}%)`);
}
test("native reveal shows the real endpoints and combines their correct halves at each breakpoint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 834, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); const stage = await start(page);
    const surface = stage.locator("[data-palette-surface]"); const frames: Buffer[] = [];
    for (const [button, percent] of [["Original", 0], ["Palette", 100], ["Reset comparison", 50]] as const) {
      await stage.getByRole("button", { name: button, exact: true }).click();
      await expect(stage.getByRole("slider")).toHaveValue(String(percent)); await expectReveal(stage, percent);
      frames.push(await surface.screenshot());
    }
    expect(frames[0].equals(frames[1])).toBe(false);
    const metadata = await sharp(frames[2]).metadata();
    const half = Math.floor(metadata.width! / 2);
    const crop = async (frame: Buffer, left: number, width: number) => sharp(frame).extract({ left, top: 0, width, height: metadata.height! }).raw().toBuffer();
    expect((await crop(frames[2], 0, half - 1)).equals(await crop(frames[0], 0, half - 1))).toBe(true);
    expect((await crop(frames[2], half + 1, half - 1)).equals(await crop(frames[1], half + 1, half - 1))).toBe(true);
    await expect(stage.locator("canvas")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await stage.screenshot({ path: `/tmp/mic26-palette-${width}.png` });
  }
});

test("native keyboard and buttons commit, hover previews restore, and mouse drag commits", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); const stage = await start(page);
  const slider = stage.getByRole("slider");
  await slider.focus(); await page.keyboard.press("Home"); await expect(slider).toHaveValue("0");
  await page.keyboard.press("End"); await expect(slider).toHaveValue("100");
  await page.keyboard.press("ArrowLeft"); await expect(slider).toHaveValue("99");
  await expect(slider).toHaveAttribute("aria-valuetext", "99% palette");
  await stage.getByRole("button", { name: "Reset comparison", exact: true }).click();
  const surface = stage.locator("[data-palette-surface]"); const box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + box.width * .25, box.y + box.height * .5);
  await expectReveal(stage, 75);
  await expect(slider).toHaveValue("50");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 10);
  await expectReveal(stage, 50);
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .5); await page.mouse.down(); await page.mouse.move(box.x + box.width * .6, box.y + box.height * .5, { steps: 8 }); await page.mouse.up();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 10); await expect(slider).toHaveValue("40");
});

test("touch uses explicit range input while the image retains vertical page scrolling", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); const stage = await start(page, "/play");
  const slider = stage.getByRole("slider"); await slider.scrollIntoViewIfNeeded(); const box = (await slider.boundingBox())!;
  await page.touchscreen.tap(box.x + box.width * .8, box.y + box.height / 2);
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(70);
  const selected = await slider.inputValue();
  const surface = stage.locator("[data-palette-surface]");
  expect(await surface.evaluate(el => getComputedStyle(el).touchAction)).toBe("pan-y");
  await surface.scrollIntoViewIfNeeded(); const image = (await surface.boundingBox())!;
  const before = await page.evaluate(() => scrollY);
  const session = await context.newCDPSession(page);
  const x = image.x + image.width / 2, y = image.y + image.height * .8;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let delta = 20; delta <= 160; delta += 20) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - delta }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  await expect(slider).toHaveValue(selected);
  await context.close();
});

test("failed media retains an honest explanation, dimensions, provenance and project destination", async ({ page }) => {
  await page.route("**/media/chromatique/irises-nord.png", route => route.abort());
  await page.goto("/play"); const stage = region(page);
  await expect(stage.getByText(/comparison image could not load/)).toBeVisible();
  await expect(stage.getByRole("slider")).toHaveCount(0);
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.getByText(/Photograph: Frances/)).toBeVisible();
  await stage.getByRole("link", { name: /explore the palette study/ }).click();
  await expect(page).toHaveURL(/\/work\/chromatique$/);
});

test("reduced motion suppresses hover but retains immediate native controls and large-text layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); const stage = await start(page);
  const surface = stage.locator("[data-palette-surface]"); const box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + box.width * .1, box.y + 100);
  await expectReveal(stage, 50);
  await stage.getByRole("slider").focus(); await page.keyboard.press("End");
  await expect(stage.getByRole("slider")).toHaveValue("100");
  await surface.click({ position: { x: box.width * .2, y: box.height / 2 } });
  await expect(stage.getByRole("slider")).toHaveValue("80");
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.addStyleTag({ content: "html { font-size: 200% }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const name of ["Original", "Palette", "Reset comparison"]) {
    const button = stage.getByRole("button", { name, exact: true });
    await expect(button).toBeVisible(); await button.hover();
    await page.waitForTimeout(200); // Measure the settled 150ms feedback transition.
    const contrast = await button.evaluate(el => {
      const luminance = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => {
        const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      }).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
      const style = getComputedStyle(el), a = luminance(style.color), b = luminance(style.backgroundColor);
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  }
});

test("palette interaction never requires a canvas or a 3D context", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) throw new Error("Unexpected 3D context");
      return original.call(this, type as "2d", ...args);
    } as typeof original;
  });
  const stage = await start(page); await stage.getByRole("slider").fill("73");
  await expectReveal(stage, 73); await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.getByRole("link", { name: /explore the palette study/ })).toBeVisible();
});
