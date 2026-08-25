"use client";

import { useEffect, useRef } from "react";

const API_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type RenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: RenderOptions) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string | null) => void;
  label: string;
};

let apiScript: Promise<void> | null = null;

/**
 * Loads the Turnstile API once per page, whoever asks first.
 * next/script is deliberately avoided here: the widget mounts inside the booking modal, long after
 * the load event, and its lazyOnload/afterInteractive strategies never injected the tag in that
 * situation — leaving the submit button disabled forever with no error anywhere.
 */
function loadApi(): Promise<void> {
  if (apiScript) return apiScript;
  apiScript = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const script = document.createElement("script");
    script.src = API_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      apiScript = null;
      reject(new Error("Turnstile API failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiScript;
}

/** Cloudflare Turnstile widget. Renders as soon as the API is available, once per mount. */
export function Turnstile({ siteKey, onToken, label }: TurnstileProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;

    loadApi()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(hostRef.current, {
          sitekey: siteKey,
          callback: (value) => onTokenRef.current(value),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey]);

  return (
    <div ref={hostRef} className="booking-form__captcha" aria-label={label} />
  );
}
