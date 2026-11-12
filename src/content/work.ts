import { chromatiqueProject, imageGoNordProject, supermarketProject, selectedProjects } from "./selected-projects";

export type ProjectIndexEntry = {
  id: string; title: string; summary: string; contribution: string; status: string; href?: string;
};

export const projectIndex: readonly ProjectIndexEntry[] = [
  { id: "schrodinger-hat", title: "Schrödinger Hat", status: "Open-source community",
    summary: "Software, events, talks and a podcast made together.",
    contribution: "I co-founded the community and contribute as a speaker. This is collective work.", href: "https://schroedinger-hat.org/" },
  { id: "broskis", title: "Broskis", status: "Publication",
    summary: "My personal publication on Substack.", contribution: "I write here.", href: "https://broski.substack.com/" },
  { ...chromatiqueProject, status: "In development", href: "/work#chromatique" },
  { id: "holy-card-generator", title: "HolyCard AI", status: "Digital-only beta",
    summary: "An editable devotional portrait-card studio with PNG and PDF exports.",
    contribution: "I developed the card studio, image-generation flow and forms." },
  { id: "copro-syndic", title: "CoproSync", status: "In development",
    summary: "A self-hosted workspace for condominium councils, projects and incidents.",
    contribution: "I developed the project workflow and co-owner portal." },
  { id: "alerting", title: "Alerting", status: "In development",
    summary: "A dashboard exploring economic and systemic-risk signals from public data.",
    contribution: "My development work includes monitoring continuity and retry handling." },
  { id: "hop", title: "Hop", status: "Early prototype",
    summary: "A shared team room for conversation, notes and ideas, with an optional agent.",
    contribution: "I’m developing the meeting-app prototype." },
  { id: "social-post", title: "Social post", status: "In progress",
    summary: "An ongoing personal project around social posts.", contribution: "Personal work in progress." },
  { ...imageGoNordProject, status: "Public source", href: "/work#imagegonord" },
  { ...supermarketProject, id: "supermarket-waiting-times", status: "Archived project · 2020", href: "/work#supermarket" },
  { id: "comic-learning", title: "Learning to make comic books", status: "In progress",
    summary: "Learning to tell stories through comic-book drawings.", contribution: "I’m learning and practising." },
];

export const workDescription = "Software, open-source contributions and creative work by Miki Lombardi. Explore project media, contributions and a complete index, including archived work and prototypes.";

export function workStructuredData(origin: string) {
  const url = new URL("/work", origin).href;
  return {
    "@context": "https://schema.org", "@type": "CollectionPage", url,
    name: "Work — Miki Lombardi", description: workDescription,
    hasPart: selectedProjects.map(project => ({
      "@type": "CreativeWork", "@id": `${url}#${project.id}`, url: `${url}#${project.id}`,
      name: project.title, abstract: project.summary, description: project.contribution,
      contributor: { "@id": `${new URL("/", origin).href}#miki` },
      image: new URL(`/share/projects/${project.id}`, origin).href,
    })),
    mainEntity: { "@type": "ItemList", numberOfItems: projectIndex.length,
      itemListElement: projectIndex.map((project, index) => ({
        "@type": "ListItem", position: index + 1, name: project.title,
        description: `${project.summary} ${project.contribution} ${project.status}.`,
        ...(project.href ? { url: new URL(project.href, origin).href } : {}),
      })),
    },
  };
}
