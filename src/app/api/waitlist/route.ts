import { NextResponse } from "next/server";

const SENDER_BASE_URL = "https://api.sender.net/v2";
const GROUP_TITLE = "Run Rentless Waitlist";
const PROFILE_FIELDS = {
  company: { title: "Company", type: "text" },
  interest: { title: "Software interest", type: "text" },
  teamSize: { title: "Team size", type: "text" },
  currentSoftware: { title: "Current software", type: "text" },
  consent: { title: "Marketing consent", type: "text" },
  submittedAt: { title: "Waitlist submitted at", type: "datetime" },
} as const;

type SenderItem = { id?: string; title?: string; name?: string; field_name?: string };

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function itemsFrom(payload: unknown): SenderItem[] {
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  if (Array.isArray(data)) return data as SenderItem[];
  if (data && typeof data === "object") {
    const nested = (data as { data?: unknown }).data;
    if (Array.isArray(nested)) return nested as SenderItem[];
    if ("title" in data || "field_name" in data || "id" in data) return [data as SenderItem];
  }
  return [];
}

async function senderFetch(token: string, path: string, init: RequestInit = {}) {
  return fetch(`${SENDER_BASE_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function ensureGroup(token: string) {
  const list = await senderFetch(token, "/groups?limit=100");
  if (!list.ok) throw new Error("Sender group lookup failed");
  const existing = itemsFrom(await list.json()).find((item) => (item.title || item.name) === GROUP_TITLE);
  if (existing?.id) return existing.id;
  const created = await senderFetch(token, "/groups", { method: "POST", body: JSON.stringify({ title: GROUP_TITLE }) });
  if (!created.ok) {
    const refreshed = await senderFetch(token, "/groups?limit=100");
    const recovered = refreshed.ok ? itemsFrom(await refreshed.json()).find((item) => (item.title || item.name) === GROUP_TITLE) : undefined;
    if (recovered?.id) return recovered.id;
    throw new Error(`Sender group creation failed with ${created.status}`);
  }
  const payload = await created.json() as { data?: SenderItem };
  if (!payload.data?.id) throw new Error("Sender returned no group id");
  return payload.data.id;
}

async function ensureProfileFields(token: string) {
  const list = await senderFetch(token, "/fields");
  if (!list.ok) throw new Error(`Sender field lookup failed with ${list.status}`);
  const knownFields = itemsFrom(await list.json());
  const fieldNames: Partial<Record<keyof typeof PROFILE_FIELDS, string>> = {};

  for (const [key, definition] of Object.entries(PROFILE_FIELDS) as Array<[keyof typeof PROFILE_FIELDS, (typeof PROFILE_FIELDS)[keyof typeof PROFILE_FIELDS]]>) {
    const existing = knownFields.find((item) => item.title === definition.title);
    if (existing?.field_name) {
      fieldNames[key] = existing.field_name;
      continue;
    }

    const created = await senderFetch(token, "/fields", {
      method: "POST",
      body: JSON.stringify(definition),
    });
    if (!created.ok) {
      const details = (await created.text()).slice(0, 300);
      console.error(`Sender profile field failed: ${key} (${created.status})`, details);
      continue;
    }

    const payload = await created.json() as { data?: SenderItem };
    if (payload.data?.field_name) {
      knownFields.push(payload.data);
      fieldNames[key] = payload.data.field_name;
    }
  }

  return fieldNames;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "This submission could not be verified." }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 }); }

  if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: true });
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 160).toLowerCase();
  const company = clean(body.company, 120);
  const interest = clean(body.interest, 120);
  const teamSize = clean(body.teamSize, 30);
  const currentSoftware = clean(body.currentSoftware, 160);
  const consent = body.marketingConsent === "on" || body.marketingConsent === true;
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company || !interest || !teamSize || !consent) {
    return NextResponse.json({ message: "Please complete every required field and confirm your consent." }, { status: 400 });
  }

  const token = process.env.SENDER_API;
  if (!token) {
    console.error("Waitlist submission unavailable: SENDER_API is not configured.");
    return NextResponse.json({ message: "The waitlist is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  try {
    const [groupId, fieldNames] = await Promise.all([ensureGroup(token), ensureProfileFields(token)]);
    const submittedAt = new Date().toISOString();
    const fields = Object.fromEntries([
      fieldNames.company && [fieldNames.company, company],
      fieldNames.interest && [fieldNames.interest, interest],
      fieldNames.teamSize && [fieldNames.teamSize, teamSize],
      fieldNames.currentSoftware && [fieldNames.currentSoftware, currentSoftware || "Not provided"],
      fieldNames.consent && [fieldNames.consent, "Yes"],
      fieldNames.submittedAt && [fieldNames.submittedAt, submittedAt],
    ].filter((entry): entry is [string, string] => Boolean(entry)));
    const subscriber = { email, firstname: firstName, lastname: lastName, groups: [groupId], fields, trigger_automation: true };
    const lookup = await senderFetch(token, `/subscribers/${encodeURIComponent(email)}`);
    if (!lookup.ok && lookup.status !== 404) throw new Error("Sender subscriber lookup failed");
    const response = await senderFetch(token, lookup.ok ? `/subscribers/${encodeURIComponent(email)}` : "/subscribers", {
      method: lookup.ok ? "PATCH" : "POST", body: JSON.stringify(subscriber),
    });
    if (!response.ok) throw new Error(`Sender subscriber request failed with ${response.status}`);

    const eventResponse = await senderFetch(token, "/events", {
      method: "POST",
      body: JSON.stringify({
        subscriber: { email },
        type: "run_rentless_waitlist_submission",
        properties: {
          company,
          software_interest: interest,
          team_size: teamSize,
          current_software: currentSoftware || "Not provided",
          marketing_consent: true,
          submitted_at: submittedAt,
        },
      }),
    });
    if (!eventResponse.ok) throw new Error(`Sender waitlist event failed with ${eventResponse.status}`);
    return NextResponse.json({ ok: true, profileFieldsStored: Object.keys(fields).length });
  } catch (error) {
    console.error("Waitlist submission failed", error instanceof Error ? error.message : "Unknown Sender error");
    return NextResponse.json({ message: "We could not add you right now. Please try again in a moment." }, { status: 502 });
  }
}
