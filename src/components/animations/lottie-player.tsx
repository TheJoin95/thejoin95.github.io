"use client";

import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

export default function LottiePlayer({ src, fallback }: { src: string; fallback?: ReactNode }) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);
  useEffect(() => {
    player?.addEventListener("loadError", handleError);
    return () => player?.removeEventListener("loadError", handleError);
  }, [player, handleError]);
  if (failed) return fallback;
  return <DotLottieReact src={src} autoplay loop dotLottieRefCallback={setPlayer} />;
}
