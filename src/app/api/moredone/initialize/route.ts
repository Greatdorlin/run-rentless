import { cleanMoreDoneText, isMoreDoneNairaSeats, isMoreDoneSeats, moreDonePlans, moreDonePrice, moreDoneProjects, type MoreDoneCountry } from "@/lib/moredone";
import { saveMoreDoneCheckoutUrl, saveMoreDoneLead } from "@/lib/moredone-sender";
import { sendMoreDoneCheckoutLink } from "@/lib/moredone-email";
import { readPublicForm } from "@/lib/public-form-request";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const headers = { "Cache-Control": "no-store" };
const fail = (message: string, status: number) => Response.json({ error: message }, { status, headers });

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && request.headers.get("origin") !== "https://www.runrentless.com") {
    return fail("Please start from the MoreDone page.", 403);
  }
  const parsed = await readPublicForm(request, 5000);
  if (parsed.status) return fail(parsed.message || "Please check your details.", parsed.status);
  const body = parsed.body;
  if (cleanMoreDoneText(body.companyWebsite, 100)) return fail("Please try again.", 400);
  const firstName = cleanMoreDoneText(body.firstName, 80);
  const lastName = cleanMoreDoneText(body.lastName, 80);
  const email = cleanMoreDoneText(body.email, 160).toLowerCase();
  const company = cleanMoreDoneText(body.company, 120);
  const teamSize = cleanMoreDoneText(body.teamSize, 30);
  const project = cleanMoreDoneText(body.project, 80);
  const goal = cleanMoreDoneText(body.goal, 400);
  const seats = body.seats;
  const paymentCountry: MoreDoneCountry = body.paymentCountry === "rw" || body.paymentCountry === "other" ? body.paymentCountry
    : body.paymentCountry === "ng" ? "ng" : body.paymentRegion === "international" ? "other" : "ng";
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company ||
    !moreDoneProjects.includes(project as (typeof moreDoneProjects)[number]) || !isMoreDoneSeats(seats) || body.consent !== true) {
    return fail("Please complete the required details and agree to receive course updates.", 400);
  }
  if (paymentCountry === "ng" && !isMoreDoneNairaSeats(seats)) return fail("Choose one, three or five places for naira checkout.", 400);
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!process.env.SENDER_API || (paymentCountry === "ng" && !key)) return fail("Registration is temporarily unavailable. Please try again shortly.", 503);
  const reference = `rrmd_${crypto.randomUUID().replaceAll("-", "")}`;
  try {
    await saveMoreDoneLead({ firstName, lastName, email, company, teamSize: teamSize || "Not shared", project, goal, seats, reference, paymentCountry });
  } catch (error) {
    console.error("MoreDone Sender sync failed", error instanceof Error ? error.message : "Unknown error");
    return fail("We could not save your details. Please try again before paying.", 502);
  }
  if (paymentCountry !== "ng") {
    const message = `I want to register for the More Done With AI Challenge. My name is ${firstName} ${lastName}. I would need the payment details to complete my payment for ${moreDonePlans[seats].label.toLowerCase()} (${moreDonePrice(seats, paymentCountry)}).`;
    const url = new URL("https://wa.me/25079904461");
    url.searchParams.set("text", message);
    return Response.json({ url: url.toString(), paymentRoute: paymentCountry }, { headers });
  }
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email, amount: moreDonePlans[seats].amount, currency: "NGN", reference,
        callback_url: "https://www.runrentless.com/moredone",
        metadata: JSON.stringify({ product: "more_done_challenge", seats, customer_name: `${firstName} ${lastName}` }),
      }),
      cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    const result = await response.json() as { status?: boolean; data?: { authorization_url?: string; reference?: string } };
    const url = result.data?.authorization_url;
    if (!response.ok || !result.status || !url || result.data?.reference !== reference) throw new Error(`Paystack initialize ${response.status}`);
    const checkout = new URL(url);
    if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.paystack.com" || checkout.username || checkout.password) throw new Error("Unexpected Paystack checkout URL");
    try { await saveMoreDoneCheckoutUrl(email, reference, url); }
    catch (error) { console.error("MoreDone checkout URL sync failed", error instanceof Error ? error.message : "Unknown error"); }
    let checkoutEmailSent = false;
    try { await sendMoreDoneCheckoutLink(email, firstName, seats, url); checkoutEmailSent = true; }
    catch (error) { console.error("MoreDone checkout email failed", error instanceof Error ? error.message : "Unknown error"); }
    return Response.json({ url, checkoutEmailSent }, { headers });
  } catch (error) {
    console.error("MoreDone checkout failed", error instanceof Error ? error.message : "Unknown error");
    return fail("Paystack could not open checkout. Your details are saved, and no payment was taken. Please try again.", 502);
  }
}
