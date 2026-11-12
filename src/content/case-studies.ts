import { chromatiqueProject, imageGoNordProject, supermarketProject, type SelectedProject } from "./selected-projects";

export type StorySection = { id: string; title: string; paragraphs: readonly string[]; links?: readonly { href: string; label: string }[]; code?: string };
export type CaseStudy = { project: SelectedProject; published: boolean; introduction: string; team: string; mediaNote: string; sections: readonly StorySection[] };

const stories: readonly CaseStudy[] = [
  {
    project: imageGoNordProject, published: true,
    introduction: "A small tool for finding a different colour language. ImageGoNord brings palette conversion to a Python package and a browser experience, so the same idea can be used from code or tried with an image.",
    team: "Co-authored with Wabri, with contributions from the Schrödinger Hat community. The web architecture describes the shared project, rather than work attributed to one person.",
    mediaNote: "Real captures of the ImageGoNord interface. These show the upload and palette settings; they are not a claim about conversion accuracy or usage.",
    sections: [
      { id: "problem", title: "A palette beyond one image", paragraphs: [
        "ImageGoNord started from an interest in applying a consistent colour palette to images. The useful boundary is between the conversion itself and the ways people want to use it: a script, a Python program or a browser.",
        "An image-processing operation does not have the same workload as accepting a web request. The interface needs to start work and communicate with the processing service without making the conversion package depend on a particular website.",
      ] },
      { id: "decisions", title: "Separate the engine from the request", paragraphs: [
        "A direct conversion in the HTTP request would have fewer moving parts, but it would couple request handling to the processing job. The documented project architecture instead uses Flask and Gunicorn to accept conversion requests, Redis for queue management, and background workers using the ImageGoNord Python package.",
        "That separation makes the conversion package useful outside the web interface. It also introduces a queue and workers that have to be operated alongside the API. It is a tradeoff in the project’s architecture, not evidence of a particular response-time improvement.",
      ], links: [{ href: "https://github.com/Schroedinger-Hat/ImageGoNord-Web#core-technical-concepts", label: "Read the documented web architecture" }] },
      { id: "implementation", title: "One package, a browser entry point", paragraphs: [
        "The Python package handles image and palette operations, with Pillow providing image manipulation. The web interface supplies image upload and palette controls, while the API and workers form the processing boundary behind it.",
        "I co-authored ImageGoNord with Wabri. Keeping that attribution visible matters: the package, website and later community contributions form a shared open-source project. A description of the overall system does not mean I independently built every later version or deployment.",
      ], links: [{ href: "https://github.com/Schroedinger-Hat/ImageGoNord-pip", label: "Explore the Python package" }] },
      { id: "evidence", title: "Try the idea. Read the implementation.", paragraphs: [
        "The gallery shows the real browser interface, its palette groups and conversion settings. The live demo and public source provide different ways to explore the same tool: try an image, inspect the package boundary or follow a conversion job through the web application.",
        "The engineering lesson is the value of a reusable conversion boundary. It lets an interactive demonstration and a programmatic workflow share the same purpose, while making the cost of the web layer explicit.",
      ], links: [{ href: "https://ign.schroedinger-hat.org/", label: "Open the ImageGoNord demo" }, { href: imageGoNordProject.href, label: "Read the web application source" }] },
    ],
  },
  {
    project: supermarketProject, published: true,
    introduction: "From a Raspberry Pi to regional infrastructure during lockdown. In 2020, I built a map to help people check estimated waiting times at supermarkets and pharmacies. The project is now archived.",
    team: "Contributors helped with the graphics. My preserved technical articles document the implementation and the decisions made along the way.",
    mediaNote: "A source-derived architecture diagram, drawn in 2026 from my preserved technical article. It is not a historical product screenshot. This archived project is not a live source of waiting-time or health information.",
    sections: [
      { id: "problem", title: "A small tool for an immediate problem", paragraphs: [
        "During the 2020 lockdown, a trip to the supermarket could involve a long queue. The map combined available place data with corrections from people using it, showing estimated waiting times rather than claiming to measure the queue directly.",
        "The first version ran on my Raspberry Pi. That was an affordable starting point for a personal tool, but the same machine initially held the web services, processing and cache. As demand changed, that single setup became a constraint.",
      ] },
      { id: "decisions", title: "Move when the constraint becomes real", paragraphs: [
        "I considered extending the local setup with a cluster, then moved the backend to VPS infrastructure. Starting with the Raspberry Pi kept the initial system small; moving later meant adapting an existing service while it was being used.",
        "The backend grew into regional instances in Europe and America, while the frontend eventually moved to GitHub Pages. Clients selected from available API instances with fallback. That approach shared the load, but also meant maintaining several environments and handling unavailable instances. It was a practical response to observed demand, rather than a claim that this was the only possible cloud architecture.",
      ], links: [{ href: "/blog/2021-04-17-covid19-supermarket-waiting-times-2020-recap", label: "Read the preserved architecture account" }] },
      { id: "implementation", title: "Keep location and freshness in the data layer", paragraphs: [
        "The backend used Python and Flask, served through uWSGI. Redis supplied geospatial lookup and expiring cached data. The frontend used Leaflet and OpenStreetMap, with a small JavaScript and Grunt setup rather than an additional application framework.",
        "The waiting times were estimates derived from place data and feedback, with limitations when geolocation did not match the queue or venue. The service’s useful output depended on fresh data and clear expectations as much as on keeping the API available.",
      ], links: [{ href: "/blog/2021-04-17-covid19-supermarket-waiting-times-how-it-was-made", label: "Read how the map was made" }] },
      { id: "evidence", title: "What the archive preserves", paragraphs: [
        "The source, technical articles and EuroPython talk preserve the development process. The diagram above summarises the documented architecture; it does not reconstruct a missing period map screenshot.",
        "The lesson was adapting a personal tool to a different scale while keeping it understandable and affordable. The project remains an archived 2020 experiment. The source and archived articles preserve the reasoning behind that progression.",
      ], links: [{ href: supermarketProject.href, label: "Explore the archived source" }, { href: "https://ep2021.europython.eu/talks/BG87bCt-a-crowdsourced-map-for-checking-supermarket-wait-times-worldwide/", label: "View the EuroPython 2021 talk page" }] },
    ],
  },
  {
    project: chromatiqueProject, published: true,
    introduction: "One colour engine, several ways to use it. Chromatique explores how the same palette-processing behaviour can be reused through a command line, language bindings and creative-tool interfaces. It is still in development.",
    team: "An evolving ecosystem with a shared engine and several integration surfaces. The available CLI example demonstrates one operation; it does not independently verify every integration as a finished release.",
    mediaNote: "A licensed source photograph beside actual Chromatique CLI output. The example uses ordinary OKLab palette mapping without dithering; it does not demonstrate the optional lightness-preservation mode.",
    sections: [
      { id: "problem", title: "A shared colour contract", paragraphs: [
        "A palette engine is useful in more than one environment. Reimplementing its algorithms independently in each language would make it harder to keep defaults, colour selection and output behaviour consistent across those entry points.",
        "The project uses a shared Rust core, with other languages integrating through bindings. The deterministic CPU path remains the reference behaviour; optional acceleration must not change that contract. The project is in development, so a list of integrations is not a list of independently verified releases.",
      ] },
      { id: "decisions", title: "Choose lightness deliberately", paragraphs: [
        "For lightness preservation, the mapper chooses the palette entry with the closest OKLab lightness, then uses chroma distance to resolve ties. Palette order provides a final deterministic tie-break. This keeps the output inside the requested palette and gives the selection rule a precise meaning.",
        "A weighted colour-distance formula can trade lightness against chroma, but cannot make the same minimum-lightness-error guarantee. Choosing lightness first has its own tradeoff: it can select a colour that is less faithful in hue or saturation. Changing the palette to match the input would solve a different problem by introducing colours outside the requested palette.",
      ] },
      { id: "implementation", title: "Explicit behaviour at the boundary", paragraphs: [
        "My repository work includes analysis, comparison and the lightness-preserving selection path. The Rust core decision keeps algorithmic behaviour in one place, while bindings expose that behaviour to other languages. Rust is a structural choice here, not a benchmark result.",
        "Requests for unsupported preservation behaviour return an explicit error instead of being silently ignored. Lightness preservation uses the OKLab path; the decision record distinguishes that from ordinary sRGB matching. Lightness selection, structure handling and contrast adjustment have separate contracts; they are not interchangeable preservation flags.",
      ], links: [{ href: "/media/chromatique/decision-extracts.md", label: "Read the original decision record extracts" }] },
      { id: "evidence", title: "An input, a recipe, a real output", paragraphs: [
        "The gallery pairs Frances Benjamin Johnston’s 1921 photograph of irises at West Potomac Park with the actual output from Chromatique 0.2.0. The input’s Library of Congress rights advisory records no known restrictions on publication. The output uses the sixteen-colour Nord palette, credited to Sven Greb.",
        "This run uses the CPU path, OKLab and no dithering. It demonstrates a reproducible palette conversion, not a performance benchmark or the optional lightness-preservation algorithm. The lesson is to make each operation’s contract clear enough to inspect and test without confusing it with another operation.",
      ], code: "chromatique map --palette nord --palette-dir ./palettes \\\n  --space oklab --dither none --indexed \\\n  irises-original.jpg -o irises-nord.png", links: [{ href: "/media/chromatique/irises-original.jpg", label: "Download the original input" }, { href: chromatiqueProject.href, label: "View the actual CLI output" }, { href: "https://www.loc.gov/pictures/item/2007686318/", label: "Read the photograph’s catalogue and rights advisory" }] },
    ],
  },
];

