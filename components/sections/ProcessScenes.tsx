"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMock, type ChatLine } from "@/components/sections/ChatMock";

type Caption = {
  step: string;
  h: string;
  p: string;
};

type ProcessScenesProps = {
  captions: Caption[];
  chatScenes: ChatLine[][];
  online: string;
  children: React.ReactNode;
};

export function ProcessScenes({
  captions,
  chatScenes,
  online,
  children,
}: ProcessScenesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = captions.length;

  /* Équivaut au useScroll de Motion avec offset ["start start", "end end"] : la progression vaut 0
     quand le haut du wrapper atteint le haut du viewport, 1 quand son bas atteint le bas. Écrit à
     la main pour que Motion ne soit plus dans le bundle. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setActive(Math.min(count - 1, Math.floor(progress * count * 0.999)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return (
    <div
      ref={ref}
      className="featured__scenes"
      style={{ "--scenes": captions.length } as React.CSSProperties}
    >
      <div className="featured__pin">
        <div className="featured__pin-visual">
          <ChatMock scenes={chatScenes} activeScene={active} online={online} />
        </div>
        <div className="featured__pin-captions" aria-live="polite">
          {captions.map((caption, i) => (
            <div
              key={caption.step}
              className="featured__pin-caption"
              data-active={i === active}
            >
              <div className="featured__scene-step">{caption.step}</div>
              <h3 className="featured__scene-h">{caption.h}</h3>
              <p className="featured__scene-p">{caption.p}</p>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
