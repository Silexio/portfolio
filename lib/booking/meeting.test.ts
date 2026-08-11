import { describe, expect, it } from "vitest";
import { generateRoomSlug, meetingUrl } from "@/lib/booking/meeting";

describe("generateRoomSlug", () => {
  it("is prefixed with silexio-", () => {
    expect(generateRoomSlug().startsWith("silexio-")).toBe(true);
  });

  it("uses only URL-safe characters", () => {
    expect(generateRoomSlug()).toMatch(/^silexio-[A-Za-z0-9_-]+$/);
  });

  it("is unique across calls", () => {
    const slugs = new Set(Array.from({ length: 50 }, () => generateRoomSlug()));
    expect(slugs.size).toBe(50);
  });
});

describe("meetingUrl", () => {
  it("builds a kmeet.infomaniak.com URL", () => {
    expect(meetingUrl("silexio-abc")).toBe("https://kmeet.infomaniak.com/silexio-abc");
  });
});
