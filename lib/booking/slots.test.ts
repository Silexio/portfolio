import { describe, expect, it } from "vitest";
import { BOOKING } from "@/lib/data";
import { groupByDay, isValidSlot, listSlotStarts, zonedWallToUtc } from "@/lib/booking/slots";

const TZ = "Europe/Brussels";

function brussels(iso: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(iso))) map[part.type] = part.value;
  return { weekday: map.weekday, hour: Number(map.hour), minute: Number(map.minute) };
}

describe("zonedWallToUtc — DST", () => {
  it("maps 08:00 Brussels to 07:00Z in winter (UTC+1)", () => {
    expect(zonedWallToUtc(2026, 1, 14, 8, 0, TZ).toISOString()).toBe("2026-01-14T07:00:00.000Z");
  });

  it("maps 08:00 Brussels to 06:00Z in summer (UTC+2)", () => {
    expect(zonedWallToUtc(2026, 7, 14, 8, 0, TZ).toISOString()).toBe("2026-07-14T06:00:00.000Z");
  });
});

describe("listSlotStarts", () => {
  const now = new Date("2026-01-12T00:00:00Z");
  const slots = listSlotStarts(now);

  it("returns slots", () => {
    expect(slots.length).toBeGreaterThan(0);
  });

  it("only business days (Mon–Fri) in Brussels", () => {
    const allowed = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    expect(slots.every((s) => allowed.has(brussels(s).weekday))).toBe(true);
  });

  it("only business hours (08:00–15:30) in Brussels", () => {
    for (const s of slots) {
      const { hour, minute } = brussels(s);
      const minutes = hour * 60 + minute;
      expect(minutes).toBeGreaterThanOrEqual(BOOKING.startHour * 60);
      expect(minutes).toBeLessThanOrEqual(BOOKING.endHour * 60 - BOOKING.slotMinutes);
    }
  });

  it("respects the lead time (no slot before now + lead)", () => {
    const earliest = now.getTime() + BOOKING.leadMinutes * 60_000;
    expect(slots.every((s) => new Date(s).getTime() >= earliest)).toBe(true);
  });

  it("stays within the horizon", () => {
    const horizonEnd = now.getTime() + BOOKING.horizonDays * 86_400_000;
    expect(slots.every((s) => new Date(s).getTime() <= horizonEnd)).toBe(true);
  });

  it("is sorted ascending and unique", () => {
    const sorted = [...slots].sort();
    expect(slots).toEqual(sorted);
    expect(new Set(slots).size).toBe(slots.length);
  });

  it("includes an 08:00 Brussels slot mapped to 07:00Z in January", () => {
    expect(slots.some((s) => s.endsWith("T07:00:00.000Z"))).toBe(true);
  });
});

describe("listSlotStarts — summer DST offset", () => {
  it("includes an 08:00 Brussels slot mapped to 06:00Z in July", () => {
    const slots = listSlotStarts(new Date("2026-07-06T00:00:00Z"));
    expect(slots.some((s) => s.endsWith("T06:00:00.000Z"))).toBe(true);
  });
});

describe("groupByDay", () => {
  it("groups consecutive slots under their Brussels calendar day", () => {
    const groups = groupByDay(listSlotStarts(new Date("2026-01-12T00:00:00Z")));
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.every((g) => /^\d{4}-\d{2}-\d{2}$/.test(g.day))).toBe(true);
    expect(groups.every((g) => g.starts.length > 0)).toBe(true);
  });
});

describe("isValidSlot", () => {
  const now = new Date("2026-01-12T00:00:00Z");

  it("accepts a generated slot", () => {
    expect(isValidSlot(listSlotStarts(now)[0], now)).toBe(true);
  });

  it("rejects a weekend slot", () => {
    expect(isValidSlot("2026-01-17T09:00:00.000Z", now)).toBe(false);
  });

  it("rejects an out-of-hours slot", () => {
    expect(isValidSlot("2026-01-13T03:00:00.000Z", now)).toBe(false);
  });
});
