import { type MoreDoneSeats, moreDonePlans } from "@/lib/moredone";
import { sendMoreDonePaymentConfirmation } from "@/lib/moredone-email";

const base = "https://api.sender.net/v2";
const groupTitle = "MoreDone Challenge";
const fieldTitles = [
  "MoreDone business", "MoreDone team size", "MoreDone project", "MoreDone project goal",
  "MoreDone seats", "MoreDone amount NGN", "MoreDone payment reference",
  "MoreDone payment status", "MoreDone submitted at",
  "MoreDone payment email accepted",
] as const;

type Field = { title?: string; field_name?: string; name?: string; id?: string };
type Subscriber = {
  firstname?: string; lastname?: string;
  columns?: Array<{ title?: string; value?: unknown }>;
  subscriber_tags?: Array<{ id?: string; title?: string }>;
};

export type MoreDoneLead = {
  firstName: string; lastName: string; email: string; company: string; teamSize: string;
  project: string; goal: string; seats: MoreDoneSeats; reference: string;
};

async function sender(path: string, init: RequestInit = {}) {
  const token = process.env.SENDER_API;
  if (!token) throw new Error("Sender configuration missing");
  return fetch(`${base}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...init.headers },
    cache: "no-store", signal: AbortSignal.timeout(12000),
  });
}

function items(value: unknown): Field[] {
  const found: Field[] = [];
  function visit(entry: unknown, depth: number) {
    if (!entry || depth > 5) return;
    if (Array.isArray(entry)) { entry.forEach((item) => visit(item, depth + 1)); return; }
    if (typeof entry !== "object") return;
    const record = entry as Record<string, unknown>;
    if (typeof record.title === "string" && (typeof record.id === "string" || typeof record.field_name === "string" || typeof record.name === "string")) {
      found.push({ ...record, field_name: typeof record.field_name === "string" ? record.field_name : typeof record.name === "string" && record.name.startsWith("{") ? record.name : undefined } as Field); return;
    }
    for (const [key, item] of Object.entries(record)) {
      if (/^\{\{?[^}]+\}\}?$/.test(key) && typeof item === "string") found.push({ title: item, field_name: key });
      else visit(item, depth + 1);
    }
  }
  visit(value, 0);
  return found;
}

async function groupId() {
  const listed = await sender("/groups?limit=100");
  if (!listed.ok) throw new Error(`Sender group lookup ${listed.status}`);
  const existing = items(await listed.json()).find((item) => item.title === groupTitle);
  if (existing?.id) return existing.id;
  const created = await sender("/groups", { method: "POST", body: JSON.stringify({ title: groupTitle }) });
  if (!created.ok) {
    const retry = await sender("/groups?limit=100");
    const recovered = retry.ok ? items(await retry.json()).find((item) => item.title === groupTitle) : undefined;
    if (recovered?.id) return recovered.id;
    throw new Error(`Sender group creation ${created.status}`);
  }
  const result = await created.json() as { data?: { id?: string } };
  if (!result.data?.id) throw new Error("Sender group id missing");
  return result.data.id;
}

async function fields() {
  const known: Field[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await sender(`/fields?limit=100&page=${page}`);
    if (!response.ok) throw new Error(`Sender field lookup ${response.status}`);
    const result = await response.json() as { meta?: { last_page?: number }; has_more_resources?: boolean };
    const pageItems = items(result);
    known.push(...pageItems);
    if (typeof result.meta?.last_page === "number" ? page >= result.meta.last_page : result.has_more_resources !== true || pageItems.length === 0) break;
  }
  for (const title of fieldTitles) {
    if (known.some((field) => field.title === title && field.field_name)) continue;
    const created = await sender("/fields", { method: "POST", body: JSON.stringify({ title, type: "text" }) });
    if (!created.ok && created.status !== 400) throw new Error(`Sender field creation ${title} ${created.status}`);
    const listed = await sender("/fields?limit=100");
    if (!listed.ok) throw new Error(`Sender field confirmation ${listed.status}`);
    const recovered = items(await listed.json()).find((field) => field.title === title && field.field_name);
    if (!recovered) throw new Error(`Sender field missing ${title}`);
    known.push(recovered);
  }
  return Object.fromEntries(known.filter((field) => field.title && field.field_name).map((field) => [field.title, field.field_name])) as Record<string, string>;
}

async function subscriber(email: string) {
  const response = await sender(`/subscribers/${encodeURIComponent(email)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Sender subscriber lookup ${response.status}`);
  return (await response.json() as { data?: Subscriber }).data;
}

function retainedFields(record: Subscriber | undefined, fieldNames: Record<string, string>) {
  return Object.fromEntries((record?.columns || []).flatMap((column) => {
    const name = column.title ? fieldNames[column.title] : undefined;
    return name && column.value != null && String(column.value).trim() ? [[name, String(column.value)]] : [];
  }));
}

export async function saveMoreDoneLead(lead: MoreDoneLead) {
  const [group, fieldNames, existing] = await Promise.all([groupId(), fields(), subscriber(lead.email)]);
  const expected: Record<(typeof fieldTitles)[number], string> = {
    "MoreDone business": lead.company,
    "MoreDone team size": lead.teamSize,
    "MoreDone project": lead.project,
    "MoreDone project goal": lead.goal || "Not provided",
    "MoreDone seats": String(lead.seats),
    "MoreDone amount NGN": String(moreDonePlans[lead.seats].amount / 100),
    "MoreDone payment reference": lead.reference,
    "MoreDone payment status": "Checkout started",
    "MoreDone submitted at": new Date().toISOString(),
    "MoreDone payment email accepted": "Not sent",
  };
  if (!fieldTitles.every((title) => fieldNames[title])) throw new Error("Sender fields unavailable");
  const groups = [...new Set([...(existing?.subscriber_tags || []).map((item) => item.id).filter((id): id is string => Boolean(id)), group])];
  const profileFields = { ...retainedFields(existing, fieldNames), ...Object.fromEntries(fieldTitles.map((title) => [fieldNames[title], expected[title]])) };
  const path = `/subscribers/${encodeURIComponent(lead.email)}`;
  const saved = await sender(existing ? path : "/subscribers", {
    method: existing ? "PATCH" : "POST",
    body: JSON.stringify({ email: lead.email, firstname: lead.firstName, lastname: lead.lastName, groups, fields: profileFields, trigger_automation: false }),
  });
  if (!saved.ok) throw new Error(`Sender subscriber save ${saved.status}`);
  const identity = await sender(path, { method: "PATCH", body: JSON.stringify({ firstname: lead.firstName, lastname: lead.lastName, fields: profileFields, trigger_automation: false }) });
  if (!identity.ok) throw new Error(`Sender name update ${identity.status}`);
  for (const delay of [0, 250, 700]) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const stored = await subscriber(lead.email);
    const correctGroup = stored?.subscriber_tags?.some((item) => item.id === group || item.title === groupTitle);
    const correctFields = fieldTitles.every((title) => stored?.columns?.some((column) => column.title === title && String(column.value) === expected[title]));
    if (correctGroup && correctFields && stored?.firstname === lead.firstName && stored?.lastname === lead.lastName) return;
  }
  throw new Error("Sender did not retain MoreDone answers");
}

export async function markMoreDonePaid(email: string, reference: string, seats: MoreDoneSeats) {
  const [record, fieldNames] = await Promise.all([subscriber(email), fields()]);
  if (!record || !record.columns?.some((column) => column.title === "MoreDone payment reference" && column.value === reference)) {
    throw new Error("MoreDone payment record missing");
  }
  const alreadyPaid = record.columns.some((column) => column.title === "MoreDone payment status" && column.value === "Paid");
  if (!alreadyPaid) {
    const updated = await sender(`/subscribers/${encodeURIComponent(email)}`, {
      method: "PATCH", body: JSON.stringify({ fields: { ...retainedFields(record, fieldNames), [fieldNames["MoreDone payment status"]]: "Paid" }, trigger_automation: false }),
    });
    if (!updated.ok) throw new Error(`Sender payment update ${updated.status}`);
  }
  const confirmed = await subscriber(email);
  if (!confirmed?.columns?.some((column) => column.title === "MoreDone payment status" && column.value === "Paid")) throw new Error("Sender payment status not retained");
  const accepted = confirmed.columns.some((column) => column.title === "MoreDone payment email accepted" && String(column.value).startsWith(`${reference}:`));
  if (accepted) return;
  const emailId = await sendMoreDonePaymentConfirmation(email, confirmed.firstname || "there", seats, reference);
  const marked = await sender(`/subscribers/${encodeURIComponent(email)}`, {
    method: "PATCH", body: JSON.stringify({ fields: { ...retainedFields(confirmed, fieldNames), [fieldNames["MoreDone payment email accepted"]]: `${reference}:${emailId}` }, trigger_automation: false }),
  });
  if (!marked.ok) throw new Error(`Sender payment email marker ${marked.status}`);
}
