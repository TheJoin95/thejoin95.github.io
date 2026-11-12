import { createRoot } from "react-dom/client";
import Image from "next/image";
import { useState } from "react";
import { setWasmUrl } from "@lottiefiles/dotlottie-react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { LottieAnimation } from "../../src/components/animations/lottie-animation";
import { foxAssets } from "../../src/content/fox";

setWasmUrl("/animations/runtime/dotlottie-player.wasm");
type Clip = "notice" | "follow" | "settle";
declare global { interface Window { foxProof: DotLottie; foxError?: string; } }

// Native player proof exposes deterministic frames independently of the UI wrapper.
const canvas = document.getElementById("fox-proof") as HTMLCanvasElement;
window.foxProof = new DotLottie({ canvas, src: foxAssets.notice.src, autoplay: false, loop: false, renderConfig: { devicePixelRatio: 2, freezeOnOffscreen: false } });
window.foxProof.addEventListener("loadError", () => { window.foxError = "loadError"; });

function Specimen() {
  const [clip, setClip] = useState<Clip | null>(null);
  const [run, setRun] = useState(0);
  return <div><h1>Fox compatibility specimen</h1><p>Asset review only. Page placement is MIC-23.</p>
    <div className="my-8 flex flex-wrap gap-6">{(["notice", "follow", "settle"] as const).map(name => <button className="min-h-11 border p-3" key={name} onClick={() => { setClip(name); setRun(value => value + 1); }}>Play {name}</button>)}</div>
    <div id="fox-wrapper" className="h-20 w-24">{clip ? <LottieAnimation key={run} src={foxAssets[clip].src} className="h-full w-full" fallback={<Image src={foxAssets.poster} width={192} height={160} alt="" unoptimized />} /> : <Image src={foxAssets.poster} width={192} height={160} alt="" unoptimized />}</div>
    <div style={{ height: 1600 }} aria-hidden="true" />
    <a href="#fox-wrapper">Back to the fox specimen</a>
  </div>;
}
createRoot(document.getElementById("fox-ui")!).render(<Specimen />);
