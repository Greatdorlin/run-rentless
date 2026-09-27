import { NextResponse } from "next/server";
import { WEBINAR_END, WEBINAR_GROUP } from "@/lib/webinar";

export const maxDuration = 60;

const API = "https://api.sender.net/v2";
const FIELD_TITLES = ["Webinar attending as", "Webinar company", "Webinar phone", "Webinar registered at"] as const;
const FIELD_NAMES: Record<(typeof FIELD_TITLES)[number], string> = {
  "Webinar attending as": "{{webinar_attending_as}}",
  "Webinar company": "{{webinar_company}}",
  "Webinar phone": "{{webinar_phone}}",
  "Webinar registered at": "{{webinar_registered_at}}",
};
type SenderField = { title: string; field_name?: string; name?: string };
type SenderGroup = { id: string; title: string };
type SenderSubscriber = { subscriber_tags?: Array<{ id?: string; title?: string }>; columns?: Array<{ title?: string; value?: unknown }> };
function asItems<T>(data: T | T[] | undefined): T[] { return Array.isArray(data) ? data : data ? [data] : []; }
function fieldItems(payload: unknown): SenderField[] {
  const found: SenderField[] = [];
  function visit(value: unknown, depth: number) {
    if (!value || depth > 5) return;
    if (Array.isArray(value)) { value.forEach((item) => visit(item, depth + 1)); return; }
    if (typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (typeof record.title === "string") {
      found.push({ title: record.title, field_name: typeof record.field_name === "string" ? record.field_name : typeof record.name === "string" ? record.name : undefined });
      return;
    }
    Object.entries(record).forEach(([key, item]) => {
      if (/^\{\{[^}]+\}\}$/.test(key) && typeof item === "string") found.push({ title: item, field_name: key });
      else if (/^\{\{[^}]+\}\}$/.test(key) && item && typeof item === "object") {
        const nested = item as Record<string, unknown>;
        if (typeof nested.title === "string") found.push({ title: nested.title, field_name: key });
      }
      else visit(item, depth + 1);
    });
  }
  visit(payload, 0);
  return found;
}
function createdFieldName(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  if (typeof record.field_name === "string") return record.field_name;
  if (typeof record.name === "string" && /^\{\{[^}]+\}\}$/.test(record.name)) return record.name;
  return Object.values(record).map(createdFieldName).find((name): name is string => Boolean(name));
}

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char); }
async function sender(token: string, path: string, init: RequestInit = {}) {
  return fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
}

async function groupId(token: string) {
  const listed = await sender(token, "/groups?limit=100");
  if (!listed.ok) throw new Error(`Group lookup ${listed.status}`);
  const groups = asItems((await listed.json() as { data?: SenderGroup[] | SenderGroup }).data);
  const found = groups.find((group) => group.title === WEBINAR_GROUP);
  if (found) return found.id;
  const created = await sender(token, "/groups", { method: "POST", body: JSON.stringify({ title: WEBINAR_GROUP }) });
  if (!created.ok) {
    const retry = await sender(token, "/groups?limit=100");
    const recovered = retry.ok ? asItems((await retry.json() as { data?: SenderGroup[] | SenderGroup }).data).find((group) => group.title === WEBINAR_GROUP) : undefined;
    if (recovered) return recovered.id;
    throw new Error(`Group creation ${created.status}`);
  }
  const data = (await created.json() as { data?: SenderGroup }).data;
  if (!data?.id) throw new Error("Group id missing");
  return data.id;
}

