import { parsePhoneNumberFromString } from "libphonenumber-js/min";

/** Require an explicit country code and store Sender's canonical international format. */
export function normalizeInternationalPhoneNumber(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const input = value.trim();
  if (!/^\+[\d\s().-]{7,31}$/.test(input)) return null;
  const parsed = parsePhoneNumberFromString(input);
  return parsed?.isValid() ? parsed.number : null;
}
