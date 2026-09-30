import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { WEBINAR_GROUP } from "@/lib/webinar";
import { normalizeInternationalPhoneNumber } from "@/lib/phone";
import { confirmation } from "@/lib/webinar-confirmation-maintenance";

export const maxDuration = 60;
type Subscriber = { email?: string; firstname?: string | null; lastname?: string | null; phone?: string | null; subscriber_tags?: Array<{ id: string; title: string }>; columns?: Array<{ title?: string; value?: unknown }>; status?: { sms?: string } };
const markerTitle = "Webinar confirmation accepted at";
function authorized(request: Request) {
  const expected = process.env.WEBINAR_MAINTENANCE_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (process.env.VERCEL_ENV !== "preview" || !expected || !supplied || Date.now() > Date.parse("2026-10-02T00:00:00Z")) return false;
  const left = Buffer.from(expected), right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}
async function sender(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.sender.net/v2${path}`, { ...init, headers: { Authorization: `Bearer ${process.env.SENDER_API}`, Accept: "application/json", "Content-Type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(15000) });
  const body = await response.text();
  if (!response.ok) throw new Error(JSON.stringify({ path: path.split("?")[0], status: response.status, retryAfter: response.headers.get("retry-after"), body: body.slice(0,1000) }));
  return JSON.parse(body);
}
function result(value: unknown, status = 200) { return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } }); }
export async function GET(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 404 });
  try {
    const url = new URL(request.url), resource = url.searchParams.get("resource") || "subscribers";
    if (resource === "subscriber") {
      const email = url.searchParams.get("email") || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return result({ error: "Invalid email" },400);
      return result(await sender(`/subscribers/${encodeURIComponent(email)}`));
    }
    if (!["subscribers", "fields", "groups"].includes(resource)) return result({ error: "Invalid resource" },400);
    return result(await sender(`/${resource}?limit=100&page=${Number(url.searchParams.get("page")) || 1}`));
  } catch(error) { return result({ error: error instanceof Error ? error.message : "Sender request failed" },502); }
}
export async function POST(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 404 });
  try {
    const body = await request.json() as { action?: string; email?: string; firstname?: string; lastname?: string; phone?: string; fields?: Record<string,string>; fieldMap?: Record<string,string>; confirmedMissing?: boolean };
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || !["repair", "send-confirmation"].includes(body.action || "")) return result({ error:"Invalid request" },400);
    const path = `/subscribers/${encodeURIComponent(body.email.toLowerCase())}`;
    const { data: subscriber } = await sender(path) as { data?: Subscriber };
    if (!subscriber?.subscriber_tags?.some(group=>group.title === WEBINAR_GROUP)) return result({ error:"Subscriber is not in webinar group" },400);
    const fieldMap = body.fieldMap || {};
    if (!fieldMap[markerTitle]) return result({ error:"Field map missing" },400);
    const retained = Object.fromEntries((subscriber.columns || []).flatMap(column=>column.title && fieldMap[column.title] && column.value != null ? [[fieldMap[column.title],String(column.value)]] : []));
    if (body.action === "repair") {
      const supplied = body.fields || {};
      if (Object.keys(supplied).some(title=>!title.startsWith("Webinar ") || !fieldMap[title])) return result({ error:"Unsupported field" },400);
      const changes: Record<string,unknown> = { fields: { ...retained, ...Object.fromEntries(Object.entries(supplied).map(([title,value])=>[fieldMap[title],value])) }, trigger_automation:false };
      if (body.firstname) changes.firstname = body.firstname;
      if (body.lastname) changes.lastname = body.lastname;
      if (body.phone) {
        const normalized = normalizeInternationalPhoneNumber(body.phone);
        if (!normalized) return result({ error:"Invalid phone" },400);
        if (subscriber.phone && normalizeInternationalPhoneNumber(subscriber.phone) !== normalized) return result({ error:"Phone conflicts with current record" },409);
        changes.phone = normalized;
        if (subscriber.status?.sms !== "active") changes.sms_status = "UNSUBSCRIBED";
      }
      await sender(path, { method:"PATCH", body:JSON.stringify(changes) });
      const checked = await sender(path) as { data?: Subscriber };
      const fieldsStored = Object.entries(supplied).every(([title,value])=>checked.data?.columns?.some(column=>column.title===title && String(column.value)===value));
      return result({ email:body.email, fieldsStored, data:checked.data });
    }
    if (!body.confirmedMissing) return result({ error:"Missing delivery audit" },400);
    if (subscriber.columns?.some(column=>column.title===markerTitle && column.value)) return result({ email:body.email, status:"already-confirmed" });
    const name = body.firstname || subscriber.firstname || String(subscriber.columns?.find(column=>column.title==="First name")?.value || "");
    if (!name) return result({ error:"Collected first name required" },400);
    const message = await sender("/message/send", { method:"POST", body:JSON.stringify({ from:{ email:process.env.SENDER_FROM_EMAIL || "info@runrentless.com",name:"Run Rentless" },to:{email:body.email,name},...confirmation(name),headers:{charset:"utf-8"} }) }) as { success?:boolean;emailId?:string };
    if (!message.success || !message.emailId) return result({ error:"Message acceptance missing",message },502);
    const acceptedAt = new Date().toISOString();
    await sender(path,{method:"PATCH",body:JSON.stringify({fields:{...retained,[fieldMap[markerTitle]]:acceptedAt},trigger_automation:false})});
    return result({ email:body.email,status:"sent",emailId:message.emailId,acceptedAt });
  } catch(error) { return result({ error:error instanceof Error ? error.message : "Sender operation failed" },502); }
}
