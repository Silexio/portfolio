"use client";

import { useEffect, useRef } from "react";

/**
 * Déplace le focus sur le message de fin quand un formulaire est remplacé par sa confirmation.
 *
 * Sans ça le bouton d'envoi est démonté, le focus retombe sur `body`, et une région `role="status"`
 * montée avec son texte déjà dedans n'est pas annoncée par tous les lecteurs d'écran : la personne
 * ne sait ni que l'envoi a réussi, ni où elle se trouve.
 */
export function useDoneFocus(done: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (done) ref.current?.focus();
  }, [done]);
  return ref;
}
