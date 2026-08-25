export type IcsInput = {
  uid: string;
  start: Date;
  durationMinutes: number;
  summary: string;
  description: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

function toUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest.length > 0) chunks.push(` ${rest}`);
  return chunks.join("\r\n");
}

/**
 * Lien « Ajouter à Google Agenda » pour le même événement que le .ics — utile sur mobile, où une
 * pièce jointe passe souvent inaperçue. L'endpoint /calendar/render n'est pas documenté par Google
 * mais est stable de longue date ; le .ics reste la voie principale, ce lien n'est qu'un raccourci.
 */
export function googleCalendarUrl(input: IcsInput): string {
  const end = new Date(input.start.getTime() + input.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.summary,
    dates: `${toUtc(input.start)}/${toUtc(end)}`,
    details: input.description,
    location: input.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Génère un VEVENT iCalendar (RFC 5545) ajoutable dans tout agenda (Apple/Google/Outlook). */
export function buildIcs(input: IcsInput, stamp: Date = new Date()): string {
  const end = new Date(input.start.getTime() + input.durationMinutes * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Silexio//Booking//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeText(input.uid)}`,
    `DTSTAMP:${toUtc(stamp)}`,
    `DTSTART:${toUtc(input.start)}`,
    `DTEND:${toUtc(end)}`,
    `SUMMARY:${escapeText(input.summary)}`,
    `DESCRIPTION:${escapeText(input.description)}`,
    `LOCATION:${escapeText(input.location)}`,
    `ORGANIZER;CN=${escapeText(input.organizerName)}:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escapeText(input.attendeeName)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
