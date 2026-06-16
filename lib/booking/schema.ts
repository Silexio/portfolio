import { z } from "zod";
import { PACKAGES } from "@/lib/data";

export type MeetingMode = "video" | "call";

const PACKAGE_IDS: string[] = PACKAGES.map((p) => p.id);

/** Validation du payload du formulaire de réservation (le honeypot est traité hors schéma). */
export const bookingSchema = z.object({
  slotStart: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "invalid datetime" }),
  name: z.string().trim().min(1).max(100),
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
  packages: z
    .array(z.string())
    .max(10)
    .optional()
    .transform((arr) => (arr ?? []).filter((id) => PACKAGE_IDS.includes(id))),
  locale: z.enum(["fr", "en"]).optional().default("fr"),
  turnstileToken: z.string().min(1),
});

export type BookingInput = z.infer<typeof bookingSchema>;
