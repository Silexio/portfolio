import { describe, expect, it } from "vitest";
import { clientIp, hashIp, ipKey } from "@/lib/booking/ratelimit";

process.env.IP_HASH_SECRET = "test-ip-secret-0123456789abcdef0123456789ab";

describe("clientIp", () => {
  it("prefers cf-connecting-ip, which Cloudflare sets and clients cannot spoof", () => {
    const h = new Headers({
      "cf-connecting-ip": "203.0.113.9",
      "x-forwarded-for": "1.2.3.4",
    });
    expect(clientIp(h)).toBe("203.0.113.9");
  });

  it("takes the first entry of x-forwarded-for", () => {
    const h = new Headers({
      "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178",
    });
    expect(clientIp(h)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.5" }))).toBe(
      "198.51.100.5",
    );
  });

  it("falls back to 0.0.0.0 when no header is present", () => {
    expect(clientIp(new Headers())).toBe("0.0.0.0");
  });
});

describe("hashIp", () => {
  it("is deterministic and never returns the raw IP", () => {
    const a = hashIp("203.0.113.7");
    const b = hashIp("203.0.113.7");
    expect(a).toBe(b);
    expect(a).not.toContain("203.0.113.7");
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("differs for different IPs", () => {
    expect(hashIp("203.0.113.7")).not.toBe(hashIp("203.0.113.8"));
  });
});

/**
 * Le quota horaire se compte par abonné, pas par adresse : un /64 IPv6 est l'allocation courante
 * d'une seule ligne, et le parcourir ne doit pas rendre cinq envois par heure illimités.
 */
describe("ipKey", () => {
  it("laisse une IPv4 intacte", () => {
    expect(ipKey("203.0.113.9")).toBe("203.0.113.9");
  });

  it("ramène une IPv6 à son préfixe /64", () => {
    expect(ipKey("2001:0db8:85a3:0000:1319:8a2e:0370:7344")).toBe(
      "2001:db8:85a3:0",
    );
    expect(ipKey("2001:db8:85a3::8a2e:370:7334")).toBe("2001:db8:85a3:0");
  });

  it("met tout un /64 dans le même seau", () => {
    const a = ipKey("2001:db8:85a3:1::1");
    const b = ipKey("2001:db8:85a3:1:ffff:ffff:ffff:ffff");
    expect(a).toBe(b);
    expect(a).not.toBe(ipKey("2001:db8:85a3:2::1"));
  });

  it("identifie une IPv4 encapsulée par son adresse v4", () => {
    expect(ipKey("::ffff:198.51.100.7")).toBe("198.51.100.7");
  });

  it("ne met pas toutes les adresses encapsulées dans le même seau", () => {
    // Même adresse que ci-dessus, écrite en hexadécimal : le préfixe /64 y est nul pour tout le
    // monde, donc il ne peut pas servir de clé.
    expect(ipKey("::ffff:c633:6407")).not.toBe(ipKey("::ffff:c633:6408"));
  });

  it("donne la même empreinte à deux adresses du même /64", () => {
    expect(hashIp("2001:db8:1:2::5")).toBe(hashIp("2001:db8:1:2::99"));
    expect(hashIp("2001:db8:1:2::5")).not.toBe(hashIp("2001:db8:1:3::5"));
  });
});
