import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { articleStructuredData, findArticle, parseArticle, publishedArticles, visibleArticles, renderMarkdown } from "@/lib/journal";
import manifest from "../docs/migration/legacy-manifest.json";
const hash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const fixture = (extra = "") => `---\ntitle: Test article\ndescription: A real summary\ndate: 2020-01-01\n${extra}---\n\n## Section\n\nBody`;
describe("legacy journal migration", () => {
  test("all 16 published records retain exact source bytes, dates, titles and canonical routes", () => {
    const oldIndex = JSON.parse(execFileSync("git", ["show", `${manifest.sourceRef}:src/assets/articles.json`], { encoding: "utf8" })) as { date: string; permalink: string }[];
    expect(manifest.articles.map(a => a.canonical).sort()).toEqual(oldIndex.map(a => `/blog/${a.date}-${a.permalink}`).sort());
    const articles = publishedArticles().filter(article => article.archival);
    expect(articles).toHaveLength(16);
    for (const record of manifest.articles) {
      const original = execFileSync("git", ["show", `${manifest.sourceRef}:${record.source}`]);
      expect(createHash("sha256").update(original).digest("hex")).toBe(record.sha256);
      expect(hash(`content/journal/${record.slug}.md`)).toBe(record.sha256);
      expect(hash(`public/articles/${record.filename}`)).toBe(record.sha256);
      const article = findArticle(record.slug)!;
      expect(article.title).toBe(record.title);
      expect(article.date).toBe(record.date);
      expect(article.archival).toBe(true);
    }
    expect(articles[0].date).toBe("2021-04-17");
    expect(articles.at(-1)!.date).toBe("2017-02-16");
    expect(findArticle("2019-05-18-prenotare-appuntamento-passaporto-online")!.language).toBe("it");
    expect(manifest.articles.flatMap(a => a.aliases)).toEqual(["/blog/2021-04-16-covid19-supermarket-waiting-times-2020-recap"]);
    expect(findArticle("not-an-article")).toBeUndefined();
  });
  test("preserved images, Gists, legacy assets and CV match manifest hashes", () => {
    for (const asset of [...manifest.media, ...manifest.assets]) expect(hash(`public${asset.path}`)).toBe(asset.sha256);
    expect(manifest.media.filter(m => m.kind === "image")).toHaveLength(5);
    expect(manifest.media.filter(m => m.kind === "code")).toHaveLength(3);
  });
  test("invalid metadata, impossible dates and path traversal fail", () => {
    for (const source of [fixture().replace("2020-01-01", "2020-02-30"), fixture().replace("2020-01-01", "invalid"), fixture().replace("title: Test article", "title: ''")]) expect(() => parseArticle(source, "valid-slug")).toThrow();
    expect(() => parseArticle(fixture(), "../private")).toThrow();
    expect(parseArticle(fixture("updated: 2020-03-01\n"), "valid-slug").updated).toBe("2020-03-01");
  });
  test("publication gate hides drafts and future posts and discovers a new Markdown article", () => {
    const articles = [parseArticle(fixture(), "new-article"), parseArticle(fixture("draft: true\n"), "draft"), parseArticle(fixture().replace("2020-01-01", "2999-01-01"), "future")];
    expect(visibleArticles(articles, new Date("2026-01-01")).map(a => a.slug)).toEqual(["new-article"]);
    expect(() => visibleArticles([articles[0], articles[0]], new Date())).toThrow("Duplicate");
  });
  test("renderer handles standard Markdown and rejects scripts, event handlers and unsafe URLs", async () => {
    const html = await renderMarkdown('## Heading\n\n```js\nconst a = 1;\n```\n\n- List\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n[Safe](https://example.com) ![Caption](/image.png)\n\n<script>alert(1)</script><img src="x" onerror="evil()"><a href="javascript:evil()">bad</a>');
    for (const part of ['<h2 id="section-heading" tabindex="-1">Heading</h2>', 'aria-label="Code example 1"', "<ul>", "<table>", 'aria-label="Data table 1"', 'alt="Caption"', 'href="https://example.com"']) expect(html).toContain(part);
    for (const part of ["<script", "onerror", "javascript:", "alert(1)"]) expect(html).not.toContain(part);
  });
  test("every legacy body renders with local media and code, without Liquid, covers or duplicate H1", async () => {
    for (const article of publishedArticles().filter(article => article.archival)) {
      const html = await renderMarkdown(article.body, true);
      for (const part of ["<h1", "{% highlight", "{% endhighlight", "source.unsplash.com", "data:image", "cdn-images-1.medium.com", "<script"]) expect(html).not.toContain(part);
      expect(html.length).toBeGreaterThan(400);
    }
    const scraper = findArticle("2019-06-28-puppeteer-skyscanner-scraper-nodejs")!;
    const html = await renderMarkdown(scraper.body, true);
    expect(html.match(/Original code on GitHub Gist/g)).toHaveLength(3);
    expect(html).toContain("/media/blog/legacy-1.png");
  });
  test("schema uses real author, language, original dates and canonical social URL", () => {
    const article = publishedArticles()[0];
    const schema = articleStructuredData(article, "https://example.com");
    expect(schema.headline).toBe(article.title);
    expect(schema.datePublished).toBe(article.date);
    expect(schema).not.toHaveProperty("dateModified");
    expect(schema.author.name).toBe("Miki Lombardi");
    expect(schema.image).toBe(`https://example.com/blog/${article.slug}/share`);
    expect(articleStructuredData({ ...article, updated: "2022-01-01" }, "https://example.com").dateModified).toBe("2022-01-01");
  });
});
