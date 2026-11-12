import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentState, Section } from "@/components/site/primitives";
import { siteStyles } from "@/components/site/styles";
import { archiveHref, archivePageSize, type ArchiveView } from "@/lib/journal-archive";

export function JournalArchive({ view }: { view: ArchiveView }) {
  return <div id="archive"><Section labelledBy="archive-title"><div className={siteStyles.container}>
    <h2 id="archive-title" className={siteStyles.sectionTitle}>From the archive.</h2>
    <p className="mt-6 max-w-[68ch]">Writing from the archive, with original titles and publication dates. Search titles, summaries and article text, or choose a tag.</p>
    <form key={`${view.q}:${view.tag}`} action="/blog#archive" method="get" role="search" aria-label="Search the Journal" className="mt-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
        <div className="grid min-w-0 gap-3"><Label htmlFor="journal-search">Search writing</Label><Input id="journal-search" name="q" type="search" defaultValue={view.q} maxLength={160} /></div>
        <div className="grid min-w-0 gap-3"><Label htmlFor="journal-tag">Tag</Label><select id="journal-tag" name="tag" defaultValue={view.tag} className="min-h-11 w-full min-w-0 rounded-(--radius) border border-input bg-background px-3 py-2 text-base">
          <option value="">All tags</option>
          {view.tag && !view.tags.includes(view.tag) ? <option value={view.tag}>{view.tag} (unavailable)</option> : null}
          {view.tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select></div>
        <Button type="submit" variant="outline">Search</Button>
      </div>
    </form>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p role="status" aria-live="polite" className="min-w-0 [overflow-wrap:anywhere]">{view.total} {view.total === 1 ? "article" : "articles"}{view.q ? ` matching “${view.q}”` : ""}{view.tag ? ` tagged “${view.tag}”` : ""}{view.total > 0 ? ` · Showing ${(view.page - 1) * archivePageSize + 1}–${Math.min(view.page * archivePageSize, view.total)}` : ""}</p>
      {view.filtered ? <Link className={siteStyles.link} href="/blog#archive">Clear filters</Link> : null}
    </div>
    {view.items.length ? <ul className="mt-8 border-t border-current/20" aria-label="Archive articles">{view.items.map(article => <li key={article.slug} className="grid min-w-0 gap-4 border-b border-current/20 py-8 md:grid-cols-[8rem_minmax(0,1fr)] desktop:grid-cols-[10rem_minmax(0,1fr)_auto]">
      <time dateTime={article.date} className="text-base tabular-nums">{article.date}</time>
      <div className="min-w-0 max-w-[70ch] [overflow-wrap:anywhere]"><h3 className="text-2xl leading-tight tracking-tight"><Link className="inline-flex min-h-11 items-center" href={`/blog/${article.slug}`}>{article.title}</Link></h3><p className="mt-3">{article.description}</p><p className="mt-3 text-base text-muted-foreground">{article.tags.join(" · ")}</p></div>
      <Link href={`/blog/${article.slug}`} className="inline-flex min-h-11 items-center self-start md:col-start-2 desktop:col-auto">Read<span className="sr-only"> {article.title}</span></Link>
    </li>)}</ul> : <div className="mt-10"><ContentState title={view.empty ? "No published writing yet." : "No matching articles."} action={view.filtered ? <Link href="/blog#archive">Clear filters</Link> : <Link href="/play">Explore Play</Link>}>
      <p>{view.empty ? "New writing will appear here when it is published." : "Try another search or tag. The complete archive is still available."}</p>
    </ContentState></div>}
    {view.totalPages > 1 ? <nav aria-label="Archive pagination" className="mt-10 flex flex-wrap items-center justify-between gap-6">
      {view.page > 1 ? <a className={siteStyles.link} href={archiveHref({ ...view, page: view.page - 1 })}>Previous page</a> : null}
      <p>Page {view.page} of {view.totalPages}</p>
      {view.page < view.totalPages ? <a className={siteStyles.link} href={archiveHref({ ...view, page: view.page + 1 })}>Next page</a> : null}
    </nav> : null}
  </div></Section></div>;
}
