import { randomBytes } from "node:crypto";

const JITSI_BASE = "https://meet.jit.si";
const PREFIX = "silexio";

/** Unique Jitsi room slug. The owner opens it first (authenticated) to host; guests join freely. */
export function generateRoomSlug(): string {
  return `${PREFIX}-${randomBytes(9).toString("base64url")}`;
}

/** Public meeting URL for a room slug. */
export function meetingUrl(slug: string): string {
  return `${JITSI_BASE}/${slug}`;
}
