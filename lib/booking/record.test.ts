import { describe, expect, it } from "vitest";
import { slotKey, toRecord, type BookingRow } from "@/lib/booking/record";

const row: BookingRow = {
  id: "abc",
  slotStart: "2026-01-14T07:00:00.000Z",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+32 470 00 00 00",
  meetingType: "video",
  message: null,
  locale: "fr",
  meetingRoom: "silexio-xyz",
  status: "pending",
  createdAt: "2026-01-10T09:00:00.000Z",
  updatedAt: "2026-01-10T09:00:00.000Z",
};

describe("slotKey", () => {
  it("normalizes any accepted instant to UTC ISO", () => {
    expect(slotKey("2026-01-14T08:00:00+01:00")).toBe(
      "2026-01-14T07:00:00.000Z",
    );
    expect(slotKey("2026-01-14T07:00:00.000Z")).toBe(
      "2026-01-14T07:00:00.000Z",
    );
  });

  it("rejects an unparsable instant", () => {
    expect(() => slotKey("not-a-date")).toThrow(RangeError);
  });
});

describe("toRecord", () => {
  it("maps a row to the domain record", () => {
    expect(toRecord(row)).toEqual({
      id: "abc",
      slotStart: "2026-01-14T07:00:00.000Z",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+32 470 00 00 00",
      meetingType: "video",
      message: null,
      locale: "fr",
      meetingRoom: "silexio-xyz",
      status: "pending",
    });
  });

  it("falls back to the default locale for an unknown one", () => {
    expect(toRecord({ ...row, locale: "de" }).locale).toBe("fr");
  });

  it("rejects values the CHECK constraints forbid", () => {
    expect(() => toRecord({ ...row, meetingType: "hologram" })).toThrow(
      TypeError,
    );
    expect(() => toRecord({ ...row, status: "maybe" })).toThrow(TypeError);
  });
});
