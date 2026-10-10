import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.BOOKING_ACTION_SECRET =
  "test-secret-0123456789abcdef0123456789abcdef";
process.env.BOOKING_NOTIFY_EMAIL = "nicolas@silexio.be";

const findBooking = vi.fn();
const settleBooking = vi.fn();
const sendMailOrReport = vi.fn();

vi.mock("@/lib/booking/db", () => ({
  findBooking: (id: string) => findBooking(id),
  settleBooking: (id: string, status: string) => settleBooking(id, status),
}));
vi.mock("@/lib/booking/mailer", () => ({
  ownerAddress: () => "nicolas@silexio.be",
  sendMailOrReport: (to: string, mail: { subject: string }, tag: string) =>
    sendMailOrReport(to, mail, tag),
}));

const { applyAction } = await import("@/lib/booking/actions");
const { signAction } = await import("@/lib/booking/token");

const ID = "7f1b4c32-0000-4000-8000-000000000001";
const FUTURE = new Date(Date.now() + 7 * 86_400_000).toISOString();

const pending = (over: Record<string, unknown> = {}) => ({
  id: ID,
  slotStart: FUTURE,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+32 470 00 00 00",
  meetingType: "video",
  message: null,
  locale: "fr",
  meetingRoom: "silexio-abc",
  status: "pending",
  ...over,
});

/**
 * Le seul code non pur qui décide d'envoyer un email à un client. Une inversion de branche ou un
 * garde oublié ici confirme un rendez-vous refusé, ou en annonce deux fois le même — ça se voit
 * chez le client, pas dans les logs.
 */
describe("applyAction", () => {
  beforeEach(() => {
    findBooking.mockReset();
    settleBooking.mockReset().mockResolvedValue(true);
    sendMailOrReport.mockReset().mockResolvedValue(undefined);
  });

  it("refuse un jeton forgé sans toucher à la base", async () => {
    expect(await applyAction("confirm", ID, "deadbeef")).toBe("invalid");
    expect(findBooking).not.toHaveBeenCalled();
    expect(settleBooking).not.toHaveBeenCalled();
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("refuse le jeton de l'autre action", async () => {
    expect(await applyAction("confirm", ID, signAction(ID, "refuse"))).toBe(
      "invalid",
    );
    expect(findBooking).not.toHaveBeenCalled();
  });

  it("confirme : un email au client, un au propriétaire, aucun refus", async () => {
    findBooking.mockResolvedValue(pending());
    expect(await applyAction("confirm", ID, signAction(ID, "confirm"))).toBe(
      "confirmed",
    );
    expect(settleBooking).toHaveBeenCalledWith(ID, "confirmed");
    const tags = sendMailOrReport.mock.calls.map((call) => call[2]);
    expect(tags).toEqual(["booking-confirmed", "booking-confirmed-owner"]);
    expect(sendMailOrReport.mock.calls[0][0]).toBe("jane@example.com");
    expect(sendMailOrReport.mock.calls[1][0]).toBe("nicolas@silexio.be");
  });

  it("refuse : un seul email, et jamais celui de confirmation", async () => {
    findBooking.mockResolvedValue(pending());
    expect(await applyAction("refuse", ID, signAction(ID, "refuse"))).toBe(
      "refused",
    );
    expect(settleBooking).toHaveBeenCalledWith(ID, "refused");
    expect(sendMailOrReport).toHaveBeenCalledTimes(1);
    expect(sendMailOrReport.mock.calls[0][2]).toBe("booking-refused");
  });

  /* L'idempotence est garantie par la base : `settleBooking` ne change une ligne que si elle est
     encore `pending`. Un double clic sur le lien ne doit donc pas renvoyer un second email. */
  it("n'envoie rien quand la base a déjà réglé la demande", async () => {
    findBooking.mockResolvedValue(pending());
    settleBooking.mockResolvedValue(false);
    expect(await applyAction("confirm", ID, signAction(ID, "confirm"))).toBe(
      "already",
    );
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("n'envoie rien sur une demande déjà confirmée", async () => {
    findBooking.mockResolvedValue(pending({ status: "confirmed" }));
    expect(await applyAction("confirm", ID, signAction(ID, "confirm"))).toBe(
      "already",
    );
    expect(settleBooking).not.toHaveBeenCalled();
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });

  it("refuse un créneau déjà passé", async () => {
    findBooking.mockResolvedValue(
      pending({ slotStart: new Date(Date.now() - 3_600_000).toISOString() }),
    );
    expect(await applyAction("confirm", ID, signAction(ID, "confirm"))).toBe(
      "expired",
    );
    expect(settleBooking).not.toHaveBeenCalled();
    expect(sendMailOrReport).not.toHaveBeenCalled();
  });
});
