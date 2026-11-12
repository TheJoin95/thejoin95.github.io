import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { selectedProjects, chromatiqueProject } from "@/content/selected-projects";
import { featuredWriting, homeIdentity, homeStructuredData } from "@/content/home";
import { PaletteStage } from "@/components/home/palette-stage";
import { SelectedWork } from "@/components/home/selected-work";
import { SelectedWriting } from "@/components/home/selected-writing";

describe("editorial homepage", () => {
  test("uses three sourced projects in the agreed order, with meaningful destinations", () => {
    expect(selectedProjects.map(project => project.id)).toEqual(["imagegonord", "supermarket", "chromatique"]);
    for (const project of selectedProjects) {
      expect(project.summary.length).toBeGreaterThan(20);
      expect(project.contribution.length).toBeGreaterThan(20);
      expect(project.href).not.toBe("#");
      expect(project.media.length).toBeGreaterThan(0);
    }
    expect(chromatiqueProject.href).toBe("/media/chromatique/irises-nord.png");
    const html = renderToStaticMarkup(<SelectedWork />);
    expect(html).toContain("I co-authored ImageGoNord with Wabri");
    expect(html).toContain("Archived project · 2020");
    expect(html).toContain("In development");
    expect(html).toContain('href="/work"');
    expect(html).toContain('href="/play"');
    expect(html).toContain('href="/about"');
  });
  test("static stage identifies input/output and artist without pretending controls exist", () => {
    const html = renderToStaticMarkup(<PaletteStage />);
    expect(html).toContain("Chromatique static palette comparison");
    expect(html).toContain("original / actual CLI output");
    expect(html).toContain("Frances Benjamin Johnston");
    expect(html).toContain('href="#chromatique"');
    expect(html).toContain('loading="eager"');
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain('type="range"');
  });
  test("writing preserves the old title/date and a usable published destination", () => {
    expect(featuredWriting.title).toBe("Micro Frontends - From the 00s to 20s");
    expect(featuredWriting.published).toBe("2019-12-21");
    const html = renderToStaticMarkup(<SelectedWriting />);
    expect(html).toContain(featuredWriting.href);
    expect(html).toMatch(/datetime="2019-12-21"/i);
    expect(html).toContain("Miki Lombardi");
    expect(html).toContain('href="/blog"');
  });
  test("structured data agrees with visible identity and never invents metrics", () => {
    const schema = homeStructuredData("https://example.com");
    const person = schema["@graph"][0];
    expect(person.name).toBe(homeIdentity.name);
    expect(person.url).toBe("https://example.com/");
    expect(person.jobTitle).toBe("Senior Software Engineer");
    expect(person.worksFor?.name).toBe("Adobe");
    expect(JSON.stringify(schema)).not.toContain("interactionStatistic");
    expect(JSON.stringify(schema)).not.toContain("award");
  });
  test("stage output is a real indexed PNG and the original fixture is preserved", async () => {
    const original = await Bun.file("public/media/chromatique/irises-original.jpg").arrayBuffer();
    expect(new Bun.CryptoHasher("sha256").update(original).digest("hex")).toBe("c3f2d8af54d13e5c2744d24fab9975aebdbd51f1a3bdd94a6e8df76fc3676a14");
    const mapped = Buffer.from(await Bun.file("public/media/chromatique/irises-nord.png").arrayBuffer());
    expect(mapped.toString("ascii", 1, 4)).toBe("PNG");
    expect(mapped.readUInt32BE(16)).toBe(1024);
    expect(mapped.readUInt32BE(20)).toBe(846);
    // Indexed output retains at most sixteen palette entries, rather than a mockup.
    expect(mapped[25]).toBe(3);
    const chunks: string[] = [];
    let offset = 8;
    while (offset < mapped.length) {
      const size = mapped.readUInt32BE(offset);
      const type = mapped.toString("ascii", offset + 4, offset + 8);
      chunks.push(type);
      if (type === "PLTE") expect(size / 3).toBeLessThanOrEqual(16);
      offset += size + 12;
    }
    expect(chunks).toContain("PLTE");
  });
});
