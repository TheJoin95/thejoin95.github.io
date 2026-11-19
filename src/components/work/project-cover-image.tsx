"use client";

import type { ComponentProps } from "react";
import { PreviewImage } from "@/components/media/preview-image";

export function ProjectCoverImage(props: ComponentProps<typeof PreviewImage>) {
  return <PreviewImage
    {...props}
    loading="lazy"
    ref={image => {
      // The request may have already failed before hydration.
      if (image?.complete && image.naturalWidth === 0) image.hidden = true;
    }}
    onError={event => { event.currentTarget.hidden = true; }}
  />;
}
