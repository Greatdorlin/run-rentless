import { isMoreDoneSeats, moreDonePlans } from "@/lib/moredone";
import { markMoreDonePaid } from "@/lib/moredone-sender";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference || !/^rrmd_[a-f0-9]{32}$/.test(reference)) return Response.json({ paid: false }, { status: 400, headers });
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return Response.json({ paid: false, error: "Verification is temporarily unavailable." }, { status: 503, headers });
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${key}` }, cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error(`Paystack verification ${response.status}`);
    const result = await response.json() as { status?: boolean; data?: Record<string, unknown> };
    const data = result.data;
    const metadata = typeof data?.metadata === "string" ? JSON.parse(data.metadata) : data?.metadata;
    const seats = metadata && typeof metadata === "object" ? metadata.seats : undefined;
    const paid = result.status === true && data?.status === "success" && data?.reference === reference &&
      (process.env.NODE_ENV !== "production" || data?.domain === "live") &&
      metadata?.product === "more_done_challenge" && isMoreDoneSeats(seats) &&
      data?.currency === "NGN" && data?.amount === moreDonePlans[seats].amount;
    if (!paid) return Response.json({ paid: false, reference }, { headers });
    const email = typeof data?.customer === "object" && data.customer && "email" in data.customer ? data.customer.email : undefined;
    let synced = false;
    if (typeof email === "string") {
      try { await markMoreDonePaid(email, reference, seats); synced = true; }
      catch (error) { console.error("MoreDone paid profile sync failed", error instanceof Error ? error.message : "Unknown error"); }
    }
    return Response.json({ paid: true, reference, seats, synced }, { headers });
  } catch {
    return Response.json({ paid: false, error: "We could not check Paystack yet. Please keep your reference and try again." }, { status: 502, headers });
  }
}
