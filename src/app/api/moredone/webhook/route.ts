import { createHmac, timingSafeEqual } from "node:crypto";
import { isMoreDoneSeats, moreDonePlans } from "@/lib/moredone";
import { markMoreDonePaid } from "@/lib/moredone-sender";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature");
  if (!key || !signature || !/^[a-f0-9]{128}$/i.test(signature)) return new Response(null, { status: 401 });
  const body = await request.text();
  if (body.length > 30000) return new Response(null, { status: 413 });
  const expected = createHmac("sha512", key).update(body).digest("hex");
  if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return new Response(null, { status: 401 });
  let event: { event?: string; data?: Record<string, unknown> };
  try { event = JSON.parse(body); } catch { return new Response(null, { status: 400 }); }
  if (event.event !== "charge.success") return Response.json({ ok: true });
  const data = event.data;
  let metadata: Record<string, unknown> | undefined;
  try { metadata = typeof data?.metadata === "string" ? JSON.parse(data.metadata) : data?.metadata as Record<string, unknown> | undefined; }
  catch { return Response.json({ ok: true }); }
  const seats = metadata?.seats;
  const reference = data?.reference;
  const customer = data?.customer;
  const email = customer && typeof customer === "object" && "email" in customer ? customer.email : undefined;
  if (metadata?.product !== "more_done_challenge" || !isMoreDoneSeats(seats) ||
    typeof reference !== "string" || !/^rrmd_[a-f0-9]{32}$/.test(reference) ||
    typeof email !== "string" || data?.status !== "success" || data?.domain !== "live" ||
    data?.currency !== "NGN" || data?.amount !== moreDonePlans[seats].amount) return Response.json({ ok: true });
  try { await markMoreDonePaid(email, reference); return Response.json({ ok: true }); }
  catch (error) {
    console.error("MoreDone webhook profile sync failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ ok: false }, { status: 500 });
  }
}
