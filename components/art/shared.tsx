/* Primitives partagées par les planches : la lumière de taille et l'éclat qui les traverse.
   Elles vivent ici parce que plusieurs planches les réutilisent, pas par goût de l'abstraction. */

/**
 * Lumière de la planche : haut éclairé, bas dans l'ombre, comme les arêtes de l'interface.
 * Déclarée dans chaque <svg> — un serveur de peinture ne se référence pas d'un SVG à l'autre.
 */
export function ArtLight({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`art-lit-${id}`} x1="0" y1="0" x2="0.25" y2="1">
        <stop
          offset="0"
          style={{
            stopColor:
              "color-mix(in srgb, var(--raised) 86%, var(--arris-light))",
          }}
        />
        <stop
          offset="1"
          style={{
            stopColor:
              "color-mix(in srgb, var(--raised) 84%, var(--arris-dark))",
          }}
        />
      </linearGradient>
    </defs>
  );
}

/** L'éclat qui traverse une planche. Écrit une fois, posé par translation. */
export const FLAKE = "0,0 54,-18 92,8 54,36 0,18 14,9";
