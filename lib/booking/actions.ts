import { NextResponse } from "next/server";
import { asLocale } from "@/lib/i18n/utils";
import { findBooking, settleBooking } from "@/lib/booking/db";
import { confirmedEmail, ownerConfirmedEmail, refusedEmail } from "@/lib/booking/email";
import { sendMail } from "@/lib/booking/mailer";
import { verifyAction, type BookingAction } from "@/lib/booking/token";

export type ActionState = "confirmed" | "refused" | "already" | "expired" | "invalid";

/** Applies an owner action (confirm/refuse) to a booking. Idempotent, token-gated. */
export async function applyAction(action: BookingAction, id: string, token: string): Promise<ActionState> {
  if (!id || !token || !verifyAction(id, action, token)) return "invalid";

  const booking = await findBooking(id);
  if (!booking) return "invalid";
  if (booking.status !== "pending") return "already";
  if (new Date(booking.slotStart).getTime() < Date.now()) return "expired";

  const status = action === "confirm" ? "confirmed" : "refused";
  if (!(await settleBooking(id, status))) return "already";

  if (action === "refuse") {
    await sendMail(
      booking.email,
      refusedEmail({ name: booking.name, slotIso: booking.slotStart, locale: booking.locale }),
    ).catch(() => undefined);
    return "refused";
  }

  const base = {
    id,
    name: booking.name,
    email: booking.email,
    slotIso: booking.slotStart,
    meetingType: booking.meetingType,
    roomSlug: booking.meetingRoom ?? undefined,
    locale: booking.locale,
  };
  await sendMail(booking.email, confirmedEmail(base)).catch(() => undefined);

  const owner = process.env.BOOKING_NOTIFY_EMAIL;
  if (owner) {
    const ownerMail = ownerConfirmedEmail({ ...base, phone: booking.phone, ownerEmail: owner });
    await sendMail(owner, ownerMail).catch(() => undefined);
  }
  return "confirmed";
}

/** Parses the owner action form, applies it, and redirects to the localized result page. */
export async function runBookingAction(action: BookingAction, req: Request): Promise<Response> {
  const form = await req.formData();
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");
  const lang = asLocale(String(form.get("lang") ?? ""));
  const state = await applyAction(action, id, token);
  const url = new URL(`/${lang}/booking/${action}`, req.url);
  url.searchParams.set("state", state);
  return NextResponse.redirect(url, 303);
}
