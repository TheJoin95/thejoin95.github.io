import { expect, test } from "@playwright/test";
import { publicPages } from "../src/lib/seo";
import { publishedCaseStudies, caseStudyPath } from "../src/content/case-studies";
import slugs from "../src/content/journal-routes.json";

test("crawler HTML connects every published page without broken local links or fragments", async ({ request, page }, info) => {
  test.setTimeout(120000);
  const origin = "http://127.0.0.1:3109";
  const pending = [{ path: "/", from: "entry", text: "Home" }];
  const visited = new Set<string>();
  const documents = new Map<string, string[]>();
  const fragments: { path: string; fragment: string; from: string; text: string }[] = [];
  const evidence: { path: string; from: string; status: number }[] = [];
  while (pending.length) {
    const target = pending.shift()!;
    if (visited.has(target.path)) continue;
    visited.add(target.path);
    expect(visited.size, "Unexpectedly expanding internal link graph").toBeLessThan(500);
    const response = await request.get(target.path);
    evidence.push({ path: target.path, from: target.from, status: response.status() });
    expect(response.status(), `${target.from} → ${target.path} (${target.text})`).toBe(200);
    if (!response.headers()["content-type"]?.includes("text/html")) continue;
    const document = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return { ids: [...doc.querySelectorAll("[id]")].map(el => el.id), links: [...doc.querySelectorAll("a[href]")].map(el => ({ href: el.getAttribute("href")!, text: el.textContent?.trim() || "unnamed link" })) };
    }, await response.text());
    documents.set(target.path, document.ids);
    for (const link of document.links) {
      const url = new URL(link.href, origin + target.path);
      if (url.origin !== origin) continue; // Never crawl providers, social profiles or historical external sites.
      const path = url.pathname + url.search;
      pending.push({ path, from: target.path, text: link.text });
      if (url.hash) fragments.push({ path, fragment: decodeURIComponent(url.hash.slice(1)), from: target.path, text: link.text });
    }
  }
  for (const target of fragments) {
    const ids = documents.get(target.path);
    if (ids) expect(ids, `${target.from} → ${target.path}#${target.fragment} (${target.text})`).toContain(target.fragment);
  }
  for (const path of [...publicPages, ...publishedCaseStudies.map(story => caseStudyPath(story.project)), ...slugs.map(slug => `/blog/${slug}`)]) {
    expect(visited.has(path), `Published page unreachable from Home: ${path}`).toBe(true);
  }
  await info.attach("local-link-crawl", { body: JSON.stringify({ documents: documents.size, links: evidence, fragments: fragments.length }, null, 2), contentType: "application/json" });
});
