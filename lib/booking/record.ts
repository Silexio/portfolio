import type { Locale } from "@/lib/i18n/config";
import { asLocale } from "@/lib/i18n/utils";
import type { MeetingMode } from "@/lib/booking/schema";

export const BOOKING_STATUSES = ["pending", "confirmed", "refused"] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** A Booking row as SQLite returns it: every column is a primitive. */
export type BookingRow = {
  id: string;
  slotStart: string;
  name: string;
  email: string;
  phone: string;
  meetingType: string;
  message: string | null;
  locale: string;
  packages: string;
  meetingRoom: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type BookingRecord = {
  id: string;
  slotStart: string;
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingMode;
  message: string | null;
  locale: Locale;
  packages: string[];
  meetingRoom: string | null;
  status: BookingStatus;
};

function isMeetingMode(value: string): value is MeetingMode {
  return value === "video" || value === "call";
}

function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(value);
}

/** Canonical UTC form of a slot instant — the value the unique index is enforced on. */
export function slotKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid slot instant: ${iso}`);
  return date.toISOString();
}

export function encodePackages(ids: string[]): string {
  return JSON.stringify(ids);
}

/** Package ids are cosmetic (email labels only), so a corrupted column degrades to none. */
export function decodePackages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/** Maps a row to the domain record. Throws on values the CHECK constraints should have rejected. */
export function toRecord(row: BookingRow): BookingRecord {
  if (!isMeetingMode(row.meetingType)) throw new TypeError(`Unexpected meetingType: ${row.meetingType}`);
  if (!isBookingStatus(row.status)) throw new TypeError(`Unexpected status: ${row.status}`);
  return {
    id: row.id,
    slotStart: row.slotStart,
    name: row.name,
    email: row.email,
    phone: row.phone,
    meetingType: row.meetingType,
    message: row.message,
    locale: asLocale(row.locale),
    packages: decodePackages(row.packages),
    meetingRoom: row.meetingRoom,
    status: row.status,
  };
}
