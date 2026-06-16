import { NextResponse } from "next/server";
import { asLocale } from "@/lib/i18n/utils";
import { verifyAction, type BookingAction } from "@/lib/booking/token";
import { getPrisma } from "@/lib/booking/prisma";
import { confirmedEmail, refusedEmail } from "@/lib/booking/email";
import { sendMail } from "@/lib/booking/mailer";
import { BookingStatus } from "@/generated/prisma/client";

export type ActionState = "confirmed" | "refused" | "already" | "expired" | "invalid";

/** Applies an owner action (confirm/refuse) to a booking. Idempotent, token-gated. */
export async function applyAction(action: BookingAction, id: string, token: string): Promise<ActionState> {
  if (!id || !token || !verifyAction(id, action, token)) return "invalid";

  const prisma = getPrisma();
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return "invalid";
  if (booking.status !== BookingStatus.pending) return "already";
  if (booking.slotStart.getTime() < Date.now()) return "expired";

  const locale = asLocale(booking.locale);
  const slotIso = booking.slotStart.toISOString();

  if (action === "confirm") {
    await prisma.booking.update({ where: { id }, data: { status: BookingStatus.confirmed } });
    try {
      await sendMail(
        booking.email,
        confirmedEmail({
          name: booking.name,
          slotIso,
          meetingType: booking.meetingType,
          roomSlug: booking.jitsiRoom ?? undefined,
          locale,
        }),
      );
    } catch {
      // booking is confirmed; mail failure is non-fatal.
    }
    return "confirmed";
  }

  await prisma.booking.update({ where: { id }, data: { status: BookingStatus.refused } });
  try {
    await sendMail(booking.email, refusedEmail({ name: booking.name, slotIso, locale }));
  } catch {
    // booking is refused; mail failure is non-fatal.
  }
  return "refused";
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
