"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Player = dynamic(() => import("./lottie-player"), { ssr: false });

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
      { rootMargin: "100px" });
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
      {visible && !reducedMotion && !completed ? <Player key={src} src={src} fallback={fallback} onComplete={finish} /> : fallback}
    </div>
  );
}
