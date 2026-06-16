import { createHmac, timingSafeEqual } from "node:crypto";

export type BookingAction = "confirm" | "refuse";

function secret(): string {
  const value = process.env.BOOKING_ACTION_SECRET;
  if (!value) throw new Error("BOOKING_ACTION_SECRET is not set");
  return value;
}

/** HMAC token authorizing a single owner action on a booking (no login). */
export function signAction(id: string, action: BookingAction): string {
  return createHmac("sha256", secret()).update(`${id}:${action}`).digest("hex");
}

/** Timing-safe verification of an action token. */
export function verifyAction(id: string, action: BookingAction, token: string): boolean {
  const expected = Buffer.from(signAction(id, action), "hex");
  const provided = Buffer.from(typeof token === "string" ? token : "", "hex");
  if (expected.length === 0 || expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
