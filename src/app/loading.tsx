import { ContentState } from "@/components/site/primitives";

export default function Loading() {
  return <div className="site-container section-space"><ContentState title="Loading this page…" loading><p>The navigation is ready if you need to go somewhere else.</p></ContentState></div>;
}
