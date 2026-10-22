import { cleanMoreDoneText, isMoreDoneSeats, moreDonePlans, moreDoneProjects } from "@/lib/moredone";
import { saveMoreDoneLead } from "@/lib/moredone-sender";
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
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !company || !teamSize ||
    !moreDoneProjects.includes(project as (typeof moreDoneProjects)[number]) || !isMoreDoneSeats(seats) || body.consent !== true) {
    return fail("Please complete the required details and agree to receive course updates.", 400);
  }
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || !process.env.SENDER_API) return fail("Checkout is temporarily unavailable. Please try again shortly.", 503);
  const reference = `rrmd_${crypto.randomUUID().replaceAll("-", "")}`;
  try {
    await saveMoreDoneLead({ firstName, lastName, email, company, teamSize, project, goal, seats, reference });
  } catch (error) {
    console.error("MoreDone Sender sync failed", error instanceof Error ? error.message : "Unknown error");
    return fail("We could not save your details. Please try again before paying.", 502);
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
    return Response.json({ url }, { headers });
  } catch (error) {
    console.error("MoreDone checkout failed", error instanceof Error ? error.message : "Unknown error");
    return fail("Paystack could not open checkout. Your details are saved, and no payment was taken. Please try again.", 502);
  }
}
