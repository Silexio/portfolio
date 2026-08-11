import { Buffer } from "node:buffer";
import { EMAIL } from "@/lib/data";
import type { Mail } from "@/lib/booking/email";

const ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SENDER_NAME = "Silexio";

/** Sends one transactional email through the Brevo HTTP API — Workers cannot open an SMTP socket. */
export async function sendMail(to: string, mail: Mail): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !sender) throw new Error("BREVO_API_KEY and BREVO_SENDER_EMAIL must be set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: sender },
      to: [{ email: to }],
      replyTo: { name: SENDER_NAME, email: EMAIL },
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      attachment: mail.attachments?.map((file) => ({
        name: file.filename,
        content: Buffer.from(file.content, "utf8").toString("base64"),
      })),
    }),
  });

  if (!response.ok) throw new Error(`Brevo rejected the email (HTTP ${response.status})`);
}
