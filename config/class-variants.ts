import { cva } from "class-variance-authority";

export const title = cva("tracking-tight font-bold", {
  variants: {
    size: {
      sm: "text-2xl lg:text-4xl",
      md: "text-3xl lg:text-6xl",
      lg: "text-4xl lg:text-8xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const subtitle = cva("text-lg lg:text-xl text-muted-foreground");
