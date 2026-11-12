import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup as html } from "react-dom/server";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import About, { metadata } from "@/app/about/page";
import { SiteFooter } from "@/components/site/shell";
import { contacts } from "@/lib/site";
import { aboutDescription, aboutStructuredData, selectedTalks } from "@/content/about";
import { homeStructuredData } from "@/content/home";
import inventory from "../docs/content/inventory.json";

describe("About, passions and contact", () => {
  test("confirmed professional copy, historical employers and community attribution remain accurate", () => {
    const output = html(<About />);
    expect(output.match(/<h1\b/g)).toHaveLength(1);
    expect(output).toContain(`${inventory.profile.title} at ${inventory.profile.employer}`);
    for (const company of ["Aperion", "Plansoft", "Growens"]) expect(output).toContain(company);
    expect(output).toContain("I co-founded Schrödinger Hat");
    for (const unsupported of ["Since 2014", "Paris", "available for freelance", "Adobe Stock", "2Mln", "million visits"]) expect(output).not.toContain(unsupported);
    expect(output).toContain('href="https://schroedinger-hat.org/"');
  });
  test("selected talks use sourced event titles, years and native destinations", () => {
    const output = html(<About />);
    expect(selectedTalks.map(talk => talk.year)).toEqual(["2022", "2021"]);
    for (const talk of selectedTalks) {
      expect(output).toContain(talk.title); expect(output).toContain(`href="${talk.href}"`);
      expect(output).toContain(`lang="${talk.language}"`); expect(talk.href).toStartWith("https://");
    }
    expect(output).not.toContain("Watch the recording");
  });
  test("passions use the approved text fallback and actual sketchbook route without invented artwork", () => {
    const output = html(<About />);
    for (const part of ["Cycling", "photography", "Learning to make comic books.", "A work in progress."]) expect(output).toContain(part);
    expect(output).toContain('href="/blog#sketchbook"'); expect(output).toContain('href="/play"');
    expect(output).not.toContain("<img"); expect(output).not.toContain("<canvas");
    expect(output).not.toContain('href="#"'); expect(output).toContain('href="#contact"');
  });
  test("shared contacts preserve exact public destinations and CV downloads the original PDF", () => {
    const footer = html(<SiteFooter />);
    expect(contacts.map<string>(contact => contact.href)).toEqual([`mailto:${inventory.profile.email}`, inventory.profile.github, inventory.profile.linkedin, inventory.profile.cvPath]);
    for (const contact of contacts) expect(footer).toContain(`href="${contact.href}"`);
    expect(footer).toContain('download="miki-lombardi-resume.pdf"');
    const bytes = readFileSync(`public${inventory.profile.cvPath}`);
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(inventory.profile.cvSha256);
  });
  test("profile schema and social metadata match visible identity without synthetic dates or location", () => {
    expect(metadata.description).toBe(aboutDescription);
    expect(metadata.alternates?.canonical).toBe("https://example.com/about");
    expect(metadata.openGraph).toMatchObject({ url: "https://example.com/about", images: [{ url: "https://example.com/opengraph-image", width: 1200, height: 630 }] });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    const profile = aboutStructuredData("https://example.com");
    expect(profile).toMatchObject({ "@type": "ProfilePage", mainEntity: { "@type": "Person", "@id": "https://example.com/#miki", name: inventory.profile.name, jobTitle: inventory.profile.title, worksFor: { name: inventory.profile.employer }, email: inventory.profile.email } });
    expect(profile.mainEntity.sameAs).toEqual(homeStructuredData("https://example.com")["@graph"][0].sameAs);
    for (const field of ["dateCreated", "dateModified", "address", "birthDate", "interactionStatistic"]) expect(JSON.stringify(profile)).not.toContain(`"${field}"`);
  });
});
