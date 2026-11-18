"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentSection, navigation } from "@/lib/site";
import { cn } from "@/lib/utils";
import { RouteMotion } from "./route-motion";

export function NavigationLinks({ pathname = "" }: { pathname?: string }) {
  return <nav aria-label="Primary" className="md:col-span-full desktop:col-auto"><ul className="flex list-none flex-wrap gap-x-2 p-0 desktop:grid desktop:grid-cols-2 desktop:gap-x-6 desktop:gap-y-0">
    {navigation.map(({ href, label }) => {
      const current = currentSection(pathname, href);
      return <li key={href}><Link className={cn("inline-flex min-h-11 min-w-11 items-center gap-[0.35rem] pe-2 hover:underline", current && "underline underline-offset-[0.35em]")} href={href} aria-current={current}>{label}</Link></li>;
    })}
  </ul></nav>;
}

export function Navigation() {
  const pathname = usePathname();
  return <><NavigationLinks pathname={pathname} /><RouteMotion pathname={pathname} /></>;
}
