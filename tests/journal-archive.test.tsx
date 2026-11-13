import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup as html } from "react-dom/server";
import Journal, { generateMetadata } from "@/app/blog/page";
import { archiveCanonical, archiveHref, archiveStructuredData, archiveView } from "@/lib/journal-archive";
import { publishedArticles, visibleArticles } from "@/lib/journal";
import { JournalArchive } from "@/components/journal/archive";
import { FeaturedWriting } from "@/components/journal/featured-writing";
import { featuredWriting } from "@/content/home";

// A fixed historical dataset tests pagination without blocking new publications.
const articles = publishedArticles().filter(article => article.archival);
describe("Journal archive and discovery", () => {
  test("pagination preserves every published source record once in chronological order", () => {
    const first = archiveView(articles, {}), second = archiveView(articles, { page: "2" });
    expect(first.total).toBe(16); expect(first.items).toHaveLength(8); expect(second.items).toHaveLength(8);
    expect([...first.items, ...second.items]).toEqual(articles);
    expect(new Set([...first.items, ...second.items].map(a => a.slug)).size).toBe(16);
    for (const page of ["-3", "0", "oops", "2.5", "Infinity", "9007199254740992"]) expect(archiveView(articles, { page }).page).toBe(1);
    expect(archiveView(articles, { page: "999" }).page).toBe(2);
    expect(archiveView(articles, { page: ["2", "1"] }).page).toBe(2);
    expect(archiveView(articles, { page: [] }).page).toBe(1);
  });
  test("search handles case, accents, combined terms, exact tags and hostile inputs as text", () => {
    const sample = { ...articles[0], title: "Café systems", description: "Boundaries", body: "Independent frontends", tags: ["architecture"] };
    expect(archiveView([sample], { q: "CAFE independent", tag: "architecture" }).items).toEqual([sample]);
    expect(archiveView([sample], { q: "boundaries" }).total).toBe(1);
    expect(archiveView([sample], { q: "architecture" }).total).toBe(1);
    expect(archiveView([sample], { tag: "arch" }).total).toBe(0);
    expect(archiveView([sample], { q: "cafe missing" }).total).toBe(0);
    expect(archiveView([sample], { q: [" cafe ", "missing"] }).q).toBe("cafe");
    expect(archiveView([sample], { q: " ", tag: [] }).filtered).toBe(false);
    expect(archiveView(articles, { q: "x".repeat(200), tag: "x".repeat(100) })).toMatchObject({ q: "x".repeat(160), tag: "x".repeat(80) });
    const hostile = html(<JournalArchive view={archiveView(articles, { q: '<script>alert("x")</script>', tag: "unavailable" })} />);
    expect(hostile).not.toContain("<script>"); expect(hostile).toContain("No matching articles.");
    expect(hostile).toContain("(unavailable)"); expect(hostile).toContain("Clear filters");
  });
  test("native discovery controls preserve filters, reset pages and distinguish empty states", () => {
    expect(archiveHref({ q: "C++ & café", tag: "web dev", page: 2 })).toBe("/blog?q=C%2B%2B+%26+caf%C3%A9&tag=web+dev&page=2#archive");
    expect(archiveHref({})).toBe("/blog#archive");
    const initial = html(<JournalArchive view={archiveView(articles, {})} />);
    expect(initial).toContain('method="get"'); expect(initial).toContain('action="/blog#archive"');
    expect(initial).toContain('href="/blog?page=2#archive"'); expect(initial).not.toContain("Previous page");
    expect(initial).toContain('for="journal-search"'); expect(initial).toContain('for="journal-tag"');
    const last = html(<JournalArchive view={archiveView(articles, { page: "2" })} />);
    expect(last).toContain("Previous page"); expect(last).not.toContain("Next page");
    const empty = html(<JournalArchive view={archiveView([], {})} />);
    expect(empty).toContain("No published writing yet."); expect(empty).toContain('href="/play"'); expect(empty).not.toContain("Archive pagination");
  });
  test("featured writing, sketchbook and RSS use real content and honest publication states", async () => {
    const output = html(await Journal());
    expect(output).toContain(featuredWriting.title); expect(output).toContain(`dateTime="${featuredWriting.published}"`);
    expect(output).toContain('src="/media/journal/microfrontends.svg"'); expect(output).toContain("not a historical product screenshot");
    expect(output).toContain("No drawings or sketchbook articles are published here yet.");
    expect(output).toContain('href="/play#comic-title"'); expect(output).toContain('href="/rss.xml"');
    expect(html(<FeaturedWriting article={articles[0]} />)).toContain(encodeURIComponent(`/blog/${articles[0].slug}/share`));
    const hidden = visibleArticles([...articles, { ...articles[0], slug: "secret-draft", draft: true }, { ...articles[0], slug: "future", date: "2999-01-01" }], new Date("2026-11-12"));
    expect(archiveView(hidden, { q: "secret-draft" }).total).toBe(0); expect(hidden).toHaveLength(16);
  });
  test("metadata and schema follow the visible page with no invented dates or filtered index pages", async () => {
    const first = archiveView(articles, {}), second = archiveView(articles, { page: "2" });
    expect(archiveCanonical(first)).toBe("/blog"); expect(archiveCanonical(second)).toBe("/blog?page=2");
    expect(archiveCanonical(archiveView(articles, { q: "python" }))).toBe("/blog");
    const schema = archiveStructuredData(second, "https://example.com");
    expect(schema.mainEntity.itemListElement.map(entry => entry.item.headline)).toEqual(second.items.map(a => a.title));
    expect(schema.mainEntity.itemListElement[0]).toMatchObject({ position: 9, item: { datePublished: second.items[0].date, url: `https://example.com/blog/${second.items[0].slug}` } });
    expect(JSON.stringify(schema)).not.toContain("dateModified");
    const metadata = await generateMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(metadata.alternates?.canonical).toBe("https://example.com/blog?page=2"); expect(metadata.title).toBe("Journal — Page 2");
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "https://example.com/opengraph-image" }] });
    expect((await generateMetadata({ searchParams: Promise.resolve({ tag: "python" }) })).robots).toEqual({ index: false, follow: true });
    expect((await generateMetadata()).alternates?.canonical).toBe("https://example.com/blog");
  });
});