export function caseStudyPath(project: Pick<SelectedProject, "id">) { return `/work/${project.id}`; }
export function isPublishableStory(story: CaseStudy) {
  return story.published && story.introduction.trim().length > 0 && story.team.trim().length > 0 &&
    story.sections.length >= 4 && story.sections.every(section => section.title.trim() && section.paragraphs.length > 0 && section.paragraphs.every(text => text.trim()));
}
export const publishedCaseStudies = stories.filter(isPublishableStory);
export function findCaseStudy(slug: string) { return publishedCaseStudies.find(story => story.project.id === slug); }
export function caseStudyStructuredData(story: CaseStudy, origin: string) {
  const url = new URL(caseStudyPath(story.project), origin).href;
  return { "@context": "https://schema.org", "@type": "Article", "@id": `${url}#story`, url, mainEntityOfPage: url,
    headline: story.project.title, description: story.introduction,
    author: { "@type": "Person", name: "Miki Lombardi", url: new URL("/about", origin).href },
    image: new URL(`/share/projects/${story.project.id}`, origin).href,
    about: { "@type": "CreativeWork", "@id": `${new URL("/work", origin).href}#${story.project.id}`, name: story.project.title,
      description: `${story.project.summary} ${story.project.contribution}`, contributor: { "@type": "Person", name: "Miki Lombardi" } },
  };
}
