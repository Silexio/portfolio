import { I18N, LEAD_EMAILS } from "@/lib/data";
import { BRAND } from "@/lib/brand";
import { esc, nl2br, row, shell, type Mail } from "@/lib/booking/email";
import {
  HOURS_LABEL,
  type LeadHours,
  type LeadSource,
} from "@/lib/leads/constants";
import type { Locale } from "@/lib/i18n/config";
import { fill, t } from "@/lib/i18n/utils";

export type LeadMailData = {
  task: string;
  hours?: LeadHours;
  email: string;
  source: LeadSource;
  locale: Locale;
};

/** Notification au propriétaire, en français, avec le prospect en reply-to : répondre part directement chez lui. */
export function leadOwnerEmail(data: LeadMailData): Mail {
  const tpl = LEAD_EMAILS.owner;
  const f = tpl.fields;
  const source = LEAD_EMAILS.sources[data.source];
  const fields: [string, string][] = [
    [f.source, source],
    [f.locale, data.locale.toUpperCase()],
    [f.email, data.email],
  ];
  if (data.hours)
    fields.push([f.hours, t(I18N.lead[HOURS_LABEL[data.hours]], "fr")]);

  const html = shell(
    `<h1 style="font-size:18px;margin:0 0 16px;">${esc(tpl.heading)}</h1>
<table style="border-collapse:collapse;font-size:14px;">${fields.map(([label, value]) => row(label, esc(value))).join("")}</table>
<p style="margin:20px 0 6px;font-size:12px;color:${BRAND.muted};">${esc(f.task)}</p>
<div style="font-size:15px;line-height:1.6;">${nl2br(esc(data.task))}</div>
<p style="margin-top:24px;font-size:12px;color:${BRAND.muted};">${esc(tpl.hint)}</p>`,
  );

  const text = [
    tpl.heading,
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    `${f.task}:`,
    data.task,
    "",
    tpl.hint,
  ].join("\n");

  return {
    subject: fill(tpl.subject, { source, email: data.email }),
    html,
    text,
    replyTo: data.email,
  };
}

/** Accusé de réception au prospect. Ne reprend jamais le texte saisi : le formulaire ne doit pas pouvoir relayer du contenu arbitraire. */
export function leadAckEmail(locale: Locale): Mail {
  const tpl = LEAD_EMAILS.ack;
  const text = t(tpl.body, locale);
  return {
    subject: t(tpl.subject, locale),
    html: shell(`<div style="font-size:14px;">${nl2br(esc(text))}</div>`),
    text,
  };
}
