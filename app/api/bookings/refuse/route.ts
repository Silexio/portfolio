import { runBookingAction } from "@/lib/booking/actions";

export const runtime = "nodejs";

export function POST(req: Request) {
  return runBookingAction("refuse", req);
}
