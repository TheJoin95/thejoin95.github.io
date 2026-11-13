import { test, expect, firefox, webkit, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import journalSlugs from "../src/content/journal-routes.json";

const article = "/blog/2019-12-21-microfrontend-from-00-to-20s";
const pages = ["/", "/work", "/play", "/blog", "/about", "/newsletter/confirmed", "/not-a-page", "/work/imagegonord", "/work/supermarket", "/work/chromatique"];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
async function scan(page: Page) { return new AxeBuilder({ page }).withTags(tags).analyze(); }
async function noOverflow(page: Page) {
  const size = await page.evaluate(() => ({ path: location.pathname, width: innerWidth, scroll: document.documentElement.scrollWidth }));
  expect(size.scroll, `${size.path} at ${size.width}px`).toBeLessThanOrEqual(size.width);
}

for (const width of [320, 1440]) test(`axe checks every public template and all sixteen preserved articles at ${width}px`, async ({ page }, info) => {
  test.setTimeout(120000); await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ reducedMotion: "reduce" });
  const evidence = [];
  for (const path of [...pages, ...journalSlugs.map(slug => `/blog/${slug}`)]) {
    const response = await page.goto(path); await expect(page.locator("h1")).toHaveCount(1);
    expect(response!.status()).toBe(path === "/not-a-page" ? 404 : 200);
    const result = await scan(page);
    evidence.push({ path, width, status: response!.status(), violations: result.violations, incomplete: result.incomplete.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), passes: result.passes.length });
    expect.soft(result.violations, path).toEqual([]); await noOverflow(page);
  }
  const file = info.outputPath("axe-results.json"); writeFileSync(file, JSON.stringify({ axe: "4.14.0", browser: "Chromium", browserVersion: page.context().browser()?.version(), tags, evidence }, null, 2));
  await info.attach("axe-results", { path: file, contentType: "application/json" });
});

test("phone landscape, tablet, ultrawide, 200% text and text spacing retain content without page overflow", async ({ page }) => {
  test.setTimeout(120000); await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[320, 844], [390, 844], [844, 390], [834, 1112], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    const paths = width === 320 ? [...pages, ...journalSlugs.map(slug => `/blog/${slug}`)] : [...pages, article];
    for (const path of [...paths, "/blog?q=" + "x".repeat(160)]) {
      await page.goto(path); await expect(page.locator("h1")).toBeVisible();
      await page.addStyleTag({ content: "html { font-size: 200% } p { line-height: 1.5 !important; margin-bottom: 2em !important } main { letter-spacing: .12em !important; word-spacing: .16em !important }" });
      await noOverflow(page);
      for (const control of await page.locator('button:not(:disabled), input:not([type="hidden"]):not(:disabled), select').all()) {
        if (await control.isVisible()) expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
});

test("keyboard skip, focus and tab flow stay visible across the full page set", async ({ page }) => {
  test.setTimeout(120000); await page.setViewportSize({ width: 320, height: 844 }); await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [...pages, article]) {
    await page.goto(path); await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toBeFocused();
    await page.keyboard.press("Enter"); await expect(page.locator("#main-content")).toBeFocused();
    const visited = new Set<string>();
    for (let step = 0; step < 45; step++) {
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement, rect = el.getBoundingClientRect(), style = getComputedStyle(el);
        return { key: `${el.tagName}:${el.id}:${el.textContent?.trim().slice(0, 80)}:${el.getAttribute("href")}`, body: el === document.body,
          visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth,
          outline: parseFloat(style.outlineWidth) };
      });
      if (focus.body || visited.has(focus.key)) break;
      visited.add(focus.key); expect(focus.visible, `${path}: ${focus.key}`).toBe(true); expect(focus.outline, `${path}: ${focus.key}`).toBeGreaterThanOrEqual(2);
    }
    expect(visited.size).toBeGreaterThan(2);
  }
});

async function contrast(control: ReturnType<Page["getByRole"]>) {
  return control.evaluate(el => {
    const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    function rgb(color: string) { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3); }
    function luminance(color: string) { return rgb(color).map(channel => { const c = channel / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0); }
    const style = getComputedStyle(el), a = luminance(style.color), b = luminance(style.backgroundColor);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  });
}

test("dark gallery controls retain text contrast on hover and expose distinct live media status", async ({ page }) => {
  await page.goto("/"); const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  const next = gallery.getByRole("button", { name: /Next media/ });
  await next.hover(); await page.waitForTimeout(200); expect(await contrast(next)).toBeGreaterThanOrEqual(4.5);
  await next.click(); await expect(gallery.getByRole("status")).toContainText("2 of 3");
  const previous = gallery.getByRole("button", { name: /Previous media/ });
  await previous.hover(); await page.waitForTimeout(200); expect(await contrast(previous)).toBeGreaterThanOrEqual(4.5);
  const state = await gallery.ariaSnapshot(); expect(state).toContain("status:"); expect(state).toContain("2 of 3");
});

