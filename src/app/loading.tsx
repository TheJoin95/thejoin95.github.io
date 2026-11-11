import { ContentState } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { siteStyles } from "@/components/site/styles";

export default function Loading() {
  return <div className={cn(siteStyles.container, siteStyles.sectionSpace)}><ContentState title="Loading this page…" loading><p>The navigation is ready if you need to go somewhere else.</p></ContentState></div>;
}
