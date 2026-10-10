import { describe, expect, it } from "vitest";
import { priceParts, VAT_RATE, type PriceLabels } from "@/lib/price";

const fr: PriceLabels = {
  free: "Gratuit",
  from: "dès",
  perMonth: "/ mois",
  net: "soit {amount} hors TVA pour un professionnel",
};
const en: PriceLabels = {
  free: "Free",
  from: "from",
  perMonth: "/ month",
  net: "i.e. {amount} excl. VAT for a business",
};
const nbsp = /[\u00a0\u202f]/g;
const plain = (value: string) => value.replace(nbsp, " ");

/**
 * Le montant mis en avant est celui que le visiteur paiera : le SPF Économie impose au prix
 * montré à un consommateur d'inclure la TVA, prestations de services comprises. Le hors-TVA
 * reste dit à côté, pour le professionnel qui la récupère.
 */
describe("priceParts", () => {
  it("affiche une offre gratuite comme un mot, sans qualificatif ni mention de TVA", () => {
    expect(
      priceParts({ amount: 0, from: false, monthly: false }, "fr", fr),
    ).toEqual({ lead: "", amount: "Gratuit", tail: "", net: "" });
  });

  it("met en avant le prix TVA comprise et dit le hors-TVA à côté", () => {
    const parts = priceParts(
      { amount: 600, from: true, monthly: false },
      "fr",
      fr,
    );
    expect(parts.lead).toBe("dès");
    expect(plain(parts.amount)).toBe("726 €");
    expect(plain(parts.net)).toBe("soit 600 € hors TVA pour un professionnel");
  });

  it("applique le taux belge et groupe les milliers", () => {
    const parts = priceParts(
      { amount: 5000, from: true, monthly: false },
      "fr",
      fr,
    );
    expect(VAT_RATE).toBe(0.21);
    expect(plain(parts.amount)).toBe("6 050 €");
  });

  it("ajoute l'unité mensuelle après le montant", () => {
    const parts = priceParts(
      { amount: 99, from: true, monthly: true },
      "fr",
      fr,
    );
    expect(parts.tail).toBe("/ mois");
    expect(plain(parts.amount)).toBe("120 €");
  });

  it("utilise la mise en forme monétaire anglaise", () => {
    const parts = priceParts(
      { amount: 900, from: true, monthly: false },
      "en",
      en,
    );
    expect(parts.lead).toBe("from");
    expect(parts.amount).toBe("€1,089");
    expect(parts.net).toBe("i.e. €900 excl. VAT for a business");
  });
});
