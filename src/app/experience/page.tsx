import type { Metadata } from "next";
import Link from "next/link";
import { Experience } from "@/components/experience/experience";

export const metadata: Metadata = { title: "Experience" };
export default function ExperiencePage() {
  return (
    <div className="site-container section-space flex flex-col gap-6">
      <Link href="/" className="text-sm underline underline-offset-4">Back to home</Link>
      <h1 className="text-3xl font-semibold tracking-tight">A little room to explore.</h1>
      <p className="text-muted-foreground">Drag to rotate the sculpture.</p>
      <Experience />
    </div>
  );
}
