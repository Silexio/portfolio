import { NextResponse } from "next/server";
import { BOOKING } from "@/lib/data";
import { groupByDay, listSlotStarts } from "@/lib/booking/slots";
import { getPrisma } from "@/lib/booking/prisma";
import { BookingStatus } from "@/generated/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const starts = listSlotStarts(new Date());
  const taken = new Set<string>();

  if (starts.length > 0) {
    try {
      const prisma = getPrisma();
      const rows = await prisma.booking.findMany({
        where: {
          slotStart: { gte: new Date(starts[0]), lte: new Date(starts[starts.length - 1]) },
          status: { in: [BookingStatus.pending, BookingStatus.confirmed] },
        },
        select: { slotStart: true },
      });
      for (const row of rows) taken.add(row.slotStart.toISOString());
    } catch {
      // DB unavailable → expose all slots as available; the POST handler still guards against races.
    }
  }

  const days = groupByDay(starts).map((day) => ({
    day: day.day,
    slots: day.starts.map((start) => ({ start, available: !taken.has(start) })),
  }));

  return NextResponse.json({ days, timezone: BOOKING.timezone }, { headers: { "Cache-Control": "no-store" } });
}
