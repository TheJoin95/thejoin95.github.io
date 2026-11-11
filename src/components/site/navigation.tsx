"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentSection, navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavigationLinks({ pathname = "" }: { pathname?: string }) {
  return <nav aria-label="Primary" className="md:col-span-full desktop:col-auto"><ul className="flex list-none flex-wrap gap-2 p-0 desktop:group-has-[.home-page]/site:flex-col desktop:group-has-[.home-page]/site:gap-0">
    {navigation.map(({ href, label }) => {
      const current = currentSection(pathname, href);
      return <li key={href}><Link className={cn("inline-flex min-h-11 items-center gap-[0.35rem] px-[0.35rem] hover:underline", current && "underline underline-offset-[0.35em]")} href={href} aria-current={current}>{label}</Link></li>;
    })}
  </ul></nav>;
}

export function Navigation() {
  return <NavigationLinks pathname={usePathname()} />;
}
