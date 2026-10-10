import type { ReactNode } from "react";
import { cssVars } from "@/lib/css";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** Délai d'apparition, pour les blocs `.hero-reveal` animés dès le premier paint. */
export const revealDelay = (ms: number) => cssVars({ "--d": `${ms}ms` });

/**
 * Reveal à l'entrée dans le viewport — composant serveur, zéro JS embarqué : l'animation est un
 * keyframe CSS et le déclenchement vient de l'IntersectionObserver du script inline du layout.
 * Ce script pose `data-in` avant l'hydratation sur les blocs déjà visibles : l'écart est voulu.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={className}
      data-reveal=""
      suppressHydrationWarning
      style={delay ? revealDelay(delay) : undefined}
    >
      {children}
    </div>
  );
}
