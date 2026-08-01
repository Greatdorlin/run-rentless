import { NextResponse } from "next/server";

const SENDER_BASE_URL = "https://api.sender.net/v2";
const GROUP_TITLE = "Run Rentless Waitlist";
const FIELD_TITLES = {
  company: "Run Rentless Company",
  interest: "Run Rentless Software Interest",
  teamSize: "Run Rentless Team Size",
  currentSoftware: "Run Rentless Current Software",
} as const;

type SenderItem = { id?: string; title?: string; name?: string; field_name?: string };

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function itemsFrom(payload: unknown): SenderItem[] {
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  return Array.isArray(data) ? data as SenderItem[] : [];
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
  if (!created.ok) throw new Error("Sender group creation failed");
  const payload = await created.json() as { data?: SenderItem };
  if (!payload.data?.id) throw new Error("Sender returned no group id");
  return payload.data.id;
}

async function ensureFields(token: string) {
  const list = await senderFetch(token, "/fields?limit=100");
  if (!list.ok) throw new Error("Sender field lookup failed");
  const existing = itemsFrom(await list.json());
  const entries = await Promise.all(Object.entries(FIELD_TITLES).map(async ([key, title]) => {
    const match = existing.find((item) => item.title === title);
    if (match?.field_name) return [key, match.field_name] as const;
    const created = await senderFetch(token, "/fields", { method: "POST", body: JSON.stringify({ title, type: "text" }) });
    if (!created.ok) throw new Error("Sender field creation failed");
    const payload = await created.json() as { data?: SenderItem };
    if (!payload.data?.field_name) throw new Error("Sender returned no field name");
    return [key, payload.data.field_name] as const;
  }));
  return Object.fromEntries(entries) as Record<keyof typeof FIELD_TITLES, string>;
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
    const [groupId, fieldNames] = await Promise.all([ensureGroup(token), ensureFields(token)]);
    const subscriber = { email, firstname: firstName, lastname: lastName, groups: [groupId], fields: {
      [fieldNames.company]: company, [fieldNames.interest]: interest, [fieldNames.teamSize]: teamSize, [fieldNames.currentSoftware]: currentSoftware,
    }, trigger_automation: true };
    const lookup = await senderFetch(token, `/subscribers/${encodeURIComponent(email)}`);
    if (!lookup.ok && lookup.status !== 404) throw new Error("Sender subscriber lookup failed");
    const response = await senderFetch(token, lookup.ok ? `/subscribers/${encodeURIComponent(email)}` : "/subscribers", {
      method: lookup.ok ? "PATCH" : "POST", body: JSON.stringify(subscriber),
    });
    if (!response.ok) throw new Error(`Sender subscriber request failed with ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist submission failed", error instanceof Error ? error.message : "Unknown Sender error");
    return NextResponse.json({ message: "We could not add you right now. Please try again in a moment." }, { status: 502 });
  }
}
