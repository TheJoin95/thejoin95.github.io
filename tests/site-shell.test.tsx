import Link from "next/link";
import { describe, expect, test, mock } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { currentSection, navigation, contacts } from "@/lib/site";
import { PageIntro, Section, ContentState, MediaFrame } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Work from "@/app/work/page";
import Journal from "@/app/blog/page";
import Play from "@/app/play/page";
import About from "@/app/about/page";
import NotFound from "@/app/not-found";
import Loading from "@/components/site/page-loading";
import { ErrorState } from "@/components/site/error-state";

mock.module("next/navigation", () => ({ usePathname: () => "/work" }));
const { NavigationLinks } = await import("@/components/site/navigation");
const { SiteHeader, SiteFooter } = await import("@/components/site/shell");

function html(element: React.ReactNode) { return renderToStaticMarkup(element); }

describe("site navigation and semantic shell", () => {
  test("exact pages and nested sections are active without prefix collisions", () => {
    expect(currentSection("/work", "/work")).toBe("page");
    expect(currentSection("/work/imagegonord", "/work")).toBe("location");
    expect(currentSection("/workshop", "/work")).toBeUndefined();
    expect(currentSection("/", "/blog")).toBeUndefined();
    expect(navigation.map((n) => n.href)).toEqual(["/work", "/blog", "/play", "/about"]);
  });
  test("all navigation destinations render as real links before hydration", () => {
    const output = html(<NavigationLinks pathname="/blog/legacy-article" />);
    expect(output).toContain('aria-label="Primary"');
    expect(output).toMatch(/<a(?=[^>]*href="\/blog")(?=[^>]*aria-current="location")[^>]*>/);
    for (const entry of navigation) expect(output).toContain(`href="${entry.href}"`);
    expect(html(<NavigationLinks />)).not.toContain("aria-current");
    expect(html(<SiteHeader />)).toContain('aria-label="Miki Lombardi — Home"');
  });
  test("footer preserves confirmed contacts and identifies the PDF", () => {
    const output = html(<SiteFooter />);
    for (const entry of contacts) expect(output).toContain(`href="${entry.href}"`);
    expect(output).toContain("PDF");
    expect(output).toContain('id="contact"');
  });
  test("introductory destinations each provide one H1 and useful content", async () => {
    for (const Page of [Work, Journal, Play, About, NotFound]) {
      const output = html(await Page());
      expect(output.match(/<h1\b/g)).toHaveLength(1);
      expect(output).not.toContain("<main");
      expect(output).not.toContain('href="#"');
    }
    expect(html(<Work />)).toContain("archived");
    expect(html(<Play />)).toContain("A work in progress");
    expect(html(<About />)).toContain("Senior Software Engineer at Adobe");
    expect(html(await Journal())).toContain("original titles and publication dates");
  });
});

describe("reusable states and primitives", () => {
  test("page and section landmarks retain titles and associations", () => {
    expect(html(<PageIntro title="A long title"><p>Summary</p></PageIntro>)).toContain("Summary");
    const output = html(<Section labelledBy="story"><h2 id="story">Story</h2></Section>);
    expect(output).toContain('aria-labelledby="story"');
  });
  test("loading announces status; empty content offers a working recovery", () => {
    expect(html(<Loading />)).toContain('role="status"');
    const output = html(<ContentState title="No results" action={<Link href="/blog">Clear filters</Link>}><p>Try another query.</p></ContentState>);
    expect(output).toContain('href="/blog"');
    expect(output).not.toContain('role="status"');
  });
  test("error recovery offers an announced message and native home destination", () => {
    const output = html(<ErrorState reset={() => {}} />);
    expect(output).toContain('role="alert"');
    expect(output).toContain("Try again"); expect(output).toContain('href="/"');
  });
  test("media reserves its ratio, preserves alt/caption/credit and handles absent assets", () => {
    const image = html(<MediaFrame src="/test-image.png" alt="Architecture diagram" width={1200} height={630} caption="System overview" credit="Miki Lombardi" />);
    expect(image).toContain('alt="Architecture diagram"');
    expect(image).toContain("aspect-ratio:1200 / 630");
    expect(image).toContain("System overview");
    expect(image).toContain("Miki Lombardi");
    expect(image).toContain("media-contain");
    expect(html(<MediaFrame src="/photo.png" alt="Cycling" width={800} height={600} fit="cover" priority />)).toContain("media-cover");
    const missing = html(<MediaFrame alt="Pending image" width={800} height={600} />);
    expect(missing).toContain("Image unavailable");
    expect(missing).not.toContain("<img");
    expect(html(<MediaFrame alt="" width={1} height={1} />)).not.toContain(" — ");
  });
  test("button supports links, disabled state and native input semantics", () => {
    expect(html(<Button disabled>Unavailable</Button>)).toContain('disabled=""');
    expect(html(<Button asChild variant="outline"><Link href="/work">Work</Link></Button>)).toContain('href="/work"');
    expect(html(<Input type="email" required aria-label="Email" />)).toContain('type="email"');
  });
  test("the specified UI token pairs meet text and focus contrast requirements", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    function luminance(hex: string) {
      const channels = hex.match(/\w\w/g)!.map((c) => parseInt(c, 16) / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }
    for (const [fg, bg, min] of [["595959", "ffffff", 4.5], ["bdbdbd", "111111", 4.5], ["2457e6", "ffffff", 3], ["d7ef36", "111111", 3], ["b42318", "ffffff", 4.5], ["ffb4ab", "111111", 4.5]] as const) {
      expect(css.toLowerCase()).toContain(`#${fg}`);
      const a = luminance(fg), b = luminance(bg);
      expect((Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05)).toBeGreaterThanOrEqual(min);
    }
  });
});
