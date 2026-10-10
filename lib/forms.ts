import { NextResponse } from "next/server";

/**
 * Frontière HTTP commune aux deux formulaires publics (demande et rendez-vous). Les deux routes
 * portaient ces deux fonctions à l'identique : renommer le champ leurre revenait à le changer dans
 * quatre fichiers, et en oublier un désactivait l'anti-spam d'un formulaire sans aucune erreur.
 */

/** Réponse d'erreur : un code court que le formulaire traduit, jamais un message serveur. */
export const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/** Réponse de succès, la même qu'un leurre rempli : un robot ne doit rien apprendre. */
export const jsonAccepted = () =>
  NextResponse.json({ ok: true }, { status: 201 });

/** Champ leurre `company` (composant `Honeypot`) : invisible, donc rempli par un robot seul. */
export function isHoneypotFilled(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const company = (raw as { company?: unknown }).company;
  return typeof company === "string" && company.length > 0;
}
