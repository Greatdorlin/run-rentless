import { isOfferCurrency, isOfferSeats, offerAmount } from "@/lib/webinar-offer";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const error = (message: string, status: number, code?: string) => Response.json({ error: message, code }, { status, headers: noStore });

export async function POST(request: Request) {
  if (request.headers.get("origin") !== "https://www.runrentless.com" && process.env.NODE_ENV === "production") {
    return error("Please start from the offer page.", 403);
  }
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return error("Checkout is being prepared. Please try again shortly.", 503);
  let input: unknown;
  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) return error("Please check your details.", 400);
    input = await request.json();
  } catch {
    return error("Please check your details.", 400);
  }
  if (!input || typeof input !== "object") return error("Please check your details.", 400);
  const { name, email, currency, seats } = input as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100 ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !isOfferCurrency(currency) || !isOfferSeats(seats)) {
    return error("Please enter your name, email and preferred seats.", 400);
  }

  const reference = `rrlab_${crypto.randomUUID().replaceAll("-", "")}`;
  const amount = offerAmount(currency, seats);
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(), amount, currency, reference,
        callback_url: "https://www.runrentless.com/webinar-pay",
        metadata: JSON.stringify({ product: "run_rentless_ai_execution_lab", seats, customer_name: name.trim() }),
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    const result: unknown = await response.json();
    if (!response.ok || !result || typeof result !== "object") {
      return error(currency === "USD"
        ? "Dollar checkout is not available through Paystack right now. Please contact us for help with your booking."
        : "Checkout could not start. Please try again or contact us for help.", 502, "provider_rejected");
    }
    const data = (result as { status?: unknown; data?: { authorization_url?: unknown; reference?: unknown } }).data;
    const url = data?.authorization_url;
    if ((result as { status?: unknown }).status !== true) return error(currency === "USD"
      ? "Dollar checkout is not available through Paystack right now. Please contact us for help with your booking."
      : "Checkout could not start. Please try again or contact us for help.", 502, "provider_rejected");
    if (typeof url !== "string") return error("Checkout could not start. Please try again.", 502, "missing_checkout_url");
    let checkout: URL;
    try { checkout = new URL(url); } catch { return error("Checkout could not start. Please try again.", 502, "invalid_checkout_url"); }
    if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.paystack.com" || checkout.username || checkout.password) {
      return error("Checkout could not start. Please try again.", 502, "invalid_checkout_url");
    }
    if (data?.reference !== reference) return error("Checkout could not start. Please try again.", 502, "reference_mismatch");
    return Response.json({ url }, { headers: noStore });
  } catch {
    return error("Checkout could not start. Please try again.", 502, "provider_unreachable");
  }
}
