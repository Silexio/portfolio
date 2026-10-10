import type { CSSProperties } from "react";

/**
 * Propriétés personnalisées en style en ligne (`--i`, `--count`, `--ox`…).
 *
 * Deux raisons d'un point unique. React ne déclare pas les variables CSS dans `CSSProperties`,
 * donc chaque appel portait sa propre assertion — elles sont remplacées par celle-ci, tenue au
 * même endroit que la règle. Et React sérialise une valeur numérique différemment au rendu
 * serveur et à l'hydratation, ce qui fait diverger l'attribut `style` : tout est donc converti en
 * chaîne ici, une fois pour toutes.
 */
export function cssVars(vars: Record<string, string | number>): CSSProperties {
  const style: Record<string, string> = {};
  for (const [name, value] of Object.entries(vars))
    style[name] = typeof value === "number" ? String(value) : value;
  return style as CSSProperties;
}
