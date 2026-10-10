import { isOfferCurrency, isOfferSeats, offerAmount } from "@/lib/webinar-offer";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const error = (message: string, status: number) => Response.json({ error: message }, { status, headers: noStore });

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
    if (!response.ok || !result || typeof result !== "object") return error("Checkout could not start. Please try again.", 502);
    const data = (result as { status?: unknown; data?: { authorization_url?: unknown; reference?: unknown } }).data;
    const url = data?.authorization_url;
    if ((result as { status?: unknown }).status !== true || typeof url !== "string" ||
        !/^https:\/\/checkout\.paystack\.com\/[a-zA-Z0-9]+$/.test(url) || data?.reference !== reference) {
      return error("Checkout could not start. Please try again.", 502);
    }
    return Response.json({ url }, { headers: noStore });
  } catch {
    return error("Checkout could not start. Please try again.", 502);
  }
}
