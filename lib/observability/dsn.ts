export type EnvelopeTarget = {
  url: string;
  /** Clé publique du DSN. Sans elle le serveur refuse l'enveloppe, et aucune erreur ne remonte. */
  publicKey: string;
};

/**
 * Résout le point d'entrée Bugsink depuis un DSN Sentry (`https://<clé>@hôte/<projet>`).
 *
 * Renvoie `null` quand le DSN manque, est mal formé, ou **ne porte pas de clé publique** : un
 * envoi sans clé est refusé côté serveur (HTTP 403) alors que le navigateur, lui, ne voit rien.
 * Mieux vaut un relais explicitement inactif qu'un relais qui jette tout en silence.
 */
export function envelopeTarget(dsn: string | undefined): EnvelopeTarget | null {
  if (!dsn) return null;
  let parsed: URL;
  try {
    parsed = new URL(dsn);
  } catch {
    return null;
  }
  const projectId = parsed.pathname.split("/").filter(Boolean).pop();
  if (!projectId || !parsed.username) return null;
  return {
    url: `${parsed.protocol}//${parsed.host}/api/${projectId}/envelope/`,
    publicKey: parsed.username,
  };
}
