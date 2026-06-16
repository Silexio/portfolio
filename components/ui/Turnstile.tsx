"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

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
    };
  }
}

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string | null) => void;
  label: string;
};

/** Cloudflare Turnstile widget — loads api.js via next/script and renders once it's ready. */
export function Turnstile({ siteKey, onToken, label }: TurnstileProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const render = useCallback(() => {
    if (!hostRef.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(hostRef.current, {
      sitekey: siteKey,
      callback: (value) => onTokenRef.current(value),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    });
  }, [siteKey]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" onReady={render} />
      <div ref={hostRef} className="booking-form__captcha" aria-label={label} />
    </>
  );
}
