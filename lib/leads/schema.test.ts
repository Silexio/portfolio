import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/leads/schema";

const base = {
  task: "Chaque vendredi, on recopie les bons de livraison PDF dans Excel.",
  email: "patron@entreprise.be",
  source: "home",
  turnstileToken: "token",
};

describe("leadSchema", () => {
  it("accepts a minimal valid request and defaults the locale", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.locale).toBe("fr");
      expect(r.data.hours).toBeUndefined();
    }
  });

  it("trims the task before measuring it", () => {
    expect(
      leadSchema.safeParse({ ...base, task: "   trop court   " }).success,
    ).toBe(false);
  });

  it("caps the task length", () => {
    expect(
      leadSchema.safeParse({ ...base, task: "x".repeat(2001) }).success,
    ).toBe(false);
  });

  it("accepts only known time ranges and sources", () => {
    expect(leadSchema.safeParse({ ...base, hours: "3to10" }).success).toBe(
      true,
    );
    expect(leadSchema.safeParse({ ...base, hours: "forever" }).success).toBe(
      false,
    );
    expect(leadSchema.safeParse({ ...base, source: "support" }).success).toBe(
      true,
    );
    expect(leadSchema.safeParse({ ...base, source: "blog" }).success).toBe(
      false,
    );
  });

  it("rejects a missing captcha token or a malformed email", () => {
    expect(leadSchema.safeParse({ ...base, turnstileToken: "" }).success).toBe(
      false,
    );
    expect(
      leadSchema.safeParse({ ...base, email: "pas-un-email" }).success,
    ).toBe(false);
  });
});
