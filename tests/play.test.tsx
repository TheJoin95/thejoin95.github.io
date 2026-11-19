import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import inventory from "../docs/content/inventory.json";
import Play, { metadata } from "@/app/play/page";
import { ComicPreview } from "@/components/play/comic-preview";
import { ProjectDirectory } from "@/components/projects/project-directory";
import { playProjects, comicLearning, playStructuredData } from "@/content/play";
import { sideProjectCaseStudies, projectIndex } from "@/content/work";
import { minimumGitHubStars, organizationGitHubRepositories, publicGitHubRepositories } from "@/content/github-projects";

describe("Play directory and comic-learning preview", () => {
  test("the public GitHub index lists only qualifying repositories and includes contribution evidence", () => {
    const repositories = [...publicGitHubRepositories, ...organizationGitHubRepositories];
    expect(minimumGitHubStars).toBe(5);
    expect(repositories.every(({ stars }) => Number.isInteger(stars) && stars >= minimumGitHubStars)).toBe(true);
    expect(new Set(repositories.map(({ repository }) => repository.toLowerCase())).size).toBe(repositories.length);
    const html = renderToStaticMarkup(<Play />);
    expect(html).toContain("Public projects with 5 or more stars.");
    for (const { repository, contribution } of organizationGitHubRepositories) {
      expect(html).toContain(`href="https://github.com/${repository}"`);
      expect(html).toContain(`href="${contribution}"`);
    }
  });
  test("the directory and separate comic preview cover every approved project using shared records", () => {
    expect([...playProjects, comicLearning].map(project => project.id).sort()).toEqual([...inventory.projects, ...sideProjectCaseStudies].map(project => project.id).sort());
    expect(playProjects).toHaveLength(26);
    for (const project of playProjects) expect(project).toBe(projectIndex.find(entry => entry.id === project.id)!);
    expect(playProjects.find(project => project.id === "hop")!.title).toBe("Hop");
    expect(playProjects.find(project => project.id === "broskis")!.href).toBe("https://broski.substack.com/");
    expect(playProjects.find(project => project.id === "supermarket-waiting-times")!.status).toBe("Archived project · 2020");
    expect(playProjects.filter(project => project.href)).toHaveLength(21);
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
    expect(html).toContain("Chromatique palette comparison");
    expect(html).toContain('href="/work/chromatique"');
    expect(html).not.toContain('href="#chromatique"');
    expect(html).toContain("no dithering");
    expect(html).toContain("Cycling, photography, and whatever comes next.");
    expect(html).not.toContain('href="/experience"');
    expect(html).not.toContain('href="#"');
    const comic = renderToStaticMarkup(<ComicPreview />);
    expect(comic).toContain("A work in progress");
    expect(comic).toContain("No drawings are published here yet.");
    expect(comic).toContain('href="/blog"'); expect(comic).toContain('href="/rss.xml"');
    for (const tag of ["<img", "<svg", "<canvas"]) expect(comic).not.toContain(tag);
  });
  test("case-study cards prefer sourced images and use same-origin share cards as fallbacks", () => {
    const expected = {
      certo: "/media/project-covers/certo.webp",
      vitni: "/media/project-covers/vitni.webp",
      "vitni-credentials": "/media/project-covers/vitni-credentials.webp",
      imagegonord: "/media/imagegonord/converter-preview-2x.png",
      "ambisonic-audio": "/share/projects/ambisonic-audio",
    };
    for (const [id, src] of Object.entries(expected)) {
      expect(playProjects.find(project => project.id === id)?.preview?.src).toBe(src);
    }
    const html = renderToStaticMarkup(<ProjectDirectory entries={playProjects} showPreviews />);
    expect(html.match(/<img\b/g)).toHaveLength(19);
    expect(html.match(/loading="lazy"/g)).toHaveLength(19);
    expect(playProjects.find(project => project.id === "ambisonic-audio")?.preview?.alt).toBe("");
  });
  test("metadata and structured data describe the visible collection and only its actual destinations", () => {
    expect(metadata.alternates?.canonical).toBe("https://example.com/play");
    expect(metadata.openGraph).toMatchObject({ type: "website", images: [{ url: "https://example.com/opengraph-image" }] });
    const schema = playStructuredData("https://example.com");
    expect(schema.mainEntity.numberOfItems).toBe(26);
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
