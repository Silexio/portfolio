import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
const sendMailOrReport = vi.fn();
const verifyTurnstile = vi.fn();
const checkRateLimit = vi.fn();

vi.mock("@/lib/booking/mailer", () => ({
  ownerAddress: () => "nicolas@silexio.be",
  sendMail: (to: string, mail: unknown) => sendMail(to, mail),
  sendMailOrReport: (to: string, mail: unknown, tag: string) =>
    sendMailOrReport(to, mail, tag),
}));
vi.mock("@/lib/booking/turnstile", () => ({
  verifyTurnstile: (token: string) => verifyTurnstile(token),
}));
vi.mock("@/lib/booking/ratelimit", () => ({
  clientIp: () => "203.0.113.9",
  checkRateLimit: () => checkRateLimit(),
}));

const { POST } = await import("@/app/api/leads/route");

const post = (body: unknown) =>
  POST(
    new Request("https://silexio.be/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

const lead = (over: Record<string, unknown> = {}) => ({
  task: "Chaque vendredi, on recopie les bons de livraison PDF dans Excel.",
  email: "patron@entreprise.be",
  source: "home",
  locale: "fr",
  turnstileToken: "jeton",
  ...over,
});

/**
 * Rien n'est stocké : l'email au propriétaire est la seule trace d'une demande. Le prospect doit
 * donc apprendre un échec d'envoi (502) plutôt que de croire sa demande partie — c'est la seule
 * chose qui sépare « un prospect rappelé » de « un prospect perdu sans que personne le sache ».
 */
describe("POST /api/leads", () => {
  beforeEach(() => {
    sendMail.mockReset().mockResolvedValue(undefined);
    sendMailOrReport.mockReset().mockResolvedValue(undefined);
    verifyTurnstile.mockReset().mockResolvedValue(true);
    checkRateLimit.mockReset().mockResolvedValue(true);
  });

  it("notifie le propriétaire puis accuse réception", async () => {
    const res = await post(lead());
    expect(res.status).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMailOrReport).toHaveBeenCalledTimes(1);
    expect(sendMailOrReport.mock.calls[0][2]).toBe("lead-ack");
  });

  it("renvoie 502 quand la notification n'est pas partie", async () => {
    sendMail.mockRejectedValue(new Error("Brevo down"));
    const res = await post(lead());
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({ error: "server" });
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("fait semblant d'accepter un leurre rempli, sans rien envoyer", async () => {
    const res = await post(lead({ company: "Acme" }));
    expect(res.status).toBe(201);
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse un anti-robot invalide avant de compter le quota", async () => {
    verifyTurnstile.mockResolvedValue(false);
    const res = await post(lead());
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "captcha" });
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse au-delà du quota horaire", async () => {
    checkRateLimit.mockResolvedValue(false);
    const res = await post(lead());
    expect(res.status).toBe(429);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse une tâche trop courte sans rien envoyer", async () => {
    const res = await post(lead({ task: "trop court" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "validation" });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse un corps qui n'est pas du JSON", async () => {
    const res = await POST(
      new Request("https://silexio.be/api/leads", {
        method: "POST",
        body: "pas du json",
      }),
    );
    expect(res.status).toBe(400);
  });
});
