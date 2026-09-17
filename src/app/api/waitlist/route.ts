import { NextResponse } from "next/server";
import { parseAudit, reportEmail, auditSummary as summarizeReport } from "@/lib/audit-report";
import { budgetRanges, deliveryPreferences, verdict } from "@/lib/audit";

export const maxDuration = 60;

const SENDER_BASE_URL = "https://api.sender.net/v2";
const GROUP_TITLE = "Run Rentless Waitlist";
const PROFILE_FIELDS = {
  company: { title: "Company", type: "text", fieldName: "{$company}" },
  interest: { title: "Software interest", type: "text", fieldName: "{$software_interest}" },
  teamSize: { title: "Team size", type: "text", fieldName: "{$team_size}" },
  currentSoftware: { title: "Current software", type: "text", fieldName: "{$current_software}" },
  consent: { title: "Marketing consent", type: "text", fieldName: "{$marketing_consent}" },
  budgetRange: { title: "Investment range", type: "text", fieldName: "{$investment_range}" },
  deliveryPreference: { title: "Preferred engagement", type: "text", fieldName: "{$preferred_engagement}" },
  auditSummary: { title: "Software audit summary", type: "text", fieldName: "{$software_audit_summary}" },
  auditPriority: { title: "Audit priority", type: "text", fieldName: "{$audit_priority}" },
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
    signal: AbortSignal.timeout(12000),
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

async function ensureGroup(token: string, title = GROUP_TITLE) {
  const list = await senderFetch(token, "/groups?limit=100");
  if (!list.ok) throw new Error("Sender group lookup failed");
  const existing = itemsFrom(await list.json()).find((item) => (item.title || item.name) === title);
  if (existing?.id) return existing.id;
  const created = await senderFetch(token, "/groups", { method: "POST", body: JSON.stringify({ title }) });
  if (!created.ok) {
    const refreshed = await senderFetch(token, "/groups?limit=100");
    const recovered = refreshed.ok ? itemsFrom(await refreshed.json()).find((item) => (item.title || item.name) === title) : undefined;
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
  if (Number(request.headers.get("content-length") || 0) > 100000) return NextResponse.json({ message: "This audit is too large. Please use up to 30 tools." }, { status: 413 });
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
  const budgetRange = budgetRanges.includes(clean(body.budgetRange, 80)) ? clean(body.budgetRange, 80) : "Not provided";
  const deliveryPreference = deliveryPreferences.includes(clean(body.deliveryPreference, 80)) ? clean(body.deliveryPreference, 80) : "Not provided";
  const audit = parseAudit(body.audit);
  const consent = body.marketingConsent === "on" || body.marketingConsent === true;
  const reportConsent = body.reportConsent === "on" || body.reportConsent === true;
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company || !interest || !teamSize || (interest === "Software Rent Audit" ? !audit || !reportConsent : !consent) || (audit && !reportConsent)) {
    return NextResponse.json({ message: "Please complete every required field and confirm your consent." }, { status: 400 });
  }

  const token = process.env.SENDER_API;
  if (!token) {
    console.error("Waitlist submission unavailable: SENDER_API is not configured.");
    return NextResponse.json({ message: "The waitlist is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  try {
    const [groupId, profileFieldSetup] = await Promise.all([ensureGroup(token, audit ? "Run Rentless Software Audits" : GROUP_TITLE), ensureProfileFields(token)]);
    const { fieldNames, diagnostics } = profileFieldSetup;
    const submittedAt = new Date().toISOString();
    const auditSummary = audit ? summarizeReport(audit) : "Not provided";
    const fields = Object.fromEntries([
      fieldNames.company && [fieldNames.company, company],
      fieldNames.interest && [fieldNames.interest, interest],
      fieldNames.teamSize && [fieldNames.teamSize, teamSize],
      fieldNames.currentSoftware && [fieldNames.currentSoftware, currentSoftware || "Not provided"],
      fieldNames.consent && [fieldNames.consent, consent ? "Yes" : "No"],
      fieldNames.budgetRange && [fieldNames.budgetRange, budgetRange],
      fieldNames.deliveryPreference && [fieldNames.deliveryPreference, deliveryPreference],
      fieldNames.auditSummary && [fieldNames.auditSummary, auditSummary],
      fieldNames.auditPriority && [fieldNames.auditPriority, audit?.priority?.name || "No clear opportunity yet"],
      fieldNames.submittedAt && [fieldNames.submittedAt, submittedAt],
    ].filter((entry): entry is [string, string] => Boolean(entry)));
    if (diagnostics.length || Object.keys(fields).length !== Object.keys(PROFILE_FIELDS).length) {
      throw new Error("Sender profile fields could not be prepared");
    }
    const subscriber = { email, firstname: firstName, lastname: lastName, groups: [groupId], fields, trigger_automation: consent };
    const lookup = await senderFetch(token, `/subscribers/${encodeURIComponent(email)}`);
    if (!lookup.ok && lookup.status !== 404) {
      console.error("Sender subscriber lookup rejected", lookup.status, (await lookup.text()).slice(0, 300));
      throw new Error("Sender subscriber lookup failed");
    }
    const response = await senderFetch(token, lookup.ok ? `/subscribers/${encodeURIComponent(email)}` : "/subscribers", {
      method: lookup.ok ? "PATCH" : "POST", body: JSON.stringify(subscriber),
    });
    if (!response.ok) throw new Error(`Sender subscriber request failed with ${response.status}`);
    // Confirm the provider actually retained the custom profile fields.
    const storedResponse = await senderFetch(token, `/subscribers/${encodeURIComponent(email)}`);
    if (!storedResponse.ok) throw new Error("Sender profile verification failed");
    const stored = await storedResponse.json() as { data?: { columns?: Array<{ title?: string; value?: unknown }> } };
    const expected = { company, interest, teamSize, currentSoftware: currentSoftware || "Not provided", consent: consent ? "Yes" : "No", budgetRange, deliveryPreference, auditSummary, auditPriority: audit?.priority?.name || "No clear opportunity yet" };
    const confirmed = Object.entries(expected).filter(([key, value]) => stored.data?.columns?.some((column) => column.title === PROFILE_FIELDS[key as keyof typeof PROFILE_FIELDS].title && String(column.value) === value));
    if (confirmed.length !== Object.keys(expected).length) throw new Error(`Sender profile verification incomplete (${confirmed.length}/${Object.keys(expected).length})`);
    console.info("Sender profile persistence verified", { fieldCount: confirmed.length });

    const eventResponse = await senderFetch(token, "/events", {
      method: "POST",
      body: JSON.stringify({
        subscriber: { email },
        type: audit ? "run_rentless_audit_submission" : "run_rentless_waitlist_submission",
        properties: {
          company,
          software_interest: interest,
          team_size: teamSize,
          current_software: currentSoftware || "Not provided",
          investment_range: budgetRange,
          preferred_engagement: deliveryPreference,
          audit_summary: auditSummary,
          audit_priority: audit?.priority?.name || "No clear opportunity yet",
          audit_report: audit ? JSON.stringify({ ...audit, recommendations: audit.tools.map((tool) => ({ name: tool.name, verdict: verdict(tool) })) }) : "Not provided",
          report_consent: reportConsent,
          marketing_consent: consent,
          submitted_at: submittedAt,
        },
      }),
    });
    if (!eventResponse.ok) throw new Error(`Sender waitlist event failed with ${eventResponse.status}`);
    if (audit) {
      const report = reportEmail(firstName, audit);
      const emailResponse = await senderFetch(token, "/message/send", {
        method: "POST",
        body: JSON.stringify({
          from: { email: process.env.SENDER_FROM_EMAIL || "info@runrentless.com", name: "Greatdorlin" },
          to: { email, name: `${firstName} ${lastName}` },
          subject: `${firstName}, your Software Rent Audit is ready`,
          text: report.text,
          html: report.html,
          headers: { charset: "utf-8" },
        }),
      });
      if (!emailResponse.ok) {
        const details = (await emailResponse.text()).slice(0, 300);
        console.error("Sender report delivery rejected", emailResponse.status, details);
        return NextResponse.json({ ok: true, reportSent: false, message: "Your audit is saved. Email delivery is temporarily unavailable. Download your full report below." }, { status: 202 });
      }
      const delivery = await emailResponse.json() as { success?: boolean; emailId?: string };
      if (!delivery.success || !delivery.emailId) return NextResponse.json({ ok: true, reportSent: false, message: "Your audit is saved. Email delivery could not be confirmed. Download your report below." }, { status: 202 });
      console.info("Sender report accepted", { emailId: delivery.emailId });
    }

    console.info("Run Rentless submission completed", { reportSent: Boolean(audit), fieldsSaved: Object.keys(fields).length, toolCount: audit?.tools.length || 0 });
    return NextResponse.json({ ok: true, reportSent: Boolean(audit) });
  } catch (error) {
    console.error("Waitlist submission failed", error instanceof Error ? error.message : "Unknown Sender error");
    return NextResponse.json({ message: "We could not add you right now. Please try again in a moment." }, { status: 502 });
  }
}
