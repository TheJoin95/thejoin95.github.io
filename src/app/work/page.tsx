import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Section } from "@/components/site/primitives";
import { ProjectFeature } from "@/components/gallery/project-feature";
import { selectedProjects } from "@/content/selected-projects";
import { ProjectIndex } from "@/components/work/project-index";
import { siteStyles } from "@/components/site/styles";
import { workDescription, workStructuredData } from "@/content/work";

export const metadata: Metadata = pageMetadata({ title: "Work", description: workDescription, path: "/work" });

export default function Work() {
  return <div className="surface-charcoal" data-surface="charcoal">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(workStructuredData(siteOrigin())) }} />
    <PageIntro title="Selected work."><p>Software, systems, and open-source contributions. Explore the problem, the implementation and the decisions behind each project.</p></PageIntro>
    {selectedProjects.map(project => <ProjectFeature key={project.id} project={project} />)}
    <ProjectIndex />
    <Section labelledBy="work-play-title"><div className={siteStyles.editorialRow}>
      <h2 id="work-play-title" className={siteStyles.sectionTitle}>Beyond the brief.</h2>
      <div className={siteStyles.copy}><p>Small experiments and things I’m learning along the way.</p><Link href="/play" className={siteStyles.link}>Explore Play</Link></div>
    </div></Section>
  </div>;
}
