"use client";

import { useEffect, useState } from "react";

/** Tracks which section id is currently in view, for nav highlighting. */
export function useActiveSection(ids: string[], rootMargin = "-40% 0px -50% 0px") {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
