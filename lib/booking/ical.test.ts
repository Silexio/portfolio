import { describe, expect, it } from "vitest";
import { isSlotBusy, parseBusyIntervals } from "@/lib/booking/ical";

const WINDOW_START = new Date("2026-09-01T00:00:00.000Z");
const WINDOW_END = new Date("2026-09-22T00:00:00.000Z");

const wrap = (body: string) => `BEGIN:VCALENDAR\nVERSION:2.0\n${body}\nEND:VCALENDAR`;
const busy = (body: string) => parseBusyIntervals(wrap(body), WINDOW_START, WINDOW_END);
const iso = (ms: number) => new Date(ms).toISOString();

describe("parseBusyIntervals", () => {
  it("reads a plain UTC event", () => {
    const out = busy("BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nEND:VEVENT");
    expect(out).toHaveLength(1);
    expect(iso(out[0].start)).toBe("2026-09-02T08:00:00.000Z");
    expect(iso(out[0].end)).toBe("2026-09-02T09:00:00.000Z");
  });

  it("converts a wall time carrying a TZID", () => {
    // 10:00 à Bruxelles en septembre = 08:00Z (UTC+2).
    const out = busy(
      "BEGIN:VEVENT\nDTSTART;TZID=Europe/Brussels:20260902T100000\nDTEND;TZID=Europe/Brussels:20260902T110000\nEND:VEVENT",
    );
    expect(iso(out[0].start)).toBe("2026-09-02T08:00:00.000Z");
  });

  it("blocks a whole day for an all-day event", () => {
    const out = busy("BEGIN:VEVENT\nDTSTART;VALUE=DATE:20260902\nDTEND;VALUE=DATE:20260903\nEND:VEVENT");
    expect(out[0].end - out[0].start).toBe(86_400_000);
  });

  it("accepts DURATION instead of DTEND", () => {
    const out = busy("BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDURATION:PT1H30M\nEND:VEVENT");
    expect(out[0].end - out[0].start).toBe(90 * 60_000);
  });

  it("rebuilds folded lines", () => {
    const out = busy("BEGIN:VEVENT\nDTSTART;TZID=Europe/Bru\n ssels:20260902T100000\nDTEND;TZID=Europe/Brussels:20260902T110000\nEND:VEVENT");
    expect(iso(out[0].start)).toBe("2026-09-02T08:00:00.000Z");
  });

  it("ignores cancelled events", () => {
    expect(busy("BEGIN:VEVENT\nSTATUS:CANCELLED\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nEND:VEVENT")).toHaveLength(0);
  });

  it("ignores events marked as free time", () => {
    expect(busy("BEGIN:VEVENT\nTRANSP:TRANSPARENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nEND:VEVENT")).toHaveLength(0);
  });

  it("ignores the DTSTART lines of a VTIMEZONE block", () => {
    // Un export d'agenda réel commence par un VTIMEZONE dont les règles DST portent leurs
    // propres DTSTART : les lire comme des événements bloquerait des créneaux au hasard.
    const out = busy(
      [
        "BEGIN:VTIMEZONE",
        "TZID:Europe/Brussels",
        "BEGIN:DAYLIGHT",
        "DTSTART:19700329T020000",
        "TZOFFSETFROM:+0100",
        "TZOFFSETTO:+0200",
        "END:DAYLIGHT",
        "BEGIN:STANDARD",
        "DTSTART:19701025T030000",
        "TZOFFSETFROM:+0200",
        "TZOFFSETTO:+0100",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        "DTSTART;TZID=Europe/Brussels:20260902T100000",
        "DTEND;TZID=Europe/Brussels:20260902T110000",
        "END:VEVENT",
      ].join("\n"),
    );
    expect(out).toHaveLength(1);
    expect(iso(out[0].start)).toBe("2026-09-02T08:00:00.000Z");
  });

  it("blocks a tentative event", () => {
    // Prudence : un « peut-être » sur l'agenda du studio ne doit pas être vendu comme libre.
    const out = busy("BEGIN:VEVENT\nSTATUS:TENTATIVE\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nEND:VEVENT");
    expect(out).toHaveLength(1);
  });

  it("drops events outside the window", () => {
    expect(busy("BEGIN:VEVENT\nDTSTART:20251002T080000Z\nDTEND:20251002T090000Z\nEND:VEVENT")).toHaveLength(0);
  });

  describe("recurrence", () => {
    it("expands a weekly rule across the window", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=WEEKLY\nEND:VEVENT",
      );
      expect(out.map((i) => iso(i.start))).toEqual([
        "2026-09-02T08:00:00.000Z",
        "2026-09-09T08:00:00.000Z",
        "2026-09-16T08:00:00.000Z",
      ]);
    });

    it("honours COUNT", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=DAILY;COUNT=3\nEND:VEVENT",
      );
      expect(out).toHaveLength(3);
    });

    it("honours UNTIL", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=DAILY;UNTIL=20260904T235959Z\nEND:VEVENT",
      );
      expect(out).toHaveLength(3);
    });

    it("honours INTERVAL", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2\nEND:VEVENT",
      );
      expect(out.map((i) => iso(i.start))).toEqual(["2026-09-02T08:00:00.000Z", "2026-09-16T08:00:00.000Z"]);
    });

    it("expands BYDAY to every listed weekday", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=WE,FR;COUNT=4\nEND:VEVENT",
      );
      // 2026-09-02 est un mercredi : ME, VE, ME, VE.
      expect(out.map((i) => iso(i.start).slice(0, 10))).toEqual(["2026-09-02", "2026-09-04", "2026-09-09", "2026-09-11"]);
    });

    it("applies INTERVAL to a BYDAY rule", () => {
      // 2026-09-07 est un lundi : un lundi sur deux, pas tous les lundis.
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260907T080000Z\nDTEND:20260907T090000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO\nEND:VEVENT",
      );
      expect(out.map((i) => iso(i.start).slice(0, 10))).toEqual(["2026-09-07", "2026-09-21"]);
    });

    it("skips dates listed in EXDATE", () => {
      const out = busy(
        "BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=WEEKLY\nEXDATE:20260909T080000Z\nEND:VEVENT",
      );
      expect(out.map((i) => iso(i.start))).toEqual(["2026-09-02T08:00:00.000Z", "2026-09-16T08:00:00.000Z"]);
    });

    it("stays bounded on an endless rule", () => {
      const out = busy("BEGIN:VEVENT\nDTSTART:20260902T080000Z\nDTEND:20260902T090000Z\nRRULE:FREQ=DAILY\nEND:VEVENT");
      expect(out.length).toBeLessThan(30);
      expect(out.length).toBeGreaterThan(15);
    });
  });
});

describe("isSlotBusy", () => {
  const intervals = [{ start: Date.parse("2026-09-02T08:00:00.000Z"), end: Date.parse("2026-09-02T09:00:00.000Z") }];

  it("flags a slot fully inside a busy interval", () => {
    expect(isSlotBusy("2026-09-02T08:30:00.000Z", 30, intervals)).toBe(true);
  });

  it("flags a slot that only overlaps the tail", () => {
    expect(isSlotBusy("2026-09-02T07:45:00.000Z", 30, intervals)).toBe(true);
  });

  it("leaves an adjacent slot free", () => {
    expect(isSlotBusy("2026-09-02T09:00:00.000Z", 30, intervals)).toBe(false);
    expect(isSlotBusy("2026-09-02T07:30:00.000Z", 30, intervals)).toBe(false);
  });

  it("leaves everything free when the calendar returned nothing", () => {
    expect(isSlotBusy("2026-09-02T08:30:00.000Z", 30, [])).toBe(false);
  });
});
