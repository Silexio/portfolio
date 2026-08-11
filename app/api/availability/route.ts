import { NextResponse } from "next/server";
import { BOOKING } from "@/lib/data";
import { listHeldSlots } from "@/lib/booking/db";
import { groupByDay, listSlotStarts } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

export async function GET() {
  const starts = listSlotStarts(new Date());
  // A dead database greys out nothing rather than breaking the modal.
  const held =
    starts.length > 0 ? await listHeldSlots(starts[0], starts[starts.length - 1]).catch(() => []) : [];
  const taken = new Set(held);

  const days = groupByDay(starts).map((day) => ({
    day: day.day,
    slots: day.starts.map((start) => ({ start, available: !taken.has(start) })),
  }));

  return NextResponse.json({ days, timezone: BOOKING.timezone }, { headers: { "Cache-Control": "no-store" } });
}
