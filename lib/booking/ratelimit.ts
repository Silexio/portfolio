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

/**
 * Ramène une adresse à ce qu'un même abonné contrôle : une IPv4 telle quelle, une IPv6 à son
 * préfixe /64. Un abonné reçoit couramment un /64 entier, soit 2^64 adresses : hacher l'adresse
 * complète rendrait le quota horaire contournable en changeant d'hôte dans son propre réseau.
 */
export function ipKey(ip: string): string {
  if (!ip.includes(":")) return ip;
  const [head, tail] = ip.split("::");
  const parts =
    tail === undefined
      ? ip.split(":")
      : (() => {
          const left = head ? head.split(":") : [];
          const right = tail ? tail.split(":") : [];
          const missing = Math.max(0, 8 - left.length - right.length);
          return [...left, ...Array<string>(missing).fill("0"), ...right];
        })();
  // Une IPv6 qui finit par une IPv4 (::ffff:198.51.100.7) désigne un hôte v4 précis : son préfixe
  // est le même pour tout le monde, c'est l'adresse v4 qui identifie.
  const last = parts[parts.length - 1];
  if (last && last.includes(".")) return last;
  const prefix = parts
    .slice(0, 4)
    .map((part) => part.toLowerCase().replace(/^0+(?=.)/, ""))
    .join(":");
  // Un préfixe entièrement nul désigne une adresse encapsulée (::ffff:c633:6407) : le préfixe est
  // le même pour tout le monde, c'est la fin de l'adresse qui identifie.
  return prefix === "0:0:0:0" ? parts.join(":").toLowerCase() : prefix;
}

/** HMAC de l'adresse — jamais d'IP en clair (RGPD). */
export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error("IP_HASH_SECRET is not set");
  return createHmac("sha256", secret).update(ipKey(ip)).digest("hex");
}

/** Records a hit and returns false when the IP exceeded the hourly quota. */
export async function checkRateLimit(
  ip: string,
  now: Date = new Date(),
): Promise<boolean> {
  const { countHits, recordHit } = await import("@/lib/booking/db");
  const ipHash = hashIp(ip);
  const windowStart = new Date(now.getTime() - WINDOW_MS).toISOString();
  if ((await countHits(ipHash, windowStart)) >= MAX_PER_WINDOW) return false;
  await recordHit(
    ipHash,
    now,
    new Date(now.getTime() - RETENTION_MS).toISOString(),
  );
  return true;
}
