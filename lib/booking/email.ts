import { BOOKING, BOOKING_EMAILS, EMAIL, I18N } from "@/lib/data";
import { BASE_URL } from "@/lib/metadata";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";
import { formatSlotLabel } from "@/lib/booking/format";
import { buildIcs } from "@/lib/booking/ics";
import { meetingUrl } from "@/lib/booking/meeting";
import type { MeetingMode } from "@/lib/booking/schema";
import { signAction, type BookingAction } from "@/lib/booking/token";

export type MailAttachment = { filename: string; content: string; contentType: string };
export type Mail = { subject: string; html: string; text: string; attachments?: MailAttachment[] };

export type OwnerMailData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingMode;
  message?: string;
  packages: string[];
  slotIso: string;
  locale: Locale;
};

export type ClientMailData = {
  name: string;
  slotIso: string;
  meetingType: MeetingMode;
  roomSlug?: string;
  locale: Locale;
};

export type ConfirmedMailData = {
  id: string;
  name: string;
  email: string;
  slotIso: string;
  meetingType: MeetingMode;
  roomSlug?: string;
  locale: Locale;
};

export type OwnerConfirmedMailData = ConfirmedMailData & { phone: string; ownerEmail: string };

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`));
}

const nl2br = (value: string) => value.replace(/\n/g, "<br>");

function shell(inner: string): string {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f4f1ea;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;padding:28px;">${inner}</div></body></html>`;
}

function modeLabel(meetingType: MeetingMode, locale: Locale): string {
  return t(meetingType === "video" ? I18N.booking.modeVideo : I18N.booking.modeCall, locale);
}

function actionUrl(id: string, action: BookingAction, locale: Locale): string {
  const token = signAction(id, action);
  return `${BASE_URL}/${locale}/booking/${action}?id=${encodeURIComponent(id)}&token=${token}`;
}

function meetingLink(meetingType: MeetingMode, roomSlug?: string): string | undefined {
  return meetingType === "video" && roomSlug ? meetingUrl(roomSlug) : undefined;
}

type IcsTarget = {
  id: string;
  slotIso: string;
  meetingType: MeetingMode;
  roomSlug?: string;
  locale: Locale;
  attendeeName: string;
  attendeeEmail: string;
};

function bookingIcs(target: IcsTarget): MailAttachment {
  const ics = BOOKING_EMAILS.ics;
  const url = meetingLink(target.meetingType, target.roomSlug);
  const content = buildIcs({
    uid: `${target.id}@silexio.be`,
    start: new Date(target.slotIso),
    durationMinutes: BOOKING.slotMinutes,
    summary: t(ics.summary, target.locale),
    description: url ? fill(t(ics.descriptionVideo, target.locale), { url }) : t(ics.descriptionCall, target.locale),
    location: url ?? t(ics.locationCall, target.locale),
    organizerName: "Silexio",
    organizerEmail: EMAIL,
    attendeeName: target.attendeeName,
    attendeeEmail: target.attendeeEmail,
  });
  return { filename: "rendez-vous.ics", content, contentType: "text/calendar; charset=utf-8; method=PUBLISH" };
}

