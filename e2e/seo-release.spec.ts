import { test, expect } from "@playwright/test";
test.skip(process.env.SEO_RELEASE_TEST !== "true", "Requires the explicit simulated release build; see docs/seo/mic25-discovery.md");
test("a release build serves canonical-only discovery and indexes only its configured host", async ({ request, page }) => {
  const origin = "https://www.mikilombardi.com";
  const headers = { Host: "www.mikilombardi.com" };
  const sitemap = await request.get("/sitemap.xml", { headers });
  expect(sitemap.status()).toBe(200);
  const entries = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return { errors: doc.querySelectorAll("parsererror").length, urls: [...doc.querySelectorAll("loc")].map(node => node.textContent) };
  }, await sitemap.text());
  expect(entries.errors).toBe(0); expect(entries.urls).toHaveLength(25);
  expect(entries.urls.every(url => url?.startsWith(origin) && !/[?#]/.test(url))).toBe(true);
  expect(new Set(entries.urls).size).toBe(25);
  expect(entries.urls.some(url => /2021-04-16|whoami|confirmed|missing|draft|future/.test(url!))).toBe(false);
  const robots = await request.get("/robots.txt", { headers });
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`);
  const home = await request.get("/", { headers });
  expect(home.headers()["x-robots-tag"]).toBeUndefined();
  const meta = await page.evaluate(html => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return { robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content"), canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") };
  }, await home.text());
  expect(meta.robots).toContain("index, follow"); expect(meta.robots).not.toContain("noindex");
  expect(new URL(meta.canonical!).href).toBe(`${origin}/`);
  // Pagination may be indexed, while internal search/tag combinations may not.
  for (const [path, canonical, indexed] of [["/blog?page=2", "/blog?page=2", true], ["/blog?q=python", "/blog", false], ["/blog?tag=python", "/blog", false]] as const) {
    const archive = await request.get(path, { headers: { ...headers, "User-Agent": "Googlebot" } });
    expect(archive.status()).toBe(200);
    expect(archive.headers()["x-robots-tag"]).toBeUndefined();
    const metadata = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return { robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content"), canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"), count: doc.querySelectorAll("#archive li").length };
    }, await archive.text());
    expect(metadata.canonical).toBe(`${origin}${canonical}`);
    expect(metadata.robots?.includes("noindex")).toBe(!indexed);
    expect(metadata.count).toBeGreaterThan(0);
  }
  const alias = await request.get("/", { headers: { Host: "preview.netlify.app" } });
  expect(alias.headers()["x-robots-tag"]).toContain("noindex");
  const rss = await request.get("/rss.xml", { headers });
  expect(rss.headers()["x-robots-tag"]).toContain("noindex");
  expect(await rss.text()).toContain(`${origin}/blog/`);
  const raw = await request.get("/articles/2017-02-16-how-to-backup-all-collections-from-mongodb-on-raspberry.md", { headers });
  expect(raw.headers()["x-robots-tag"]).toContain("noindex");
  expect((await request.get("/blog/missing", { headers })).status()).toBe(404);
});
