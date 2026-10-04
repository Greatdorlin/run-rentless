export const WEBINAR_START = Date.parse("2026-10-10T17:00:00.000Z");
export const WEBINAR_END = Date.parse("2026-10-10T19:00:00.000Z");
export const WEBINAR_GROUP = "October 2026 Webinar";
export const WEBINAR_WHATSAPP_URL = "https://chat.whatsapp.com/GqEqHjPIGjwK8sg6G8KBwv?mode=gi_t";
export const WEBINAR_LIVE_URL = "https://youtube.com/live/jYBCMZPKW3I";
export const WEBINAR_THUMBNAIL_URL = "https://i.ytimg.com/vi/jYBCMZPKW3I/maxresdefault.jpg?v=6abf18ce";
export const WEBINAR_CALENDAR_URL = "https://www.runrentless.com/webinar/event.ics";
export const WEBINAR_GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: "TEMPLATE",
  text: "Making AI Make Business Sense",
  dates: "20261010T170000Z/20261010T190000Z",
  details: `Watch the live webinar: ${WEBINAR_LIVE_URL}\n\nRun Rentless × Navrademy. Saturday, 10th October 2026 at 6PM GMT+1.`,
  location: WEBINAR_LIVE_URL,
  ctz: "Africa/Lagos",
}).toString()}`;

export function webinarPhase(now: number): "upcoming" | "live" | "ended" {
  if (now < WEBINAR_START) return "upcoming";
  if (now < WEBINAR_END) return "live";
  return "ended";
}
