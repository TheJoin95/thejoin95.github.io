import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import inventory from "../docs/content/inventory.json";
import { projectIndex, workStructuredData } from "@/content/work";
import { selectedProjects } from "@/content/selected-projects";
import { ProjectIndex } from "@/components/work/project-index";
import Work, { metadata } from "@/app/work/page";

describe("Work gallery and complete project index", () => {
  test("publishes every approved inventory entry once, preserving shared featured copy", () => {
    expect(projectIndex.map(project => project.id).sort()).toEqual(inventory.projects.map(project => project.id).sort());
    expect(new Set(projectIndex.map(project => project.id)).size).toBe(11);
    for (const featured of selectedProjects) {
      const entry = projectIndex.find(project => project.title === featured.title)!;
      expect(entry.summary).toBe(featured.summary);
      expect(entry.contribution).toBe(featured.contribution);
      expect(entry.href).toBe(`/work#${featured.id}`);
    }
    expect(projectIndex.find(project => project.id === "hop")?.title).toBe("Hop");
    expect(projectIndex.find(project => project.id === "supermarket-waiting-times")?.status).toBe("Archived project · 2020");
  });
  test("renders usable destinations and honest unlinked prototypes in semantic HTML", () => {
    const html = renderToStaticMarkup(<ProjectIndex />);
    expect(html.match(/<li /g)).toHaveLength(11);
    expect(html.match(/<h3/g)).toHaveLength(11);
    expect(html.match(/No public link yet/g)).toHaveLength(6);
    expect(html.match(/<a /g)).toHaveLength(5);
    expect(html).toContain('href="https://broski.substack.com/"');
    expect(html).toContain("co-founded");
    expect(html).toContain("collective work");
    for (const id of ["holy-card-generator", "copro-syndic", "alerting", "hop", "social-post", "comic-learning"]) {
      expect(projectIndex.find(project => project.id === id)?.href).toBeUndefined();
    }
    expect(html).not.toContain('href="#"');
    expect(html).not.toContain("disabled");
  });
  test("renders all three galleries, Play onward link and crawlable social metadata", () => {
    const html = renderToStaticMarkup(<Work />);
    for (const project of selectedProjects) expect(html).toContain(`id="${project.id}"`);
    expect(html).toContain('href="/play"');
    expect(html).toContain('data-surface="charcoal"');
    expect(html).toContain('type="application/ld+json"');
    expect(metadata.alternates?.canonical).toBe("/work");
    expect(metadata.openGraph).toMatchObject({ images: [{ url: "/opengraph-image", width: 1200, height: 630 }] });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "/opengraph-image" }] });
  });
  test("structured data mirrors all visible entries without inventing URLs or claims", () => {
    const schema = workStructuredData("https://example.com");
    expect(schema.url).toBe("https://example.com/work");
    expect(schema.mainEntity.numberOfItems).toBe(11);
    schema.mainEntity.itemListElement.forEach((item, index) => {
      const project = projectIndex[index];
      expect(item.position).toBe(index + 1);
      expect(item.name).toBe(project.title);
      expect(item.description).toContain(project.status);
      expect(item.url).toBe(project.href ? new URL(project.href, "https://example.com").href : undefined);
    });
    expect(JSON.stringify(schema)).not.toContain("award");
    expect(JSON.stringify(schema)).not.toContain("interactionStatistic");
  });
});
