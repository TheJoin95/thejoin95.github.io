import { MediaCaption, MediaSurface } from "@/components/media/presentation";
import { siteStyles } from "@/components/site/styles";

export function PaletteStage({ href = "#chromatique" }: { href?: string }) {
  return <section aria-label="Chromatique static palette comparison">
    <figure className="mx-auto max-w-[100rem]">
      <MediaSurface className="relative aspect-[4/3] overflow-hidden bg-(--experiment-ink) md:aspect-video desktop:aspect-[3/1] desktop:min-h-[360px] desktop:max-h-[560px]">
        {/* Native, pre-sized output is available before scripts or gallery enhancement. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/chromatique/irises-original.jpg" width={1024} height={846}
          alt="Original hand-coloured garden photograph by Frances Benjamin Johnston."
          loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/chromatique/irises-nord.png" width={1024} height={846}
            alt="The same photograph converted by Chromatique into the Nord palette."
            loading="eager" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-x-0 top-4 flex justify-between px-4 text-base text-(--reverse) md:top-6 md:px-8">
          <span className="bg-(--charcoal) px-3 py-1">Original</span>
          <span className="bg-(--charcoal) px-3 py-1">Nord palette</span>
        </div>
      </MediaSurface>
      <MediaCaption className="surface-charcoal m-0! px-5 py-4 text-base md:px-8 desktop:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <a href={href} className={siteStyles.link}>Chromatique — explore the palette study</a>
          <span>Static comparison · original / actual CLI output</span>
        </div>
        <p className="mt-2 text-muted-foreground">Photograph: Frances Benjamin Johnston / <a href="https://www.loc.gov/pictures/item/2007686318/">Library of Congress</a>. Nord palette: Sven Greb.</p>
      </MediaCaption>
    </figure>
  </section>;
}
