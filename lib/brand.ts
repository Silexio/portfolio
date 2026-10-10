/**
 * Couleurs de marque hors CSS : barre du navigateur, manifeste PWA et emails, les seuls endroits
 * où un jeton de `globals.css` ne peut pas servir. Toute évolution de la charte passe ici aussi.
 */
export const BRAND = {
  bg: "#efebe7",
  bgDark: "#181512",
  surface: "#e5e0da",
  raised: "#faf8f6",
  border: "#d5cec7",
  heading: "#1b1816",
  text: "#342f2b",
  muted: "#605952",
  accent: "#1b1816",
  onAccent: "#efebe7",
  spark: "#ffb020",
} as const;
