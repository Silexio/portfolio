import { describe, expect, it } from "vitest";
import { isLocale, localeParam, t, type Bilingual } from "./utils";

describe("t", () => {
  const node: Bilingual = { fr: "Bonjour", en: "Hello" };

  it("returns the requested language", () => {
    expect(t(node, "en")).toBe("Hello");
    expect(t(node, "fr")).toBe("Bonjour");
  });

  it("falls back to French when a translation is missing", () => {
    const partial = { fr: "Bonjour" } as Bilingual;
    expect(t(partial, "en")).toBe("Bonjour");
  });

  it("resolves non-string nodes", () => {
    const lines: Bilingual<string[]> = { fr: ["a", "b"], en: ["c"] };
    expect(t(lines, "en")).toEqual(["c"]);
  });
});

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("de")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("localeParam", () => {
  it("narrows a valid route param", async () => {
    await expect(localeParam(Promise.resolve({ lang: "en" }))).resolves.toBe("en");
  });

  it("falls back to the default locale on unknown values", async () => {
    await expect(localeParam(Promise.resolve({ lang: "de" }))).resolves.toBe("fr");
  });
});
