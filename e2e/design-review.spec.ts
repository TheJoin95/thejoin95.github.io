import { test, expect } from "@playwright/test";

test("approved page introductions retain their phone tablet and desktop compositions", async ({ page }) => {
  for (const width of [390, 834, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/work", "/blog", "/play", "/about"]) {
      const response = await page.goto(new URL(path, process.env.REVIEW_BASE_URL || "http://127.0.0.1:3109").href);
      expect(response!.status(), path).toBe(200);
      await expect(page.locator("body")).toHaveCSS("font-family", "Arial, Helvetica, sans-serif");
      const columns = await page.locator("h1").evaluate(heading => getComputedStyle(heading.parentElement!).gridTemplateColumns.split(" ").map(Number.parseFloat));
      expect(columns).toHaveLength(width < 768 ? 1 : 2);
      if (columns.length === 2) {
        const expected = width < 1200 ? 5 / 3 : path === "/" ? 7 / 5 : 2;
        expect(columns[0] / columns[1], `${path} at ${width}px`).toBeCloseTo(expected, 2);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} overflow at ${width}px`).toBe(true);
    }
  }
});

test("review build loads its assets and supports the complete visitor journey", async ({ page, request }) => {
  const origin = process.env.REVIEW_BASE_URL || "http://127.0.0.1:3109";
  const failedAssets: string[] = [];
  page.on("response", response => {
    if (response.url().includes("/_next/static/") && response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(origin);
  const stage = page.getByRole("region", { name: "Chromatique palette comparison", exact: true });
  const range = stage.getByRole("slider", { name: "Palette reveal" });
  await range.focus(); await page.keyboard.press("End"); await expect(range).toHaveValue("100");
  await stage.getByRole("button", { name: "Reset comparison" }).click(); await expect(range).toHaveValue("50");
  const fox = page.getByRole("button", { name: "Meet the fox", exact: true });
  await fox.click(); await expect(page.getByRole("region", { name: "A quiet corner.", exact: true })).toBeVisible();
  await page.keyboard.press("Escape"); await expect(fox).toBeFocused();
  const gallery = page.getByRole("region", { name: "ImageGoNord media", exact: true });
  await gallery.getByRole("button", { name: /Next media/ }).click(); await expect(gallery.getByRole("status")).toContainText("2 of 3");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Journal", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search writing" }).fill("micro frontends");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const archive = page.getByRole("list", { name: "Archive articles" });
  await expect(archive.getByRole("listitem")).toHaveCount(1); await archive.locator("h3 a").click();
  await expect(page.locator("article h1")).toHaveText("Micro Frontends - From the 00s to 20s");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page.locator("main")).toContainText("Senior Software Engineer at Adobe");
  await page.getByRole("link", { name: "Contact & CV", exact: true }).click(); await expect(page).toHaveURL(/#contact$/);
  const pdf = await request.get(new URL("/miki-lombardi-resume.pdf", origin).href);
  expect(pdf.status()).toBe(200); expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await request.get(new URL("/not-a-page", origin).href)).status()).toBe(404);
  expect(failedAssets).toEqual([]);
});
