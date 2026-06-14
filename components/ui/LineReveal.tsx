"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

type LineRevealProps = {
  lines: React.ReactNode | React.ReactNode[];
  baseDelay?: number;
  stagger?: number;
};

export function LineReveal({ lines, baseDelay = 0, stagger = 110 }: LineRevealProps) {
  const reduced = useReducedMotion();
  const items = Array.isArray(lines) ? lines : [lines];
  return (
    <>
      {items.map((line, i) => (
        <motion.span
          key={i}
          className="line-reveal"
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span
            variants={{ hidden: { y: "112%" }, visible: { y: 0 } }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: (baseDelay + i * stagger) / 1000 }
            }
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}
