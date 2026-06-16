import { expect, test } from "@playwright/test";

const openModal = async (page: import("@playwright/test").Page) => {
  await page.goto("/fr");
  await page.locator("#contact").getByRole("button", { name: "Réserver un appel" }).click();
  const dialog = page.locator("dialog.booking-modal");
  await expect(dialog).toBeVisible();
  return dialog;
};

test.describe("Booking modal", () => {
  test("opens from the contact CTA and shows the calendar", async ({ page }) => {
    const dialog = await openModal(page);
    await expect(dialog.getByRole("heading", { name: /Réservez/ })).toBeVisible();
    await expect(dialog.locator(".booking-cal__day").first()).toBeVisible();
  });

  test("selecting a slot reveals the form", async ({ page }) => {
    const dialog = await openModal(page);
    await dialog.locator(".booking-cal__slot:not([disabled])").first().click();
    await expect(dialog.getByText("Créneau choisi")).toBeVisible();
    await expect(dialog.getByLabel("Nom")).toBeVisible();
    await expect(dialog.getByLabel("Email")).toBeVisible();
  });

  test("closes with the Escape key", async ({ page }) => {
    const dialog = await openModal(page);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
