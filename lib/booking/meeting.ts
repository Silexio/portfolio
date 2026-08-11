import { randomBytes } from "node:crypto";

const KMEET_BASE = "https://kmeet.infomaniak.com";
const PREFIX = "silexio";

/** Unique kMeet room slug. The room is created on first join; guests join freely. */
export function generateRoomSlug(): string {
  return `${PREFIX}-${randomBytes(9).toString("base64url")}`;
}

/** Public meeting URL for a room slug. */
export function meetingUrl(slug: string): string {
  return `${KMEET_BASE}/${slug}`;
}
