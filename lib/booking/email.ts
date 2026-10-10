import { BRAND } from "@/lib/brand";
import { BOOKING, BOOKING_EMAILS, EMAIL, I18N } from "@/lib/data";
import { BASE_URL } from "@/lib/metadata";
import type { Locale } from "@/lib/i18n/config";
import { fill, t } from "@/lib/i18n/utils";
import { formatSlotLabel } from "@/lib/booking/format";
import {
  buildIcs,
  googleCalendarUrl,
  type IcsInput,
  type IcsStatus,
} from "@/lib/booking/ics";
import { meetingUrl } from "@/lib/booking/meeting";
import type { MeetingMode } from "@/lib/booking/schema";
import { signAction, type BookingAction } from "@/lib/booking/token";

export type MailAttachment = {
  filename: string;
  content: string;
  contentType: string;
};
export type Mail = {
  subject: string;
  html: string;
  text: string;
  /** Adresse de réponse. Absente = l'adresse de contact publique. */
  replyTo?: string;
  attachments?: MailAttachment[];
};

export type OwnerMailData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingMode;
  message?: string;
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

export type OwnerConfirmedMailData = ConfirmedMailData & { phone: string };

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const nl2br = (value: string) => value.replace(/\n/g, "<br>");

/** Ligne d'un tableau d'email ; `value` est inséré tel quel, donc déjà échappé par l'appelant. */
export const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:${BRAND.muted};vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:6px 0;">${value}</td></tr>`;

export function shell(inner: string): string {
  return `<!doctype html><html lang="en"><body style="margin:0;background:${BRAND.bg};padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.text};line-height:1.5;">
<div style="max-width:560px;margin:0 auto;background:${BRAND.raised};border-radius:14px;padding:28px;">${inner}</div></body></html>`;
}

const BUTTON =
  "display:inline-block;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;margin:0 8px 8px 0;";

/** Lien d'email : les clients mail n'heritent d'aucune feuille de style, la couleur se pose a la main. */
function mailLink(href: string, label: string): string {
  return `<a href="${esc(href)}" style="color:${BRAND.accent};">${esc(label)}</a>`;
}

/** Bouton d'email : un `<a>` style en ligne, la seule forme de bouton que tous les clients mail rendent. */
function mailButton(
  href: string,
  label: string,
  tone: "accent" | "ghost" = "accent",
): string {
  const skin =
    tone === "accent"
      ? `background:${BRAND.accent};color:${BRAND.onAccent};border-left:3px solid ${BRAND.spark};`
      : `border:1px solid ${BRAND.border};color:${BRAND.heading};`;
  return `<a href="${esc(href)}" style="${BUTTON}${skin}">${esc(label)}</a>`;
}

function modeLabel(meetingType: MeetingMode, locale: Locale): string {
  return t(
    meetingType === "video" ? I18N.booking.modeVideo : I18N.booking.modeCall,
    locale,
  );
}

function actionUrl(id: string, action: BookingAction, locale: Locale): string {
  const token = signAction(id, action);
  return `${BASE_URL}/${locale}/booking/${action}?id=${encodeURIComponent(id)}&token=${token}`;
}

function meetingLink(
  meetingType: MeetingMode,
  roomSlug?: string,
): string | undefined {
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
  /** Titre vu dans l'agenda du destinataire ; par defaut celui du client. */
  summary?: string;
  /** Ajoute a la description : les coordonnees du client dans l'agenda du proprietaire. */
  contact?: string;
  status?: IcsStatus;
  sequence?: number;
};

function calendarEvent(target: IcsTarget): IcsInput {
  const ics = BOOKING_EMAILS.ics;
  const url = meetingLink(target.meetingType, target.roomSlug);
  const video = target.meetingType === "video";
  const detail = url
    ? fill(t(ics.descriptionVideo, target.locale), { url })
    : t(
        video ? ics.descriptionVideoPending : ics.descriptionCall,
        target.locale,
      );
  return {
    uid: `${target.id}@silexio.be`,
    start: new Date(target.slotIso),
    durationMinutes: BOOKING.slotMinutes,
    summary: target.summary ?? t(ics.summary, target.locale),
    description: target.contact ? `${detail}\n${target.contact}` : detail,
    location:
      url ?? t(video ? ics.locationVideo : ics.locationCall, target.locale),
    organizerName: "Silexio",
    organizerEmail: EMAIL,
    attendeeName: target.attendeeName,
    attendeeEmail: target.attendeeEmail,
    status: target.status,
    sequence: target.sequence,
  };
}

/** Invitation pour l'agenda du proprietaire : le client en participant, ses coordonnees dans la description. */
function ownerEvent(
  data: Pick<
    OwnerMailData,
    "id" | "name" | "email" | "phone" | "meetingType" | "slotIso" | "locale"
  > & { roomSlug?: string; pending: boolean },
): IcsInput {
  const ics = BOOKING_EMAILS.ics;
  return calendarEvent({
    id: data.id,
    slotIso: data.slotIso,
    meetingType: data.meetingType,
    roomSlug: data.roomSlug,
    locale: data.locale,
    attendeeName: data.name,
    attendeeEmail: data.email,
    summary: fill(
      t(data.pending ? ics.ownerSummaryPending : ics.ownerSummary, data.locale),
      { name: data.name },
    ),
    contact: `${data.email} \u00b7 ${data.phone}`,
    status: data.pending ? "TENTATIVE" : "CONFIRMED",
    sequence: data.pending ? 0 : 1,
  });
}

