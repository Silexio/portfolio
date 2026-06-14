"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
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

export function ProcessScenes({ captions, chatScenes, online, children }: ProcessScenesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(captions.length - 1, Math.floor(progress * captions.length * 0.999)));
  });

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
            <div key={caption.step} className="featured__pin-caption" data-active={i === active}>
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
