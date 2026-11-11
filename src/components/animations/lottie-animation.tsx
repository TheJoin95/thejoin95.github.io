"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const Player = dynamic(() => import("./lottie-player"), { ssr: false });

/** Reserve dimensions with className; supply a static fallback for reduced motion. */
export function LottieAnimation({ src, fallback, className }: {
  src: string; fallback?: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      {visible && !reducedMotion ? <Player src={src} fallback={fallback} /> : fallback}
    </div>
  );
}
