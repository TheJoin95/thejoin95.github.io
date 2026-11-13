import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex h-auto min-h-11 min-w-11 shrink-0 items-center justify-center rounded-(--radius) border border-transparent bg-clip-padding px-4 py-[0.65rem] text-[1rem] leading-[calc(1.25/0.875)] font-normal whitespace-normal transition-[background-color,color] duration-150 ease-[ease] outline-none select-none focus-visible:border-ring focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-(--ring) focus-visible:outline-offset-3 focus-visible:[box-shadow:none]! motion-safe:active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-65 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-[0.22em] hover:underline",
      },
      size: {
        default: "gap-1.5",
        xs: "gap-1 data-[size=xs]:leading-[calc(1/0.75)] [&_svg:not([class*='size-'])]:size-3",
        sm: "gap-1 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "gap-1.5",
        icon: "w-8",
        "icon-xs": "w-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "w-7",
        "icon-lg": "w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
