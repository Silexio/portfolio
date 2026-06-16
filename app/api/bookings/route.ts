import { NextResponse } from "next/server";
import { PACKAGES } from "@/lib/data";
import { t } from "@/lib/i18n/utils";
import { bookingSchema } from "@/lib/booking/schema";
import { isValidSlot } from "@/lib/booking/slots";
import { verifyTurnstile } from "@/lib/booking/turnstile";
import { checkRateLimit, clientIp } from "@/lib/booking/ratelimit";
import { generateRoomSlug } from "@/lib/booking/meeting";
import { getPrisma } from "@/lib/booking/prisma";
import { ownerEmail, pendingEmail } from "@/lib/booking/email";
import { sendMail } from "@/lib/booking/mailer";
import { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";

const json = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json("bad_request", 400);
  }

  // Honeypot: a filled `company` field means a bot — fake success, no side effects.
  if (raw && typeof raw === "object" && typeof (raw as { company?: unknown }).company === "string" && (raw as { company: string }).company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) return json("validation", 400);
  const data = parsed.data;

  const now = new Date();
  if (!isValidSlot(data.slotStart, now)) return json("invalid_slot", 400);

  const ip = clientIp(req.headers);
  if (!(await verifyTurnstile(data.turnstileToken, ip))) return json("captcha", 400);
  if (!(await checkRateLimit(ip, now))) return json("rate_limit", 429);

  const jitsiRoom = generateRoomSlug();
  let bookingId: string;
  try {
    const created = await getPrisma().booking.create({
      data: {
        slotStart: new Date(data.slotStart),
        name: data.name,
        email: data.email,
        phone: data.phone,
        meetingType: data.meetingType,
        message: data.message ?? null,
        locale: data.locale,
        packages: data.packages,
        jitsiRoom,
      },
      select: { id: true },
    });
    bookingId = created.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return json("slot_taken", 409);
    return json("server", 500);
  }

  const labelById = new Map<string, string>(PACKAGES.map((p) => [p.id, t(p.title, data.locale)]));
  const packageLabels = data.packages.map((id) => labelById.get(id) ?? id);

  try {
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
      );
    }
    await sendMail(
      data.email,
      pendingEmail({ name: data.name, slotIso: data.slotStart, meetingType: data.meetingType, locale: data.locale }),
    );
  } catch {
    // The booking is persisted; a mail failure must not surface as an error to the client.
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
