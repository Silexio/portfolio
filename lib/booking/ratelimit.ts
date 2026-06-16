import { createHmac } from "node:crypto";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const RETENTION_MS = 24 * 60 * 60 * 1000;

/** Extracts the originating client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
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
  const { getPrisma } = await import("@/lib/booking/prisma");
  const prisma = getPrisma();
  const ipHash = hashIp(ip);
  const recent = await prisma.rateLimitHit.count({
    where: { ipHash, createdAt: { gte: new Date(now.getTime() - WINDOW_MS) } },
  });
  if (recent >= MAX_PER_WINDOW) return false;
  await prisma.rateLimitHit.create({ data: { ipHash } });
  await prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - RETENTION_MS) } } });
  return true;
}