async function fields(token: string) {
  const found: SenderField[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await sender(token, `/fields?limit=100&page=${page}`);
    if (!response.ok) throw new Error(`Field lookup ${response.status}`);
    const payload = await response.json() as { data?: SenderField[] | SenderField; meta?: { last_page?: number }; has_more_resources?: boolean };
    const pageFields = fieldItems(payload);
    found.push(...pageFields);
    if (typeof payload.meta?.last_page === "number" ? page >= payload.meta.last_page : payload.has_more_resources !== true || pageFields.length === 0) break;
  }
  for (const title of FIELD_TITLES) {
    if (found.some((field) => field.title === title)) continue;
    const response = await sender(token, "/fields", { method: "POST", body: JSON.stringify({ title, type: "text" }) });
    if (!response.ok) {
      const retry = await sender(token, "/fields?limit=100");
      const recovered = retry.ok ? fieldItems(await retry.json()).find((field) => field.title === title) : undefined;
      if (recovered) { found.push(recovered); continue; }
      throw new Error(`Field creation ${title} ${response.status}`);
    }
    const created = await response.json();
    const field = fieldItems(created).find((item) => item.title === title) || (createdFieldName(created) ? { title, field_name: createdFieldName(created)! } : undefined);
    if (field?.field_name) { found.push({ ...field, title }); continue; }
    // Sender can accept a field without returning its name. Resolve the name
    // from the authoritative field list before writing subscriber data.
    const reread = await sender(token, "/fields?limit=100");
    const recovered = reread.ok ? fieldItems(await reread.json()).find((item) => item.title === title && item.field_name) : undefined;
    found.push(recovered || { title, field_name: FIELD_NAMES[title] });
  }
  return Object.fromEntries(FIELD_TITLES.map((title) => [title, found.find((field) => field.title === title)?.field_name || FIELD_NAMES[title]])) as Record<(typeof FIELD_TITLES)[number], string>;
}

function confirmation(firstName: string) {
  const safeName = escapeHtml(firstName);
  return {
    subject: "Your spot is confirmed: Making AI Make Business Sense",
    text: `Hi ${firstName},\n\nYou're registered for Making AI Make Business Sense.\n\nSaturday, 10 October 2026\n6PM GMT+1 · Live online\n\nWe will email joining details before the webinar. Bring someone from your team if the topic would help them too.\n\nSee you there,\nRun Rentless × Navrademy`,
    html: `<div style="margin:0 auto;max-width:580px;padding:38px 24px;font-family:Arial,sans-serif;color:#08211d;background:#f8f6ef"><p style="margin:0 0 28px;color:#e25930;font-size:12px;font-weight:bold;letter-spacing:2px">RUN RENTLESS × NAVRADEMY</p><h1 style="margin:0 0 22px;font-size:32px;line-height:1.1">Your spot is confirmed.</h1><p>Hi ${safeName},</p><p>You're registered for <strong>Making AI Make Business Sense</strong>.</p><p style="padding:20px 0;border-top:1px solid #bbc9c1;border-bottom:1px solid #bbc9c1"><strong>Saturday, 10 October 2026</strong><br>6PM GMT+1 · Live online</p><p>We will email joining details before the webinar. Bring someone from your team if the topic would help them too.</p><p>See you there,<br><strong>Run Rentless × Navrademy</strong></p><p style="margin-top:30px;font-size:12px;color:#4e655c">Questions? Reply to this email or visit <a href="https://www.runrentless.com/contact" style="color:#08211d">runrentless.com/contact</a>.</p></div>`,
  };
}

