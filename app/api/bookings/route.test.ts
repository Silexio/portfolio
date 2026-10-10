import { beforeEach, describe, expect, it, vi } from "vitest";
import { listSlotStarts } from "@/lib/booking/slots";

// Le mail au propriétaire porte les liens d'action signés.
process.env.BOOKING_ACTION_SECRET =
  "test-secret-0123456789abcdef0123456789abcdef";

const insertBooking = vi.fn();
const sendMailOrReport = vi.fn();
const verifyTurnstile = vi.fn();
const checkRateLimit = vi.fn();

vi.mock("@/lib/booking/db", () => ({
  insertBooking: (input: unknown) => insertBooking(input),
}));
vi.mock("@/lib/booking/mailer", () => ({
  ownerAddress: () => "nicolas@silexio.be",
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

const { POST } = await import("@/app/api/bookings/route");

/** Un créneau réellement proposé : le schéma exige l'instant exact, pas une date approchante. */
const SLOT = listSlotStarts(new Date())[0];

const post = (body: unknown) =>
  POST(
    new Request("https://silexio.be/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

const booking = (over: Record<string, unknown> = {}) => ({
  slotStart: SLOT,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+32 470 00 00 00",
  meetingType: "video",
  locale: "fr",
  turnstileToken: "jeton",
  ...over,
});

/**
 * Le 409 est le cas de course : deux visiteurs sur le même créneau. L'index unique partiel de D1
 * le décide, `insertBooking` renvoie `null`, et c'est ici que ça doit devenir un refus propre —
 * pas un 500, et surtout pas un email promettant un rendez-vous déjà pris.
 */
describe("POST /api/bookings", () => {
  beforeEach(() => {
    insertBooking.mockReset().mockResolvedValue("booking-id");
    sendMailOrReport.mockReset().mockResolvedValue(undefined);
    verifyTurnstile.mockReset().mockResolvedValue(true);
    checkRateLimit.mockReset().mockResolvedValue(true);
    process.env.BOOKING_NOTIFY_EMAIL = "nicolas@silexio.be";
  });

  it("enregistre la demande et prévient les deux parties", async () => {
    const res = await post(booking());
    expect(res.status).toBe(201);
    const tags = sendMailOrReport.mock.calls.map((call) => call[2]);
    expect(tags).toEqual(["booking-owner", "booking-pending"]);
  });

  it("renvoie 409 sur un créneau déjà pris, sans écrire ni envoyer", async () => {
    insertBooking.mockResolvedValue(null);
    const res = await post(booking());
    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toEqual({ error: "slot_taken" });
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("renvoie 500 si la base tombe, sans promettre de rendez-vous", async () => {
    insertBooking.mockRejectedValue(new Error("D1 down"));
    const res = await post(booking());
    expect(res.status).toBe(500);
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("refuse un créneau hors de ceux proposés", async () => {
    const res = await post(booking({ slotStart: "2020-01-01T10:00:00.000Z" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "invalid_slot" });
    expect(insertBooking).not.toHaveBeenCalled();
  });

  it("refuse un nom porteur d'un caractère de contrôle", async () => {
    const res = await post(booking({ name: "Pirate\rATTACH:https://evil" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "validation" });
    expect(insertBooking).not.toHaveBeenCalled();
  });

  it("fait semblant d'accepter un leurre rempli", async () => {
    const res = await post(booking({ company: "Acme" }));
    expect(res.status).toBe(201);
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(insertBooking).not.toHaveBeenCalled();
  });

  it("refuse un anti-robot invalide avant de compter le quota", async () => {
    verifyTurnstile.mockResolvedValue(false);
    const res = await post(booking());
    expect(res.status).toBe(400);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(insertBooking).not.toHaveBeenCalled();
  });
});