test("newsletter failures focus their explanation, preserve the email, and distinguish field errors from service failure", async ({ page }) => {
  let status = 503;
  await page.route("**/api/newsletter", route => route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ message: status === 400 ? "Please enter a valid email address." : status === 200 ? "Please check your email to confirm." : "Newsletter signup is unavailable. Please try again later." }) }));
  await page.goto("/"); const email = page.getByRole("textbox", { name: "Email address" }), submit = page.getByRole("button", { name: "Subscribe", exact: true }), message = page.locator("#newsletter-status");
  await email.fill("reader@example.com"); await submit.click();
  await expect(message).toBeFocused(); await expect(message).toContainText("unavailable"); await expect(email).not.toHaveAttribute("aria-invalid", "true"); await expect(email).toHaveValue("reader@example.com");
  expect(await scan(page).then(result => result.violations)).toEqual([]);
  status = 400; await submit.click(); await expect(message).toBeFocused(); await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAttribute("aria-describedby", "newsletter-status");
  status = 200; await submit.click(); await expect(page.getByRole("status").filter({ hasText: "check your email" })).toBeVisible(); await expect(email).toHaveValue(""); await expect(message).not.toBeFocused();
});

test("no-script newsletter cannot leak an email through GET and retains its RSS alternative", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3109/");
  await expect(page.getByRole("textbox", { name: "Email address" })).toBeDisabled(); await expect(page.getByRole("button", { name: "Subscribe", exact: true })).toBeDisabled();
  await expect(page.getByRole("link", { name: "follow the Journal by RSS", exact: true })).toHaveAttribute("href", "/rss.xml");
  await context.close();
});

test("forced colours retain visible native search focus", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" }); await page.goto("/blog");
  const search = page.getByRole("searchbox", { name: "Search writing" }); await search.focus();
  await expect(search).toHaveCSS("outline-style", "solid");
  expect(parseFloat(await search.evaluate(el => getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(2);
});

test("error recovery announces a visible primary heading and its keyboard Retry executes the actual callback", async ({ page }) => {
  await page.goto("/about");
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(elements => elements.map(el => (el as HTMLLinkElement).href));
  await page.setContent(`<html lang="en"><head><base href="http://127.0.0.1:3109/"><title>Accessibility error fixture</title>${styles.map(href => `<link rel="stylesheet" href="${href}">`).join("")}</head><body><main id="accessibility-fixture"></main></body></html>`);
  await page.addScriptTag({ path: resolve(".test-fixtures/accessibility.js") });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page could not load."); await expect(page.getByRole("alert")).toBeVisible();
  expect(await scan(page).then(result => result.violations)).toEqual([]);
  await page.getByRole("button", { name: "Try again", exact: true }).focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("The recovery callback ran.");
});

for (const [name, engine] of [["Firefox", firefox], ["WebKit", webkit]] as const) test(`${name} phone/desktop layout, keyboard, fox and Journal discovery`, async () => {
  test.setTimeout(120000); const browser = await engine.launch();
  try {
    // Independent device sessions also avoid the Firefox driver navigation-bookkeeping
    // hang when a cached article is revisited after a streamed search response.
    console.info(`${name} ${browser.version()}`);
    for (const width of [320, 1440]) {
      const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width, height: 1000 } });
      const page = await context.newPage();
      try {
      for (const path of ["/", "/work", "/play", "/about", "/blog", article]) {
        await page.goto(`http://127.0.0.1:3109${path}`); await expect(page.locator("h1")).toBeVisible(); await noOverflow(page);
      }
      await page.goto("http://127.0.0.1:3109/play"); const trigger = page.getByRole("button", { name: "Meet the fox", exact: true });
      await trigger.focus(); await page.keyboard.press("Enter"); await expect(page.getByRole("region", { name: "A quiet corner.", exact: true })).toBeVisible(); await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
      await page.goto("http://127.0.0.1:3109/blog"); await page.getByRole("searchbox", { name: "Search writing" }).fill("microfrontend"); await page.getByRole("button", { name: "Search", exact: true }).click();
      await expect(page.getByRole("list", { name: "Archive articles" }).getByRole("listitem")).toHaveCount(1);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
});

test("open fox, empty search and failed gallery media remain accessible states", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/play");
  await page.getByRole("button", { name: "Meet the fox", exact: true }).click(); await expect(page.getByRole("region", { name: "A quiet corner.", exact: true })).toBeVisible();
  expect(await scan(page).then(result => result.violations)).toEqual([]);
  await page.goto("/blog?q=no-result-accessibility-specimen"); await expect(page.getByRole("heading", { name: "No matching articles.", exact: true })).toBeVisible();
  expect(await scan(page).then(result => result.violations)).toEqual([]);
  await page.route("**/_next/image?**", route => decodeURIComponent(route.request().url()).includes("/media/imagegonord/") ? route.abort() : route.continue());
  await page.goto("/"); const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true }); await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.getByText("Image unavailable.", { exact: false }).first()).toBeVisible();
  expect(await scan(page).then(result => result.violations)).toEqual([]);
});

test("audit captures confirm the fixed controls at phone and desktop sizes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/"); const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
    await gallery.getByRole("button", { name: /Next media/ }).hover(); await page.waitForTimeout(200);
    await gallery.screenshot({ path: `/tmp/mic26-gallery-${width}.png` });
  }
});

test("removed 3D URL redirects to Play and is absent from public navigation", async ({ page, request }) => {
  const response = await request.get("/experience", { maxRedirects: 0 });
  expect(response.status()).toBe(308); expect(response.headers().location).toBe("/play");
  await page.goto("/experience"); await expect(page).toHaveURL(/\/play$/);
  await expect(page.locator('a[href="/experience"]')).toHaveCount(0);
});
