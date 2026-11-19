import { expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import slugs from "@/content/journal-routes.json";
import { publishedArticles } from "@/lib/journal";
test("the build route inventory admits published articles and rejects unknown/private routes before streaming", () => {
  expect(slugs).toEqual(publishedArticles().map(article => article.slug));
  expect(proxy(new NextRequest(`https://example.com/blog/${slugs[0]}`)).status).toBe(200);
  for (const slug of ["missing", "draft", "future"]) {
    const response = proxy(new NextRequest(`https://example.com/blog/${slug}`));
    expect(response.status).toBe(404);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  }
});
test("the preserved supermarket alias redirects before the unpublished route guard", () => {
  const oldPath = "/blog/2021-04-16-covid19-supermarket-waiting-times-2020-recap";
  const newPath = "/blog/2021-04-17-covid19-supermarket-waiting-times-2020-recap";
  const response = proxy(new NextRequest(`https://preview.netlify.app${oldPath}?source=legacy`));
  expect(response.status).toBe(308);
  expect(response.headers.get("Location")).toBe(`https://preview.netlify.app${newPath}?source=legacy`);
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex, follow");
  expect(proxy(new NextRequest(`https://example.com${newPath}`)).status).toBe(200);
  expect(proxy(new NextRequest(`https://example.com${oldPath}/share`)).status).toBe(404);
});
test("indexing headers follow the build decision and canonical host, independently of article visibility", () => {
  const previous = process.env.PORTFOLIO_INDEXABLE;
  try {
    process.env.PORTFOLIO_INDEXABLE = "false";
    expect(proxy(new NextRequest("https://example.com/about")).headers.get("X-Robots-Tag")).toBe("noindex, follow");
    process.env.PORTFOLIO_INDEXABLE = "true";
    expect(proxy(new NextRequest("https://example.com/about")).headers.get("X-Robots-Tag")).toBeNull();
    expect(proxy(new NextRequest("http://localhost/about", { headers: { Host: "example.com" } })).headers.get("X-Robots-Tag")).toBeNull();
    expect(proxy(new NextRequest("https://preview.netlify.app/about")).headers.get("X-Robots-Tag")).toBe("noindex, follow");
  } finally { process.env.PORTFOLIO_INDEXABLE = previous; }
});
