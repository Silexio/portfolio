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
  /** Mention du montant hors TVA, avec le placeholder `{amount}`. */
  net: string;
};

/**
 * Taux de TVA belge applicable aux prestations. Les montants du catalogue sont hors TVA — c'est
 * la base de calcul commerciale — mais le prix **affiché** doit être le total que le visiteur
 * paiera : le SPF Économie impose au prix montré à un consommateur d'inclure la TVA et toutes
 * les autres taxes, prestations de services comprises.
 */
export const VAT_RATE = 0.21;

export type PriceParts = {
  lead: string;
  /** Le montant visible : TVA comprise. */
  amount: string;
  tail: string;
  /** Le même montant hors TVA, pour un professionnel qui la récupère. */
  net: string;
};

/**
 * Découpe un prix en parties affichables. Le montant mis en avant est **TVA comprise**, et le
 * montant hors TVA l'accompagne : un consommateur doit lire ce qu'il paiera, un professionnel
 * ce qu'il déduira.
 */
export function priceParts(
  price: Price,
  lang: Locale,
  labels: PriceLabels,
): PriceParts {
  if (price.amount === 0)
    return { lead: "", amount: labels.free, tail: "", net: "" };
  const money = (value: number) =>
    new Intl.NumberFormat(intlLocale(lang), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  return {
    lead: price.from ? labels.from : "",
    amount: money(Math.round(price.amount * (1 + VAT_RATE))),
    tail: price.monthly ? labels.perMonth : "",
    net: labels.net.replace("{amount}", money(price.amount)),
  };
}
