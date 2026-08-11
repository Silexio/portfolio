import { NextResponse } from "next/server";
import { PACKAGES } from "@/lib/data";
import { t } from "@/lib/i18n/utils";
import { insertBooking } from "@/lib/booking/db";
import { ownerEmail, pendingEmail } from "@/lib/booking/email";
import { sendMail } from "@/lib/booking/mailer";
import { generateRoomSlug } from "@/lib/booking/meeting";
import { checkRateLimit, clientIp } from "@/lib/booking/ratelimit";
import { bookingSchema } from "@/lib/booking/schema";
import { isValidSlot } from "@/lib/booking/slots";
import { verifyTurnstile } from "@/lib/booking/turnstile";

const json = (error: string, status: number) => NextResponse.json({ error }, { status });

function isHoneypotFilled(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const company = (raw as { company?: unknown }).company;
  return typeof company === "string" && company.length > 0;
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json("bad_request", 400);
  }

  if (isHoneypotFilled(raw)) return NextResponse.json({ ok: true }, { status: 201 });

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) return json("validation", 400);
  const data = parsed.data;

  const now = new Date();
  if (!isValidSlot(data.slotStart, now)) return json("invalid_slot", 400);

  const ip = clientIp(req.headers);
  if (!(await verifyTurnstile(data.turnstileToken, ip))) return json("captcha", 400);
  if (!(await checkRateLimit(ip, now))) return json("rate_limit", 429);

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
        packages: data.packages,
        meetingRoom: generateRoomSlug(),
      },
      now,
    );
  } catch {
    return json("server", 500);
  }
  if (!bookingId) return json("slot_taken", 409);

  const labelById = new Map<string, string>(PACKAGES.map((p) => [p.id, t(p.title, data.locale)]));
  const packageLabels = data.packages.map((id) => labelById.get(id) ?? id);

  const notify = process.env.BOOKING_NOTIFY_EMAIL;
  if (notify) {
    await sendMail(
      notify,
      ownerEmail({
        id: bookingId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        meetingType: data.meetingType,
        message: data.message,
        packages: packageLabels,
        slotIso: data.slotStart,
        locale: data.locale,
      }),
    ).catch(() => undefined);
  }
  await sendMail(
    data.email,
    pendingEmail({ name: data.name, slotIso: data.slotStart, meetingType: data.meetingType, locale: data.locale }),
  ).catch(() => undefined);

  return NextResponse.json({ ok: true }, { status: 201 });
}
