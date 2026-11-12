import Link from "next/link";
import { Suspense } from "react";
import { MediaGallery } from "@/components/gallery/media-gallery";
import { StaticGallery } from "@/components/gallery/static-gallery";
import { siteStyles } from "@/components/site/styles";
import { Section } from "@/components/site/primitives";
import { caseStudyPath, publishedCaseStudies, type CaseStudy, type StorySection } from "@/content/case-studies";

function StoryBodySection({ section }: { section: StorySection }) {
  return <Section labelledBy={section.id}><div className={siteStyles.editorialRow}>
    <h2 id={section.id} className={siteStyles.sectionTitle}>{section.title}</h2>
    <div className={`${siteStyles.copy} text-lg leading-relaxed`}>
      {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      {section.code ? <div role="region" aria-label="Reproduce the palette conversion" tabIndex={0} className="max-w-full overflow-x-auto bg-(--ink) p-5 text-sm text-(--paper)"><pre><code>{section.code}</code></pre></div> : null}
      {section.links ? <ul className="flex list-none flex-col gap-2 p-0">{section.links.map(link => <li key={link.href}><a className="inline-flex min-h-11 items-center underline underline-offset-4" href={link.href}>{link.label}</a></li>)}</ul> : null}
    </div>
  </div></Section>;
}

export function CaseStudyPage({ story }: { story: CaseStudy }) {
  const { project } = story;
  const galleryLabel = `${project.title} project media`;
  return <article>
    <header className={`${siteStyles.container} ${siteStyles.sectionSpace}`}>
      <Link href="/work" className="inline-flex min-h-11 items-center underline underline-offset-4">← All work</Link>
      <h1 className="mt-8 max-w-[18ch] text-[clamp(2.8rem,7vw,6rem)] leading-[1.04] tracking-[-0.04em] text-balance [overflow-wrap:anywhere]">{project.title}</h1>
      <p className="mt-8 max-w-[68ch] text-xl leading-relaxed">{story.introduction}</p>
      <p className="mt-5 flex flex-wrap items-center gap-x-3 text-base"><span>{project.status || "Open-source project"}</span><span aria-hidden="true">·</span><span>Story by <Link className="inline-flex min-h-11 items-center underline underline-offset-4" href="/about">Miki Lombardi</Link></span></p>
      <dl className="mt-10 grid max-w-[85rem] gap-8 border-t border-current/20 pt-8 md:grid-cols-2">
        <div><dt className="font-medium">My contribution</dt><dd className="mt-2 max-w-[68ch]">{project.contribution}</dd></div>
        <div><dt className="font-medium">Project context</dt><dd className="mt-2 max-w-[68ch]">{story.team}</dd></div>
      </dl>
    </header>
    <section aria-labelledby="story-media" className={`surface-charcoal ${siteStyles.sectionSpace}`}>
      <div className={`${siteStyles.editorialRow} mb-8`}><h2 id="story-media" className={siteStyles.sectionTitle}>In pictures.</h2><p className={`${siteStyles.copy} text-base leading-relaxed`}>{story.mediaNote}</p></div>
      <div className={siteStyles.container}><Suspense fallback={<StaticGallery label={galleryLabel} items={project.media} />}><MediaGallery label={galleryLabel} items={project.media} /></Suspense></div>
    </section>
    {story.sections.map(section => <StoryBodySection key={section.id} section={section} />)}
    <Section labelledBy="more-work" className="surface-charcoal"><div className={siteStyles.editorialRow}>
      <h2 id="more-work" className={siteStyles.sectionTitle}>Keep exploring.</h2>
      <nav aria-label="More project stories"><ul className="space-y-4">{publishedCaseStudies.filter(item => item.project.id !== project.id).map(item => <li key={item.project.id}><Link className="inline-flex min-h-11 items-center text-2xl underline underline-offset-4" href={caseStudyPath(item.project)}>{item.project.title}</Link></li>)}</ul><Link className="mt-6 inline-flex min-h-11 items-center" href="/work">All work</Link></nav>
    </div></Section>
  </article>;
}
