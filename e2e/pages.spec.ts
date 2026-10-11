import { expect, test } from "@playwright/test";

const SERVICE_PAGES = [
  { path: "/fr/automatisation", other: "/en/automation" },
  { path: "/fr/logiciel-metier", other: "/en/custom-software" },
  { path: "/fr/site-internet", other: "/en/website" },
  { path: "/fr/depannage", other: "/en/it-support" },
  { path: "/en/automation", other: "/fr/automatisation" },
  { path: "/en/custom-software", other: "/fr/logiciel-metier" },
  { path: "/en/website", other: "/fr/site-internet" },
  { path: "/en/it-support", other: "/fr/depannage" },
];

test.describe("Dedicated pages", () => {
  for (const { path, other } of SERVICE_PAGES) {
    test(`${path} is complete and fits the screen`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("#contact form.lead-form")).toHaveCount(1);
      await expect(page.locator(".lang-switch").first()).toHaveAttribute(
        "href",
        other,
      );
      const markup = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(markup.some((json) => json.includes('"FAQPage"'))).toBe(true);
      expect(markup.some((json) => json.includes('"Service"'))).toBe(true);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }

  test("every solution card leads to its dedicated page", async ({ page }) => {
    await page.goto("/fr");
    const links = page.locator("#solutions .domain__link");
    await expect(links).toHaveCount(3);
    await links.last().click();
    await expect(page).toHaveURL(/\/fr\/logiciel-metier$/);
    await expect(page.locator("h1")).toContainText("logiciel métier");
  });
});
