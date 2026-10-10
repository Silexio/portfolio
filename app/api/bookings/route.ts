import { reportServerError } from "@/lib/observability/server";
import { isHoneypotFilled, jsonAccepted, jsonError } from "@/lib/forms";
import { insertBooking } from "@/lib/booking/db";
import { ownerEmail, pendingEmail } from "@/lib/booking/email";
import { ownerAddress, sendMailOrReport } from "@/lib/booking/mailer";
import { generateRoomSlug } from "@/lib/booking/meeting";
import { checkRateLimit, clientIp } from "@/lib/booking/ratelimit";
import { bookingSchema } from "@/lib/booking/schema";
import { isValidSlot } from "@/lib/booking/slots";
import { verifyTurnstile } from "@/lib/booking/turnstile";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError("bad_request", 400);
  }

  if (isHoneypotFilled(raw)) return jsonAccepted();

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) return jsonError("validation", 400);
  const data = parsed.data;

  const now = new Date();
  if (!isValidSlot(data.slotStart, now)) return jsonError("invalid_slot", 400);

  const ip = clientIp(req.headers);
  if (!(await verifyTurnstile(data.turnstileToken, ip)))
    return jsonError("captcha", 400);
  if (!(await checkRateLimit(ip, now))) return jsonError("rate_limit", 429);

  let bookingId: string | null;
  try {
    bookingId = await insertBooking(
      {
        slotStart: data.slotStart,
        name: data.name,
        email: data.email,
        phone: data.phone,
        meetingType: data.meetingType,
        message: data.message ?? null,
        locale: data.locale,
        meetingRoom: generateRoomSlug(),
      },
      now,
    );
  } catch (error) {
    reportServerError(error, "booking-insert");
    return jsonError("server", 500);
  }
  if (!bookingId) return jsonError("slot_taken", 409);

  await sendMailOrReport(
    ownerAddress(),
    ownerEmail({
      id: bookingId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      meetingType: data.meetingType,
      message: data.message,
      slotIso: data.slotStart,
      locale: data.locale,
    }),
    "booking-owner",
  );
  await sendMailOrReport(
    data.email,
    pendingEmail({
      name: data.name,
      slotIso: data.slotStart,
      meetingType: data.meetingType,
      locale: data.locale,
    }),
    "booking-pending",
  );

  return jsonAccepted();
}
