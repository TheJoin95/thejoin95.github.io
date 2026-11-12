export const homeIdentity = {
  name: "Miki Lombardi",
  title: "Miki Lombardi | Software engineering and open source",
  description: "Software engineering, open-source projects and practical experiments by Miki Lombardi, Senior Software Engineer at Adobe.",
};

export const featuredWriting = {
  title: "Micro Frontends - From the 00s to 20s",
  published: "2019-12-21",
  href: "/blog/2019-12-21-microfrontend-from-00-to-20s",
  summary: "When independently developed frontend applications share one experience: the boundaries, trade-offs and maintenance costs.",
};

export function homeStructuredData(origin: string) {
  const url = new URL("/", origin).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${url}#miki`, name: homeIdentity.name, url,
        jobTitle: "Senior Software Engineer", worksFor: { "@type": "Organization", name: "Adobe" },
        sameAs: ["https://github.com/TheJoin95", "https://www.linkedin.com/in/miki-lombardi/"] },
      { "@type": "WebSite", "@id": `${url}#website`, url, name: homeIdentity.name,
        description: homeIdentity.description, author: { "@id": `${url}#miki` } },
    ],
  };
}
