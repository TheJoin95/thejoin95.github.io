import { test, expect } from "@playwright/test";
test.skip(process.env.SEO_CONTEXT_TEST !== "true", "Requires an explicit Netlify preview or branch-context build");
test("hosted preview contexts stay noindex even if release indexing was requested", async ({ request, page }) => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL!;
  for (const path of ["/", "/about", "/blog/2019-12-21-microfrontend-from-00-to-20s"]) {
    const response = await request.get(path, { headers: { Host: new URL(origin).host } });
    expect(response.status()).toBe(200); expect(response.headers()["x-robots-tag"]).toContain("noindex");
    const meta = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return { robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content"), canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"), image: doc.querySelector('meta[property="og:image"]')?.getAttribute("content") };
    }, await response.text());
    expect(meta.robots).toContain("noindex"); expect(new URL(meta.canonical!).href).toBe(new URL(path, origin).href);
    expect(meta.image).toMatch(/^https:\/\/www.mikilombardi.com\//);
  }
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("<loc>");
  expect(await (await request.get("/robots.txt")).text()).not.toContain("Sitemap:");
  expect((await request.get("/rss.xml")).headers()["x-robots-tag"]).toContain("noindex");
});
