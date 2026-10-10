import { describe, expect, it } from "vitest";
import { DOMAINS, OFFERS } from "@/lib/data";
import { LOCALES } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";
import {
  SERVICE_PAGES,
  findServicePage,
  servicePage,
  servicePath,
  serviceSlugs,
} from "@/lib/services";

const RESERVED = ["legal", "booking"];

describe("service pages", () => {
  it("use unique slugs per language that never shadow a static route", () => {
    for (const lang of LOCALES) {
      const slugs = serviceSlugs(lang);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) {
        expect(RESERVED).not.toContain(slug);
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      }
    }
  });

  it("resolve a slug back to its page, in its own language only", () => {
    const page = servicePage("support");
    expect(findServicePage("fr", "depannage")).toBe(page);
    expect(findServicePage("en", "it-support")).toBe(page);
    expect(findServicePage("en", "depannage")).toBeUndefined();
  });

  it("build localised paths", () => {
    expect(servicePath(servicePage("software"), "fr")).toBe(
      "/fr/logiciel-metier",
    );
    expect(servicePath(servicePage("software"), "en")).toBe(
      "/en/custom-software",
    );
  });

  it("only reference offers that exist", () => {
    const ids = OFFERS.map((offer) => offer.id);
    for (const page of SERVICE_PAGES)
      for (const id of page.offers) expect(ids).toContain(id);
  });

  it("keep meta titles within 60 characters and descriptions within 160", () => {
    for (const page of SERVICE_PAGES)
      for (const lang of LOCALES) {
        expect(t(page.meta.title, lang).length).toBeLessThanOrEqual(60);
        expect(t(page.meta.description, lang).length).toBeLessThanOrEqual(160);
      }
  });

  it("are reachable from every domain card", () => {
    for (const domain of DOMAINS)
      expect(() => servicePage(domain.service)).not.toThrow();
  });
});
