import { expect, test } from "@playwright/test";

const openWork = async (page: import("@playwright/test").Page) => {
  await page.goto("/fr");
  const carousel = page.locator("#work .carousel");
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toBeVisible();
  return carousel;
};

test.describe("Work carousel", () => {
  test("exposes the APG carousel semantics", async ({ page }) => {
    const carousel = await openWork(page);
    await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    const first = carousel.locator(".carousel__viewport > *").first();
    await expect(first).toHaveAttribute("aria-roledescription", "slide");
    await expect(first).toHaveAttribute("aria-label", /projet 1 sur \d+/);
  });

  test("the next arrow advances the active slide", async ({ page }) => {
    const carousel = await openWork(page);
    const current = carousel.locator('.carousel__dot[aria-current="true"]');
    const firstLabel = await current.getAttribute("aria-label");
    await carousel.locator(".carousel__arrow").last().click();
    await expect(current).not.toHaveAttribute("aria-label", firstLabel ?? "");
  });

  test("arrows are disabled at both ends", async ({ page }) => {
    const carousel = await openWork(page);
    await expect(carousel.locator(".carousel__arrow").first()).toBeDisabled();
    await carousel.locator(".carousel__dot").last().click();
    await expect(carousel.locator(".carousel__arrow").last()).toBeDisabled();
  });

  test("every project keeps a reachable action", async ({ page }) => {
    const carousel = await openWork(page);
    const slides = carousel.locator(".carousel__viewport > *");
    const count = await slides.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
      await expect(
        slides.nth(i).locator(".project__actions a"),
      ).not.toHaveCount(0);
    }
  });
});
