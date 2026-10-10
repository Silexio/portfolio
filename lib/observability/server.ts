import * as Sentry from "@sentry/nextjs";

/**
 * Remontée d'une panne serveur dont le code se relève tout seul.
 *
 * Un `catch` qui renvoie une valeur de repli rend le site résistant **et** la panne invisible :
 * l'agenda injoignable laisse tous les créneaux ouverts, une notification perdue laisse une
 * demande sans destinataire, et personne n'apprend jamais que ça dure depuis trois semaines. Tout
 * repli silencieux passe donc par ici : Workers Logs pour regarder tout de suite, Bugsink pour
 * être prévenu sans regarder.
 */
export function reportServerError(error: unknown, context: string): void {
  console.error(`[${context}]`, error);
  Sentry.captureException(error, { tags: { context } });
}
