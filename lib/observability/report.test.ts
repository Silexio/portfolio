import { describe, expect, it } from "vitest";
import {
  buildEnvelope,
  describeThrown,
  parseStack,
  reportKey,
} from "@/lib/observability/report";

const CONTEXT = {
  eventId: "0123456789abcdef0123456789abcdef",
  timestamp: 1_767_225_600_000,
  url: "https://silexio.be/fr",
  environment: "production",
  userAgent: "Mozilla/5.0",
};

describe("parseStack", () => {
  it("reads the V8 form, with and without a function name", () => {
    const frames = parseStack(
      [
        "TypeError: x is not a function",
        "    at handleClick (https://silexio.be/_next/static/chunks/a.js:12:34)",
        "    at https://silexio.be/_next/static/chunks/b.js:56:78",
      ].join("\n"),
    );
    expect(frames).toHaveLength(2);
    // Sentry orders frames oldest first, so the deepest call ends up last.
    expect(frames.at(-1)).toMatchObject({
      filename: "https://silexio.be/_next/static/chunks/a.js",
      function: "handleClick",
      lineno: 12,
      colno: 34,
    });
    expect(frames[0]).toMatchObject({ function: "?", lineno: 56, colno: 78 });
  });

  it("reads the SpiderMonkey/JavaScriptCore form", () => {
    const frames = parseStack(
      [
        "boot@https://silexio.be/app.js:3:9",
        "@https://silexio.be/app.js:1:1",
      ].join("\n"),
    );
    expect(frames).toHaveLength(2);
    expect(frames.at(-1)).toMatchObject({ function: "boot", lineno: 3 });
  });

  it("drops the message line and anonymous frames", () => {
    expect(
      parseStack(
        "Error: boom\n    at <anonymous>:1:1\n    at fn (https://a/b.js:2:3)",
      ),
    ).toEqual([
      {
        filename: "https://a/b.js",
        function: "fn",
        lineno: 2,
        colno: 3,
        in_app: true,
      },
    ]);
  });

  it("marks node_modules frames as out of app", () => {
    const [frame] = parseStack(
      "    at x (https://a/node_modules/lib/i.js:1:1)",
    );
    expect(frame.in_app).toBe(false);
  });

  it("returns nothing for a missing or unparsable stack", () => {
    expect(parseStack(undefined)).toEqual([]);
    expect(parseStack("no frames here")).toEqual([]);
  });

  it("caps very deep stacks", () => {
    const deep = Array.from(
      { length: 200 },
      (_, i) => `    at f${i} (https://a/b.js:${i + 1}:1)`,
    ).join("\n");
    expect(parseStack(deep).length).toBe(40);
  });
});

describe("describeThrown", () => {
  it("keeps the error name and message", () => {
    expect(describeThrown(new TypeError("nope"))).toEqual({
      type: "TypeError",
      value: "nope",
    });
  });

  it("handles a thrown string", () => {
    expect(describeThrown("plain")).toEqual({ type: "Error", value: "plain" });
  });

  it("serialises a thrown object", () => {
    expect(describeThrown({ code: 42 })).toEqual({
      type: "Error",
      value: '{"code":42}',
    });
  });

  it("survives an object that cannot be serialised", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(describeThrown(cyclic).type).toBe("Error");
  });

  it("truncates a very long message", () => {
    expect(describeThrown(new Error("x".repeat(5000))).value.length).toBe(1000);
  });
});

describe("buildEnvelope", () => {
  it("emits the three envelope lines expected by the Sentry protocol", () => {
    const lines = buildEnvelope(new Error("boom"), CONTEXT)
      .trimEnd()
      .split("\n");
    expect(lines).toHaveLength(3);
    expect(JSON.parse(lines[0])).toEqual({
      event_id: CONTEXT.eventId,
      sent_at: "2026-01-01T00:00:00.000Z",
    });
    expect(JSON.parse(lines[1])).toEqual({ type: "event" });
  });

  it("carries the exception and the page context", () => {
    const event = JSON.parse(
      buildEnvelope(new TypeError("nope"), CONTEXT).split("\n")[2],
    );
    expect(event.exception.values[0]).toMatchObject({
      type: "TypeError",
      value: "nope",
    });
    expect(event.timestamp).toBe(CONTEXT.timestamp / 1000);
    expect(event.request.url).toBe(CONTEXT.url);
    expect(event.environment).toBe("production");
    expect(event.level).toBe("error");
  });

  it("omits the stacktrace when there is none rather than sending an empty one", () => {
    const event = JSON.parse(
      buildEnvelope("string thrown", CONTEXT).split("\n")[2],
    );
    expect(event.exception.values[0].stacktrace).toBeUndefined();
  });

  it("omits environment and user-agent when unknown", () => {
    const event = JSON.parse(
      buildEnvelope(new Error("x"), {
        eventId: CONTEXT.eventId,
        timestamp: CONTEXT.timestamp,
        url: CONTEXT.url,
      }).split("\n")[2],
    );
    expect(event.environment).toBeUndefined();
    expect(event.request.headers).toBeUndefined();
  });
});

describe("reportKey", () => {
  it("matches two throws of the same error from the same place", () => {
    const make = () => {
      const e = new Error("same");
      e.stack = "Error: same\n    at f (https://a/b.js:1:2)";
      return e;
    };
    expect(reportKey(make())).toBe(reportKey(make()));
  });

  it("separates different messages", () => {
    expect(reportKey(new Error("a"))).not.toBe(reportKey(new Error("b")));
  });
});
