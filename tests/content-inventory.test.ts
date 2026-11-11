import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import inventory from "../docs/content/inventory.json";

describe("MIC-10 content handoff", () => {
  test("covers every requested project and comic learning with unique identities", () => {
    const ids = inventory.projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(inventory.projects.map((project) => project.title)).size).toBe(ids.length);
    expect(ids.toSorted()).toEqual([
      "alerting", "broskis", "chromatique", "comic-learning", "copro-syndic",
      "holy-card-generator", "hop", "imagegonord", "schrodinger-hat",
      "social-post", "supermarket-waiting-times",
    ]);
  });

  test("backs every established fact and project link with a known source", () => {
    const sources = new Set(inventory.sources.map((source) => source.id));
    expect(sources.size).toBe(inventory.sources.length);
    for (const project of inventory.projects) {
      for (const fact of Object.values(project.facts)) {
        if (!fact) continue;
        expect(fact.text.trim().length).toBeGreaterThan(0);
        expect(fact.sources.length).toBeGreaterThan(0);
        for (const source of fact.sources) expect(sources.has(source)).toBe(true);
      }
      for (const link of project.links) {
        expect(sources.has(link.source)).toBe(true);
        expect(new URL(link.url).protocol).toBe("https:");
      }
    }
  });

  test("discloses unknown facts and supplies an authentic-media brief for each record", () => {
    for (const project of inventory.projects) {
      const gaps: Record<string, string | undefined> = project.gaps;
      for (const [field, fact] of Object.entries(project.facts)) {
        if (fact === null) expect(gaps[field]?.trim().length ?? 0).toBeGreaterThan(0);
      }
      expect(project.mediaRequirements.length).toBeGreaterThan(0);
      expect(project.publicationPermission).toBe("owner-approved");
      expect(project.editorialState).toBe("prepared-for-review");
    }
  });

  test("keeps unfinished creative work honest and free of placeholder links/outcomes", () => {
    for (const id of ["social-post", "comic-learning"]) {
      const project = inventory.projects.find((entry) => entry.id === id)!;
      expect(project.links).toEqual([]);
      expect(project.facts.outcomes).toBeNull();
      expect(project.facts.status?.text.toLowerCase()).toContain("in progress");
      expect(project.featuredRank).toBeNull();
    }
    expect(inventory.projects.find((entry) => entry.id === "hop")?.title).toBe("Hop");
    expect(inventory.projects.find((entry) => entry.id === "broskis")?.links[0]?.url)
      .toBe("https://broski.substack.com/");
  });

  test("gives each of three featured stories contribution and decision evidence", () => {
    const featured = inventory.projects.filter((project) => project.featuredRank !== null);
    expect(featured).toHaveLength(3);
    expect(featured.map((project) => project.featuredRank).toSorted()).toEqual([1, 2, 3]);
    for (const project of featured) {
      expect(project.facts.role?.sources.length ?? 0).toBeGreaterThan(0);
      expect(project.facts.decisions?.sources.length ?? 0).toBeGreaterThan(0);
      expect(project.facts.outcomes?.sources.length ?? 0).toBeGreaterThan(0);
    }
    const archived = inventory.projects.find((entry) => entry.id === "supermarket-waiting-times")!;
    expect(archived.facts.status?.text).toContain("Archived");
    expect(archived.links.every((link) => link.url.startsWith("https://github.com/"))).toBe(true);
  });

  test("preserves the real CV file at its confirmed URL, without replacing it with HTML", () => {
    expect(inventory.profile.cvPath).toBe("/miki-lombardi-resume.pdf");
    const bytes = readFileSync(new URL(`../public${inventory.profile.cvPath}`, import.meta.url));
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.length).toBe(3_275_765);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(inventory.profile.cvSha256);
    expect(inventory.profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
