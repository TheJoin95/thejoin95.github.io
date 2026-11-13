import { expect, test, type Page } from "@playwright/test";

const companion = (page: Page) => page.locator("[data-fox-companion]");
const corner = (page: Page) => page.getByRole("region", { name: "A quiet corner.", exact: true });
async function enter(page: Page, path = "/") {
  await page.goto(path);
  await expect(companion(page).getByRole("button", { name: "Meet the fox", exact: true })).toBeVisible();
  return companion(page);
}

for (const path of ["/", "/play"]) test(`one quiet fox, no autoplay fetch, keyboard reactions and close at ${path}`, async ({ page }) => {
  const clips: string[] = [], wasm: string[] = [];
  page.on("request", request => {
    if (request.url().endsWith(".lottie")) clips.push(request.url());
    if (request.url().endsWith(".wasm")) wasm.push(request.url());
  });
  const fox = await enter(page, path); const trigger = fox.getByRole("button", { name: "Meet the fox", exact: true });
  await expect(fox.locator("img")).toHaveCount(1); await expect(fox.locator("canvas")).toHaveCount(0);
  expect(clips).toHaveLength(0); expect(wasm).toHaveLength(0);
  await trigger.focus(); await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true"); await expect(corner(page)).toBeVisible();
  await expect(fox.locator("canvas")).toBeVisible(); await expect(fox.locator("canvas")).not.toHaveClass(/opacity-0/);
  await expect(fox.locator("canvas")).toHaveCount(0); await expect(fox.locator("img")).toHaveCount(1);
  for (const [label, clip] of [["Look around", "follow"], ["Take a breath", "settle"]]) {
    const button = corner(page).getByRole("button", { name: label, exact: true });
    await page.keyboard.press("Tab"); await expect(button).toBeFocused(); await page.keyboard.press("Space");
    await expect(fox.locator("canvas")).toBeVisible(); await expect(fox.locator("canvas")).toHaveCount(0);
    expect(clips.some(src => src.endsWith(`/${clip}.lottie`))).toBe(true);
  }
  expect(clips.some(src => src.endsWith("/notice.lottie"))).toBe(true);
  await page.keyboard.press("Escape"); await expect(corner(page)).toHaveCount(0); await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter"); await expect(corner(page)).toBeVisible();
  await corner(page).getByRole("button", { name: "Close fox corner", exact: true }).click();
  await expect(trigger).toBeFocused(); await expect(fox.locator("canvas")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
});

test("phone touch actions, inline dismissal and 200% text preserve scrolling and readable controls", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage(); const fox = await enter(page, "/play");
  await fox.getByRole("button", { name: "Meet the fox", exact: true }).tap(); await expect(corner(page)).toBeVisible();
  await corner(page).getByRole("button", { name: "Take a breath", exact: true }).tap();
  await expect(fox.locator("canvas")).toHaveCount(0); await expect(fox.locator("img")).toHaveCount(1);
  await page.addStyleTag({ content: "html { font-size: 200% }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const name of ["Look around", "Take a breath", "Close fox corner"]) await expect(corner(page).getByRole("button", { name, exact: true })).toBeVisible();
  await page.evaluate(() => scrollBy(0, 300)); expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await corner(page).getByRole("button", { name: "Close fox corner", exact: true }).tap();
  await expect(fox.getByRole("button", { name: "Meet the fox", exact: true })).toBeFocused();
  await context.close();
});

test("reduced motion changes cancel reactions; offscreen return never replays a cancelled clip", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); const fox = await enter(page);
  const trigger = fox.getByRole("button", { name: "Meet the fox", exact: true });
  await trigger.hover(); await page.mouse.down();
  await expect(trigger).toHaveCSS("translate", "none");
  await page.mouse.up(); await expect(fox.locator("canvas")).toHaveCount(0);
  expect(await corner(page).evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  await page.emulateMedia({ reducedMotion: "no-preference" }); await expect(fox.locator("canvas")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" }); await expect(fox.locator("canvas")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" }); await expect(fox.locator("canvas")).toHaveCount(0);
  await corner(page).getByRole("button", { name: "Take a breath", exact: true }).click();
  await expect(fox.locator("canvas")).toBeVisible();
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await expect(fox.locator("canvas")).toHaveCount(0);
  await trigger.scrollIntoViewIfNeeded(); await expect(fox.locator("canvas")).toHaveCount(0);
  await expect(fox.locator("img")).toBeVisible();
});

