import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";

async function fixture(page: Page) {
  await page.goto("/work");
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.map(link => (link as HTMLLinkElement).href));
  await page.goto("about:blank");
  await page.setContent(`<base href="http://127.0.0.1:3109/"><html lang="en"><head>${styles.map(href => `<link rel="stylesheet" href="${href}">`).join("")}</head><body><div id="gallery-fixture"></div></body></html>`);
  await page.addScriptTag({ path: resolve(".test-fixtures/gallery.js") });
  await expect(page.getByRole("region", { name: "Single", exact: true })).toBeVisible();
}

for (const width of [390, 834, 1440]) {
  test(`gallery controls, peeking frame and overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/work");
    const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
    const list = gallery.locator("ol");
    const first = await list.locator("li").first().boundingBox();
    const bounds = await list.boundingBox();
    const expected = width >= 1200 ? 0.48 : width >= 768 ? 0.76 : 0.88;
    expect(first!.width / bounds!.width).toBeCloseTo(expected, 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const previous = gallery.getByRole("button", { name: /Previous/ });
    const next = gallery.getByRole("button", { name: /Next/ });
    await expect(previous).toBeDisabled();
    await next.focus();
    await page.keyboard.press("Enter");
    await expect(next).toBeFocused();
    await expect(gallery.getByRole("status")).toContainText("2 of 3");
    await page.keyboard.press("Enter");
    await expect(next).toBeDisabled();
    await previous.click();
    await expect(gallery.getByRole("status")).toContainText("2 of 3");
    await previous.click();
    await expect(previous).toBeDisabled();
  });
}

test("reduced motion is immediate and manual browsing does not announce every scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  const list = gallery.locator("ol");
  await gallery.getByRole("button", { name: /Next/ }).click();
  expect(await list.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  const announcement = await gallery.getByRole("status").textContent();
  await list.dispatchEvent("pointerdown");
  await list.evaluate(el => { el.scrollLeft = el.scrollWidth; });
  await expect(gallery.getByText("3 of 3", { exact: true })).toBeVisible();
  expect(await gallery.getByRole("status").textContent()).toBe(announcement);
  await list.locator("a").first().focus();
  await expect(list.locator("a").first()).toBeFocused();
});

test("slow and failed images keep their dimensions, captions and project link", async ({ page }) => {
  let release!: () => void;
  const wait = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/_next/image?**", async route => { await wait; await route.abort(); });
  await page.goto("/work", { waitUntil: "domcontentloaded" });
  const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  await expect(gallery.getByText("Loading image…").first()).toBeVisible();
  const frame = gallery.locator("figure > div").first();
  const before = await frame.boundingBox();
  release();
  await expect(gallery.getByText("Image unavailable.").first()).toBeVisible();
  expect((await frame.boundingBox())!.height).toBeCloseTo(before!.height, 1);
  await expect(gallery.getByText("The conversion interface: upload an image and choose palette options.")).toBeVisible();
  await expect(page.locator("#imagegonord").locator("..").getByRole("link", { name: "Explore ImageGoNord on GitHub" })).toBeVisible();
  await gallery.getByRole("button", { name: /Next/ }).click();
  await expect(gallery.getByRole("status")).toContainText("2 of 3");
});

test("without JavaScript the media strip scrolls and captions/links remain readable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work");
  const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  await expect(gallery.locator("li")).toHaveCount(3);
  await expect(gallery.getByRole("button")).toHaveCount(0);
  await expect(gallery.getByText("Loading image…")).toHaveCount(0);
  await gallery.locator("ol").evaluate(el => { el.scrollLeft = el.scrollWidth; });
  expect(await gallery.locator("ol").evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await expect(gallery.getByRole("link").last()).toBeVisible();
  await context.close();
});

test("single/empty/missing items and native video controls have honest states", async ({ page }) => {
  await page.route("**/fixture-clip.webm", route => route.fulfill({ path: resolve("e2e/fixtures/clip.webm"), contentType: "video/webm" }));
  await page.route("**/fixture-captions.vtt", route => route.fulfill({ body: "WEBVTT\n\n00:00.000 --> 00:01.000\nA silent test clip.\n", contentType: "text/vtt" }));
  await fixture(page);
  await expect(page.getByRole("region", { name: "Empty", exact: true })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Single", exact: true }).getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Missing", exact: true }).getByText("Image unavailable.")).toBeVisible();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).not.toHaveAttribute("autoplay");
  await expect(video).toHaveAttribute("preload", "none");
  expect(await video.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(el => (el as HTMLVideoElement).play());
  expect(await video.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  await page.getByRole("region", { name: "Video", exact: true }).getByRole("button", { name: /Next/ }).click();
  expect(await video.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  await page.getByText("Video transcript", { exact: true }).click();
  await expect(page.getByText("A silent test clip for gallery controls.")).toBeVisible();
});

test("failed video preserves transcript and credit", async ({ page }) => {
  await page.route("**/fixture-clip.webm", route => route.abort());
  await fixture(page);
  await page.locator("video").evaluate(el => (el as HTMLVideoElement).load());
  await expect(page.getByText("Video unavailable.")).toBeVisible();
  await expect(page.getByText("Test-only sample")).toBeVisible();
  await page.getByText("Video transcript", { exact: true }).click();
  await expect(page.getByText("A silent test clip for gallery controls.")).toBeVisible();
});

test("native touch gestures browse media and still scroll the page vertically", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/work");
  await expect(page.getByRole("button", { name: /Next media in ImageGoNord/ })).toBeVisible();
  const list = page.getByRole("region", { name: "ImageGoNord media", exact: true }).locator("ol");
  await list.scrollIntoViewIfNeeded();
  const session = await context.newCDPSession(page);
  async function swipe(x: number, y: number, dx: number, dy: number) {
    await session.send("Input.synthesizeScrollGesture", {
      x, y, xDistance: dx, yDistance: dy, gestureSourceType: "touch", speed: 500,
    });
  }

  let box = await list.boundingBox();
  await swipe(box!.x + 280, Math.max(80, box!.y + 80), -200, 0);
  await expect.poll(() => list.evaluate(el => el.scrollLeft)).toBeGreaterThan(10);
  const before = await page.evaluate(() => scrollY);
  box = await list.boundingBox();
  await swipe(box!.x + 150, Math.max(180, box!.y + 180), 0, -120);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 10);
  await context.close();
});
