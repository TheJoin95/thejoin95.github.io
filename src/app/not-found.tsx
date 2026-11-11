import Link from "next/link";
import { PageIntro } from "@/components/site/primitives";

export default function NotFound() {
  return <PageIntro title="Page not found."><p>This address doesn’t lead to a page. Try the work or Journal, or head back home.</p><div className="inline-actions"><Link href="/">Home</Link><Link href="/work">Work</Link><Link href="/blog">Journal</Link></div></PageIntro>;
}