/** Notification to the owner with all client details and signed confirm/decline links. */
export function ownerEmail(data: OwnerMailData): Mail {
  const tpl = BOOKING_EMAILS.owner;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const mode = modeLabel(data.meetingType, data.locale);
  const packages = data.packages.join(", ");
  const subject = fill(t(tpl.subject, data.locale), { name: data.name });
  const f = tpl.fields;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:6px 0;">${value}</td></tr>`;

  const rows = [
    row(t(f.slot, data.locale), esc(slot)),
    row(t(f.mode, data.locale), esc(mode)),
    row(t(f.name, data.locale), esc(data.name)),
    row(t(f.email, data.locale), `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`),
    row(t(f.phone, data.locale), `<a href="tel:${esc(data.phone.replace(/\s/g, ""))}">${esc(data.phone)}</a>`),
    data.packages.length ? row(t(f.packages, data.locale), esc(packages)) : "",
    data.message ? row(t(f.message, data.locale), nl2br(esc(data.message))) : "",
  ].join("");

  const confirmHref = actionUrl(data.id, "confirm", data.locale);
  const refuseHref = actionUrl(data.id, "refuse", data.locale);
  const buttons = `<div style="margin-top:24px;">
<a href="${confirmHref}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#c2410c;color:#fff;text-decoration:none;font-weight:600;margin-right:8px;">${esc(t(tpl.confirm, data.locale))}</a>
<a href="${refuseHref}" style="display:inline-block;padding:12px 20px;border-radius:8px;border:1px solid #d4d0c8;color:#1a1a1a;text-decoration:none;">${esc(t(tpl.refuse, data.locale))}</a>
</div>`;

  const html = shell(
    `<h1 style="font-size:18px;margin:0 0 16px;">${esc(t(tpl.heading, data.locale))}</h1>
<table style="border-collapse:collapse;font-size:14px;">${rows}</table>
${buttons}
<p style="margin-top:20px;font-size:12px;color:#6b6b6b;">${esc(t(tpl.hint, data.locale))}</p>`,
  );

  const text = [
    t(tpl.heading, data.locale),
    "",
    `${t(f.slot, data.locale)}: ${slot}`,
    `${t(f.mode, data.locale)}: ${mode}`,
    `${t(f.name, data.locale)}: ${data.name}`,
    `${t(f.email, data.locale)}: ${data.email}`,
    `${t(f.phone, data.locale)}: ${data.phone}`,
    data.packages.length ? `${t(f.packages, data.locale)}: ${packages}` : "",
    data.message ? `${t(f.message, data.locale)}: ${data.message}` : "",
    "",
    `${t(tpl.confirm, data.locale)}: ${confirmHref}`,
    `${t(tpl.refuse, data.locale)}: ${refuseHref}`,
    "",
    t(tpl.hint, data.locale),
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject, html, text };
}

function clientMail(subject: string, text: string, linkify?: string): Mail {
  let body = nl2br(esc(text));
  if (linkify) body = body.replace(esc(linkify), `<a href="${linkify}">${linkify}</a>`);
  return { subject, html: shell(`<div style="font-size:14px;">${body}</div>`), text };
}

/** "Request received, pending confirmation" email to the client. */
export function pendingEmail(data: ClientMailData): Mail {
  const tpl = BOOKING_EMAILS.pending;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const mode = modeLabel(data.meetingType, data.locale);
  const subject = t(tpl.subject, data.locale);
  const text = fill(t(tpl.body, data.locale), { name: data.name, slot, mode });
  return clientMail(subject, text);
}

/** Confirmation email to the client, with the Jitsi link (video) or call note + an .ics invite. */
export function confirmedEmail(data: ConfirmedMailData): Mail {
  const tpl = BOOKING_EMAILS.confirmed;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const url = meetingLink(data.meetingType, data.roomSlug);
  const meetingInfo = url ? fill(t(tpl.meetingVideo, data.locale), { url }) : t(tpl.meetingCall, data.locale);
  const subject = fill(t(tpl.subject, data.locale), { slot });
  const text = fill(t(tpl.body, data.locale), { name: data.name, slot, meetingInfo });
  const mail = clientMail(subject, text, url);
  return {
    ...mail,
    attachments: [bookingIcs({ ...data, attendeeName: data.name, attendeeEmail: data.email })],
  };
}

/** Confirmation email to the owner (after they confirm), with the meeting details + an .ics invite. */
export function ownerConfirmedEmail(data: OwnerConfirmedMailData): Mail {
  const tpl = BOOKING_EMAILS.ownerConfirmed;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const url = meetingLink(data.meetingType, data.roomSlug);
  const meetingInfo = url
    ? fill(t(BOOKING_EMAILS.confirmed.meetingVideo, data.locale), { url })
    : fill(t(tpl.meetingCall, data.locale), { name: data.name });
  const subject = fill(t(tpl.subject, data.locale), { slot, name: data.name });
  const text = fill(t(tpl.body, data.locale), {
    name: data.name,
    email: data.email,
    phone: data.phone,
    slot,
    meetingInfo,
  });
  const mail = clientMail(subject, text, url);
  return {
    ...mail,
    attachments: [bookingIcs({ ...data, attendeeName: "Silexio", attendeeEmail: data.ownerEmail })],
  };
}

/** Decline email to the client; the slot is freed. */
export function refusedEmail(data: Pick<ClientMailData, "name" | "slotIso" | "locale">): Mail {
  const tpl = BOOKING_EMAILS.refused;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const subject = t(tpl.subject, data.locale);
  const text = fill(t(tpl.body, data.locale), { name: data.name, slot });
  return clientMail(subject, text);
}
