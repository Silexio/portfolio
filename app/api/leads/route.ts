import { reportServerError } from "@/lib/observability/server";
import { isHoneypotFilled, jsonAccepted, jsonError } from "@/lib/forms";
import { ownerAddress, sendMail, sendMailOrReport } from "@/lib/booking/mailer";
import { checkRateLimit, clientIp } from "@/lib/booking/ratelimit";
import { verifyTurnstile } from "@/lib/booking/turnstile";
import { leadAckEmail, leadOwnerEmail } from "@/lib/leads/email";
import { leadSchema } from "@/lib/leads/schema";

/* Rien n'est stocké : l'email au propriétaire est la seule trace de la demande. S'il échoue, le
   prospect doit le savoir (502) plutôt que de croire sa demande partie — l'accusé de réception,
   lui, reste best-effort. */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError("bad_request", 400);
  }

  if (isHoneypotFilled(raw)) return jsonAccepted();

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) return jsonError("validation", 400);
  const data = parsed.data;

  const ip = clientIp(req.headers);
  if (!(await verifyTurnstile(data.turnstileToken, ip)))
    return jsonError("captcha", 400);
  if (!(await checkRateLimit(ip))) return jsonError("rate_limit", 429);

  try {
    await sendMail(ownerAddress(), leadOwnerEmail(data));
  } catch (error) {
    reportServerError(error, "lead-owner-mail");
    return jsonError("server", 502);
  }
  await sendMailOrReport(data.email, leadAckEmail(data.locale), "lead-ack");

  return jsonAccepted();
}
