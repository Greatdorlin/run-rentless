"use client";
import { useEffect, useState, type FormEvent } from "react";
import { moreDonePlans, moreDoneProjects, type MoreDoneSeats } from "@/lib/moredone";

const price = (seats: MoreDoneSeats, nigeria: boolean) => nigeria
  ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(moreDonePlans[seats].amount / 100)
  : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(moreDonePlans[seats].usd);
const examples = [
  "An online store that tracks every order and low-stock item",
  "A private customer tracker that reminds us who needs a reply",
  "A booking app that fills open slots and confirms each visit",
  "A client portal that shows tasks, files and what is due next",
  "An assistant that turns a customer brief into a first quote",
];

export function MoreDoneForm({ initialNigeria }: { initialNigeria: boolean }) {
  const [seats, setSeats] = useState<MoreDoneSeats>(1);
  const [nigeria, setNigeria] = useState(initialNigeria);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState<"checking" | "paid" | "unconfirmed" | null>(null);
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("seats") === "2" && (params.get("region") === "international" || !initialNigeria)) queueMicrotask(() => setSeats(2));
    if (params.get("seats") === "3") queueMicrotask(() => setSeats(3));
    if (params.get("seats") === "5") queueMicrotask(() => setSeats(5));
    if (params.get("region") === "ng") queueMicrotask(() => setNigeria(true));
    if (params.get("region") === "international") queueMicrotask(() => setNigeria(false));
    const returned = params.get("reference");
    if (!returned) return;
    queueMicrotask(() => { setReference(returned); setPayment("checking"); });
    document.getElementById("join")?.scrollIntoView({ block: "start" });
    fetch(`/api/moredone/verify?reference=${encodeURIComponent(returned)}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { paid: false })
      .then((result: { paid?: boolean; synced?: boolean }) => { setConfirmationAccepted(result.synced === true); setPayment(result.paid ? "paid" : "unconfirmed"); })
      .catch(() => setPayment("unconfirmed"));
  }, [initialNigeria]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setExampleIndex((index) => (index + 1) % examples.length), 3200);
    return () => window.clearInterval(timer);
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
        consent: form.get("consent") === "on", companyWebsite: form.get("companyWebsite"), paymentRegion: nigeria ? "ng" : "international",
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
    <p>{payment === "paid" ? confirmationAccepted ? "Check your email for the payment confirmation. We will send your challenge schedule and joining details separately." : "Your payment is confirmed, but we could not confirm the email was sent. Keep this reference and contact us if it does not arrive." : payment === "checking" ? "We are checking with Paystack now." : "If your card was charged, please do not pay again. Send us the reference below so we can check it."}</p>
    <code>{reference}</code>
    <a href={`mailto:info@runrentless.com?subject=MoreDone%20payment%20${encodeURIComponent(reference)}`}>Contact Run Rentless ↗</a>
  </div>;

  return <form className="md-form" onSubmit={submit}>
    <div className="md-form__top"><span>MORE DONE</span><strong>Join the challenge</strong></div>
    <p className="md-form__choice-label">Where are you paying from?</p>
    <div className="md-form__region" role="group" aria-label="Payment location">
      <button type="button" aria-pressed={nigeria} onClick={() => { setNigeria(true); if (seats === 2) setSeats(1); }}>Nigeria</button>
      <button type="button" aria-pressed={!nigeria} onClick={() => setNigeria(false)}>Outside Nigeria</button>
    </div>
    <p className="md-form__choice-label">How many people are joining?</p>
    <div className="md-form__seats" role="group" aria-label="Number of places">
      {([1, 2, 3, 5] as const).filter((count) => !nigeria || count !== 2).map((count) => <button key={count} type="button" aria-pressed={seats === count} onClick={() => setSeats(count)}>
        <span>{moreDonePlans[count].label}</span><strong>{price(count, nigeria)}</strong>
      </button>)}
    </div>
    <p className="md-form__amount" aria-live="polite">{moreDonePlans[seats].label} · {nigeria ? "Total to pay" : "Your place"}: <strong>{price(seats, nigeria)}</strong></p>
    <div className="md-form__row"><label>First name<input name="firstName" autoComplete="given-name" required maxLength={80} /></label><label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80} /></label></div>
    <label>Email for your place<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
    <label>Business or project name<input name="company" autoComplete="organization" required maxLength={120} /></label>
    <div className="md-form__row"><label>How big is your business? <span className="md-form__optional">Optional</span><select name="teamSize" defaultValue=""><option value="">Choose if you know</option><option>Just me</option><option>2–5 people</option><option>6–15 people</option><option>16+ people</option></select></label><label>What would you build?<select name="project" required defaultValue=""><option value="" disabled>Choose a starting point</option>{moreDoneProjects.map((project) => <option key={project}>{project}</option>)}</select></label></div>
    <label className="md-form__idea">What would you love to build? <span className="md-form__optional">Optional</span><textarea name="goal" maxLength={400} rows={3} placeholder={examples[exampleIndex]} /><span className="md-form__idea-hint">A small, working first version is enough to start.</span></label>
    <p className="md-form__tool-note">You will need access to a paid AI building tool during the challenge. That subscription is separate. We will help you choose and set it up before the first workshop.</p>
    <div className="md-form__trap" aria-hidden="true"><label>Website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="md-form__consent"><input name="consent" type="checkbox" required /><span>Send me my payment and course information by email. I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</span></label>
    {error && <p className="md-form__error" role="alert">{error}</p>}
    <button className="md-button md-form__pay" type="submit" disabled={busy}>{busy ? nigeria ? "Opening secure checkout…" : "Preparing your message…" : nigeria ? `Pay ${price(seats, nigeria)} securely` : "Get payment details on WhatsApp"} <span aria-hidden="true">↗</span></button>
    <small>{nigeria ? "Our payment partner processes your card details securely." : "We will open WhatsApp with your name and chosen places ready to send. Your place is confirmed after payment."}</small>
  </form>;
}
