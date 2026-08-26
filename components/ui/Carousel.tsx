"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CarouselProps = {
  label: string;
  prevLabel: string;
  nextLabel: string;
  dots: { id: string; label: string }[];
  children: React.ReactNode;
};

/**
 * Carrousel horizontal accessible (motif APG « basic carousel », sans rotation automatique).
 * Le défilement reste du scroll-snap natif — swipe, molette et clavier fonctionnent sans JS ;
 * les contrôles ne font que piloter ce même scroll. Les slides sont rendues côté serveur et
 * passées en children : elles doivent porter elles-mêmes role="group" + aria-roledescription.
 */
export function Carousel({
  label,
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
      { root: node, threshold: [0.5, 0.75, 1] },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const node = viewport.current;
    const slide = node?.children[index];
    if (!node || !(slide instanceof HTMLElement)) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({
      left: slide.offsetLeft - node.offsetLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  const single = dots.length < 2;

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="carousel__viewport" ref={viewport}>
        {children}
      </div>
      {!single && (
        <div className="carousel__controls">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label={prevLabel}
          >
            <Arrow direction="left" />
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
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => goTo(active + 1)}
            disabled={active === dots.length - 1}
            aria-label={nextLabel}
          >
            <Arrow direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      data-direction={direction}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
