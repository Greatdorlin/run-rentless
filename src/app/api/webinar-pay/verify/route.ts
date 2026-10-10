import { isOfferCurrency, isOfferSeats, offerAmount } from "@/lib/webinar-offer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference || !/^rrlab_[a-f0-9]{32}$/.test(reference)) return Response.json({ paid: false }, { status: 400 });
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return Response.json({ paid: false, error: "Verification unavailable" }, { status: 503 });
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${key}` }, cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    const result: unknown = await response.json();
    if (!response.ok || !result || typeof result !== "object") throw new Error("Paystack unavailable");
    const data = (result as { data?: Record<string, unknown> }).data;
    const metadata = typeof data?.metadata === "string" ? JSON.parse(data.metadata) : data?.metadata;
    const currency = data?.currency;
    const seats = metadata && typeof metadata === "object" ? metadata.seats : undefined;
    const paid = data?.status === "success" && data?.reference === reference &&
      (process.env.NODE_ENV !== "production" || data?.domain === "live") &&
      metadata?.product === "run_rentless_ai_execution_lab" &&
      isOfferCurrency(currency) && isOfferSeats(seats) && data?.amount === offerAmount(currency, seats);
    return Response.json({ paid, reference, seats: paid ? seats : undefined, currency: paid ? currency : undefined }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ paid: false, error: "We could not verify this payment yet. Please try again." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
