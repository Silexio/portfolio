import { BookingModal } from "@/components/sections/BookingModal";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import { I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { resolveDict, t } from "@/lib/i18n/utils";

export function Booking({ lang }: { lang: Locale }) {
  const labels = {
    ...resolveDict(I18N.form, lang),
    ...resolveDict(I18N.booking, lang),
  };
  const siteKey = TURNSTILE_SITE_KEY;

  return (
    <BookingModal
      lang={lang}
      siteKey={siteKey}
      labels={labels}
      closeLabel={t(I18N.a11y.close, lang)}
    />
  );
}
