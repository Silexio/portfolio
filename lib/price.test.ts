import { describe, expect, it } from "vitest";
import { priceParts, VAT_RATE, type PriceLabels } from "@/lib/price";

const fr: PriceLabels = {
  free: "Gratuit",
  from: "dès",
  perMonth: "/mois",
  net: "soit {amount} TVA comprise",
};
const en: PriceLabels = {
  free: "Free",
  from: "from",
  perMonth: "/month",
  net: "i.e. {amount} incl. VAT",
};
const nbsp = /[\u00a0\u202f]/g;
const plain = (value: string) => value.replace(nbsp, " ");

/**
 * Le montant mis en avant est hors TVA : les tarifs s'adressent à des professionnels, qui la
 * récupèrent. Le total TVA comprise reste dit à côté, pour le particulier qui, lui, le paiera —
 * et la page dépannage, la seule qui vise d'abord des particuliers, n'affiche aucun prix.
 */
describe("priceParts", () => {
  it("affiche une offre gratuite comme un mot, sans qualificatif ni mention de TVA", () => {
    expect(
      priceParts({ amount: 0, from: false, monthly: false }, "fr", fr),
    ).toEqual({ lead: "", amount: "Gratuit", tail: "", net: "" });
  });

  it("met en avant le prix hors TVA et dit le TVA comprise à côté", () => {
    const parts = priceParts(
      { amount: 600, from: true, monthly: false },
      "fr",
      fr,
    );
    expect(parts.lead).toBe("dès");
    expect(plain(parts.amount)).toBe("600 €");
    expect(plain(parts.net)).toBe("soit 726 € TVA comprise");
  });

  it("applique le taux belge et groupe les milliers", () => {
    const parts = priceParts(
      { amount: 5000, from: true, monthly: false },
      "fr",
      fr,
    );
    expect(VAT_RATE).toBe(0.21);
    expect(plain(parts.amount)).toBe("5 000 €");
    expect(plain(parts.net)).toBe("soit 6 050 € TVA comprise");
  });

  it("ajoute l'unité mensuelle après le montant", () => {
    const parts = priceParts(
      { amount: 99, from: true, monthly: true },
      "fr",
      fr,
    );
    expect(parts.tail).toBe("/mois");
    expect(plain(parts.amount)).toBe("99 €");
  });

  it("utilise la mise en forme monétaire anglaise", () => {
    const parts = priceParts(
      { amount: 900, from: true, monthly: false },
      "en",
      en,
    );
    expect(parts.lead).toBe("from");
    expect(parts.amount).toBe("€900");
    expect(parts.net).toBe("i.e. €1,089 incl. VAT");
  });
});
