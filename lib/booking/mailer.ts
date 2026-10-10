import { Buffer } from "node:buffer";
import { EMAIL } from "@/lib/data";
import { reportServerError } from "@/lib/observability/server";
import type { Mail } from "@/lib/booking/email";

const ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SENDER_NAME = "Silexio";

/** Plus large que les 4 s de l’agenda : un envoi porte une pièce jointe, et son échec coûte
 *  une notification perdue ou un 502 au prospect. */
const TIMEOUT_MS = 10_000;

/**
 * Adresse qui reçoit les notifications du studio. Le repli sur l'adresse publique est le point
 * important : sans lui, une variable d'environnement oubliée fait disparaître la notification
 * d'une réservation sans la moindre erreur — la demande est enregistrée, et personne ne la voit.
 */
export const ownerAddress = () => process.env.BOOKING_NOTIFY_EMAIL || EMAIL;

/** Sends one transactional email through the Brevo HTTP API — Workers cannot open an SMTP socket. */
export async function sendMail(to: string, mail: Mail): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !sender)
    throw new Error("BREVO_API_KEY and BREVO_SENDER_EMAIL must be set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: sender },
      to: [{ email: to }],
      replyTo: { email: mail.replyTo ?? EMAIL },
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      attachment: mail.attachments?.map((file) => ({
        name: file.filename,
        content: Buffer.from(file.content, "utf8").toString("base64"),
      })),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok)
    throw new Error(`Brevo rejected the email (HTTP ${response.status})`);
}

/**
 * Envoie un email dont l'échec ne doit pas faire échouer la requête — mais ne doit pas passer
 * inaperçu non plus : une réservation enregistrée dont la notification s'est perdue est un
 * rendez-vous que personne ne voit arriver. L'erreur part donc vers Bugsink.
 */
export async function sendMailOrReport(
  to: string,
  mail: Mail,
  context: string,
): Promise<void> {
  try {
    await sendMail(to, mail);
  } catch (error) {
    reportServerError(error, `mail:${context}`);
  }
}
