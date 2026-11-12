import { ContentState } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { siteStyles } from "@/components/site/styles";

// Opt into loading at an enhancement boundary, not around static page content.
export default function Loading() {
  return <div className={cn(siteStyles.container, siteStyles.sectionSpace)}><ContentState title="Loading this page…" loading><p>The navigation is ready if you need to go somewhere else.</p></ContentState></div>;
}
