"use client";

import { useMemo } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

type ChapterMarkersProps = {
  chapters: { id: string; label: string }[];
  ariaLabel: string;
};

export function ChapterMarkers({ chapters, ariaLabel }: ChapterMarkersProps) {
  const ids = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
  const activeId = useActiveSection(ids, "-45% 0px -45% 0px");

  return (
    <nav className="chapter-markers" aria-label={ariaLabel}>
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className="chapter-marker"
          data-active={chapter.id === activeId}
          aria-current={chapter.id === activeId ? "true" : undefined}
        >
          <span className="chapter-marker__dot" aria-hidden="true" />
          <span className="chapter-marker__label">{chapter.label}</span>
        </a>
      ))}
    </nav>
  );
}
