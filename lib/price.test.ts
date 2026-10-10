import { describe, expect, it } from "vitest";
import { priceParts, type PriceLabels } from "@/lib/price";

const fr: PriceLabels = {
  free: "Gratuit",
  from: "dès",
  perMonth: "/ mois",
};
const en: PriceLabels = {
  free: "Free",
  from: "from",
  perMonth: "/ month",
};
const nbsp = /[  ]/g;

describe("priceParts", () => {
  it("shows a free offer as a word, without qualifiers", () => {
    expect(
      priceParts({ amount: 0, from: false, monthly: false }, "fr", fr),
    ).toEqual({ lead: "", amount: "Gratuit", tail: "" });
  });

  it("formats a fixed price in Belgian French, without qualifiers", () => {
    const parts = priceParts(
      { amount: 490, from: false, monthly: false },
      "fr",
      fr,
    );
    expect(parts.lead).toBe("");
    expect(parts.amount.replace(nbsp, " ")).toBe("490 €");
    expect(parts.tail).toBe("");
  });

  it("prefixes a starting price and groups thousands", () => {
    const parts = priceParts(
      { amount: 1500, from: true, monthly: false },
      "fr",
      fr,
    );
    expect(parts.lead).toBe("dès");
    expect(parts.amount.replace(nbsp, " ")).toBe("1 500 €");
  });

  it("adds the monthly unit after the amount", () => {
    const parts = priceParts(
      { amount: 150, from: true, monthly: true },
      "fr",
      fr,
    );
    expect(parts.tail).toBe("/ mois");
  });

  it("uses the English currency layout", () => {
    const parts = priceParts(
      { amount: 4500, from: true, monthly: false },
      "en",
      en,
    );
    expect(parts).toEqual({
      lead: "from",
      amount: "€4,500",
      tail: "",
    });
  });
});
