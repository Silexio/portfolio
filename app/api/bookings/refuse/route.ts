import { runBookingAction } from "@/lib/booking/actions";

export function POST(req: Request) {
  return runBookingAction("refuse", req);
}