test("public fox pauses in a simulated hidden tab and resumes its unfinished reaction", async ({ page }) => {
  const fox = await enter(page); await fox.getByRole("button", { name: "Meet the fox", exact: true }).click();
  const canvas = fox.locator("canvas"); await expect(canvas).not.toHaveClass(/opacity-0/);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  // Longer than the complete notice clip: a paused reaction must still be mounted.
  await page.waitForTimeout(1200); await expect(canvas).toHaveCount(1);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(canvas).toHaveCount(0); await expect(fox.locator("img")).toBeVisible();
});

for (const failed of ["clip", "wasm", "poster", "player chunk"]) test(`failed ${failed} preserves the quiet corner, close and page content`, async ({ page }) => {
  let failures = 0;
  if (failed === "clip") await page.route("**/animations/fox/*.lottie", route => { failures++; return route.abort(); });
  if (failed === "wasm") await page.route("**/animations/runtime/*.wasm", route => { failures++; return route.abort(); });
  if (failed === "poster") await page.route("**/characters/fox/rest.svg", route => route.abort());
  if (failed === "player chunk") await page.route("**/_next/static/chunks/*.js", async route => {
    const response = await route.fetch();
    if ((await response.text()).includes("/animations/runtime/dotlottie-player.wasm")) { failures++; await route.abort(); }
    else await route.fulfill({ response });
  });
  const fox = await enter(page); await fox.getByRole("button", { name: "Meet the fox", exact: true }).click();
  await expect(corner(page)).toBeVisible();
  if (failed === "poster") {
    await corner(page).getByRole("button", { name: "Close fox corner", exact: true }).click();
    await expect(fox.locator("img")).toHaveCount(0);
    await fox.getByRole("button", { name: "Meet the fox", exact: true }).click();
  } else {
    await expect(fox.locator("img")).toBeVisible();
    await expect.poll(() => failures).toBeGreaterThan(0);
    await expect(fox.locator("canvas")).toHaveCount(0);
  }
  await corner(page).getByRole("button", { name: "Close fox corner", exact: true }).click();
  await expect(fox.getByRole("button", { name: "Meet the fox", exact: true })).toBeFocused();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore all work", exact: true })).toBeVisible();
});

test("no-script pages retain one decorative fox and all essential content without dead controls", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ["/", "/play"]) {
    await page.goto(path); const fox = companion(page);
    await expect(fox.locator("img")).toHaveCount(1); await expect(fox.locator("img")).toHaveAttribute("alt", "");
    await expect(fox.getByRole("button")).toHaveCount(0); await expect(fox.locator("canvas")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible(); await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  }
  for (const path of ["/about", "/work", "/blog"]) { await page.goto(path); await expect(companion(page)).toHaveCount(0); }
  await context.close();
});

test("closed and open introductions fit the approved phone tablet desktop framing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 834, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); const fox = await enter(page);
    const poster = fox.locator("img"), size = (await poster.boundingBox())!;
    expect(size.width).toBe(width >= 1200 ? 80 : 48); expect(size.width / size.height).toBeCloseTo(1.2, 2);
    const intro = page.locator("h1").locator("..");
    const headingTop = (await page.locator("h1").boundingBox())!.y + await page.evaluate(() => scrollY);
    await intro.screenshot({ path: `/tmp/mic23-intro-${width}-closed.png` });
    await fox.getByRole("button", { name: "Meet the fox", exact: true }).click();
    await expect(fox.locator("canvas")).toHaveCount(0);
    await expect(corner(page)).toBeVisible();
    expect((await page.locator("h1").boundingBox())!.y + await page.evaluate(() => scrollY)).toBeCloseTo(headingTop, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await intro.screenshot({ path: `/tmp/mic23-intro-${width}-open.png` });
  }
});

test("corner entrance actually transitions once and reduced motion removes it", async ({ page }) => {
  await page.addInitScript(() => {
    window.foxTransitions = [];
    document.addEventListener("transitionrun", event => {
      if ((event.target as HTMLElement).hasAttribute("data-fox-entrance")) window.foxTransitions.push(event.propertyName);
    });
  });
  const fox = await enter(page), trigger = fox.getByRole("button", { name: "Meet the fox", exact: true });
  await trigger.click();
  await expect.poll(() => page.evaluate(() => window.foxTransitions.sort())).toEqual(["opacity", "transform"]);
  await page.keyboard.press("Escape"); await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => { window.foxTransitions = []; });
  await trigger.click();
  expect(await fox.locator("[data-fox-entrance]").evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  await page.waitForTimeout(250); expect(await page.evaluate(() => window.foxTransitions)).toEqual([]);
});

declare global { interface Window { foxTransitions: string[] } }
