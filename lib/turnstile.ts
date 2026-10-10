/**
 * Clé **publique** du widget anti-robot, point unique des deux formulaires.
 *
 * Elle est figée dans le bundle au moment du build, pas lue à l'exécution : un build sans elle
 * part en production avec `siteKey:""`, le widget ne se monte jamais, le bouton d'envoi reste
 * désactivé et **aucune demande ne part** — sans la moindre erreur, ni côté visiteur ni dans les
 * journaux. C'est arrivé deux fois : au déploiement du 2026-09-23, puis à chaque build lancé par
 * Cloudflare depuis le dépôt, qui n'a évidemment pas le `.env` local.
 *
 * D'où le repli écrit ici. Une *sitekey* Turnstile est publique par construction — elle est lisible
 * dans le HTML de chaque page — contrairement à `TURNSTILE_SECRET_KEY`, qui reste un secret Worker
 * et sans lequel la vérification serveur échoue, fermée. La variable d'environnement garde la
 * priorité pour permettre une rotation ou une clé de test sans toucher au dépôt.
 */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAENLR8OG9ZC9ogwF";
