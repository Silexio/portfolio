import { describe, expect, it } from "vitest";
import { readingFrom } from "./refresh-reviews.mjs";

describe("readingFrom — un relevé raté ne doit jamais écraser un chiffre vrai", () => {
  it("accepte un relevé plausible et le date du jour", () => {
    const reading = readingFrom(5, 6);
    expect(reading.rating).toBe(5);
    expect(reading.count).toBe(6);
    expect(reading.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("arrondit la note au dixième, comme elle s'affiche", () => {
    expect(readingFrom(4.666, 12).rating).toBe(4.7);
  });

  it("refuse une note hors de l'échelle", () => {
    expect(() => readingFrom(7, 6)).toThrow(RangeError);
    expect(() => readingFrom(-1, 6)).toThrow(RangeError);
  });

  it("refuse une réponse d'API sans note ni compteur", () => {
    expect(() => readingFrom(undefined, undefined)).toThrow(RangeError);
    expect(() => readingFrom(null, null)).toThrow(RangeError);
  });

  it("refuse un nombre d'avis qui n'est pas un entier positif", () => {
    expect(() => readingFrom(5, 6.5)).toThrow(RangeError);
    expect(() => readingFrom(5, -2)).toThrow(RangeError);
  });
});
