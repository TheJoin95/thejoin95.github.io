"use client";

import { DotLottieReact, setWasmUrl, type DotLottie } from "@lottiefiles/dotlottie-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

setWasmUrl("/animations/runtime/dotlottie-player.wasm");

export default function LottiePlayer({ src, fallback, onComplete }: { src: string; fallback?: ReactNode; onComplete?: () => void }) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);
  const handleLoad = useCallback(() => setLoaded(true), []);
  useEffect(() => {
    player?.addEventListener("loadError", handleError);
    player?.addEventListener("renderError", handleError);
    player?.addEventListener("load", handleLoad);
    if (onComplete) player?.addEventListener("complete", onComplete);
    return () => { player?.removeEventListener("loadError", handleError); player?.removeEventListener("renderError", handleError); player?.removeEventListener("load", handleLoad); if (onComplete) player?.removeEventListener("complete", onComplete); };
  }, [player, handleError, handleLoad, onComplete]);
  useEffect(() => {
    let resume = false;
    const visibility = () => {
      if (document.hidden) { resume = player?.isPlaying ?? false; player?.pause(); }
      else if (resume) { player?.play(); resume = false; }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [player]);
  if (failed) return fallback;
  const ready = loaded || player?.isLoaded;
  return <div className="relative h-full w-full">
    {!ready ? <div className="absolute inset-0">{fallback}</div> : null}
    <DotLottieReact className={`h-full w-full ${ready ? "" : "opacity-0"}`} src={src} autoplay loop={false} dotLottieRefCallback={setPlayer} />
  </div>;
}