function bookingIcs(event: IcsInput): MailAttachment {
  return {
    filename: "rendez-vous.ics",
    content: buildIcs(event),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };
}

/** Notification to the owner with all client details and signed confirm/decline links. */
export function ownerEmail(data: OwnerMailData): Mail {
  const tpl = BOOKING_EMAILS.owner;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const mode = modeLabel(data.meetingType, data.locale);
  const subject = fill(t(tpl.subject, data.locale), { name: data.name });
  const f = tpl.fields;

  const rows = [
    row(t(f.slot, data.locale), esc(slot)),
    row(t(f.mode, data.locale), esc(mode)),
    row(t(f.name, data.locale), esc(data.name)),
    row(t(f.email, data.locale), mailLink(`mailto:${data.email}`, data.email)),
    row(
      t(f.phone, data.locale),
      mailLink(`tel:${data.phone.replace(/\s/g, "")}`, data.phone),
    ),
    data.message
      ? row(t(f.message, data.locale), nl2br(esc(data.message)))
      : "",
  ].join("");

  const confirmHref = actionUrl(data.id, "confirm", data.locale);
  const refuseHref = actionUrl(data.id, "refuse", data.locale);
  const buttons = `<div style="margin-top:24px;">${mailButton(confirmHref, t(tpl.confirm, data.locale))}${mailButton(refuseHref, t(tpl.refuse, data.locale), "ghost")}</div>`;

  const html = shell(
    `<h1 style="font-size:18px;margin:0 0 16px;">${esc(t(tpl.heading, data.locale))}</h1>
<table style="border-collapse:collapse;font-size:14px;">${rows}</table>
${buttons}
<p style="margin-top:20px;font-size:12px;color:${BRAND.muted};">${nl2br(esc(t(tpl.hint, data.locale)))}</p>`,
  );

  const text = [
    t(tpl.heading, data.locale),
    "",
    `${t(f.slot, data.locale)}: ${slot}`,
    `${t(f.mode, data.locale)}: ${mode}`,
    `${t(f.name, data.locale)}: ${data.name}`,
    `${t(f.email, data.locale)}: ${data.email}`,
    `${t(f.phone, data.locale)}: ${data.phone}`,
    data.message ? `${t(f.message, data.locale)}: ${data.message}` : "",
    "",
    `${t(tpl.confirm, data.locale)}: ${confirmHref}`,
    `${t(tpl.refuse, data.locale)}: ${refuseHref}`,
    "",
    t(tpl.hint, data.locale),
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject,
    html,
    text,
    attachments: [bookingIcs(ownerEvent({ ...data, pending: true }))],
  };
}

type MailLink = { url: string; label?: string; button?: boolean };

function clientMail(
  subject: string,
  text: string,
  links: MailLink[] = [],
): Mail {
  let body = nl2br(esc(text));
  for (const { url, label, button } of links) {
    const anchor = button
      ? mailButton(url, label ?? url)
      : mailLink(url, label ?? url);
    body = body.replace(esc(url), () => anchor);
  }
  return {
    subject,
    html: shell(`<div style="font-size:14px;">${body}</div>`),
    text,
  };
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

/** Confirmation email to the client, with the kMeet link (video) or call note + an .ics invite. */
export function confirmedEmail(data: ConfirmedMailData): Mail {
  const tpl = BOOKING_EMAILS.confirmed;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const url = meetingLink(data.meetingType, data.roomSlug);
  const meetingInfo = url
    ? fill(t(tpl.meetingVideo, data.locale), { url })
    : t(tpl.meetingCall, data.locale);
  const event = calendarEvent({
    ...data,
    attendeeName: data.name,
    attendeeEmail: data.email,
  });
  const calendarUrl = googleCalendarUrl(event);
  const calendar = fill(t(tpl.calendar, data.locale), { url: calendarUrl });
  const subject = fill(t(tpl.subject, data.locale), { slot });
  const text = fill(t(tpl.body, data.locale), {
    name: data.name,
    slot,
    meetingInfo,
    calendar,
  });
  const links: MailLink[] = [
    {
      url: calendarUrl,
      label: t(tpl.calendarLabel, data.locale),
      button: true,
    },
  ];
  if (url) links.unshift({ url });
  return {
    ...clientMail(subject, text, links),
    attachments: [bookingIcs(event)],
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
  const event = ownerEvent({ ...data, pending: false });
  const calendarUrl = googleCalendarUrl(event);
  const calendar = fill(t(BOOKING_EMAILS.confirmed.calendar, data.locale), {
    url: calendarUrl,
  });
  const subject = fill(t(tpl.subject, data.locale), { slot, name: data.name });
  const text = fill(t(tpl.body, data.locale), {
    name: data.name,
    email: data.email,
    phone: data.phone,
    slot,
    meetingInfo,
    calendar,
  });
  const links: MailLink[] = [
    {
      url: calendarUrl,
      label: t(BOOKING_EMAILS.confirmed.calendarLabel, data.locale),
      button: true,
    },
  ];
  if (url) links.unshift({ url });
  return {
    ...clientMail(subject, text, links),
    attachments: [bookingIcs(event)],
  };
}

/** Decline email to the client; the slot is freed. */
export function refusedEmail(
  data: Pick<ClientMailData, "name" | "slotIso" | "locale">,
): Mail {
  const tpl = BOOKING_EMAILS.refused;
  const slot = formatSlotLabel(data.slotIso, data.locale);
  const subject = t(tpl.subject, data.locale);
  const text = fill(t(tpl.body, data.locale), { name: data.name, slot });
  return clientMail(subject, text);
}
