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
 * Taux de TVA belge applicable aux prestations. Le montant mis en avant est **hors TVA** : ces
 * tarifs s'adressent à des professionnels, qui la récupèrent, et c'est la convention de toute
 * offre B2B. L'obligation d'afficher un prix TVA comprise vise le prix montré **à un
 * consommateur** (SPF Économie, prix total à payer) : le total TTC accompagne donc chaque
 * montant, et la page dépannage — la seule qui s'adresse d'abord à des particuliers —
 * n'affiche aucun prix.
 */
export const VAT_RATE = 0.21;

export type PriceParts = {
  lead: string;
  /** Le montant visible : hors TVA. */
  amount: string;
  tail: string;
  /** Le même montant TVA comprise, pour un particulier qui ne la récupère pas. */
  net: string;
};

/**
 * Découpe un prix en parties affichables. Le montant mis en avant est **hors TVA**, et le total
 * TVA comprise l'accompagne : un professionnel lit ce qu'il déduira, un particulier ce qu'il
 * paiera réellement.
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
    amount: money(price.amount),
    tail: price.monthly ? labels.perMonth : "",
    net: labels.net.replace(
      "{amount}",
      money(Math.round(price.amount * (1 + VAT_RATE))),
    ),
  };
}
