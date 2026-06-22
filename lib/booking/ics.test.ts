import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/booking/ics";

const base = {
  uid: "booking-abc@silexio.be",
  start: new Date("2026-01-14T07:00:00.000Z"),
  durationMinutes: 30,
  summary: "Rendez-vous Silexio",
  description: "Visio avec Nicolas",
  location: "https://meet.jit.si/silexio-xyz",
  organizerName: "Silexio",
  organizerEmail: "contact@silexio.be",
  attendeeName: "Jane Doe",
  attendeeEmail: "jane@example.com",
};

const stamp = new Date("2026-01-10T09:00:00.000Z");

describe("buildIcs", () => {
  const ics = buildIcs(base, stamp);

  it("wraps a single VEVENT in a VCALENDAR", () => {
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("uses UTC start/end with the right duration", () => {
    expect(ics).toContain("DTSTART:20260114T070000Z");
    expect(ics).toContain("DTEND:20260114T073000Z");
    expect(ics).toContain("DTSTAMP:20260110T090000Z");
  });

  it("carries summary, location, organizer and attendee", () => {
    expect(ics).toContain("SUMMARY:Rendez-vous Silexio");
    expect(ics).toContain("LOCATION:https://meet.jit.si/silexio-xyz");
    expect(ics).toContain("ORGANIZER;CN=Silexio:mailto:contact@silexio.be");
    expect(ics).toContain("ATTENDEE;CN=Jane Doe;RSVP=TRUE:mailto:jane@example.com");
    expect(ics).toContain("UID:booking-abc@silexio.be");
  });

  it("uses CRLF line endings", () => {
    expect(ics.includes("\r\n")).toBe(true);
  });

  it("escapes commas and semicolons in text fields", () => {
    const out = buildIcs({ ...base, description: "Appel; visio, ou autre" }, stamp);
    expect(out).toContain("DESCRIPTION:Appel\\; visio\\, ou autre");
  });
});
