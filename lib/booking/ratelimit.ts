import { createHmac } from "node:crypto";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const RETENTION_MS = 24 * 60 * 60 * 1000;

/** Extracts the originating client IP. Cloudflare sets CF-Connecting-IP and it cannot be spoofed. */
export function clientIp(headers: Headers): string {
  const connecting = headers.get("cf-connecting-ip")?.trim();
  if (connecting) return connecting;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "0.0.0.0";
}

/** HMAC of the IP — never store raw IPs (GDPR). */
export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error("IP_HASH_SECRET is not set");
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/** Records a hit and returns false when the IP exceeded the hourly quota. */
export async function checkRateLimit(ip: string, now: Date = new Date()): Promise<boolean> {
  const { countHits, recordHit } = await import("@/lib/booking/db");
  const ipHash = hashIp(ip);
  const windowStart = new Date(now.getTime() - WINDOW_MS).toISOString();
  if ((await countHits(ipHash, windowStart)) >= MAX_PER_WINDOW) return false;
  await recordHit(ipHash, now, new Date(now.getTime() - RETENTION_MS).toISOString());
  return true;
}
