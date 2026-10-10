import { z } from "zod";
import {
  LEAD_HOURS,
  LEAD_SOURCES,
  TASK_MAX,
  TASK_MIN,
} from "@/lib/leads/constants";

/** Validation du payload du formulaire « Montrez-moi la tâche » (le honeypot est traité hors schéma). */
export const leadSchema = z.object({
  task: z.string().trim().min(TASK_MIN).max(TASK_MAX),
  hours: z.enum(LEAD_HOURS).optional(),
  email: z.email().max(200),
  source: z.enum(LEAD_SOURCES),
  locale: z.enum(["fr", "en"]).optional().default("fr"),
  turnstileToken: z.string().min(1),
});

export type LeadInput = z.infer<typeof leadSchema>;
