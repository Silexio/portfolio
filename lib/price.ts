import type { Locale } from "@/lib/i18n/config";
import { intlLocale } from "@/lib/i18n/utils";

export type Price = {
  amount: number;
  from: boolean;
  monthly: boolean;
};

export type PriceLabels = {
  free: string;
  from: string;
  perMonth: string;
};

export type PriceParts = {
  lead: string;
  amount: string;
  tail: string;
};

/**
 * Découpe un prix en parties affichables, pour composer le montant à part de ses qualificatifs.
 * La mention HTVA n'y figure pas : elle est dite une fois sous l'échelle, pas répétée sur chaque prix.
 */
export function priceParts(
  price: Price,
  lang: Locale,
  labels: PriceLabels,
): PriceParts {
  if (price.amount === 0) return { lead: "", amount: labels.free, tail: "" };
  const amount = new Intl.NumberFormat(intlLocale(lang), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price.amount);
  return {
    lead: price.from ? labels.from : "",
    amount,
    tail: price.monthly ? labels.perMonth : "",
  };
}
