import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Locale } from "@/lib/i18n/config";
import type { MeetingMode } from "@/lib/booking/schema";
import {
  encodePackages,
  slotKey,
  toRecord,
  type BookingRecord,
  type BookingRow,
  type BookingStatus,
} from "@/lib/booking/record";

export type NewBooking = {
  slotStart: string;
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingMode;
  message: string | null;
  locale: Locale;
  packages: string[];
  meetingRoom: string;
};

async function db(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) throw new Error("D1 binding DB is missing");
  return env.DB;
}

/** D1 surfaces constraint violations as plain errors — this is the partial index on slotStart firing. */
function isSlotTaken(error: unknown): boolean {
  return error instanceof Error && error.message.includes("UNIQUE constraint failed: Booking.slotStart");
}

/** Inserts a booking and returns its id, or null when the slot is already held. */
export async function insertBooking(input: NewBooking, now: Date = new Date()): Promise<string | null> {
  const id = crypto.randomUUID();
  const stamp = now.toISOString();
  const client = await db();
  try {
    await client
      .prepare(
        `INSERT INTO Booking
           (id, slotStart, name, email, phone, meetingType, message, locale, packages, meetingRoom, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        slotKey(input.slotStart),
        input.name,
        input.email,
        input.phone,
        input.meetingType,
        input.message,
        input.locale,
        encodePackages(input.packages),
        input.meetingRoom,
        stamp,
        stamp,
      )
      .run();
    return id;
  } catch (error) {
    if (isSlotTaken(error)) return null;
    throw error;
  }
}

export async function findBooking(id: string): Promise<BookingRecord | null> {
  const client = await db();
  const row = await client.prepare("SELECT * FROM Booking WHERE id = ?").bind(id).first<BookingRow>();
  return row ? toRecord(row) : null;
}

/** Moves a pending booking to its final status. False means another request got there first. */
export async function settleBooking(id: string, status: BookingStatus, now: Date = new Date()): Promise<boolean> {
  const client = await db();
  const result = await client
    .prepare("UPDATE Booking SET status = ?, updatedAt = ? WHERE id = ? AND status = 'pending'")
    .bind(status, now.toISOString(), id)
    .run();
  return result.meta.changes > 0;
}

/** Slot instants held by a live booking within the window — the ones to grey out. */
export async function listHeldSlots(fromIso: string, toIso: string): Promise<string[]> {
  const client = await db();
  const { results } = await client
    .prepare(
      `SELECT slotStart FROM Booking
       WHERE slotStart BETWEEN ? AND ? AND status IN ('pending', 'confirmed')`,
    )
    .bind(slotKey(fromIso), slotKey(toIso))
    .all<{ slotStart: string }>();
  return results.map((row) => row.slotStart);
}

export async function countHits(ipHash: string, sinceIso: string): Promise<number> {
  const client = await db();
  const row = await client
    .prepare("SELECT COUNT(*) AS hits FROM RateLimitHit WHERE ipHash = ? AND createdAt >= ?")
    .bind(ipHash, sinceIso)
    .first<{ hits: number }>();
  return row?.hits ?? 0;
}

/** Records one hit and drops the expired ones in the same round trip. */
export async function recordHit(ipHash: string, now: Date, expiredBefore: string): Promise<void> {
  const client = await db();
  await client.batch([
    client
      .prepare("INSERT INTO RateLimitHit (id, ipHash, createdAt) VALUES (?, ?, ?)")
      .bind(crypto.randomUUID(), ipHash, now.toISOString()),
    client.prepare("DELETE FROM RateLimitHit WHERE createdAt < ?").bind(expiredBefore),
  ]);
}
