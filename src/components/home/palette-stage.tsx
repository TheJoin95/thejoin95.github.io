import { MediaCaption } from "@/components/media/presentation";
import { siteStyles } from "@/components/site/styles";
import { PaletteReveal } from "@/components/palette/palette-reveal";

export function PaletteStage({ href = "#chromatique" }: { href?: string }) {
  return <section aria-label="Chromatique palette comparison">
    <figure className="mx-auto max-w-[100rem]">
      <PaletteReveal />
      <MediaCaption className="surface-charcoal m-0! px-5 py-4 text-base md:px-8 desktop:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <a href={href} className={siteStyles.link}>Chromatique — explore the palette study</a>
          <span>Original / actual CLI output · Nord palette · no dithering</span>
        </div>
        <p className="mt-2 text-muted-foreground">Photograph: Frances Benjamin Johnston / <a href="https://www.loc.gov/pictures/item/2007686318/">Library of Congress</a>. Nord palette: Sven Greb.</p>
      </MediaCaption>
    </figure>
  </section>;
}
