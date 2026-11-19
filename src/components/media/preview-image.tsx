import type { ComponentProps } from "react";

export function PreviewImage({ alt, ...props }: ComponentProps<"img"> & { alt: string }) {
  // These files are resized at build time, so native srcset selects a static asset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img decoding="async" alt={alt} {...props} />;
}
