"use client";

import { useCallback, useState } from "react";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * Envoi d'un formulaire protégé par Turnstile : état, jeton, et traduction des codes d'erreur du
 * serveur en clé de libellé.
 *
 * Les deux formulaires du site partageaient ce bloc mot pour mot. Un code d'erreur ajouté côté
 * serveur n'était alors relayé que par celui des deux qu'on pensait à modifier, et l'autre
 * affichait « une erreur est survenue » sans rien dire d'utile.
 */
export function useFormSubmit<Key extends string>({
  url,
  errorByCode,
  genericError,
}: {
  url: string;
  /** Défini au niveau module par l'appelant : une table recréée à chaque rendu rendrait `send` instable. */
  errorByCode: Record<string, Key>;
  genericError: Key;
}) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorKey, setErrorKey] = useState<Key | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const onToken = useCallback((value: string | null) => setToken(value), []);

  /* Un jeton Turnstile ne sert qu'une fois : après un échec le widget est remonté (`attempt`),
     sinon le second envoi repart avec un jeton consommé et échoue sans que le visiteur comprenne. */
  const fail = useCallback((key: Key) => {
    setErrorKey(key);
    setStatus("error");
    setToken(null);
    setAttempt((value) => value + 1);
  }, []);

  const send = useCallback(
    async (payload: Record<string, unknown>) => {
      setStatus("submitting");
      setErrorKey(null);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus("success");
          return;
        }
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        const code = body?.error;
        fail((code ? errorByCode[code] : undefined) ?? genericError);
      } catch {
        fail(genericError);
      }
    },
    [url, errorByCode, genericError, fail],
  );

  return { status, errorKey, token, attempt, onToken, send };
}
