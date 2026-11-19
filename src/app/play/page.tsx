import { PageTransition } from "@/components/site/page-transition";
import { pageMetadata, serializeStructuredData } from "@/lib/seo";
import { siteOrigin } from "@/lib/seo-config";
import { siteStyles } from "@/components/site/styles";
import Link from "next/link";
import { PageIntro, Section } from "@/components/site/primitives";
import { PaletteStage } from "@/components/home/palette-stage";
import { ProjectDirectorySection } from "@/components/projects/project-directory";
import { ComicPreview } from "@/components/play/comic-preview";
import { playDescription, playProjects, playStructuredData } from "@/content/play";
import { githubStarsVerifiedAt, minimumGitHubStars, organizationGitHubRepositories, publicGitHubRepositories } from "@/content/github-projects";

export const metadata = pageMetadata({ title: "Play", description: playDescription, path: "/play" });
export default function Play() {
  return <PageTransition>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(playStructuredData(siteOrigin())) }} />
    <PageIntro title="Built out of curiosity."><p>Side projects, community, and experiments.</p></PageIntro>
    <PaletteStage href="/work/chromatique" />
    <ProjectDirectorySection
      id="play-directory-title"
      title="Projects & community."
      description="Things I build, contribute to, and keep exploring. Some are public; others are still taking shape."
      entries={playProjects}
      showPreviews
    />
    <Section labelledBy="github-projects"><div className={siteStyles.container}>
      <h2 id="github-projects" className={siteStyles.sectionTitle}>GitHub project index</h2>
      <p className="mt-4 text-meta text-muted-foreground">
        Public projects with {minimumGitHubStars} or more stars. Counts checked <time dateTime={githubStarsVerifiedAt}>{githubStarsVerifiedAt}</time>.
      </p>
      <details className="mt-6 border-y border-border py-3">
        <summary className="min-h-11 cursor-pointer py-2">Public repositories on my GitHub profile</summary>
        <ul className="grid gap-x-6 md:grid-cols-2">
          {publicGitHubRepositories.map(({ repository, stars }) => <li key={repository} className="[overflow-wrap:anywhere]">
            <a className={`${siteStyles.link} underline underline-offset-4`} href={`https://github.com/${repository}`}>{repository.split("/")[1]}</a>
            <span className="ms-2 text-meta text-muted-foreground">{stars.toLocaleString("en-US")} stars</span>
          </li>)}
        </ul>
      </details>
      <details className="border-b border-border py-3">
        <summary className="min-h-11 cursor-pointer py-2">Projects I contributed to</summary>
        <ul className="grid gap-x-6 md:grid-cols-2">
          {organizationGitHubRepositories.map(({ repository, stars, contribution }) => <li key={repository} className="[overflow-wrap:anywhere]">
            <a className={`${siteStyles.link} underline underline-offset-4`} href={`https://github.com/${repository}`}>{repository}</a>
            <span className="ms-2 text-meta text-muted-foreground">{stars.toLocaleString("en-US")} stars</span>
            <a className={`${siteStyles.link} ms-2 text-meta underline underline-offset-4`} href={contribution} aria-label={`View my contribution to ${repository}`}>Contribution</a>
          </li>)}
        </ul>
      </details>
      <a className={`${siteStyles.link} mt-4 underline underline-offset-4`} href="https://github.com/search?q=is%3Apr+is%3Apublic+author%3ATheJoin95&type=pullrequests">Search all my public pull requests on GitHub</a>
    </div></Section>
    <ComicPreview />
    <Section labelledBy="play-passions-title"><div className={siteStyles.editorialRow}>
      <h2 id="play-passions-title" className={siteStyles.sectionTitle}>Beyond the keyboard.</h2>
      <div className={siteStyles.copy}><p>Cycling, photography, and whatever comes next.</p>
        <div className={siteStyles.actions}><Link href="/about">More about Miki</Link></div>
      </div>
    </div></Section>
  </PageTransition>;
}
