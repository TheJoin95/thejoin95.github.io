import { expect, test } from "@playwright/test";

const routes = ["/", "/work", "/blog", "/play", "/about", "/lab", "/newsletter/confirmed"];
for (const width of [320, 390, 768, 1024, 1200, 1440]) {
  test(`shell reflows and all destinations work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const link of await page.getByRole("navigation", { name: "Primary" }).getByRole("link").all()) {
        await expect(link).toBeVisible();
        // The Suspense navigation fallback may be replaced between reads.
        await expect.poll(async () => (await link.boundingBox())?.height || 0).toBeGreaterThanOrEqual(44);
        await expect.poll(async () => (await link.boundingBox())?.width || 0).toBeGreaterThanOrEqual(44);
      }
      if (["/work", "/blog", "/play", "/about", "/lab"].includes(route)) {
        await expect(page.locator(`nav[aria-label="Primary"] a[href="${route}"]`)).toHaveAttribute("aria-current", "page");
      }
    }
  });
}

test("skip link and keyboard navigation work across client transitions", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const work = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work", exact: true });
  await work.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work$/);
  await expect(work).toHaveAttribute("aria-current", "page");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveTitle("About | Miki Lombardi");
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", "/miki-lombardi-resume.pdf");
});

test("no-script navigation, PDF and useful 404", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  for (const [label, route] of [["Work", "/work"], ["Journal", "/blog"], ["Play", "/play"], ["About", "/about"], ["Lab", "/lab"]]) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator("h1")).toBeVisible();
  }
  const pdf = await context.request.get("/miki-lombardi-resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await page.goto("/does-not-exist"))?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
  await page.locator("main").getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL("/");
  await context.close();
});

test("large text and reduced motion preserve the shell", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work", exact: true })).toBeVisible();
  expect(await page.locator('a[href="/work"]').first().evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
});

test("newsletter controls retain sizing, disabled feedback and invalid focus", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Email address" });
  const button = page.getByRole("button", { name: "Subscribe", exact: true });
  for (const control of [input, button]) {
    await expect(control).toHaveCSS("font-size", "16px");
    await expect(control).toHaveCSS("border-radius", "4px");
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await input.evaluate((el) => el.setAttribute("aria-invalid", "true"));
  await input.focus();
  await expect(input).toHaveCSS("outline-width", "3px");
  await expect(input).toHaveCSS("outline-style", "solid");
  await expect(input).toHaveCSS("box-shadow", "none");
  await button.focus();
  await expect(button).toHaveCSS("outline-width", "3px");
  await button.evaluate((el) => (el as HTMLButtonElement).disabled = true);
  await expect(button).toBeDisabled();
  await expect(button).toHaveCSS("opacity", "0.65");
});

test("Lab is crawlable and offers a working colour experiment", async ({ page, request }) => {
  const response = await request.get("/lab", { headers: { "User-Agent": "Googlebot" } });
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("A photograph, two palettes.");
  expect(html).toContain('property="og:image"');
  expect(html).toContain('rel="canonical" href="http://127.0.0.1:3109/lab"');

  await page.goto("/lab");
  const range = page.getByRole("slider", { name: "Palette reveal" });
  await range.focus();
  await page.keyboard.press("End");
  await expect(range).toHaveValue("100");
});

test("client navigation animates the page content and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      if (this.id === "main-content") {
        const count = Number(document.body.dataset.routeMotionCount || 0);
        document.body.dataset.routeMotionCount = String(count + 1);
      }
      return animate.call(this, keyframes, options);
    };
  });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(page.locator("body")).not.toHaveAttribute("data-route-motion-count", /.+/);
  await nav.getByRole("link", { name: "Lab", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Lab", exact: true })).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute("data-route-motion-count", "1");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I’m Miki");
  await expect(page.locator("body")).toHaveAttribute("data-route-motion-count", "2");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Work", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator("body")).toHaveAttribute("data-route-motion-count", "2");
  await expect(page.locator("main")).toHaveCSS("opacity", "1");
});

test("Home, Play and Lab omit the retired mascot and its runtime", async ({ request }) => {
  for (const path of ["/", "/play", "/lab"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toMatch(/Meet the fox|data-fox-companion|\/characters\/fox\/|dotlottie-player\.wasm/);
  }
  expect((await request.get("/characters/fox/rest.svg")).status()).toBe(404);
});