export async function POST(request: Request) {
  if (Date.now() >= WEBINAR_END) return NextResponse.json({ message: "Registration for this live webinar has closed." }, { status: 410 });
  if (Number(request.headers.get("content-length") || 0) > 5000) return NextResponse.json({ message: "Please check your details and try again." }, { status: 413 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "This request could not be verified." }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ message: "Please check your details and try again." }, { status: 400 }); }
  if (clean(body.website, 100)) return NextResponse.json({ ok: true, emailSent: false });

  const firstName = clean(body.firstName, 80);
  const email = clean(body.email, 160).toLowerCase();
  const attendingAs = clean(body.attendingAs, 20);
  const companyName = clean(body.companyName, 120);
  const phoneNumber = clean(body.phoneNumber, 32);
  const companyValid = attendingAs !== "company" || companyName.length >= 2;
  const phoneValid = /^[+()\d\s.-]{7,32}$/.test(phoneNumber) && phoneNumber.replace(/\D/g, "").length >= 7;
  if (!firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["individual", "company"].includes(attendingAs) || !companyValid || !phoneValid || body.eventConsent !== true) {
    return NextResponse.json({ message: "Please complete the required fields and confirm you can receive webinar emails." }, { status: 400 });
  }
  const token = process.env.SENDER_API;
  if (!token) return NextResponse.json({ message: "Registration is temporarily unavailable. Please try again shortly." }, { status: 503 });

  try {
    const [webinarGroupId, fieldNames] = await Promise.all([groupId(token), fields(token)]);
    const subscriberPath = `/subscribers/${encodeURIComponent(email)}`;
    const lookup = await sender(token, subscriberPath);
    if (!lookup.ok && lookup.status !== 404) throw new Error(`Subscriber lookup ${lookup.status}`);
    const existing = lookup.ok ? (await lookup.json() as { data?: SenderSubscriber }).data : undefined;
    if (existing?.subscriber_tags?.some((group) => group.id === webinarGroupId || group.title === WEBINAR_GROUP)) {
      return NextResponse.json({ ok: true, emailSent: false, alreadyRegistered: true });
    }

    const registeredAt = new Date().toISOString();
    const expected = {
      "Webinar attending as": attendingAs === "company" ? "Company" : "Individual",
      "Webinar company": attendingAs === "company" ? companyName : "Not applicable",
      "Webinar phone": phoneNumber,
      "Webinar registered at": registeredAt,
    };
    const profileFields = Object.fromEntries(FIELD_TITLES.map((title) => [fieldNames[title], expected[title]]));
    const saved = await sender(token, existing ? subscriberPath : "/subscribers", {
      method: existing ? "PATCH" : "POST",
      body: JSON.stringify({ email, firstname: firstName, fields: profileFields, trigger_automation: false }),
    });
    if (!saved.ok) throw new Error(`Subscriber save ${saved.status}`);
    const added = await sender(token, `/subscribers/groups/${encodeURIComponent(webinarGroupId)}`, { method: "POST", body: JSON.stringify({ subscribers: [email], trigger_automation: false }) });
    if (!added.ok) throw new Error(`Group membership ${added.status}`);

    const verified = await sender(token, subscriberPath);
    if (!verified.ok) throw new Error(`Subscriber verification ${verified.status}`);
    const record = (await verified.json() as { data?: SenderSubscriber }).data;
    const inGroup = record?.subscriber_tags?.some((group) => group.id === webinarGroupId || group.title === WEBINAR_GROUP);
    const storedFields = FIELD_TITLES.every((title) => record?.columns?.some((column) => column.title === title && String(column.value) === expected[title]));
    if (!inGroup || !storedFields) throw new Error("Subscriber fields or group were not retained");

    // Event properties make the registration easy to find even outside the profile view.
    const event = await sender(token, "/events", { method: "POST", body: JSON.stringify({ subscriber: { email }, type: "run_rentless_october_webinar_registration", properties: { first_name: firstName, attending_as: attendingAs, company_name: expected["Webinar company"], phone_number: expected["Webinar phone"], registered_at: registeredAt, event_consent: true } }) });
    if (!event.ok) console.error("Webinar registration event failed", event.status);

    const message = confirmation(firstName);
    const sent = await sender(token, "/message/send", { method: "POST", body: JSON.stringify({ from: { email: process.env.SENDER_FROM_EMAIL || "info@runrentless.com", name: "Run Rentless" }, to: { email, name: firstName }, ...message, headers: { charset: "utf-8" } }) });
    if (!sent.ok) { console.error("Webinar confirmation rejected", sent.status); return NextResponse.json({ ok: true, emailSent: false }, { status: 202 }); }
    const delivery = await sent.json() as { success?: boolean; emailId?: string };
    if (!delivery.success || !delivery.emailId) return NextResponse.json({ ok: true, emailSent: false }, { status: 202 });
    console.info("Webinar registration confirmed", { group: WEBINAR_GROUP, attendingAs, emailAccepted: true });
    return NextResponse.json({ ok: true, emailSent: true });
  } catch (error) {
    console.error("Webinar registration failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "We could not save your spot right now. Please try again shortly." }, { status: 502 });
  }
}
