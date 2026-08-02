import { NextResponse } from "next/server";

const SENDER_BASE_URL = "https://api.sender.net/v2";
const GROUP_TITLE = "Run Rentless Waitlist";
const PROFILE_FIELDS = {
  company: { title: "Company", type: "text", fieldName: "{$company}" },
  interest: { title: "Software interest", type: "text", fieldName: "{$software_interest}" },
  teamSize: { title: "Team size", type: "text", fieldName: "{$team_size}" },
  currentSoftware: { title: "Current software", type: "text", fieldName: "{$current_software}" },
  consent: { title: "Marketing consent", type: "text", fieldName: "{$marketing_consent}" },
  submittedAt: { title: "Waitlist submitted at", type: "datetime", fieldName: "{$waitlist_submitted_at}" },
} as const;

type SenderItem = { id?: string; title?: string; name?: string; field_name?: string };

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function itemsFrom(payload: unknown): SenderItem[] {
  const found: SenderItem[] = [];
  const visit = (value: unknown, depth: number) => {
    if (!value || depth > 5) return;
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (
      typeof record.field_name === "string" ||
      (typeof record.title === "string" &&
        (typeof record.id === "string" || typeof record.name === "string"))
    ) {
      found.push(record as SenderItem);
      return;
    }
    Object.entries(record).forEach(([key, item]) => {
      if (/^\{\$[^}]+\}$/.test(key) && typeof item === "string") {
        found.push({ field_name: key, title: item });
      } else if (/^\{\$[^}]+\}$/.test(key) && item && typeof item === "object") {
        const field = item as Record<string, unknown>;
        found.push({
          field_name: key,
          title:
            typeof field.title === "string"
              ? field.title
              : typeof field.name === "string"
                ? field.name
                : undefined,
        });
      }
      visit(item, depth + 1);
    });
  };
  visit(payload, 0);
  return found;
}

async function senderFetch(token: string, path: string, init: RequestInit = {}) {
  return fetch(`${SENDER_BASE_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function listProfileFields(token: string) {
  const fields: SenderItem[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const response = await senderFetch(token, `/fields?limit=10&page=${page}`);
    if (!response.ok) throw new Error(`Sender field lookup failed with ${response.status}`);
    const payload = await response.json() as {
      meta?: { last_page?: number };
      has_more_resources?: boolean;
    };
    const pageFields = itemsFrom(payload);
    fields.push(...pageFields);

    const lastPage = payload.meta?.last_page;
    const reachedEnd = typeof lastPage === "number"
      ? page >= lastPage
      : payload.has_more_resources === false || pageFields.length === 0;
    if (reachedEnd) {
      break;
    }
  }

  return fields;
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
  const knownFields = await listProfileFields(token);
  const fieldNames: Partial<Record<keyof typeof PROFILE_FIELDS, string>> = {};
  const diagnostics: Array<{ key: string; status: number; details: string }> = [];

  for (const [key, definition] of Object.entries(PROFILE_FIELDS) as Array<[keyof typeof PROFILE_FIELDS, (typeof PROFILE_FIELDS)[keyof typeof PROFILE_FIELDS]]>) {
    const existing = knownFields.find(
      (item) => (item.title || item.name)?.trim().toLowerCase() === definition.title.toLowerCase(),
    );
    const existingFieldName = existing?.field_name ||
      (existing?.name?.startsWith("{$") ? existing.name : undefined);
    if (existingFieldName) {
      fieldNames[key] = existingFieldName;
      continue;
    }

    const created = await senderFetch(token, "/fields", {
      method: "POST",
      body: JSON.stringify({ title: definition.title, type: definition.type }),
    });
    if (!created.ok) {
      const details = (await created.text()).slice(0, 300);
      if (created.status === 400 && details.includes("already exists")) {
        const recovered = (await listProfileFields(token)).find(
          (item) => (item.title || item.name)?.trim().toLowerCase() === definition.title.toLowerCase(),
        );
        const recoveredFieldName = recovered?.field_name ||
          (recovered?.name?.startsWith("{$") ? recovered.name : undefined);
        if (recoveredFieldName) {
          fieldNames[key] = recoveredFieldName;
          continue;
        }
        fieldNames[key] = definition.fieldName;
        continue;
      }
      console.error(`Sender profile field failed: ${key} (${created.status})`, details);
      diagnostics.push({ key, status: created.status, details });
      continue;
    }

    const payload = await created.json();
    const createdField = itemsFrom(payload).find((item) => item.title === definition.title || Boolean(item.field_name));
    if (createdField?.field_name) {
      knownFields.push(createdField);
      fieldNames[key] = createdField.field_name;
    } else {
      fieldNames[key] = definition.fieldName;
    }
  }

  return { fieldNames, diagnostics };
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
    const [groupId, profileFieldSetup] = await Promise.all([ensureGroup(token), ensureProfileFields(token)]);
    const { fieldNames, diagnostics } = profileFieldSetup;
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
    if (diagnostics.length || Object.keys(fields).length !== Object.keys(PROFILE_FIELDS).length) {
      throw new Error(`Sender profile fields incomplete (${Object.keys(fields).length}/${Object.keys(PROFILE_FIELDS).length})`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist submission failed", error instanceof Error ? error.message : "Unknown Sender error");
    return NextResponse.json({ message: "We could not add you right now. Please try again in a moment." }, { status: 502 });
  }
}
