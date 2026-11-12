import { homeStructuredData } from "./home";

export const aboutDescription = "Meet Miki Lombardi, Senior Software Engineer at Adobe and Schrödinger Hat co-founder, with interests in cycling, photography and comic learning.";
export const selectedTalks = [
  { title: "Automatizzare la conversione in palette di icone e immagini", event: "cssday", year: "2022", language: "it",
    description: "Open-source tools and ImageGoNord for converting visual assets to a chosen palette.",
    href: "https://2022.cssday.it/talks_speakers/index.html" },
  { title: "A crowdsourced map for checking supermarket wait times worldwide", event: "EuroPython", year: "2021", language: "en",
    description: "The architecture and scaling decisions behind the archived supermarket waiting-time map.",
    href: "https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/" },
] as const;

export function aboutStructuredData(origin: string) {
  const identity = homeStructuredData(origin)["@graph"][0];
  return { "@context": "https://schema.org", "@type": "ProfilePage", url: new URL("/about", origin).href,
    name: "About Miki Lombardi", description: aboutDescription,
    mainEntity: { ...identity, email: "miki.lombi@gmail.com" } };
}
