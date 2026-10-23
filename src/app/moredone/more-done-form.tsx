"use client";
import { useEffect, useState, type FormEvent } from "react";
import { isMoreDoneSeats, moreDonePlans, moreDonePrice, moreDoneProjects, type MoreDoneCountry, type MoreDoneSeats } from "@/lib/moredone";

const examples = [
  "An online store that tracks every order and low-stock item",
  "A private customer tracker that reminds us who needs a reply",
  "A booking app that fills open slots and confirms each visit",
  "A client portal that shows tasks, files and what is due next",
  "An assistant that turns a customer brief into a first quote",
];

export function MoreDoneForm({ country, initialSeats = 1, initialPackageSelected = false }: { country: MoreDoneCountry; initialSeats?: MoreDoneSeats; initialPackageSelected?: boolean }) {
  const [seats, setSeats] = useState<MoreDoneSeats>(initialSeats);
  const [packageSelected, setPackageSelected] = useState(initialPackageSelected);
  useEffect(() => {
    const chooseSeats = (event: Event) => {
      const value = (event as CustomEvent<unknown>).detail;
      if (isMoreDoneSeats(value) && (country !== "ng" || value !== 2)) { setSeats(value); setPackageSelected(true); }
    };
    window.addEventListener("moredone:seats", chooseSeats);
    return () => window.removeEventListener("moredone:seats", chooseSeats);
  }, [country]);
  const nigeria = country === "ng";
  const saving = country === "ng"
    ? (moreDonePlans[1].amount * seats - moreDonePlans[seats].amount) / 100
    : country === "rw" ? moreDonePlans[1].rwf * seats - moreDonePlans[seats].rwf
    : moreDonePlans[1].usd * seats - moreDonePlans[seats].usd;
  const savingLabel = new Intl.NumberFormat(nigeria ? "en-NG" : "en", { style: "currency", currency: nigeria ? "NGN" : country === "rw" ? "RWF" : "USD", maximumFractionDigits: 0 }).format(saving);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [goal, setGoal] = useState("");
  useEffect(() => {
    const acceptIdea = (event: Event) => {
      const value = (event as CustomEvent<unknown>).detail;
      if (typeof value === "string") setGoal(value.slice(0, 400));
    };
    window.addEventListener("moredone:idea", acceptIdea);
    return () => window.removeEventListener("moredone:idea", acceptIdea);
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState<"checking" | "paid" | "unconfirmed" | null>(null);
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);
  function selectPackage(count: MoreDoneSeats) {
    setSeats(count); setPackageSelected(true);
    const url = new URL(window.location.href);
    url.searchParams.set("seats", String(count));
    url.hash = "md-registration";
    window.history.replaceState(null, "", url);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.hash === "#checkout") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#join`);
      document.getElementById("join")?.scrollIntoView({ block: "start" });
    }
    const returned = params.get("reference");
    if (!returned) return;
    queueMicrotask(() => { setReference(returned); setPayment("checking"); });
    document.getElementById("join")?.scrollIntoView({ block: "start" });
    fetch(`/api/moredone/verify?reference=${encodeURIComponent(returned)}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { paid: false })
      .then((result: { paid?: boolean; synced?: boolean }) => { setConfirmationAccepted(result.synced === true); setPayment(result.paid ? "paid" : "unconfirmed"); })
      .catch(() => setPayment("unconfirmed"));
  }, [country]);

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
        consent: form.get("consent") === "on", companyWebsite: form.get("companyWebsite"), paymentCountry: country,
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

  return <form className="md-form" id="md-registration" tabIndex={-1} aria-label="Join the MoreDone cohort" onSubmit={submit}>
    <div className="md-form__top"><span>MORE DONE</span><strong>Join the challenge</strong></div>
    <p className="md-form__country-note">Prices shown for {country === "ng" ? "Nigeria" : country === "rw" ? "Rwanda" : "Global"}. <a href="#md-country">Change country ↑</a></p>
    {packageSelected ? <div className="md-form__selected" aria-live="polite"><div><span>{moreDonePlans[seats].label}</span><strong>{moreDonePrice(seats, country)}</strong>{saving > 0 && <small>Your team saves {savingLabel}.</small>}</div><button type="button" onClick={() => setPackageSelected(false)}>Change</button></div> : <>
    <p className="md-form__choice-label">How many people are joining?</p>
    <div className={`md-form__seats${nigeria ? "" : " md-form__seats--four"}`} role="group" aria-label="Number of places">
      {([1, 2, 3, 5] as const).filter((count) => !nigeria || count !== 2).map((count) => <button key={count} type="button" aria-pressed={seats === count} onClick={() => selectPackage(count)}>
        <span>{moreDonePlans[count].label}</span><strong>{moreDonePrice(count, country)}</strong>
      </button>)}
    </div>
    <p className="md-form__amount" aria-live="polite">{moreDonePlans[seats].label} · Total: <strong>{moreDonePrice(seats, country)}</strong></p>
    {saving > 0 && <p className="md-form__saving" aria-live="polite">You save {savingLabel} compared with individual places.</p>}
    </>}
    <div className="md-form__row"><label>First name<input name="firstName" autoComplete="given-name" required maxLength={80} /></label><label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80} /></label></div>
    <label>Email for your place<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
    <label>Business or project name<input name="company" autoComplete="organization" required maxLength={120} /></label>
    <div className="md-form__row"><label>How big is your business? <span className="md-form__optional">Optional</span><select name="teamSize" defaultValue=""><option value="">Choose if you know</option><option>Just me</option><option>2–5 people</option><option>6–15 people</option><option>16+ people</option></select></label><label>What would you build?<select name="project" required defaultValue=""><option value="" disabled>Choose a starting point</option>{moreDoneProjects.map((project) => <option key={project}>{project}</option>)}</select></label></div>
    <label className="md-form__idea">What would you love to build? <span className="md-form__optional">Optional</span><textarea name="goal" maxLength={400} rows={3} value={goal} onChange={(event) => setGoal(event.target.value)} placeholder={examples[exampleIndex]} /><span className="md-form__idea-hint">Tell us the idea in your own words. We will help you shape the first build.</span></label>
    <p className="md-form__tool-note">Our team helps you choose your AI tool and get it ready for class. Your AI subscription is paid separately from your challenge place.</p>
    <div className="md-form__trap" aria-hidden="true"><label>Website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="md-form__consent"><input name="consent" type="checkbox" required /><span>Send me my payment and course information by email. I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</span></label>
    {error && <p className="md-form__error" role="alert">{error}</p>}
    <button className="md-button md-form__pay" type="submit" disabled={busy}>{busy ? nigeria ? "Opening secure checkout…" : "Opening payment details…" : nigeria ? `Pay ${moreDonePrice(seats, country)} securely` : "Continue to payment details"} <span aria-hidden="true">↗</span></button>
    <small>{nigeria ? "Our payment partner processes your card details securely." : "We will open a message with your name and chosen places. Your place is confirmed after payment."}</small>
  </form>;
}
