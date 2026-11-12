import Link from "next/link";
import { MediaFrame, Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import type { JournalArticle } from "@/lib/journal";

export function FeaturedWriting({ article }: { article: JournalArticle }) {
  const diagram = article.slug === "2019-12-21-microfrontend-from-00-to-20s";
  return <Section labelledBy="featured-writing-title" className="surface-charcoal"><div className={siteStyles.container}>
    <h2 id="featured-writing-title" className="mb-8 text-lg">Featured writing.</h2>
    <article className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)] desktop:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]">
      <div className="min-w-0 [overflow-wrap:anywhere]"><h3 className="text-[clamp(1.75rem,3vw,3rem)] leading-[1.1] tracking-tight"><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
        <p className="mt-5 leading-relaxed">{article.description}</p><p className="mt-5 text-base">Miki Lombardi · <time dateTime={article.date}>{article.date}</time></p>
        <Link className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4" href={`/blog/${article.slug}`}>Read the featured article</Link>
      </div>
      <MediaFrame src={diagram ? "/media/journal/microfrontends.svg" : `/blog/${article.slug}/share`} width={1200} height={630}
        alt={diagram ? "A school application shell composes independently developed staff, subjects and register frontends." : `${article.title} — article title card`}
        caption={diagram ? "An illustration of the article’s school application example. Drawn for this site in 2026; not a historical product screenshot." : "Article title card."} />
    </article>
  </div></Section>;
}
