import { describe, expect, it } from "vitest";
import {
  formatDayLabel,
  formatSlotLabel,
  formatTimeLabel,
  slotPeriod,
} from "@/lib/booking/format";

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
    expect(formatSlotLabel("2026-01-14T07:00:00.000Z", "en")).toContain(
      "08:00",
    );
  });
});

describe("slotPeriod — la coupure se fait à midi de Bruxelles, pas d'UTC", () => {
  it("classe 11:30 de Bruxelles le matin, en hiver comme en été", () => {
    expect(slotPeriod("2026-01-14T10:30:00.000Z")).toBe("morning");
    expect(slotPeriod("2026-07-14T09:30:00.000Z")).toBe("morning");
  });

  it("classe midi pile l'après-midi, en hiver comme en été", () => {
    expect(slotPeriod("2026-01-14T11:00:00.000Z")).toBe("afternoon");
    expect(slotPeriod("2026-07-14T10:00:00.000Z")).toBe("afternoon");
  });

  it("ne bascule pas sur l'heure UTC : 11:00Z est midi passé à Bruxelles en été", () => {
    expect(slotPeriod("2026-07-14T11:00:00.000Z")).toBe("afternoon");
  });
});
