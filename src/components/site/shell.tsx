import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { contacts } from "@/lib/site";
import { Navigation, NavigationLinks } from "./navigation";

export function SiteHeader() {
  return <header className="site-header"><div className="site-container header-grid">
    <Link href="/" className="site-identity" aria-label="Miki Lombardi — Home">Miki Lombardi</Link>
    <p className="site-role">Software engineer<br className="desktop-break" /> &amp; open-source contributor</p>
    <Suspense fallback={<NavigationLinks />}><Navigation /></Suspense>
    <div className="header-contact">
      <a href="https://github.com/TheJoin95">GitHub <ArrowUpRight aria-hidden="true" size={18} /></a>
      <a href="https://www.linkedin.com/in/miki-lombardi/">LinkedIn <ArrowUpRight aria-hidden="true" size={18} /></a>
      <Link href="/about#contact">Get in touch <ArrowUpRight aria-hidden="true" size={18} /></Link>
    </div>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer surface-charcoal" id="contact"><div className="site-container footer-grid">
    <h2 className="section-title">Let’s talk.</h2>
    <nav aria-label="Contact"><ul className="contact-links">{contacts.map((contact) => <li key={contact.href}><a href={contact.href}>
      {contact.label}{"detail" in contact ? <span className="link-detail"> ({contact.detail})</span> : null}
      {contact.href.startsWith("https:") ? <ArrowUpRight size={18} aria-hidden="true" /> : null}
    </a></li>)}</ul></nav>
  </div></footer>;
}
