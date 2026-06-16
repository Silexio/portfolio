import { beforeAll, describe, expect, it } from "vitest";
import { signAction, verifyAction } from "@/lib/booking/token";

beforeAll(() => {
  process.env.BOOKING_ACTION_SECRET = "test-secret-0123456789abcdef0123456789abcdef";
});

const ID = "ckxyz123";

describe("signAction / verifyAction", () => {
  it("round-trips a valid token", () => {
    expect(verifyAction(ID, "confirm", signAction(ID, "confirm"))).toBe(true);
    expect(verifyAction(ID, "refuse", signAction(ID, "refuse"))).toBe(true);
  });

  it("rejects a token for a different action", () => {
    expect(verifyAction(ID, "refuse", signAction(ID, "confirm"))).toBe(false);
  });

  it("rejects a token for a different id", () => {
    expect(verifyAction("other", "confirm", signAction(ID, "confirm"))).toBe(false);
  });

  it("rejects a tampered token", () => {
    const t = signAction(ID, "confirm");
    const tampered = `${t.slice(0, -1)}${t.endsWith("0") ? "1" : "0"}`;
    expect(verifyAction(ID, "confirm", tampered)).toBe(false);
  });

  it("rejects non-hex and empty tokens", () => {
    expect(verifyAction(ID, "confirm", "not-hex!!")).toBe(false);
    expect(verifyAction(ID, "confirm", "")).toBe(false);
  });

  it("produces distinct tokens per action", () => {
    expect(signAction(ID, "confirm")).not.toBe(signAction(ID, "refuse"));
  });
});
