import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/booking/ics";

const base = {
  uid: "booking-abc@silexio.be",
  start: new Date("2026-01-14T07:00:00.000Z"),
  durationMinutes: 30,
  summary: "Rendez-vous Silexio",
  description: "Visio avec Nicolas",
  location: "https://kmeet.infomaniak.com/silexio-xyz",
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
    expect(ics).toContain("LOCATION:https://kmeet.infomaniak.com/silexio-xyz");
    expect(ics).toContain('ORGANIZER;CN="Silexio":mailto:contact@silexio.be');
    expect(ics).toContain(
      'ATTENDEE;CN="Jane Doe";RSVP=TRUE:mailto:jane@example.com',
    );
    expect(ics).toContain("UID:booking-abc@silexio.be");
  });

  it("uses CRLF line endings", () => {
    expect(ics.includes("\r\n")).toBe(true);
  });

  it("defaults to a confirmed event at sequence 0", () => {
    expect(ics).toContain("STATUS:CONFIRMED");
    expect(ics).toContain("SEQUENCE:0");
  });

  it("carries a tentative status and a higher sequence when asked", () => {
    const out = buildIcs({ ...base, status: "TENTATIVE", sequence: 2 }, stamp);
    expect(out).toContain("STATUS:TENTATIVE");
    expect(out).toContain("SEQUENCE:2");
  });

  it("escapes commas and semicolons in text fields", () => {
    const out = buildIcs(
      { ...base, description: "Appel; visio, ou autre" },
      stamp,
    );
    expect(out).toContain("DESCRIPTION:Appel\\; visio\\, ou autre");
  });
});

/**
 * Le nom vient d'un formulaire public et finit dans un agenda. Un analyseur tolérant coupe sur un
 * retour chariot seul, et le paramètre CN vit avant le `:` qui ouvre la valeur : les deux doivent
 * être neutralisés, sinon l'auteur du formulaire écrit la propriété de son choix dans l'agenda.
 */
describe("buildIcs face à un nom hostile", () => {
  const hostile = buildIcs(
    {
      ...base,
      summary: "Appel\rATTACH:https://evil.example/p",
      attendeeName: 'Pirate";X-EVIL:1',
      description: "Ligne un\rLigne deux",
    },
    stamp,
  );

  it("n'ouvre aucune ligne depuis un retour chariot seul", () => {
    expect(hostile).not.toContain("\rATTACH");
    expect(hostile).toContain("SUMMARY:Appel\\nATTACH");
    expect(hostile).toContain("DESCRIPTION:Ligne un\\nLigne deux");
  });

  it("n'ouvre aucune propriété depuis le paramètre CN", () => {
    const attendee = hostile
      .split("\r\n")
      .find((line) => line.startsWith("ATTENDEE"));
    expect(attendee).toBe(
      'ATTENDEE;CN="Pirate  X-EVIL 1";RSVP=TRUE:mailto:jane@example.com',
    );
  });
});
