import { z } from "zod";

export type MeetingMode = "video" | "call";

/** Validation du payload du formulaire de réservation (le honeypot est traité hors schéma). */
export const bookingSchema = z.object({
  slotStart: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "invalid datetime",
  }),
  // Pas de caractère de contrôle : ce nom finit dans un sujet d'email et dans un .ics, où un
  // retour chariot ouvrirait une ligne de son choix.
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[^\p{Cc}]+$/u, { message: "invalid name" }),
  email: z.email().max(200),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .regex(/^[+0-9 ().-]+$/, { message: "invalid phone" }),
  meetingType: z.enum(["video", "call"]),
  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  locale: z.enum(["fr", "en"]).optional().default("fr"),
  turnstileToken: z.string().min(1),
});
