import { cn } from "@/lib/utils";

// Shared Tailwind compositions used by semantic elements on several pages.
const container = cn(
  "mx-auto w-full max-w-[100rem] [overflow-wrap:anywhere] [&>*]:min-w-0",
  "ps-[max(var(--gutter),env(safe-area-inset-left))]",
  "pe-[max(var(--gutter),env(safe-area-inset-right))]",
);

export const siteStyles = {
  container,
  sectionSpace: "py-(--section-space)",
  editorialRow: cn(
    container,
    "grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)]",
  ),
  sectionTitle: cn(
    "text-[clamp(1.75rem,3.4vw,3.5rem)] leading-[1.1] tracking-[-0.035em]",
    "text-balance [overflow-wrap:anywhere]",
  ),
  copy: "max-w-[68ch] [overflow-wrap:anywhere] [&>*+*]:mt-6",
  actions: cn(
    "flex flex-wrap items-center gap-6",
    "[&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center",
  ),
  link: "inline-flex min-h-11 items-center gap-[0.35rem]",
};
