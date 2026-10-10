import { expect, test, type Page } from "@playwright/test";
import { stubTurnstile } from "./stub-turnstile";

const openForm = async (page: Page, path = "/fr") => {
  await stubTurnstile(page);
  await page.goto(path);
  const form = page.locator("#contact form.lead-form");
  await form.scrollIntoViewIfNeeded();
  return form;
};

test.describe("Lead form", () => {
  test("stays disabled while the task is too short", async ({ page }) => {
    const form = await openForm(page);
    const submit = form.getByRole("button", { name: "Envoyer" });
    await expect(submit).toBeDisabled();
    await form.getByLabel("La tâche").fill("Trop court");
    await form.getByLabel("Votre email").fill("patron@entreprise.be");
    await expect(submit).toBeDisabled();
  });

  test("sends the request with its source and confirms", async ({ page }) => {
    let payload: unknown = null;
    await page.route("**/api/leads", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, json: { ok: true } });
    });
    const form = await openForm(page);
    await form
      .getByLabel("La tâche")
      .fill(
        "Chaque vendredi, on recopie les bons de livraison PDF dans Excel.",
      );
    await form.getByLabel(/Temps perdu/).selectOption("3to10");
    await form.getByLabel("Votre email").fill("patron@entreprise.be");
    await form.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.locator("#contact").getByRole("status")).toContainText(
      "Bien reçu",
    );
    // Le focus suit la confirmation, et le champ leurre part bien avec le reste.
    await expect(page.locator("#contact div[tabindex='-1']")).toBeFocused();
    expect(payload).toHaveProperty("company", "");
    expect(payload).toMatchObject({
      source: "home",
      hours: "3to10",
      locale: "fr",
      turnstileToken: "e2e-token",
    });
  });

  test("the IT support page asks no time range and tags its source", async ({
    page,
  }) => {
    let payload: unknown = null;
    await page.route("**/api/leads", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, json: { ok: true } });
    });
    const form = await openForm(page, "/fr/depannage");
    await expect(form.getByLabel(/Temps perdu/)).toHaveCount(0);
    await form
      .getByLabel("La panne")
      .fill("Mon portable reste bloqué sur un écran noir depuis hier.");
    await form.getByLabel("Votre email").fill("jean@exemple.be");
    await form.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.locator("#contact").getByRole("status")).toBeVisible();
    expect(payload).toMatchObject({ source: "support" });
  });

  test("shows the error and lets the visitor retry", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status: 502, json: { error: "server" } }),
    );
    const form = await openForm(page);
    await form
      .getByLabel("La tâche")
      .fill(
        "Chaque vendredi, on recopie les bons de livraison PDF dans Excel.",
      );
    await form.getByLabel("Votre email").fill("patron@entreprise.be");
    await form.getByRole("button", { name: "Envoyer" }).click();
    await expect(form.getByRole("alert")).toContainText("contact@silexio.be");
    await expect(form.getByRole("button", { name: "Envoyer" })).toBeEnabled();
  });
});
