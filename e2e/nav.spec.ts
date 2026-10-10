import { expect, test } from "@playwright/test";

/**
 * Le menu mobile est un `<dialog>` ouvert par `showModal()`. C'est ce qui rend le reste de la page
 * inerte : avant, le focus sortait du panneau et tabulait dans une page devenue invisible sous un
 * fond opaque (WCAG 2.4.3 et 2.4.11).
 */
test.describe("Mobile menu", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) >= 900,
    "menu mobile seulement",
  );

  test("traps the focus and gives it back on Escape", async ({ page }) => {
    await page.goto("/fr");
    const opener = page.getByRole("button", { name: "Ouvrir le menu" });
    // Au clavier et non à la souris : un appui tactile ne donne pas le focus au bouton sur
    // mobile, et c'est bien le parcours clavier qu'on vérifie ici.
    await opener.focus();
    await page.keyboard.press("Enter");

    const sheet = page.locator("dialog.sheet");
    await expect(sheet).toBeVisible();
    await expect(page.locator("dialog.sheet[open]")).toHaveCount(1);

    // Plus de tabulations que le panneau n'a de cibles : rien ne doit sortir vers la page.
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const el = document.activeElement;
        return (
          !el || el === document.body || Boolean(el.closest("dialog.sheet"))
        );
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();
    await expect(opener).toBeFocused();
  });

  test("closes when the viewport grows to desktop", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(page.locator("dialog.sheet")).toBeVisible();
    // Un dialogue modal masqué mais resté ouvert rendrait toute la page inerte.
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator("dialog.sheet[open]")).toHaveCount(0);
  });
});
