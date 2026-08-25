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
    packages: ["API & Backend"],
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
      packages: [],
      slotIso,
      locale: "en",
    });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;script&gt;");
  });
});

describe("pendingEmail", () => {
  it("addresses the client and references the slot, FR and EN", () => {
    const fr = pendingEmail({
      name: "Jane",
      slotIso,
      meetingType: "video",
      locale: "fr",
    });
    const en = pendingEmail({
      name: "Jane",
      slotIso,
      meetingType: "video",
      locale: "en",
    });
    expect(fr.text).toContain("Bonjour Jane");
    expect(en.text).toContain("Hi Jane");
    expect(fr.text).not.toContain("{name}");
    expect(fr.text).not.toContain("{slot}");
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
  it("addresses the owner with client details + .ics", () => {
    const mail = ownerConfirmedEmail({
      id: "abc",
      name: "Jane",
      email: "jane@example.com",
      phone: "+32470123456",
      slotIso,
      meetingType: "video",
      roomSlug: "silexio-xyz",
      locale: "fr",
      ownerEmail: "contact@silexio.be",
    });
    expect(mail.text).toContain("Jane");
    expect(mail.text).toContain("+32470123456");
    expect(mail.attachments?.[0].content).toContain("BEGIN:VEVENT");
  });
});

describe("refusedEmail", () => {
  it("addresses the client and resolves placeholders", () => {
    const mail = refusedEmail({ name: "Jane", slotIso, locale: "fr" });
    expect(mail.text).toContain("Jane");
    expect(mail.text).not.toContain("{slot}");
  });
});
