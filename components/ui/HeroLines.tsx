import type { ReactNode } from "react";
import { revealDelay } from "@/components/ui/Reveal";

type HeroLinesProps = {
  lines: ReactNode | ReactNode[];
  baseDelay?: number;
  stagger?: number;
};

export function HeroLines({
  lines,
  baseDelay = 0,
  stagger = 110,
}: HeroLinesProps) {
  const items = Array.isArray(lines) ? lines : [lines];
  return (
    <>
      {items.map((line, i) => (
        <span key={i} className="line-reveal">
          <span style={revealDelay(baseDelay + i * stagger)}>{line}</span>
          {i < items.length - 1 && " "}
        </span>
      ))}
    </>
  );
}
