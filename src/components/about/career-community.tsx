import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { selectedTalks } from "@/content/about";
import { projectIndex } from "@/content/work";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";

export function CareerCommunity() {
  const community = projectIndex.find(project => project.id === "schrodinger-hat")!;
  return <Section labelledBy="community-title"><div className={siteStyles.editorialRow}>
    <h2 id="community-title" className={siteStyles.sectionTitle}>Software.<br /> People.<br /> Shared ideas.</h2>
    <div className={siteStyles.copy}>
      <p>I’ve worked in product and consultancy teams, including Aperion, Plansoft and Growens, before joining Adobe. The roles have varied, but building useful software and working through technical problems with people have stayed at the center of it.</p>
      <p>I co-founded Schrödinger Hat, where software and community meet. Open-source projects, talks and shared experiments are part of how I learn and contribute beyond my day-to-day work.</p>
      <div className={siteStyles.actions}><a href={community.href}>Explore Schrödinger Hat <ArrowUpRight size={18} aria-hidden="true" /></a><Link href="/work">Explore the work</Link></div>
      <h3 className="pt-6 text-2xl tracking-tight">Selected talks</h3>
      <ul className="border-t border-current/20">{selectedTalks.map(talk => <li key={talk.href} className="border-b border-current/20 py-6">
        <p className="text-base tabular-nums">{talk.event} · {talk.year}</p>
        <a href={talk.href} className={`${siteStyles.link} mt-2 text-xl underline underline-offset-4`}><span lang={talk.language}>{talk.title}</span><ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></a>
        <p className="mt-3">{talk.description}</p>
      </li>)}</ul>
    </div>
  </div></Section>;
}
