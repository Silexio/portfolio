import { describe, expect, it } from "vitest";
import { formatDayLabel, formatSlotLabel, formatTimeLabel } from "@/lib/booking/format";

describe("formatTimeLabel — Brussels DST", () => {
  it("maps the winter offset (07:00Z → 08:00)", () => {
    expect(formatTimeLabel("2026-01-14T07:00:00.000Z", "en")).toBe("08:00");
  });

  it("maps the summer offset (06:00Z → 08:00)", () => {
    expect(formatTimeLabel("2026-07-14T06:00:00.000Z", "en")).toBe("08:00");
  });
});

describe("formatDayLabel / formatSlotLabel", () => {
  it("formatDayLabel includes the day number", () => {
    expect(formatDayLabel("2026-01-14T07:00:00.000Z", "en")).toContain("14");
  });

  it("formatSlotLabel includes the Brussels time", () => {
    expect(formatSlotLabel("2026-01-14T07:00:00.000Z", "en")).toContain("08:00");
  });
});
