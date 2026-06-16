import { BookingModal } from "@/components/sections/BookingModal";
import { I18N, PACKAGES, type PackageId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { resolveDict, t } from "@/lib/i18n/utils";

export function Booking({ lang }: { lang: Locale }) {
  const labels = resolveDict(I18N.booking, lang);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const packageLabels = Object.fromEntries(
    PACKAGES.map((pkg) => [pkg.id, t(pkg.title, lang)]),
  ) as Record<PackageId, string>;

  return (
    <BookingModal
      lang={lang}
      siteKey={siteKey}
      labels={labels}
      packageLabels={packageLabels}
      closeLabel={t(I18N.a11y.close, lang)}
    />
  );
}
