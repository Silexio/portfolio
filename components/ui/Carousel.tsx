"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type CarouselProps = {
  label: string;
  roleDescription: string;
  prevLabel: string;
  nextLabel: string;
  dots: { id: string; label: string }[];
  children: React.ReactNode;
};

/**
 * Carrousel accessible (motif APG « basic carousel », sans rotation automatique). Le défilement
 * reste du scroll-snap natif — swipe, molette et clavier fonctionnent sans JS ; flèches et points
 * ne font que piloter ce même scroll. Les diapositives sont rendues côté serveur et passées en
 * children : elles portent elles-mêmes role="group" et aria-roledescription.
 */
export function Carousel({
  label,
  roleDescription,
  prevLabel,
  nextLabel,
  dots,
  children,
}: CarouselProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const slides = [...node.children];
    const observer = new IntersectionObserver(
      (entries) => {
        const closest = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (closest) setActive(slides.indexOf(closest.target));
      },
      { root: node, threshold: [0.6, 0.8, 1] },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const slide = viewport.current?.children[index];
    if (!(slide instanceof HTMLElement)) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    slide.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription={roleDescription}
      aria-label={label}
    >
      <div className="carousel__viewport" ref={viewport}>
        {children}
      </div>
      {dots.length > 1 && (
        <div className="carousel__controls">
          <button
            type="button"
            className="icon-btn"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label={prevLabel}
          >
            <Icon name="prev" />
          </button>
          <ol className="carousel__dots">
            {dots.map((dot, i) => (
              <li key={dot.id}>
                <button
                  type="button"
                  className="carousel__dot"
                  onClick={() => goTo(i)}
                  aria-label={dot.label}
                  aria-current={i === active}
                />
              </li>
            ))}
          </ol>
          <span className="carousel__count" aria-hidden="true">
            {active + 1} / {dots.length}
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => goTo(active + 1)}
            disabled={active === dots.length - 1}
            aria-label={nextLabel}
          >
            <Icon name="next" />
          </button>
        </div>
      )}
    </div>
  );
}
