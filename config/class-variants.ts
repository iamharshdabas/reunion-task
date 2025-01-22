import { cva } from "class-variance-authority";

export const title = cva("tracking-tight leading-relaxed font-normal", {
  variants: {
    size: {
      xs: "text-base tracking-wide text-muted-foreground",
      sm: "text-lg tracking-wide text-muted-foreground",
      md: "text-2xl lg:text-4xl",
      lg: "text-3xl lg:text-6xl",
      xl: "text-4xl lg:text-8xl",
    },
    bold: {
      true: "font-semibold text-foreground",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
