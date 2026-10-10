import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "@/lib/booking/turnstile";

process.env.TURNSTILE_SECRET_KEY = "test-secret";

const respond = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: async () => body });

/**
 * Huit lignes, mais c'est la porte d'entrée des deux formulaires : tout ce qui n'est pas un
 * succès explicite de Cloudflare doit se refermer. Une régression ici ouvre les formulaires aux
 * robots sans aucun symptôme visible.
 */
describe("verifyTurnstile", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepte le seul cas où Cloudflare dit oui", async () => {
    const fetchMock = respond({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstile("jeton", "203.0.113.9")).toBe(true);
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("response")).toBe("jeton");
    expect(body.get("remoteip")).toBe("203.0.113.9");
  });

  it("refuse un échec déclaré", async () => {
    vi.stubGlobal("fetch", respond({ success: false }));
    expect(await verifyTurnstile("jeton")).toBe(false);
  });

  it("refuse une réponse inattendue", async () => {
    vi.stubGlobal("fetch", respond({ success: "true" }));
    expect(await verifyTurnstile("jeton")).toBe(false);
    vi.stubGlobal("fetch", respond({}));
    expect(await verifyTurnstile("jeton")).toBe(false);
  });

  it("refuse une réponse HTTP en erreur", async () => {
    vi.stubGlobal("fetch", respond({ success: true }, false));
    expect(await verifyTurnstile("jeton")).toBe(false);
  });

  it("refuse quand le réseau lâche", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await verifyTurnstile("jeton")).toBe(false);
  });
});
