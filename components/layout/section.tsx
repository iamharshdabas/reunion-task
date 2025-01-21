import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  minHeightScreen?: boolean;
};

export default function Section({
  children,
  className,
  minHeightScreen = true,
}: Props) {
  return (
    <section
      className={cn(
        "flex flex-col justify-center py-16 items-center gap-8",
        minHeightScreen && "min-h-screen",
        className,
      )}
    >
      {children}
    </section>
  );
}
