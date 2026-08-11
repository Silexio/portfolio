import { runBookingAction } from "@/lib/booking/actions";

export function POST(req: Request) {
  return runBookingAction("confirm", req);
}
