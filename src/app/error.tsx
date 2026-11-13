"use client";

import { ErrorState } from "@/components/site/error-state";
import { cn } from "@/lib/utils";
import { siteStyles } from "@/components/site/styles";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className={cn(siteStyles.container, siteStyles.sectionSpace)}><ErrorState reset={reset} /></div>;
}
