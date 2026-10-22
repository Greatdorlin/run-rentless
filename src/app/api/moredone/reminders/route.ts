import { isMoreDoneNairaSeats, moreDonePlans } from "@/lib/moredone";
import { sendMoreDoneCheckoutReminder, sendMoreDonePaymentRequest } from "@/lib/moredone-email";
import { listMoreDoneCheckoutCandidates, markMoreDonePaid, markMoreDoneReminderAccepted } from "@/lib/moredone-sender";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response(null, { status: 401 });
  const key = process.env.PAYSTACK_SECRET_KEY;
  let checked = 0;
  let reminded = 0;
  let recovered = 0;
  let failed = 0;
  try {
    const candidates = await listMoreDoneCheckoutCandidates();
    for (const candidate of candidates.slice(0, 5)) {
      try {
        if (candidate.country !== "ng") {
          const emailId = await sendMoreDonePaymentRequest(candidate.email, candidate.firstName, candidate.seats, candidate.country, candidate.url, true);
          await markMoreDoneReminderAccepted(candidate.email, candidate.reference, emailId);
          reminded += 1;
          continue;
        }
        if (!key) { failed += 1; continue; }
        const response = await fetch(`https://api.paystack.co/transaction/verify/${candidate.reference}`, {
          headers: { Authorization: `Bearer ${key}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) { failed += 1; continue; }
        const result = await response.json() as { status?: boolean; data?: Record<string, unknown> };
        const data = result.data;
        const metadata = typeof data?.metadata === "string" ? JSON.parse(data.metadata) : data?.metadata;
        if (result.status !== true || data?.reference !== candidate.reference ||
          metadata?.product !== "more_done_challenge" || !isMoreDoneNairaSeats(metadata?.seats) || metadata.seats !== candidate.seats ||
          data?.currency !== "NGN" || data?.amount !== moreDonePlans[candidate.seats].amount) { failed += 1; continue; }
        checked += 1;
        if (data?.status === "success") {
          if (data?.domain !== "live") { failed += 1; continue; }
          await markMoreDonePaid(candidate.email, candidate.reference, candidate.seats);
          recovered += 1;
          continue;
        }
        if (data?.status !== "ongoing" && data?.status !== "abandoned" && data?.status !== "pending") continue;
        const emailId = await sendMoreDoneCheckoutReminder(candidate.email, candidate.firstName, candidate.seats, candidate.url);
        await markMoreDoneReminderAccepted(candidate.email, candidate.reference, emailId);
        reminded += 1;
      } catch (error) {
        failed += 1;
        console.error("MoreDone reminder candidate failed", error instanceof Error ? error.message : "Unknown error");
      }
    }
    return Response.json({ checked, reminded, recovered, failed }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("MoreDone reminder run failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Reminder check failed" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
