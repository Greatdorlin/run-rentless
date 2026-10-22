"use client";
import { useEffect, useState, type FormEvent } from "react";
import { moreDonePlans, moreDoneProjects, type MoreDoneSeats } from "@/lib/moredone";

const price = (seats: MoreDoneSeats) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(moreDonePlans[seats].amount / 100);

export function MoreDoneForm() {
  const [seats, setSeats] = useState<MoreDoneSeats>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState<"checking" | "paid" | "unconfirmed" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("seats") === "3") queueMicrotask(() => setSeats(3));
    const returned = params.get("reference");
    if (!returned) return;
    queueMicrotask(() => { setReference(returned); setPayment("checking"); });
    document.getElementById("join")?.scrollIntoView({ block: "start" });
    fetch(`/api/moredone/verify?reference=${encodeURIComponent(returned)}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { paid: false })
      .then((result: { paid?: boolean }) => setPayment(result.paid ? "paid" : "unconfirmed"))
      .catch(() => setPayment("unconfirmed"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/moredone/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        firstName: form.get("firstName"), lastName: form.get("lastName"), email: form.get("email"), company: form.get("company"),
        teamSize: form.get("teamSize"), project: form.get("project"), goal: form.get("goal"), seats,
        consent: form.get("consent") === "on", companyWebsite: form.get("companyWebsite"),
      }) });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout could not open. Please try again.");
      window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout could not open. Please try again.");
      setBusy(false);
    }
  }

  if (payment) return <div className="md-form md-payment-result" role="status">
    <h3>{payment === "paid" ? "Your place is paid." : payment === "checking" ? "Checking your payment…" : "We cannot confirm payment yet."}</h3>
    <p>{payment === "paid" ? "Keep this reference. We will send the challenge schedule to the email you used at checkout." : payment === "checking" ? "We are checking with Paystack now." : "If your card was charged, please do not pay again. Send us the reference below so we can check it."}</p>
    <code>{reference}</code>
    <a href={`mailto:info@runrentless.com?subject=MoreDone%20payment%20${encodeURIComponent(reference)}`}>Contact Run Rentless ↗</a>
  </div>;

  return <form className="md-form" onSubmit={submit}>
    <div className="md-form__top"><span>MORE DONE</span><strong>Choose your place</strong></div>
    <div className="md-form__seats" role="group" aria-label="Number of places">
      {([1, 3] as const).map((count) => <button key={count} type="button" aria-pressed={seats === count} onClick={() => setSeats(count)}>
        <span>{moreDonePlans[count].label}</span><strong>{price(count)}</strong>
      </button>)}
    </div>
    <p className="md-form__amount">Total today: <strong>{price(seats)}</strong></p>
    <div className="md-form__row"><label>First name<input name="firstName" autoComplete="given-name" required maxLength={80} /></label><label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80} /></label></div>
    <label>Email for your place<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
    <label>Business or project name<input name="company" autoComplete="organization" required maxLength={120} /></label>
    <div className="md-form__row"><label>Team size<select name="teamSize" required defaultValue=""><option value="" disabled>Choose one</option><option>Just me</option><option>2–5 people</option><option>6–15 people</option><option>16+ people</option></select></label><label>What would you build?<select name="project" required defaultValue=""><option value="" disabled>Choose a starting point</option>{moreDoneProjects.map((project) => <option key={project}>{project}</option>)}</select></label></div>
    <label>What job should your tool make easier? <span className="md-form__optional">Optional</span><textarea name="goal" maxLength={400} rows={3} placeholder="For example, remind us when a customer is waiting for a reply." /></label>
    <p className="md-form__tool-note"><strong>Before you join:</strong> Bring Claude or enough Codex access through your ChatGPT plan to work on your project. A paid plan or extra credits may be needed. These are separate from the challenge fee, and we will show you how to set up your tool.</p>
    <div className="md-form__trap" aria-hidden="true"><label>Website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="md-form__consent"><input name="consent" type="checkbox" required /><span>Send me my payment and course information by email. I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</span></label>
    {error && <p className="md-form__error" role="alert">{error}</p>}
    <button className="md-button md-form__pay" type="submit" disabled={busy}>{busy ? "Opening Paystack…" : `Pay ${price(seats)} securely`} <span aria-hidden="true">↗</span></button>
    <small>Our payment partner, Paystack, handles your card details. International cards can use the naira checkout. Your bank sets the conversion rate.</small>
  </form>;
}
