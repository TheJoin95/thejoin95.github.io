import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";
import { PageIntro, Section } from "@/components/site/primitives";

export default function Home() {
  return <div className="home-page">
    <PageIntro title="Engineering, with curiosity."><p>I’m Miki, a Senior Software Engineer at Adobe. I build software, contribute to open source, and share what I learn along the way.</p></PageIntro>
    <Section labelledBy="explore-title" className="surface-charcoal"><div className="site-container editorial-row">
      <h2 id="explore-title" className="section-title">Built, shaped,<br /> and shared.</h2>
      <div className="reading-copy"><p>Software, open source, and practical experiments. Explore the projects and the decisions behind them.</p>
        <div className="inline-actions"><Link href="/work">Explore the work</Link><Link href="/experience">Explore the experiment</Link></div>
      </div>
    </div></Section>
    <Section labelledBy="newsletter-title"><div className="site-container editorial-row">
      <h2 id="newsletter-title" className="section-title">Stay in the loop.</h2>
      <div className="reading-copy"><p>Subscribe for new writing and updates. Unsubscribe at any time.</p><NewsletterForm /><Button asChild variant="link"><Link href="/blog">Read the Journal</Link></Button></div>
    </div></Section>
  </div>;
}
