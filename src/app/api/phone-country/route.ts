import { getCountryCallingCode, isSupportedCountry, type CountryCode } from "libphonenumber-js/min";

export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() || "";
  const dialCode = /^[A-Z]{2}$/.test(country) && isSupportedCountry(country)
    ? `+${getCountryCallingCode(country as CountryCode)}`
    : "";

  return Response.json({ dialCode }, { headers: { "Cache-Control": "private, no-store" } });
}
