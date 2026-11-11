"use client";

import { ErrorState } from "@/components/site/error-state";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="site-container section-space"><h1 className="sr-only">Page unavailable</h1><ErrorState reset={reset} /></div>;
}
