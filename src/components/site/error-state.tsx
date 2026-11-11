"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContentState } from "./primitives";

export function ErrorState({ reset }: { reset: () => void }) {
  return <ContentState title="This page could not load." action={<><Button onClick={reset}>Try again</Button><Link href="/">Back to home</Link></>}>
    <p>Please try again, or use the navigation to keep exploring.</p>
  </ContentState>;
}
