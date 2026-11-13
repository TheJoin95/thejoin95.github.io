"use client";

import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Player = lazy(() => import("./lottie-player"));

class AnimationBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Reserve dimensions with className; supply a static fallback for reduced motion. */
export function LottieAnimation({ src, fallback, className }: {
  src: string; fallback?: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const started = useRef(false);
  const finish = useCallback(() => setCompleted(true), []);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) started.current = true;
      else if (started.current) finish();
    },
      { rootMargin: "0px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [finish]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => { if (media.matches && started.current) finish(); };
    media.addEventListener("change", cancel);
    return () => media.removeEventListener("change", cancel);
  }, [finish]);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      {visible && !reducedMotion && !completed ? <AnimationBoundary fallback={fallback}>
        <Suspense fallback={fallback}><Player key={src} src={src} fallback={fallback} onComplete={finish} /></Suspense>
      </AnimationBoundary> : fallback}
    </div>
  );
}
