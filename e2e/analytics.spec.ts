import { expect, test, type Page } from "@playwright/test";
import { resolve } from "node:path";

function actionCommands(page: Page) {
  return page.evaluate(() => {
    const layer = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
    return layer.map(command => Array.from(command)).filter(([command]) => command === "event");
  });
}

function umamiEvents(page: Page) {
  return page.evaluate(() => (window as unknown as { __umamiEvents?: unknown[][] }).__umamiEvents ?? []);
}

for (const [name, origin] of [
  ["canonical", "https://portfolio.example"],
  ["preview", "https://preview--portfolio.example"],
] as const) {
  test(`the ${name} origin handles contact, CV and newsletter analytics`, async ({ page }) => {
    const googleRequests: string[] = [];
    const umamiRequests: string[] = [];
    await page.route("https://www.googletagmanager.com/**", async route => {
      googleRequests.push(route.request().url());
      await route.fulfill({ contentType: "application/javascript", body: "" });
    });
    await page.route("https://analytics.chromatique.cc/script.js", async route => {
      umamiRequests.push(route.request().url());
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.umami={track:(...event)=>{window.__umamiEvents??=[];window.__umamiEvents.push(event)}}",
      });
    });
    await page.route(`${origin}/`, route => route.fulfill({
      contentType: "text/html", body: '<!doctype html><html lang="en"><body><div id="analytics-fixture"></div></body></html>',
    }));
    await page.route(`${origin}/miki-lombardi-resume.pdf`, route => route.fulfill({
      contentType: "application/pdf", body: "%PDF-1.7 fixture",
    }));
    await page.route(`${origin}/api/newsletter`, route => route.fulfill({
      status: 503, json: { message: "Newsletter signup is unavailable." },
    }));
    await page.goto(origin);
    await page.addScriptTag({ path: resolve(".test-fixtures/analytics.js") });
    if (name === "canonical") {
      await expect(page.locator('script[src="https://analytics.chromatique.cc/script.js"]'))
        .toHaveAttribute("data-website-id", "919eff20-33a5-4c0a-a86b-0b574960ecc9");
      await expect(page.locator('script[src="https://analytics.chromatique.cc/script.js"]')).toHaveAttribute("defer", "");
      await expect.poll(() => umamiRequests.length).toBe(1);
      await page.getByRole("link", { name: "Analytics test link" }).click();
      await page.getByRole("button", { name: "Analytics test button" }).click();
      expect(await umamiEvents(page)).toEqual([
        ["element_clicked", { element_kind: "a", page_path: "/" }],
        ["element_clicked", { element_kind: "button", page_path: "/" }],
      ]);
    }
    const contacts = page.getByRole("navigation", { name: "Contact" });
    // Exercise the real click handler without opening a desktop mail client.
    await contacts.getByRole("link", { name: "Email Miki", exact: true }).evaluate(link => {
      link.addEventListener("click", event => event.preventDefault(), { once: true });
    });
    await contacts.getByRole("link", { name: "Email Miki", exact: true }).click();
    const download = page.waitForEvent("download");
    await contacts.getByRole("link", { name: "Download CV (PDF)", exact: true }).click();
    expect((await download).suggestedFilename()).toBe("miki-lombardi-resume.pdf");
    const clickEvents = name === "canonical" ? [["event", "contact_email_click"], ["event", "cv_download_click"]] : [];

    const email = page.getByRole("textbox", { name: "Email address" });
    await email.fill("newsletter-test@example.com");
    const subscribe = page.getByRole("button", { name: "Subscribe" });
    await subscribe.click();
    await expect(page.locator("#newsletter-status")).toHaveText("Newsletter signup is unavailable.");
    expect(await actionCommands(page)).toEqual(clickEvents);

    await page.route(`${origin}/api/newsletter`, route => route.fulfill({
      json: { message: "Check your inbox to confirm." },
    }));
    await subscribe.click();
    await expect(email).toHaveValue("");
    await expect(page.locator("#newsletter-status")).toHaveText("Check your inbox to confirm.");

    await email.fill("newsletter-test@example.com");
    await page.locator("#newsletter-website").evaluate(input => { (input as HTMLInputElement).value = "honeypot"; });
    await subscribe.click();
    await expect(email).toHaveValue("");

    if (name === "canonical") {
      expect(await actionCommands(page)).toEqual([...clickEvents, ["event", "newsletter_signup_requested"]]);
      expect(await umamiEvents(page)).toEqual([
        ["element_clicked", { element_kind: "a", page_path: "/" }],
        ["element_clicked", { element_kind: "button", page_path: "/" }],
        ["contact_email_click"],
        ["cv_download_click"],
        ["newsletter_signup_requested"],
      ]);
      await expect.poll(() => googleRequests.length).toBe(1);
    } else {
      expect(await actionCommands(page)).toEqual([]);
      expect(await umamiEvents(page)).toEqual([]);
      await expect(page.locator('script[src="https://analytics.chromatique.cc/script.js"]')).toHaveCount(0);
      expect(umamiRequests).toEqual([]);
      expect(googleRequests).toEqual([]);
    }
  });
}
