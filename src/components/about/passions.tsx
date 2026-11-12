import Link from "next/link";
import { Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";

export function Passions() {
  return <Section labelledBy="beyond-title" className="surface-charcoal"><div className={siteStyles.editorialRow}>
    <h2 id="beyond-title" className={siteStyles.sectionTitle}>Beyond the<br /> keyboard.</h2>
    <div className={`${siteStyles.copy} space-y-12`}>
      <div><h3 className="text-[clamp(1.75rem,3vw,3rem)] leading-tight tracking-tight">Cycling &amp; photography.</h3>
        <p className="mt-6">Cycling and photography are two of my other interests.</p></div>
      <div className="border-t border-current/20 pt-8"><h3 className="text-[clamp(1.75rem,3vw,3rem)] leading-tight tracking-tight">Learning to make comic books.</h3>
        <p className="mt-6">A work in progress. I’m developing original drawings and learning the craft. The sketchbook will follow that process as it takes shape.</p>
        <Link href="/blog#sketchbook" className={`${siteStyles.link} mt-4 underline underline-offset-4`}>Explore the sketchbook</Link>
      </div>
      <Link href="/play" className={`${siteStyles.link} underline underline-offset-4`}>Explore side projects &amp; experiments</Link>
    </div>
  </div></Section>;
}
