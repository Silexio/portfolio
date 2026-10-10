import { describe, expect, it } from "vitest";
import { isHoneypotFilled } from "@/lib/forms";

/**
 * Le champ leurre est la seule défense qui ne coûte rien au visiteur. Il est invisible et hors
 * tabulation : rempli, c'est un robot. Le renommer d'un côté sans l'autre le désactiverait sans
 * la moindre erreur, d'où ce test sur le nom exact.
 */
describe("isHoneypotFilled", () => {
  it("voit le champ rempli", () => {
    expect(isHoneypotFilled({ company: "Acme" })).toBe(true);
  });

  it("laisse passer un envoi humain", () => {
    expect(isHoneypotFilled({ company: "" })).toBe(false);
    expect(isHoneypotFilled({ email: "jane@example.com" })).toBe(false);
  });

  it("ne se laisse pas surprendre par un corps qui n'est pas un objet", () => {
    for (const body of [null, undefined, "company=Acme", 42, []])
      expect(isHoneypotFilled(body)).toBe(false);
  });

  it("ignore un champ qui n'est pas une chaîne", () => {
    expect(isHoneypotFilled({ company: { toString: () => "Acme" } })).toBe(
      false,
    );
  });
});
