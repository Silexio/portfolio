import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DSN = "https://publickey123@sentry.silexio.be/2";

const { POST } = await import("@/app/monitoring/route");

const post = (body: string, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://silexio.be/monitoring", {
      method: "POST",
      headers: { "Content-Type": "application/x-sentry-envelope", ...headers },
      body,
    }),
  );

const ENVELOPE = '{"event_id":"abc"}\n{"type":"event"}\n{"level":"error"}\n';

/**
 * Ce relais a passé des semaines à jeter toutes les erreurs navigateur : il transmettait
 * l'enveloppe sans l'en-tête d'authentification du protocole Sentry, Bugsink répondait 403, et le
 * navigateur n'avait aucun moyen de l'apprendre. Un site qui ne sait plus dire qu'il casse est
 * pire qu'un site qui casse. D'où ce test sur l'en-tête, pas seulement sur le code de retour.
 */
describe("POST /monitoring", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.SENTRY_DSN = DSN;
    fetchMock.mockReset().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("transmet l'enveloppe signée de la clé publique du DSN", async () => {
    const res = await post(ENVELOPE);
    expect(res.status).toBe(202);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://sentry.silexio.be/api/2/envelope/");
    expect(init.headers["X-Sentry-Auth"]).toContain("sentry_key=publickey123");
    expect(init.headers["X-Sentry-Auth"]).toContain("sentry_version=7");
  });

  it("signale un refus du serveur plutôt que de prétendre avoir transmis", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403 });
    expect((await post(ENVELOPE)).status).toBe(502);
  });

  it("répond 502 quand le serveur est injoignable", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    expect((await post(ENVELOPE)).status).toBe(502);
  });

  it("reste inerte sans DSN exploitable", async () => {
    Reflect.deleteProperty(process.env, "SENTRY_DSN");
    Reflect.deleteProperty(process.env, "NEXT_PUBLIC_SENTRY_DSN");
    expect((await post(ENVELOPE)).status).toBe(404);
    // Un DSN sans clé publique serait refusé par le serveur : autant ne rien envoyer.
    process.env.SENTRY_DSN = "https://sentry.silexio.be/2";
    expect((await post(ENVELOPE)).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuse une enveloppe qui se déclare trop grosse, sans la lire", async () => {
    const res = await post(ENVELOPE, { "content-length": "2000000" });
    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
