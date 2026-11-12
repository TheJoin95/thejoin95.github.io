import { projectIndex } from "./work";

export const playDescription = "Side projects, community work, a personal Substack and creative experiments by Miki Lombardi, with comic learning and social posts in progress.";
// Keep shared project identity, lifecycle, attribution and public-link decisions.
export const playProjects = projectIndex.filter(project => project.id !== "comic-learning");
export const comicLearning = projectIndex.find(project => project.id === "comic-learning")!;
export function playStructuredData(origin: string) {
  return {
    "@context": "https://schema.org", "@type": "CollectionPage", url: new URL("/play", origin).href,
    name: "Play — Miki Lombardi", description: playDescription,
    mainEntity: { "@type": "ItemList", numberOfItems: playProjects.length,
      itemListElement: playProjects.map((project, index) => ({
        "@type": "ListItem", position: index + 1, name: project.title,
        description: `${project.summary} ${project.contribution} ${project.status}.`,
        ...(project.href ? { url: new URL(project.href, origin).href } : {}),
      })),
    },
    hasPart: { "@type": "CreativeWork", name: comicLearning.title, description: `${comicLearning.summary} ${comicLearning.status}.` },
  };
}
