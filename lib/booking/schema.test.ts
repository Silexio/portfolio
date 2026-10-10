import { describe, expect, it } from "vitest";
import { bookingSchema } from "@/lib/booking/schema";

const base = {
  slotStart: "2026-01-14T07:00:00.000Z",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+32 470 12 34 56",
  meetingType: "video",
  turnstileToken: "tok",
};

describe("bookingSchema", () => {
  it("accepts a valid payload", () => {
    const r = bookingSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(bookingSchema.safeParse({ ...base, email: "nope" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid phone", () => {
    expect(
      bookingSchema.safeParse({ ...base, phone: "call me!" }).success,
    ).toBe(false);
  });

  it("rejects an invalid datetime", () => {
    expect(
      bookingSchema.safeParse({ ...base, slotStart: "not-a-date" }).success,
    ).toBe(false);
  });

  it("rejects an unknown meeting type", () => {
    expect(
      bookingSchema.safeParse({ ...base, meetingType: "carrier-pigeon" })
        .success,
    ).toBe(false);
  });

  it("requires the turnstile token", () => {
    const { slotStart, name, email, phone, meetingType } = base;
    expect(
      bookingSchema.safeParse({ slotStart, name, email, phone, meetingType })
        .success,
    ).toBe(false);
  });

  it("trims name and drops empty message", () => {
    const r = bookingSchema.safeParse({
      ...base,
      name: "  Jane  ",
      message: "   ",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.name).toBe("Jane");
      expect(r.data.message).toBeUndefined();
    }
  });

  it("defaults locale to fr", () => {
    const r = bookingSchema.safeParse(base);
    if (r.success) expect(r.data.locale).toBe("fr");
  });
});

describe("bookingSchema, nom hostile", () => {
  const valid = {
    slotStart: "2026-01-14T07:00:00.000Z",
    email: "jane@example.com",
    phone: "+32 470 12 34 56",
    meetingType: "video",
    turnstileToken: "token",
  };

  it("refuse un caractère de contrôle, qui ouvrirait une ligne dans le .ics", () => {
    const out = bookingSchema.safeParse({
      ...valid,
      name: "Pirate\rATTACH:https://evil.example/p",
    });
    expect(out.success).toBe(false);
  });

  it("accepte les noms composés, accentués et apostrophés", () => {
    for (const name of [
      "Jean-Luc O’Brien",
      "Nguyễn Thị Hoa",
      "Müller & Fils",
    ]) {
      expect(bookingSchema.safeParse({ ...valid, name }).success).toBe(true);
    }
  });
});
