import { describe, expect, it } from "vitest";
import {
  confirmedEmail,
  ownerConfirmedEmail,
  ownerEmail,
  pendingEmail,
  refusedEmail,
} from "@/lib/booking/email";

process.env.BOOKING_ACTION_SECRET =
  "test-secret-0123456789abcdef0123456789abcdef";

const slotIso = "2026-01-14T07:00:00.000Z";

describe("ownerEmail", () => {
  const mail = ownerEmail({
    id: "abc123",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+32 470 12 34 56",
    meetingType: "video",
    message: "Need a backend",
    slotIso,
    locale: "fr",
  });

  it("fills the subject with the name", () => {
    expect(mail.subject).toContain("Jane Doe");
  });

  it("includes signed confirm and refuse links", () => {
    expect(mail.text).toMatch(
      /\/fr\/booking\/confirm\?id=abc123&token=[a-f0-9]+/,
    );
    expect(mail.text).toMatch(
      /\/fr\/booking\/refuse\?id=abc123&token=[a-f0-9]+/,
    );
  });

  it("includes client details", () => {
    expect(mail.html).toContain("jane@example.com");
    expect(mail.html).toContain("Need a backend");
  });

  it("attaches a tentative .ics so the slot can be held before confirming", () => {
    const ics = mail.attachments?.[0].content ?? "";
    expect(ics).toContain("STATUS:TENTATIVE");
    expect(ics).toContain("SEQUENCE:0");
    expect(ics).toContain("SUMMARY:RDV Jane Doe \u2014 \u00e0 confirmer");
    expect(ics).toContain("UID:abc123@silexio.be");
    expect(ics).toContain("jane@example.com");
  });
});

describe("ownerEmail — HTML escaping", () => {
  it("escapes script tags from user fields", () => {
    const mail = ownerEmail({
      id: "x",
      name: "<script>alert(1)</script>",
      email: "a@b.com",
      phone: "+3212345678",
      meetingType: "call",
      message: "<img src=x onerror=alert(2)>",
      slotIso,
      locale: "en",
    });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;script&gt;");
  });
});

describe("pendingEmail", () => {
  /**
   * Cet accusé part avant toute validation, vers l'adresse que l'auteur du formulaire a saisie :
   * il ne doit reprendre aucun texte de ce formulaire, sinon il relaie le message de n'importe qui
   * vers n'importe quelle adresse, signé par le domaine du studio.
   */
  it("confirme le créneau sans reprendre un mot du formulaire, FR et EN", () => {
    const payload = {
      name: "Réglez votre facture sur https://evil.example",
      slotIso,
      meetingType: "video",
    } as const;
    const fr = pendingEmail({ ...payload, locale: "fr" });
    const en = pendingEmail({ ...payload, locale: "en" });
    expect(fr.text).toContain("Bonjour,");
    expect(en.text).toContain("Hello,");
    expect(fr.text).not.toContain("evil.example");
    expect(en.text).not.toContain("evil.example");
    expect(fr.text).not.toContain("{name}");
    expect(fr.text).not.toContain("{slot}");
    expect(fr.text).toContain("14 janvier");
  });
});

describe("confirmedEmail", () => {
  const video = confirmedEmail({
    id: "abc",
    name: "Jane",
    email: "jane@example.com",
    slotIso,
    meetingType: "video",
    roomSlug: "silexio-xyz",
    locale: "fr",
  });

  it("includes the kMeet link for video meetings", () => {
    expect(video.text).toContain("https://kmeet.infomaniak.com/silexio-xyz");
    expect(video.html).toContain(
      'href="https://kmeet.infomaniak.com/silexio-xyz"',
    );
  });

  it("offers a Google Calendar link carrying the same slot, labelled in the HTML version", () => {
    expect(video.text).toContain(
      "https://calendar.google.com/calendar/render?action=TEMPLATE",
    );
    expect(video.text).toContain("dates=20260114T070000Z%2F20260114T073000Z");
    expect(video.html).toContain(">Ajouter à Google Agenda</a>");
    expect(video.html).toContain('style="display:inline-block;padding:12px');
  });

  it("attaches an .ics invite with the meeting as location", () => {
    expect(video.attachments?.[0].filename).toBe("rendez-vous.ics");
    expect(video.attachments?.[0].content).toContain("BEGIN:VEVENT");
    expect(video.attachments?.[0].content).toContain(
      "LOCATION:https://kmeet.infomaniak.com/silexio-xyz",
    );
  });

  it("uses the call note for phone meetings (no link)", () => {
    const mail = confirmedEmail({
      id: "abc",
      name: "Jane",
      email: "jane@example.com",
      slotIso,
      meetingType: "call",
      locale: "en",
    });
    expect(mail.text).not.toContain("kmeet.infomaniak.com");
    expect(mail.text).toContain("call you");
    expect(mail.attachments?.[0].content).toContain("BEGIN:VEVENT");
  });
});

describe("ownerConfirmedEmail", () => {
  const mail = ownerConfirmedEmail({
    id: "abc",
    name: "Jane",
    email: "jane@example.com",
    phone: "+32470123456",
    slotIso,
    meetingType: "video",
    roomSlug: "silexio-xyz",
    locale: "fr",
  });

  it("addresses the owner with client details", () => {
    expect(mail.text).toContain("Jane");
    expect(mail.text).toContain("+32470123456");
  });

  it("supersedes the tentative invite instead of duplicating it", () => {
    const ics = mail.attachments?.[0].content ?? "";
    expect(ics).toContain("UID:abc@silexio.be");
    expect(ics).toContain("SEQUENCE:1");
    expect(ics).toContain("STATUS:CONFIRMED");
    expect(ics).toContain("SUMMARY:RDV Jane");
    expect(ics).not.toContain("\u00e0 confirmer");
  });
});

describe("refusedEmail", () => {
  it("addresses the client and resolves placeholders", () => {
    const mail = refusedEmail({ name: "Jane", slotIso, locale: "fr" });
    expect(mail.text).toContain("Jane");
    expect(mail.text).not.toContain("{slot}");
  });
});
