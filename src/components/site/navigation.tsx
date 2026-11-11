"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentSection, navigation } from "@/lib/site";

export function NavigationLinks({ pathname = "" }: { pathname?: string }) {
  return <nav aria-label="Primary"><ul className="primary-links">
    {navigation.map(({ href, label }) => <li key={href}><Link href={href} aria-current={currentSection(pathname, href)}>{label}</Link></li>)}
  </ul></nav>;
}

export function Navigation() {
  return <NavigationLinks pathname={usePathname()} />;
}
