import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Reveal à l'entrée dans le viewport — composant serveur, zéro JS embarqué : l'animation est un
 * keyframe CSS et le déclenchement vient de l'IntersectionObserver du script inline du layout.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={className}
      data-reveal=""
      style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
