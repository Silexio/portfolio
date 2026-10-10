import { describe, expect, it } from "vitest";
import { envelopeTarget } from "./dsn";

describe("envelopeTarget", () => {
  it("derives the envelope endpoint from a self-hosted DSN", () => {
    expect(envelopeTarget("https://abc123@sentry.silexio.be/2")).toEqual({
      url: "https://sentry.silexio.be/api/2/envelope/",
      publicKey: "abc123",
    });
  });

  it("keeps a non-default port", () => {
    expect(envelopeTarget("http://abc123@localhost:8000/7")).toEqual({
      url: "http://localhost:8000/api/7/envelope/",
      publicKey: "abc123",
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

  /* Un DSN sans clé publique est refusé par le serveur (403) sans que le navigateur l'apprenne :
     autant le dire ici, où le relais peut encore se désactiver proprement. */
  it("returns null when the DSN carries no public key", () => {
    expect(envelopeTarget("https://sentry.silexio.be/2")).toBeNull();
  });
});
