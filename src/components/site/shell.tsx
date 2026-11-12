import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { contacts } from "@/lib/site";
import { Navigation, NavigationLinks } from "./navigation";
import { cn } from "@/lib/utils";
import { siteStyles } from "./styles";

export function SiteHeader() {
  return <header className="site-header py-6"><div className={cn(siteStyles.container, "grid gap-4 md:grid-cols-2 md:gap-x-6 desktop:grid-cols-[1fr_1.4fr_1.4fr_1fr] desktop:items-start desktop:[&_a]:text-lg")}>
    <Link href="/" className={cn(siteStyles.link, "self-start text-xl tracking-[-0.035em] hover:underline")} aria-label="Miki Lombardi — Home">Miki Lombardi</Link>
    <p className="text-base leading-[1.4] desktop:text-lg">Software engineer<br className="hidden desktop:block" /> &amp; open-source contributor</p>
    <Suspense fallback={<NavigationLinks />}><Navigation /></Suspense>
    <div className={cn("hidden desktop:flex desktop:flex-wrap desktop:gap-x-4 desktop:gap-y-2 desktop:justify-self-end desktop:group-has-[.home-page]/site:flex-col desktop:group-has-[.home-page]/site:items-start", "[&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-[0.35rem] [&_a:hover]:underline")}>
      <a href="https://github.com/TheJoin95">GitHub <ArrowUpRight aria-hidden="true" size={18} /></a>
      <a href="https://www.linkedin.com/in/miki-lombardi/">LinkedIn <ArrowUpRight aria-hidden="true" size={18} /></a>
      <Link href="/about#contact">Get in touch <ArrowUpRight aria-hidden="true" size={18} /></Link>
    </div>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="surface-charcoal [padding-block:var(--section-space)_max(var(--section-space),env(safe-area-inset-bottom))]" id="contact"><div className={cn(siteStyles.container, "grid gap-8 desktop:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] desktop:items-center")}>
    <h2 className={siteStyles.sectionTitle}>Let’s talk.</h2>
    <nav aria-label="Contact"><ul className="flex list-none flex-col flex-wrap gap-2 p-0 md:grid md:grid-cols-2 desktop:flex desktop:flex-row desktop:justify-between">{contacts.map((contact) => <li key={contact.href}><a className={siteStyles.link} href={contact.href} download={"download" in contact ? contact.download : undefined}>
      {contact.label}{"detail" in contact ? <span className="text-[1rem] text-muted-foreground"> ({contact.detail})</span> : null}
      {contact.href.startsWith("https:") ? <ArrowUpRight size={18} aria-hidden="true" /> : null}
    </a></li>)}</ul></nav>
  </div></footer>;
}
