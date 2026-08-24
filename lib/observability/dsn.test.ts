import { describe, expect, it } from "vitest";
import { envelopeTarget } from "./dsn";

describe("envelopeTarget", () => {
  it("derives the envelope endpoint from a self-hosted DSN", () => {
    expect(envelopeTarget("https://abc123@sentry.silexio.be/2")).toEqual({
      url: "https://sentry.silexio.be/api/2/envelope/",
    });
  });

  it("keeps a non-default port", () => {
    expect(envelopeTarget("http://abc123@localhost:8000/7")).toEqual({
      url: "http://localhost:8000/api/7/envelope/",
    });
  });

  it("returns null without a DSN", () => {
    expect(envelopeTarget(undefined)).toBeNull();
    expect(envelopeTarget("")).toBeNull();
  });

  it("returns null on a malformed DSN or a missing project id", () => {
    expect(envelopeTarget("not-a-url")).toBeNull();
    expect(envelopeTarget("https://abc123@sentry.silexio.be")).toBeNull();
  });
});
