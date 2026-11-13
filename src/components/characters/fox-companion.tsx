"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useHydrated } from "@/hooks/use-hydrated";
import { Collapsible } from "radix-ui";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/animations/lottie-animation";
import { foxAssets } from "@/content/fox";

const foxSize = "aspect-[6/5] w-12 shrink-0 desktop:w-20";
type Reaction = "notice" | "follow" | "settle";

function FoxPoster() {
  const [failed, setFailed] = useState(false);
  // A missing optional illustration must not leave a broken-image icon.
  return failed ? null : <Image src={foxAssets.poster} width={192} height={160} alt=""
    draggable={false} onError={() => setFailed(true)}
    ref={image => { if (image?.complete && !image.naturalWidth) setFailed(true); }}
    className="h-full w-full" />;
}

export function FoxCompanion() {
  const hydrated = useHydrated();
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reaction, setReaction] = useState<{ clip: Reaction; key: number } | null>(null);
  function play(clip: Reaction) { setReaction(previous => ({ clip, key: (previous?.key ?? 0) + 1 })); }
  function toggle(value: boolean) {
    setOpen(value);
    if (value) play("notice"); else setReaction(null);
  }
  function close() { toggle(false); trigger.current?.focus(); }

  return <Collapsible.Root open={open} onOpenChange={toggle} data-fox-companion
    className="grid gap-4 text-base leading-relaxed"
    onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); close(); } }}>
    <div className="flex min-h-11 flex-wrap items-center gap-5 desktop:min-h-[4.167rem]">
      {reaction ? <LottieAnimation key={reaction.key} src={foxAssets[reaction.clip].src} className={foxSize} fallback={<FoxPoster />} />
        : <div className={foxSize} aria-hidden="true"><FoxPoster /></div>}
      {hydrated ? <Collapsible.Trigger asChild><Button ref={trigger} variant="link" className="underline">Meet the fox</Button></Collapsible.Trigger> : null}
    </div>
    <Collapsible.Content role="region" aria-labelledby={`${id}-title`}>
      <div data-fox-entrance className="grid gap-4 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:starting:[transform:translateY(var(--space-1))] motion-safe:starting:opacity-80">
      <h2 id={`${id}-title`} className="text-xl leading-tight">A quiet corner.</h2>
      <p>Curiosity can wait a moment. Look around, or take a breath with the fox.</p>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="max-w-full shrink [overflow-wrap:anywhere]" onClick={() => play("follow")}>Look around</Button>
        <Button variant="outline" className="max-w-full shrink [overflow-wrap:anywhere]" onClick={() => play("settle")}>Take a breath</Button>
      </div>
      <Button variant="link" className="justify-self-start underline" onClick={close}>Close fox corner</Button>
      </div>
    </Collapsible.Content>
  </Collapsible.Root>;
}
