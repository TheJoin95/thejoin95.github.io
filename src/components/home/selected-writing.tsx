import Link from "next/link";
import { featuredWriting } from "@/content/home";
import { siteStyles } from "@/components/site/styles";
import { cn } from "@/lib/utils";

export function SelectedWriting() {
  return <section aria-labelledby="selected-writing-title" className={cn(siteStyles.container, "grid gap-6 py-12 md:grid-cols-[minmax(0,2fr)_minmax(0,6fr)] desktop:grid-cols-[minmax(0,2fr)_minmax(0,8fr)_minmax(0,2fr)]")}>
    <h2 id="selected-writing-title" className="text-lg">Notes &amp; experiments</h2>
    <article className="min-w-0">
      <h3 className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.15] tracking-[-0.03em]"><a href={featuredWriting.href}>{featuredWriting.title}</a></h3>
      <p className="mt-4 max-w-[65ch]">{featuredWriting.summary}</p>
      <p className="mt-3 text-base text-muted-foreground">Miki Lombardi · <time dateTime={featuredWriting.published}>21 December 2019</time></p>
      <a className="mt-3 inline-flex min-h-11 items-center text-base" href={featuredWriting.href}>Read the article</a>
    </article>
    <Link href="/blog" className="inline-flex min-h-11 items-center self-start md:col-start-2 desktop:col-auto">All writing</Link>
  </section>;
}
