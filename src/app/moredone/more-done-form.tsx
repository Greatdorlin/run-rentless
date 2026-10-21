"use client";
import { useState, type FormEvent } from "react";

export function MoreDoneForm() {
  const [plan, setPlan] = useState("Individual");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        firstName: form.get("firstName"), lastName: form.get("lastName"), email: form.get("email"), company: form.get("company"),
        teamSize: form.get("teamSize"), interest: "MoreDone Challenge: " + plan, marketingConsent: form.get("consent") === "on",
        companyWebsite: form.get("companyWebsite"),
      }) });
      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "Your request could not be saved. Please try again.");
      setDone(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Your request could not be saved. Please try again."); }
    finally { setBusy(false); }
  }

  if (done) return <div className="md-form md-form__done" role="status"><span aria-hidden="true">✓</span><h3>We have your details.</h3><p>The Run Rentless team can contact you about the next cohort. No payment has been taken.</p></div>;
  return <form className="md-form" onSubmit={submit}>
    <div className="md-form__top"><span>NEXT COHORT</span><strong>Request details</strong></div>
    <div className="md-form__row"><label>First name<input name="firstName" autoComplete="given-name" required maxLength={80} /></label><label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80} /></label></div>
    <label>Work email<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
    <label>Business or project name<input name="company" autoComplete="organization" required maxLength={120} /></label>
    <div className="md-form__row"><label>Places wanted<select value={plan} onChange={(event) => setPlan(event.target.value)}><option>Individual</option><option>Team of three</option></select></label><label>Team size<select name="teamSize" required defaultValue=""><option value="" disabled>Choose one</option><option>Just me</option><option>2–5 people</option><option>6–15 people</option><option>16+ people</option></select></label></div>
    <div className="md-form__trap" aria-hidden="true"><label>Website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="md-form__consent"><input name="consent" type="checkbox" required /><span>I agree to receive MoreDone cohort details and related Run Rentless emails. I can unsubscribe later.</span></label>
    {error ? <p className="md-form__error" role="alert">{error}</p> : null}
    <button className="md-button" type="submit" disabled={busy}>{busy ? "Sending your request…" : "Send me cohort details"} <span aria-hidden="true">↗</span></button>
    <small>No charge today. We will explain the payment steps when a cohort opens.</small>
  </form>;
}
