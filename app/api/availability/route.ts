import { NextResponse } from "next/server";
import { BOOKING } from "@/lib/data";
import { listBusyIntervals } from "@/lib/booking/calendar";
import { listHeldSlots } from "@/lib/booking/db";
import { isSlotBusy } from "@/lib/booking/ical";
import { groupByDay, listSlotStarts } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

export async function GET() {
  const starts = listSlotStarts(new Date());
  if (starts.length === 0) {
    return NextResponse.json({ days: [], timezone: BOOKING.timezone }, { headers: { "Cache-Control": "no-store" } });
  }

  const first = starts[0];
  const last = starts[starts.length - 1];
  // Deux sources indépendantes : les demandes déjà reçues, et l'agenda publié par le studio.
  // Chacune dégrade seule — une base morte ou un agenda injoignable ne grise rien
  // plutôt que de casser la modale.
  const [held, busy] = await Promise.all([
    listHeldSlots(first, last).catch(() => []),
    listBusyIntervals(new Date(first), new Date(Date.parse(last) + BOOKING.slotMinutes * 60_000)),
  ]);
  const taken = new Set(held);

  const days = groupByDay(starts).map((day) => ({
    day: day.day,
    slots: day.starts.map((start) => ({
      start,
      available: !taken.has(start) && !isSlotBusy(start, BOOKING.slotMinutes, busy),
    })),
  }));

  return NextResponse.json({ days, timezone: BOOKING.timezone }, { headers: { "Cache-Control": "no-store" } });
}
