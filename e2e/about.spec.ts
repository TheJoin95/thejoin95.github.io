import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import inventory from "../docs/content/inventory.json";

for (const width of [320, 390, 834, 1440]) test(`About career, passions and contacts work without scripts at ${width}px`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width, height: 1000 } });
  const page = await context.newPage();
  expect((await page.goto("http://127.0.0.1:3109/about"))!.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Engineering with curiosity.");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator("main")).toContainText("Senior Software Engineer at Adobe");
  const talks = page.getByRole("region", { name: "Software. People. Shared ideas." });
  await expect(talks.locator("li")).toHaveCount(2);
  const passions = page.getByRole("region", { name: "Beyond the keyboard." });
  await expect(passions).toContainText("Cycling & photography.");
  await expect(passions).toContainText("A work in progress.");
  await expect(passions.locator("img, canvas, video")).toHaveCount(0);
  await page.screenshot({ path: `/tmp/mic20-about-${width}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Contact & CV", exact: true }).click();
  await expect(page).toHaveURL(/\/about#contact$/);
  const contacts = page.getByRole("navigation", { name: "Contact", exact: true });
  await expect(contacts.getByRole("link", { name: "Email Miki", exact: true })).toHaveAttribute("href", `mailto:${inventory.profile.email}`);
  await expect(contacts.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", inventory.profile.github);
  await expect(contacts.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", inventory.profile.linkedin);
  const downloadPromise = page.waitForEvent("download");
  await contacts.getByRole("link", { name: "Download CV (PDF)", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("miki-lombardi-resume.pdf");
  expect(createHash("sha256").update(readFileSync((await download.path())!)).digest("hex")).toBe(inventory.profile.cvSha256);
  await page.getByRole("link", { name: "Explore the sketchbook", exact: true }).click();
  await expect(page).toHaveURL(/\/blog#sketchbook$/);
  await expect(page.locator("#sketchbook")).toContainText("No drawings or sketchbook articles are published here yet.");
  await context.close();
});

test("keyboard contact jump, CV download and 200% text remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const contact = page.getByRole("link", { name: "Contact & CV", exact: true });
  await contact.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contact$/);
  const cv = page.getByRole("navigation", { name: "Contact", exact: true }).getByRole("link", { name: "Download CV (PDF)", exact: true });
  const downloadPromise = page.waitForEvent("download"); await cv.focus(); await page.keyboard.press("Enter");
  expect((await downloadPromise).suggestedFilename()).toBe("miki-lombardi-resume.pdf");
  await expect(cv).toBeFocused();
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("About exposes accurate crawler HTML, ProfilePage identity and real social PNG", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, userAgent: "OAI-SearchBot" });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3109/about");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3109/about");
  const profile = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(profile.mainEntity).toMatchObject({ name: "Miki Lombardi", jobTitle: "Senior Software Engineer", worksFor: { name: "Adobe" }, email: inventory.profile.email });
  expect(profile.mainEntity.address).toBeUndefined();
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const image = await request.get((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
  expect(image.status()).toBe(200); const png = await image.body();
  expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  const pdf = await request.get(inventory.profile.cvPath);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(createHash("sha256").update(await pdf.body()).digest("hex")).toBe(inventory.profile.cvSha256);
  await context.close();
});
