"use client";

import { useHydrated } from "@/hooks/use-hydrated";
import { useCallback, useId, useState, type PointerEvent } from "react";
import { MediaSurface } from "@/components/media/presentation";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { paletteImages, revealAt } from "./reveal";

const controlStyle = "max-w-full shrink [overflow-wrap:anywhere]";

export function PaletteReveal() {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const id = useId();
  const [selected, setSelected] = useState(50);
  const [preview, setPreview] = useState<number | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const value = reducedMotion ? selected : preview ?? selected;
  const checkImage = useCallback((image: HTMLImageElement | null) => {
    // A failed eager image can finish before hydration attaches onError.
    if (image?.complete && image.naturalWidth === 0) setImageFailed(true);
  }, []);

  function commit(value: number) { setSelected(value); setPreview(null); }
  function pointer(event: PointerEvent<HTMLDivElement>) {
    // Touch keeps native vertical scrolling; only the labelled range manipulates it.
    if (event.pointerType !== "mouse") return;
    if (event.buttons !== 1 && (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = revealAt(event.clientX, rect.left, rect.width);
    if (event.buttons === 1) commit(next); else setPreview(next);
  }

  return <>
    <MediaSurface data-palette-surface
      className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-(--experiment-ink) md:aspect-video desktop:aspect-[3/1] desktop:min-h-[360px] desktop:max-h-[560px]"
      onPointerMove={pointer} onPointerDown={event => {
        if (event.pointerType === "mouse" && event.button === 0) { event.currentTarget.setPointerCapture(event.pointerId); pointer(event); }
      }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerLeave={() => setPreview(null)} onPointerCancel={() => setPreview(null)}>
      {/* The same accessible HTML images serve the initial and interactive comparison. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={checkImage} draggable={false} src={paletteImages.original} width={paletteImages.width} height={paletteImages.height}
        alt="Original hand-coloured garden photograph by Frances Benjamin Johnston."
        loading="eager" fetchPriority="high" onError={() => setImageFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" data-palette-output style={{ clipPath: `inset(0 0 0 ${100 - value}%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={checkImage} draggable={false} src={paletteImages.palette} width={paletteImages.width} height={paletteImages.height}
          alt="The same photograph converted by Chromatique into the Nord palette."
          loading="eager" onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
      </div>
      {imageFailed ? <p className="absolute inset-x-4 bottom-4 bg-(--charcoal) p-3 text-(--reverse)">The comparison image could not load. Explore the palette study below for the project and full-size output.</p> : null}
      <div className="pointer-events-none absolute inset-x-0 top-6 hidden justify-between gap-3 px-8 text-base text-(--reverse) md:flex">
        <span className="bg-(--charcoal) px-3 py-1">Original</span>
        <span className="bg-(--charcoal) px-3 py-1">Nord palette</span>
      </div>
    </MediaSurface>
    <div className="surface-charcoal flex flex-wrap justify-between gap-3 px-5 pt-4 text-base md:hidden"><span>Original</span><span>Nord palette</span></div>
    {hydrated && !imageFailed ? <div className="surface-charcoal grid gap-3 px-5 pt-5 md:px-8 desktop:px-12">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <label htmlFor={id} className="text-base">Palette reveal</label>
        <span className="text-base tabular-nums" aria-hidden="true">{selected}% palette</span>
      </div>
      <input id={id} type="range" min={0} max={100} step={1} value={selected}
        aria-valuetext={`${selected}% palette`} aria-describedby={`${id}-help`}
        onChange={event => commit(Number(event.currentTarget.value))}
        className="h-11 w-full cursor-ew-resize accent-(--experiment-accent)" />
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className={controlStyle} onClick={() => commit(0)}>Original</Button>
        <Button variant="outline" className={controlStyle} onClick={() => commit(100)}>Palette</Button>
        <Button variant="outline" className={controlStyle} onClick={() => commit(50)}>Reset comparison</Button>
      </div>
      <p id={`${id}-help`} className="text-base text-muted-foreground">Drag the slider or use arrow keys to compare. Original at 0%, Nord at 100%.</p>
    </div> : null}
  </>;
}
