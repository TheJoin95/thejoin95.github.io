import { describe, expect, test } from "bun:test";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { renderToStaticMarkup as html } from "react-dom/server";
import { parseArticle, publishedArticles, visibleArticles, renderReading, articleStructuredData } from "@/lib/journal";
import { relatedWriting } from "@/lib/reading";
import { ContentsNavigation, ReadingTemplate, RelatedWriting, SketchbookPanels } from "@/components/journal/reader";
import { SketchbookDiscovery } from "@/components/journal/sketchbook-discovery";
import { articleMetadata } from "@/lib/seo";
import { journalFeed, sitemapEntries } from "@/lib/discovery";

const source = readFileSync("tests/fixtures/sketchbook.md", "utf8");
const specimen = parseArticle(source, "sketchbook-reader-fixture");
describe("article and sketchbook reading", () => {
  test("sanitized headings have stable, unique safe anchors and contents, with one template H1", async () => {
    const reading = await renderReading('# Body title\n\n## A **section**\n\n### Café\n\n## A **section**\n\n<h2></h2>\n<script>evil()</script>\n\n## location');
    expect(reading.contents.map(entry => entry.id)).toEqual(["section-body-title", "section-a-section", "section-café", "section-a-section-1", "section-location"]);
    expect(reading.contents[2]).toMatchObject({ level: 3, title: "Café" });
    expect(reading.html).not.toContain("<h1"); expect(reading.html).not.toContain("<script");
    expect(reading.html).not.toContain('id="location"');
    const navigation = html(<ContentsNavigation entries={reading.contents} />);
    for (const entry of reading.contents) expect(navigation).toContain(`href="#${entry.id}"`);
    expect(html(<ContentsNavigation entries={reading.contents.slice(0, 2)} />)).toBe("");
    const rendered = await renderReading(specimen.body);
    expect(rendered.html).toContain('role="region" aria-label="Code example 1"');
    expect(rendered.html).toContain('aria-label="Data table 1" tabindex="0"');
    expect(rendered.html).toContain("<blockquote>"); expect(rendered.html).toContain("<ul>");
    const captioned = await renderReading('<figure onclick="evil()"><img src="/media/journal/microfrontends.svg" alt="A diagram" onerror="evil()"><figcaption>Authored caption<script>evil()</script></figcaption></figure>');
    expect(captioned.html).toContain('<figure><img src="/media/journal/microfrontends.svg" alt="A diagram"><figcaption>Authored caption</figcaption></figure>');
    for (const unsafe of ["onclick", "onerror", "<script", "evil()"]) expect(captioned.html).not.toContain(unsafe);
  });
  test("panel metadata requires real descriptions, captions, credits, dimensions and local paths", () => {
    const published = source.replace("draft: true", "draft: false");
    expect(parseArticle(published, "valid").panels).toHaveLength(2);
    for (const invalid of [published.replace(/alt: .*/g, 'alt: ""'), published.replace(/credit: .*/g, 'credit: ""'), published.replace(/caption: .*/g, 'caption: ""'), published.replaceAll("width: 1200", "width: 0"), published.replaceAll("/media/journal/microfrontends.svg", "https://example.com/image.png"), published.replaceAll("/media/journal/microfrontends.svg", "/media/journal/../private.png"), published.replace("updated: 2020-01-02", "updated: 2019-12-31"), published.replace("kind: sketchbook", "kind: article")]) {
      expect(() => parseArticle(invalid, "invalid")).toThrow();
    }
    const empty = source.replace(/panels:[\s\S]*?---/, "panels: []\n---");
    expect(parseArticle(empty, "draft").panels).toEqual([]);
    expect(() => parseArticle(empty.replace("draft: true", "draft: false"), "empty-published")).toThrow();
  });
  test("publication validates media before a sketchbook can enter public routes and excludes drafts", () => {
    const path = "content/journal/mic19-media-validation.md";
    try {
      writeFileSync(path, source);
      expect(publishedArticles().some(article => article.slug === "mic19-media-validation")).toBe(false);
      writeFileSync(path, source.replace("draft: true", "draft: false"));
      expect(publishedArticles().find(article => article.slug === "mic19-media-validation")!.panels).toHaveLength(2);
      writeFileSync(path, source.replace("draft: true", "draft: false").replaceAll("microfrontends.svg", "missing.png"));
      expect(() => publishedArticles()).toThrow("Missing sketchbook media");
    } finally { unlinkSync(path); }
  });
  test("shared templates render ordered described panels, genuine metadata and related writing", async () => {
    const rendered = await renderReading(specimen.body);
    const output = html(<ReadingTemplate article={specimen} {...rendered} related={publishedArticles().slice(0, 2)} />);
    expect(output.match(/<h1/g)).toHaveLength(1); expect(output.match(/<figure/g)).toHaveLength(2);
    expect(output.indexOf("Panel 1 · First test panel")).toBeLessThan(output.indexOf("Panel 2 · Second test panel"));
    for (const panel of specimen.panels) expect(output).toContain(panel.alt);
    expect(output).toContain("Website explanatory diagram, 2026. Test use only.");
    expect(output).toContain("Learning notes"); expect(output).toContain("Updated"); expect(output).toContain('dateTime="2020-01-02"');
    expect(output).toContain("Keep reading."); expect(output).toContain('href="/blog?tag=learning#archive"');
    expect(html(<SketchbookPanels panels={[]} />)).toBe("");
    expect(html(<RelatedWriting articles={[]} />)).toContain("More writing will appear");
    expect(html(<RelatedWriting articles={[specimen]} />)).toContain("Sketchbook");
    expect(html(<SketchbookDiscovery articles={[]} />)).toContain("No drawings or sketchbook articles");
    const discovery = html(<SketchbookDiscovery articles={[{ ...specimen, draft: false }]} />);
    expect(discovery).toContain(specimen.title); expect(discovery).not.toContain("No drawings or sketchbook articles");
  });
  test("related writing prioritizes topic overlap then real dates and never repeats the current entry", () => {
    const base = publishedArticles()[0];
    const current = { ...base, slug: "current", kind: "sketchbook" as const, tags: ["learning"] };
    const candidates = [current, { ...base, slug: "newest", date: "2025-01-01", tags: [] }, { ...base, slug: "topic", tags: ["learning"] }, { ...base, slug: "sketch", kind: "sketchbook" as const, tags: ["learning"] }, { ...base, slug: "z-topic", tags: ["learning"] }];
    expect(relatedWriting(current, candidates).map(a => a.slug)).toEqual(["sketch", "topic", "z-topic"]);
    expect(relatedWriting(base, []).length).toBe(0);
  });
  test("sketchbook discovery and metadata share real publication dates, authorship and media credit", () => {
    const publicSketch = { ...specimen, draft: false };
    const schema = articleStructuredData(publicSketch, "https://example.com");
    expect(schema).toMatchObject({ "@type": "BlogPosting", genre: "Sketchbook", datePublished: "2020-01-01", dateModified: "2020-01-02", author: { name: "Miki Lombardi" }, hasPart: [{ creditText: specimen.panels[0].credit, description: specimen.panels[0].alt, contentUrl: "https://example.com/media/journal/microfrontends.svg" }, {}] });
    const meta = articleMetadata(publicSketch);
    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2020-01-01", modifiedTime: "2020-01-02", images: [{ url: "https://example.com/blog/sketchbook-reader-fixture/share" }] });
    const published = visibleArticles([specimen, { ...publicSketch, slug: "public-sketch" }, { ...publicSketch, slug: "future", date: "2999-01-01" }], new Date("2026-11-13"));
    expect(published.map(a => a.slug)).toEqual(["public-sketch"]);
    expect(journalFeed(published, "https://example.com", new Date("2026-11-13"))).toContain("/blog/public-sketch");
    expect(sitemapEntries(published, "https://example.com", true, new Date("2026-11-13")).at(-1)!.url).toBe("https://example.com/blog/public-sketch");
  });
  test("a published sketchbook gets a real long-title social PNG while drafts get no card", async () => {
    const path = "content/journal/mic19-share-validation.md";
    const previousFetch = globalThis.fetch;
    globalThis.fetch = (async () => { throw new Error("No network in image test"); }) as unknown as typeof fetch;
    try {
      const { GET, generateStaticParams } = await import("@/app/blog/[slug]/share/route");
      writeFileSync(path, source);
      const params = Promise.resolve({ slug: "mic19-share-validation" });
      expect((await GET(new Request("https://example.com"), { params })).status).toBe(404);
      expect((await generateStaticParams()).some(item => item.slug === "mic19-share-validation")).toBe(false);
      writeFileSync(path, source.replace("draft: true", "draft: false").replace(/^title:.*$/m, `title: "${"Learning to compose sequential visual stories ".repeat(5).trim()}"`));
      const response = await GET(new Request("https://example.com"), { params });
      const png = Buffer.from(await response.arrayBuffer());
      expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
      await Bun.write("/tmp/mic19-sketchbook-share.png", png);
    } finally { unlinkSync(path); globalThis.fetch = previousFetch; }
  });
});
