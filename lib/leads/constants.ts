import type { ServicePageId } from "@/lib/data";

/* Sans zod : ce module est importé par le formulaire client, et le schéma n'a rien à faire dans
   le bundle du navigateur. lib/leads/schema.ts en dérive côté serveur. */

export const TASK_MIN = 20;
export const TASK_MAX = 2000;

export const LEAD_HOURS = ["lt1", "1to3", "3to10", "gt10", "unknown"] as const;
export type LeadHours = (typeof LEAD_HOURS)[number];

export function isLeadHours(value: string): value is LeadHours {
  return (LEAD_HOURS as readonly string[]).includes(value);
}

export const LEAD_SOURCES = [
  "home",
  "automation",
  "software",
  "website",
  "support",
] as const satisfies readonly ("home" | ServicePageId)[];
export type LeadSource = (typeof LEAD_SOURCES)[number];

/** Clé du libellé de chaque tranche, dans `I18N.lead` comme dans les libellés résolus du formulaire. */
export const HOURS_LABEL = {
  lt1: "hoursLt1",
  "1to3": "hours1to3",
  "3to10": "hours3to10",
  gt10: "hoursGt10",
  unknown: "hoursUnknown",
} as const satisfies Record<LeadHours, string>;
