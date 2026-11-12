import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { siteStyles } from "@/components/site/styles";
import Link from "next/link";
import { Experience } from "@/components/experience/experience";

export const metadata: Metadata = pageMetadata({ title: "Experience", description: "An interactive Three.js sculpture by Miki Lombardi. Rotate the form and explore a small experiment in geometry and motion.", path: "/experience" });
export default function ExperiencePage() {
  return (
    <div className={cn(siteStyles.container, siteStyles.sectionSpace, "flex flex-col gap-6")}>
      <Link href="/" className="text-sm underline underline-offset-4">Back to home</Link>
      <h1 className="text-3xl font-normal tracking-tight">A little room to explore.</h1>
      <p className="text-muted-foreground">Drag to rotate the sculpture.</p>
      <Experience />
    </div>
  );
}
