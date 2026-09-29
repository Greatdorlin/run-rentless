export const WEBINAR_START = Date.parse("2026-10-10T17:00:00.000Z");
export const WEBINAR_END = Date.parse("2026-10-10T19:00:00.000Z");
export const WEBINAR_GROUP = "October 2026 Webinar";
export const WEBINAR_WHATSAPP_URL = "https://chat.whatsapp.com/GqEqHjPIGjwK8sg6G8KBwv?mode=gi_t";

export function webinarPhase(now: number): "upcoming" | "live" | "ended" {
  if (now < WEBINAR_START) return "upcoming";
  if (now < WEBINAR_END) return "live";
  return "ended";
}
