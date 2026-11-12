import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, existsSync } from "node:fs";
import { CaseStudyPage } from "@/components/work/case-study";
import { caseStudyPath, caseStudyStructuredData, findCaseStudy, isPublishableStory, publishedCaseStudies } from "@/content/case-studies";
import { selectedProjects } from "@/content/selected-projects";
import ProjectStory, { generateMetadata, generateStaticParams } from "@/app/work/[slug]/page";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";

describe("evidenced project stories", () => {
  test("only the three approved stories publish with shared identity, distinct decisions and real evidence", () => {
    expect(publishedCaseStudies.map(story => story.project)).toEqual([...selectedProjects]);
    expect(generateStaticParams()).toEqual(selectedProjects.map(project => ({ slug: project.id })));
    for (const story of publishedCaseStudies) {
      expect(story.project).toBe(selectedProjects.find(project => project.id === story.project.id)!);
      expect(story.sections.map(section => section.id)).toEqual(["problem", "decisions", "implementation", "evidence"]);
      expect(story.sections.flatMap(section => section.paragraphs).join(" ").length).toBeGreaterThan(1700);
      expect(story.project.media.every(item => item.kind === "image" && item.alt && item.caption && item.credit)).toBe(true);
      for (const link of story.sections.flatMap(section => section.links || [])) {
        expect(link.href).toMatch(/^(https:\/\/|\/)/);
        if (link.href.startsWith("/media/")) expect(existsSync(`public${link.href}`)).toBe(true);
      }
    }
    expect(findCaseStudy("imagegonord")!.team).toContain("Wabri");
    expect(findCaseStudy("supermarket")!.project.status).toBe("Archived project · 2020");
    expect(findCaseStudy("chromatique")!.project.status).toBe("In development");
    expect(findCaseStudy("chromatique")!.mediaNote).toContain("does not demonstrate the optional lightness-preservation mode");
    expect(readFileSync("public/media/chromatique/decision-extracts.md", "utf8")).toContain("closest to the");
    expect(findCaseStudy("hop")).toBeUndefined();
  });
  test("draft and incomplete stories cannot become public detail pages", () => {
    const story = publishedCaseStudies[0];
    expect(isPublishableStory(story)).toBe(true);
    expect(isPublishableStory({ ...story, published: false })).toBe(false);
    expect(isPublishableStory({ ...story, introduction: "" })).toBe(false);
    expect(isPublishableStory({ ...story, team: " " })).toBe(false);
    expect(isPublishableStory({ ...story, sections: [] })).toBe(false);
    expect(isPublishableStory({ ...story, sections: story.sections.map(section => ({ ...section, paragraphs: [] })) })).toBe(false);
  });
  test("the composed reader has one H1, structured contribution, meaningful media and onward routes", () => {
    for (const story of publishedCaseStudies) {
      const html = renderToStaticMarkup(<CaseStudyPage story={story} />);
      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain(story.project.contribution.replaceAll("&", "&amp;"));
      expect(html).toContain("My contribution");
      expect(html).toContain('href="/work"');
      expect(html).toContain('aria-label="More project stories"');
      for (const section of story.sections) expect(html).toContain(`id="${section.id}"`);
      expect(html).not.toContain('href="#"');
      expect(html).not.toContain("Evidence and capture notes");
    }
  });
  test("detail metadata and schema use the published path, existing card and real attribution without fake dates", async () => {
    for (const story of publishedCaseStudies) {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: story.project.id }) });
      const url = `https://example.com${caseStudyPath(story.project)}`;
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toMatchObject({ images: [{ url: `https://example.com/share/projects/${story.project.id}` }] });
      const schema = caseStudyStructuredData(story, "https://example.com");
      expect(schema.mainEntityOfPage).toBe(url);
      expect(schema.headline).toBe(story.project.title);
      expect(schema.author.name).toBe("Miki Lombardi");
      expect(schema.about.description).toContain(story.project.contribution);
      expect(schema).not.toHaveProperty("datePublished");
      expect(schema).not.toHaveProperty("dateModified");
      const route = await ProjectStory({ params: Promise.resolve({ slug: story.project.id }) });
      expect(renderToStaticMarkup(route)).toContain('application/ld+json');
    }
    await expect(generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow();
    await expect(ProjectStory({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow();
    expect(proxy(new NextRequest("https://example.com/work/unknown")).status).toBe(404);
    expect(proxy(new NextRequest("https://example.com/work/imagegonord")).status).toBe(200);
  });
});
