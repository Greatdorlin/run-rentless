import { WEBINAR_LIVE_URL } from "@/lib/webinar";

export function GET() {
  const video = WEBINAR_LIVE_URL;
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Run Rentless//Webinar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:making-ai-make-business-sense-20261010@runrentless.com",
    "DTSTAMP:20261001T000000Z",
    "DTSTART:20261010T170000Z",
    "DTEND:20261010T190000Z",
    "SUMMARY:Making AI Make Business Sense",
    `DESCRIPTION:Join live on YouTube\\n${video}`,
    `LOCATION:${video}`,
    `URL:${WEBINAR_LIVE_URL}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Webinar tomorrow. Open the event to join live.",
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Webinar starts in one hour. Open the event for the watch link.",
    "TRIGGER:-PT1H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Webinar starts in ten minutes. Open the event for the watch link.",
    "TRIGGER:-PT10M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  return new Response(event, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=making-ai-make-business-sense.ics",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
