import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeInternationalPhoneNumber } from "@/lib/phone";
import { WEBINAR_GROUP } from "@/lib/webinar";

export const maxDuration = 60;

const API = "https://api.sender.net/v2";
type Group = { id: string; title: string };
type Subscriber = {
  email?: string;
  phone?: string | null;
  firstname?: string | null;
  subscriber_tags?: Group[];
  columns?: Array<{ title?: string; value?: unknown }>;
  status?: { temail?: string; sms?: string };
};

function authorized(request: Request) {
  const expected = process.env.WEBINAR_MAINTENANCE_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (process.env.VERCEL_ENV !== "preview" || !expected || !supplied) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function sender(path: string, init: RequestInit = {}) {
  const token = process.env.SENDER_API;
  if (!token) throw new Error("Sender key missing");
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Sender ${path.split("?")[0]} returned ${response.status}`);
  return response.json();
}

async function webinarSubscribers() {
  const groups = await sender("/groups?limit=100") as { data?: Group[] };
  const webinar = groups.data?.find((group) => group.title === WEBINAR_GROUP);
  if (!webinar) throw new Error("Webinar group missing");
  const subscribers: Subscriber[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const result = await sender(`/subscribers?limit=100&page=${page}`) as {
      data?: Subscriber[];
      has_more_resources?: boolean;
      meta?: { last_page?: number };
    };
    const items = result.data || [];
    subscribers.push(...items.filter((subscriber) => subscriber.subscriber_tags?.some((group) => group.id === webinar.id)));
    if (typeof result.meta?.last_page === "number" ? page >= result.meta.last_page : !result.has_more_resources || items.length === 0) break;
  }
  return Promise.all(subscribers.map(async (subscriber) => {
    if (!subscriber.email) throw new Error("Subscriber email missing");
    const detail = await sender(`/subscribers/${encodeURIComponent(subscriber.email)}`) as { data?: Subscriber };
    if (!detail.data?.email) throw new Error("Subscriber detail missing");
    return detail.data;
  }));
}

function customPhone(subscriber: Subscriber) {
  return String(subscriber.columns?.find((column) => column.title === "Webinar phone")?.value || "").trim();
}

function profile(subscriber: Subscriber) {
  const custom = customPhone(subscriber);
  const normalized = normalizeInternationalPhoneNumber(custom);
  const current = subscriber.phone || "";
  return {
    email: subscriber.email,
    phone: current,
    webinarPhone: custom,
    eligible: Boolean(normalized && !current),
    skipped: current ? "standard-phone-already-set" : !custom ? "no-webinar-phone" : !normalized ? "invalid-or-ambiguous-country-code" : null,
    confirmationAccepted: Boolean(subscriber.columns?.find((column) => column.title === "Webinar confirmation accepted at")?.value),
    transactionalEmailStatus: subscriber.status?.temail || null,
    smsStatus: subscriber.status?.sms || null,
  };
}

export async function GET(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 404 });
  try {
    const subscribers = await webinarSubscribers();
    if (new URL(request.url).searchParams.get("diagnostics") === "1") {
      const campaigns = await sender("/transactional?limit=100") as { data?: Array<{ id: string; title?: string; subject?: string }> };
      return NextResponse.json({
        campaigns: campaigns.data?.map(({ id, title, subject }) => ({ id, title, subject })),
        phones: subscribers.map((subscriber) => ({
          email: subscriber.email,
          fields: subscriber.columns?.filter((column) => /phone/i.test(column.title || "")),
          titles: subscriber.columns?.map((column) => column.title),
        })),
      }, { headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ group: WEBINAR_GROUP, count: subscribers.length, profiles: subscribers.map(profile) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sender audit failed" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 404 });
  const body = await request.json().catch(() => null) as { action?: string } | null;
  if (body?.action !== "sync-valid-phones-v1") return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  try {
    const subscribers = await webinarSubscribers();
    const results: Array<{ email: string; status: string }> = [];
    for (const subscriber of subscribers) {
      const email = subscriber.email!;
      const normalized = normalizeInternationalPhoneNumber(customPhone(subscriber));
      if (subscriber.phone || !normalized || subscriber.status?.sms === "active") {
        results.push({ email, status: subscriber.phone ? "already-set" : subscriber.status?.sms === "active" ? "skipped-sms-status-conflict" : "skipped-invalid-or-missing" });
        continue;
      }
      const path = `/subscribers/${encodeURIComponent(email)}`;
      try {
        await sender(path, { method: "PATCH", body: JSON.stringify({ phone: normalized, sms_status: "UNSUBSCRIBED", trigger_automation: false }) });
        const verified = await sender(path) as { data?: Subscriber };
        results.push({ email, status: verified.data?.phone === normalized && verified.data?.status?.sms !== "active" ? "synced-and-verified" : "verification-failed" });
      } catch (error) {
        results.push({ email, status: error instanceof Error ? error.message : "update-failed" });
      }
    }
    return NextResponse.json({ count: subscribers.length, results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sender sync failed" }, { status: 502 });
  }
}
