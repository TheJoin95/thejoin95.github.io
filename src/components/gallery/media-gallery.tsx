"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { boundedIndex, indexAtScroll, type GalleryMedia } from "@/lib/gallery";
import { GalleryCaption, MediaSurface } from "@/components/media/presentation";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
function useHydrated() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}

function GalleryItem({ item, eager }: { item: GalleryMedia; eager: boolean }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">(item.src ? "loading" : "failed");
  const failed = state === "failed";
  const hydrated = useHydrated();

  return <figure className="min-w-0">
    <MediaSurface className="relative aspect-[4/3] bg-(--experiment-ink) text-(--reverse) md:aspect-[5/3]" aria-busy={hydrated && state === "loading" && item.kind === "image"}>
      {item.kind === "image" && item.src && !failed ? (
        <Image src={item.src} alt={item.alt} width={item.width} height={item.height}
          sizes="(min-width: 1600px) 590px, (min-width: 1200px) 38vw, (min-width: 768px) 70vw, 85vw"
          loading={eager ? "eager" : "lazy"}
          className={cn("h-full min-h-0 w-full", item.fit === "cover" ? "object-cover" : "object-contain")}
          style={{ objectPosition: item.focalPoint }}
          onLoad={() => setState("ready")} onError={() => setState("failed")} />
      ) : null}
      {item.kind === "video" && item.src && !failed ? (
        <video src={item.src} controls playsInline preload="none" poster={item.poster} width={item.width} height={item.height}
          className="h-full min-h-0 w-full object-contain" aria-label={item.caption}
          onLoadedData={() => setState("ready")} onError={() => setState("failed")}>
          {item.captions?.map((track) => <track key={track.src} kind="captions" src={track.src} srcLang={track.language} label={track.label} />)}
          Your browser cannot play this video. Read the transcript below.
        </video>
      ) : null}
      {hydrated && state === "loading" && item.kind === "image" ? <span className="pointer-events-none absolute bottom-3 left-3 bg-(--charcoal) px-3 py-1 text-base">Loading image…</span> : null}
      {failed ? <p className="p-6 text-center">{item.kind === "image" ? "Image" : "Video"} unavailable.{item.kind === "image" && item.alt ? <span className="block text-base">{item.alt}</span> : null}</p> : null}
    </MediaSurface>
    <GalleryCaption item={item} failed={failed} />
  </figure>;
}

export function MediaGallery({ label, items }: { label: string; items: readonly GalleryMedia[] }) {
  const id = useId();
  const track = useRef<HTMLOListElement>(null);
  const requested = useRef<number | null>(null);
  const announcementTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const enhanced = useHydrated();
  const selected = boundedIndex(active, items.length);

  useEffect(() => () => {
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
  }, []);

  function announceWhenSettled(index: number) {
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    announcementTimer.current = setTimeout(() => {
      setAnnouncement(`${index + 1} of ${items.length}: ${items[index].caption}`);
    }, 150);
  }

  function pauseVideos() {
    track.current?.querySelectorAll("video").forEach((video) => video.pause());
  }

  function navigate(index: number) {
    const list = track.current;
    if (!list) return;
    const next = boundedIndex(index, items.length);
    const slide = list.children[next] as HTMLElement;
    requested.current = next;
    setActive(next);
    announceWhenSettled(next);
    pauseVideos();
    list.scrollTo({ left: slide.offsetLeft - list.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function manualScroll() {
    requested.current = null;
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
  }

  function syncScroll() {
    const list = track.current;
    if (!list) return;
    if (requested.current !== null) { announceWhenSettled(requested.current); return; }
    setActive(indexAtScroll(list.scrollLeft, list.scrollWidth - list.clientWidth, items.length));
    // Native video controls stay available; a fully offscreen video stops playing.
    const bounds = list.getBoundingClientRect();
    list.querySelectorAll("video").forEach((video) => {
      const rect = video.getBoundingClientRect();
      if (rect.right <= bounds.left || rect.left >= bounds.right) video.pause();
    });
  }

  if (items.length === 0) return null;

  return <div role="region" aria-label={label} className="min-w-0">
    <p id={`${id}-help`} className="sr-only">Browse media by scrolling horizontally, or use the previous and next buttons. Full-size image links and video controls are available inside each item.</p>
    <ol ref={track} id={`${id}-media`} aria-describedby={`${id}-help`} tabIndex={0}
      className="relative flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-2 md:gap-4"
      onPointerDown={manualScroll} onTouchStart={manualScroll} onWheel={manualScroll} onKeyDown={manualScroll}
      onScroll={syncScroll} onFocusCapture={(event) => {
        const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-media-index]");
        if (slide) { requested.current = Number(slide.dataset.mediaIndex); setActive(requested.current); }
      }}>
      {items.map((item, index) => <li key={item.id} data-media-index={index}
        className={cn("min-w-0 shrink-0 snap-start", items.length === 1 ? "basis-full" : "basis-[88%] md:basis-[76%] desktop:basis-[48%]")}>
        <GalleryItem item={item} eager={index === 0} />
      </li>)}
    </ol>
    {items.length > 1 && enhanced ? <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <p className="text-base tabular-nums" aria-hidden="true">{selected + 1} of {items.length}</p>
      <div className="flex gap-2">
        <Button variant="ghost" aria-label={`Previous media in ${label}`} aria-controls={`${id}-media`} disabled={selected === 0} onClick={() => navigate(selected - 1)}><ArrowLeft aria-hidden="true" />Previous</Button>
        <Button variant="ghost" aria-label={`Next media in ${label}`} aria-controls={`${id}-media`} disabled={selected === items.length - 1} onClick={() => navigate(selected + 1)}>Next<ArrowRight aria-hidden="true" /></Button>
      </div>
    </div> : null}
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
  </div>;
}
