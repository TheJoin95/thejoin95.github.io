import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import inventory from "../docs/content/inventory.json";
import Play, { metadata } from "@/app/play/page";
import { ComicPreview } from "@/components/play/comic-preview";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { playProjects, comicLearning, playStructuredData } from "@/content/play";
import { projectIndex } from "@/content/work";

describe("Play directory and comic-learning preview", () => {
  test("the directory and separate comic preview cover every approved project using shared records", () => {
    expect([...playProjects, comicLearning].map(project => project.id).sort()).toEqual(inventory.projects.map(project => project.id).sort());
    expect(playProjects).toHaveLength(10);
    for (const project of playProjects) expect(project).toBe(projectIndex.find(entry => entry.id === project.id)!);
    expect(playProjects.find(project => project.id === "hop")!.title).toBe("Hop");
    expect(playProjects.find(project => project.id === "broskis")!.href).toBe("https://broski.substack.com/");
    expect(playProjects.find(project => project.id === "supermarket-waiting-times")!.status).toBe("Archived project · 2020");
    expect(playProjects.filter(project => project.href)).toHaveLength(5);
  });
  test("unlinked prototypes retain honest states and never get fake actions or external arrows", () => {
    const entries = playProjects.filter(project => !project.href);
    expect(entries.map(project => project.id)).toEqual(["holy-card-generator", "copro-syndic", "alerting", "hop", "social-post"]);
    const html = renderToStaticMarkup(<ProjectDirectory entries={entries} />);
    expect(html.match(/No public link yet\./g)).toHaveLength(5);
    expect(html).not.toContain("<a"); expect(html).not.toContain("<svg");
    expect(html).toContain("Digital-only beta"); expect(html).toContain("Early prototype"); expect(html).toContain("In progress");
  });
  test("Play composes the shared stage, real directory, comic state and passions without inventing artwork", () => {
    const html = renderToStaticMarkup(<Play />);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Chromatique static palette comparison");
    expect(html).toContain('href="/work/chromatique"');
    expect(html).not.toContain('href="#chromatique"');
    expect(html).toContain("Static comparison");
    expect(html).toContain("Cycling, photography, and whatever comes next.");
    expect(html).toContain('href="/experience"');
    expect(html).not.toContain('href="#"');
    const comic = renderToStaticMarkup(<ComicPreview />);
    expect(comic).toContain("A work in progress");
    expect(comic).toContain("No drawings are published here yet.");
    expect(comic).toContain('href="/blog"'); expect(comic).toContain('href="/rss.xml"');
    for (const tag of ["<img", "<svg", "<canvas"]) expect(comic).not.toContain(tag);
  });
  test("metadata and structured data describe the visible collection and only its actual destinations", () => {
    expect(metadata.alternates?.canonical).toBe("https://example.com/play");
    expect(metadata.openGraph).toMatchObject({ type: "website", images: [{ url: "https://example.com/opengraph-image" }] });
    const schema = playStructuredData("https://example.com");
    expect(schema.mainEntity.numberOfItems).toBe(10);
    schema.mainEntity.itemListElement.forEach((item, index) => {
      const project = playProjects[index];
      expect(item.name).toBe(project.title); expect(item.position).toBe(index + 1);
      expect(item.description).toContain(project.status);
      expect(item.url).toBe(project.href ? new URL(project.href, "https://example.com").href : undefined);
    });
    expect(schema.hasPart.name).toBe(comicLearning.title);
    expect(schema.hasPart).not.toHaveProperty("image"); expect(schema.hasPart).not.toHaveProperty("datePublished");
  });
});
