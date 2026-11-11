import type { Metadata } from "next";
import { PageIntro, Section } from "@/components/site/primitives";

export const metadata: Metadata = { title: "Work", description: "Software, systems and open-source contributions by Miki Lombardi." };
export default function Work() {
  return <div className="surface-charcoal" data-surface="charcoal">
    <PageIntro title="Selected work."><p>Software, systems, and open-source contributions. Explore the problem, the implementation and the decisions behind each project.</p></PageIntro>
    <Section labelledBy="work-projects"><div className="site-container editorial-row">
      <h2 id="work-projects" className="section-title">Open source,<br /> in practice.</h2>
      <div className="reading-copy"><p>ImageGoNord converts images into a chosen palette. Built with the Schrödinger Hat community, it brings software and visual experimentation together.</p><a href="https://github.com/Schroedinger-Hat/ImageGoNord-Web">Explore ImageGoNord on GitHub</a>
        <p>Supermarket waiting times was a crowdsourced map built in 2020. The project is archived.</p><a href="https://github.com/TheJoin95/covid19-market-waiting-times">View the archived project</a></div>
    </div></Section>
  </div>;
}
