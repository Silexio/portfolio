"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { reportClientError } from "@/lib/observability/client";
import { ERROR_PAGE, browserLocale } from "@/lib/i18n/error-page";
import { t } from "@/lib/i18n/utils";
import "./globals.css";

/** Last-resort boundary: it replaces the root layout, so it renders its own html/body. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang] = useState(browserLocale);

  useEffect(() => {
    reportClientError(error);
  }, [error]);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="fallback">
          <div className="fallback__card">
            <h1 className="subtitle fallback__title">
              {t(ERROR_PAGE.title, lang)}
            </h1>
            <p className="fallback__body">{t(ERROR_PAGE.body, lang)}</p>
            <div className="fallback__actions">
              <Btn onClick={reset}>{t(ERROR_PAGE.retry, lang)}</Btn>
              <Btn href={`/${lang}`} variant="link">
                {t(ERROR_PAGE.home, lang)}
              </Btn>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
