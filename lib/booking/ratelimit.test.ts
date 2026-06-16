import { describe, expect, it } from "vitest";
import { clientIp, hashIp } from "@/lib/booking/ratelimit";

process.env.IP_HASH_SECRET = "test-ip-secret-0123456789abcdef0123456789ab";

describe("clientIp", () => {
  it("takes the first entry of x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178" });
    expect(clientIp(h)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.5" }))).toBe("198.51.100.5");
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
