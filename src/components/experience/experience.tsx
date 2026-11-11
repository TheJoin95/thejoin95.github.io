"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <p className="p-6 text-muted-foreground">Loading experience…</p>,
});

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="p-6 text-muted-foreground">3D preview is unavailable on this device.</p>
      : this.props.children;
  }
}

export function Experience() {
  const reducedMotion = useReducedMotion();
  return (
    <div role="img" aria-label="Interactive silver knot. Drag to rotate."
      className="h-80 w-full overflow-hidden rounded-xl border border-border sm:h-96">
      <SceneBoundary><Scene reducedMotion={reducedMotion} /></SceneBoundary>
    </div>
  );
}
