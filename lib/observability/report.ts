export type StackFrame = {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
  in_app: boolean;
};

export type ReportContext = {
  eventId: string;
  timestamp: number;
  url: string;
  environment?: string;
  userAgent?: string;
};

const MAX_FRAMES = 40;
const MAX_MESSAGE_LENGTH = 1000;

/* Deux dialectes couvrent tous les navigateurs cibles :
   V8/Chromium   « at nom (https://host/f.js:12:34) » ou « at https://host/f.js:12:34 »
   SpiderMonkey/JavaScriptCore   « nom@https://host/f.js:12:34 » */
const V8 = /^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/;
const SPIDERMONKEY = /^\s*(.*?)@(.+?):(\d+):(\d+)\s*$/;

/** Parses a browser stack string into Sentry frames, oldest call first. */
export function parseStack(stack: string | undefined): StackFrame[] {
  if (!stack) return [];
  const frames: StackFrame[] = [];
  for (const line of stack.split("\n")) {
    const match = V8.exec(line) ?? SPIDERMONKEY.exec(line);
    if (!match) continue;
    const [, fn, filename, lineno, colno] = match;
    if (!filename || filename === "<anonymous>") continue;
    frames.push({
      filename,
      function: fn || "?",
      lineno: Number(lineno),
      colno: Number(colno),
      in_app: !filename.includes("/node_modules/"),
    });
  }
  return frames.slice(0, MAX_FRAMES).reverse();
}

/** Normalises anything thrown — Error, string, or an object a library rejected with. */
export function describeThrown(thrown: unknown): {
  type: string;
  value: string;
} {
  if (thrown instanceof Error)
    return {
      type: thrown.name || "Error",
      value: String(thrown.message).slice(0, MAX_MESSAGE_LENGTH),
    };
  if (typeof thrown === "string")
    return { type: "Error", value: thrown.slice(0, MAX_MESSAGE_LENGTH) };
  let value: string;
  try {
    value = JSON.stringify(thrown) ?? String(thrown);
  } catch {
    value = String(thrown);
  }
  return { type: "Error", value: value.slice(0, MAX_MESSAGE_LENGTH) };
}

/**
 * Builds a Sentry envelope (protocol v7) for one browser error, ready to POST to /monitoring.
 * Pure: identifiers, clock and page context are injected so the whole thing stays testable.
 */
export function buildEnvelope(thrown: unknown, context: ReportContext): string {
  const { type, value } = describeThrown(thrown);
  const frames = parseStack(thrown instanceof Error ? thrown.stack : undefined);
  const header = {
    event_id: context.eventId,
    sent_at: new Date(context.timestamp).toISOString(),
  };
  const event = {
    event_id: context.eventId,
    timestamp: context.timestamp / 1000,
    platform: "javascript",
    level: "error",
    logger: "browser",
    ...(context.environment && { environment: context.environment }),
    exception: {
      values: [
        { type, value, ...(frames.length && { stacktrace: { frames } }) },
      ],
    },
    request: {
      url: context.url,
      ...(context.userAgent && {
        headers: { "User-Agent": context.userAgent },
      }),
    },
  };
  return `${JSON.stringify(header)}\n${JSON.stringify({ type: "event" })}\n${JSON.stringify(event)}\n`;
}

/** Stable key for de-duplicating repeats of the same error within a page view. */
export function reportKey(thrown: unknown): string {
  const { type, value } = describeThrown(thrown);
  const top =
    thrown instanceof Error ? parseStack(thrown.stack).at(-1) : undefined;
  return `${type}|${value}|${top?.filename ?? ""}:${top?.lineno ?? ""}`;
}
