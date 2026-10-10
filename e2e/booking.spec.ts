import { expect, test, type Page } from "@playwright/test";

/* Même bouchon que le formulaire de demande : un jeton délivré tout de suite, aucun appel chez
   Cloudflare, et l'envoi intercepté avant Brevo. */
const stubTurnstile = (page: Page) =>
  page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.turnstile={render:function(el,o){setTimeout(function(){o.callback('e2e-token')});return 'w'},reset:function(){},remove:function(){}};",
    }),
  );

const openModal = async (page: import("@playwright/test").Page) => {
  await page.goto("/fr");
  await page
    .locator("#contact")
    .getByRole("button", { name: "Réserver un appel" })
    .click();
  const dialog = page.locator("dialog.booking-modal");
  await expect(dialog).toBeVisible();
  return dialog;
};

test.describe("Booking modal", () => {
  test("opens from the contact CTA and shows the calendar", async ({
    page,
  }) => {
    const dialog = await openModal(page);
    await expect(
      dialog.getByRole("heading", { name: /Réservez/ }),
    ).toBeVisible();
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

test.describe("Booking submission", () => {
  /**
   * La confirmation se fermait seule au bout de 2,5 s : une personne qui lit lentement, à la loupe
   * ou au lecteur d'écran n'avait pas le temps de la lire (WCAG 2.2.1). Elle doit rester, et c'est
   * au visiteur de fermer.
   */
  test("confirms the request and keeps the confirmation on screen", async ({
    page,
  }) => {
    let payload: unknown = null;
    await stubTurnstile(page);
    await page.route("**/api/bookings", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, json: { ok: true } });
    });
    const dialog = await openModal(page);
    await dialog.locator(".booking-cal__slot:not([disabled])").first().click();
    await dialog.getByLabel("Nom").fill("Jean Dupont");
    await dialog.getByLabel("Email").fill("jean@entreprise.be");
    await dialog.getByLabel(/Téléphone/).fill("+32 470 00 00 00");
    const submit = dialog.getByRole("button", { name: "Envoyer la demande" });
    await expect(submit).toBeEnabled();
    await submit.click();

    const done = dialog.getByRole("status");
    await expect(done).toBeVisible();
    // Le focus suit la confirmation : sinon il retombe sur <body> et personne n'annonce rien.
    await expect(dialog.locator("div[tabindex='-1']")).toBeFocused();
    expect(payload).toMatchObject({
      locale: "fr",
      meetingType: "video",
      turnstileToken: "e2e-token",
    });
    // Le champ leurre doit vraiment partir, sinon le filtre du serveur ne voit jamais rien.
    expect(payload).toHaveProperty("company", "");
    await page.waitForTimeout(3200);
    await expect(done).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  /**
   * Le cas de course : deux visiteurs sur le même créneau. Le second doit lire pourquoi, et
   * pouvoir réessayer — le jeton anti-robot ayant été consommé, le widget est remonté.
   */
  test("explains a slot taken meanwhile and allows another try", async ({
    page,
  }) => {
    await stubTurnstile(page);
    await page.route("**/api/bookings", (route) =>
      route.fulfill({ status: 409, json: { error: "slot_taken" } }),
    );
    const dialog = await openModal(page);
    await dialog.locator(".booking-cal__slot:not([disabled])").first().click();
    await dialog.getByLabel("Nom").fill("Jean Dupont");
    await dialog.getByLabel("Email").fill("jean@entreprise.be");
    await dialog.getByLabel(/Téléphone/).fill("+32 470 00 00 00");
    await dialog.getByRole("button", { name: "Envoyer la demande" }).click();

    await expect(dialog.getByRole("alert")).toContainText(/créneau/i);
    await expect(
      dialog.getByRole("button", { name: "Envoyer la demande" }),
    ).toBeEnabled();
  });
});
