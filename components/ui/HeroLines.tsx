import type { CSSProperties, ReactNode } from "react";

type HeroLinesProps = {
  lines: ReactNode | ReactNode[];
  baseDelay?: number;
  stagger?: number;
};

export function HeroLines({ lines, baseDelay = 0, stagger = 110 }: HeroLinesProps) {
  const items = Array.isArray(lines) ? lines : [lines];
  return (
    <>
      {items.map((line, i) => (
        <span key={i} className="line-reveal">
          <span style={{ "--d": `${baseDelay + i * stagger}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </>
  );
}
