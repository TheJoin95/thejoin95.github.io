import { test, expect } from "@playwright/test";

test("editorial hierarchy keeps the opening and project rhythm proportionate", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const header = await page.locator("header").boundingBox();
  const title = await page.locator("h1").boundingBox();
  const work = await page.getByRole("region", { name: "Selected work", exact: true }).boundingBox();
  // Keep meaningful image content in the first viewport, with breathing room
  // around the headline, rather than spending most of it on navigation/gaps.
  expect(header!.height).toBeLessThanOrEqual(190);
  expect(title!.y - header!.height).toBeGreaterThanOrEqual(40);
  expect(work!.y).toBeLessThanOrEqual(650);
  const sizes = await page.locator("h1").evaluate(heading => ({
    title: parseFloat(getComputedStyle(heading).fontSize),
    lead: parseFloat(getComputedStyle(heading.nextElementSibling!).fontSize),
  }));
  expect(sizes.title).toBe(sizes.lead);
  expect(sizes.title).toBeLessThanOrEqual(40);
  const projects = page.locator('section[aria-label="Selected work"] > section');
  await expect(projects).toHaveCount(3);
  const logo = await page.getByRole("link", { name: "Miki Lombardi — Home", exact: true }).boundingBox();
  const headerColumn = await page.locator(".site-header p").boundingBox();
  const projectTitle = await projects.first().getByRole("heading").boundingBox();
  const track = projects.first().locator("ol");
  const trackBox = await track.boundingBox();
  const slide = await track.locator("li").first().boundingBox();
  expect(title!.x).toBeCloseTo(logo!.x, 0);
  expect(projectTitle!.x).toBeCloseTo(logo!.x, 0);
  expect(trackBox!.x).toBeCloseTo(headerColumn!.x, 0);
  expect(slide!.width / trackBox!.width).toBeCloseTo(0.64, 2);
  for (const project of await projects.all()) {
    const spacing = await project.evaluate(element => ({
      top: parseFloat(getComputedStyle(element).paddingTop),
      bottom: parseFloat(getComputedStyle(element).paddingBottom),
    }));
    expect(spacing.top + spacing.bottom).toBeLessThanOrEqual(88);
  }
});

test("approved page introductions retain their phone tablet and desktop compositions", async ({ page }) => {
  for (const width of [390, 834, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/work", "/blog", "/play", "/about"]) {
      const response = await page.goto(new URL(path, process.env.REVIEW_BASE_URL || "http://127.0.0.1:3109").href);
      expect(response!.status(), path).toBe(200);
      await expect(page.locator("body")).toHaveCSS("font-family", /Instrument Sans Extended.*instrumentSans/i);
      const header = await page.locator(".site-header").boundingBox();
      const homeLink = await page.getByRole("link", { name: "Miki Lombardi — Home", exact: true }).boundingBox();
      const title = await page.locator("h1").boundingBox();
      expect(header!.height, `Header at ${width}px`).toBeLessThanOrEqual(165);
      expect(title!.x, `Shared left gutter on ${path} at ${width}px`).toBeCloseTo(homeLink!.x, 0);
      expect(title!.y - header!.height, `Intro breathing room on ${path} at ${width}px`).toBeGreaterThanOrEqual(30);
      expect(title!.y - header!.height, `Intro spacing on ${path} at ${width}px`).toBeLessThanOrEqual(50);
      const columns = await page.locator("h1").evaluate(heading => getComputedStyle(heading.parentElement!).gridTemplateColumns.split(" ").map(Number.parseFloat));
      expect(columns).toHaveLength(width < 768 ? 1 : 2);
      if (columns.length === 2) {
        const expected = width < 1200 ? 5 / 3 : 2;
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
  await page.goto(new URL("/play", origin).href);
  const stage = page.getByRole("region", { name: "Chromatique palette comparison", exact: true });
  const range = stage.getByRole("slider", { name: "Palette reveal" });
  await range.focus(); await page.keyboard.press("End"); await expect(range).toHaveValue("100");
  await stage.getByRole("button", { name: "Reset comparison" }).click(); await expect(range).toHaveValue("50");
  await page.goto(origin);
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

test("editorial text scales to 200% and wraps on narrow layouts", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/work", "/blog", "/play", "/about", "/blog/2017-06-01-raspberry-wont-boot-make-backup-with-chroot-shell"]) {
    await page.goto(path);
    const heading = page.getByRole("heading", { level: 1 });
    const normalSize = await heading.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    const resized = await heading.evaluate(element => ({
      size: parseFloat(getComputedStyle(element).fontSize),
      fits: element.scrollWidth <= element.clientWidth + 1,
      pageFits: document.documentElement.scrollWidth <= innerWidth,
    }));
    expect(resized.size, path).toBeCloseTo(normalSize * 2, 0);
    expect(resized.fits, path).toBe(true);
    expect(resized.pageFits, path).toBe(true);
  }
});

test("the editorial font is served locally and covers Latin diacritics", async ({ page }) => {
  const fontResponses: string[] = [];
  page.on("response", response => {
    if (response.request().resourceType() === "font" && response.ok()) fontResponses.push(response.url());
  });
  await page.goto("/");
  const faces = await page.evaluate(async () => {
    const probe = document.createElement("span");
    probe.textContent = "Àéì ČŁž";
    document.querySelector("main")!.append(probe);
    const family = getComputedStyle(probe).fontFamily;
    const fonts = await document.fonts.load(`400 24px ${family}`, probe.textContent);
    return fonts.filter(font => font.status === "loaded").map(font => font.family);
  });
  expect(faces.some(family => /instrumentSans/i.test(family))).toBe(true);
  expect(faces).toContain("Instrument Sans Extended");
  expect(fontResponses).toHaveLength(2);
  expect(fontResponses.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test("a slow font response keeps the first layout stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const release = Promise.withResolvers<void>();
  const requested = Promise.withResolvers<void>();
  await page.route("**/*.woff2", async route => {
    requested.resolve();
    await release.promise;
    await route.continue();
  });
  const work = page.getByRole("region", { name: "Selected work", exact: true });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await requested.promise;
    await work.waitFor({ state: "visible" });
    // Wait past the optional face's initial block period while the request is held.
    await page.waitForTimeout(200);
    const before = await work.boundingBox();
    release.resolve();
    await page.evaluate(() => document.fonts.ready.then(() => {}));
    expect((await work.boundingBox())!.y).toBeCloseTo(before!.y, 0);
  } finally {
    release.resolve();
  }
});
