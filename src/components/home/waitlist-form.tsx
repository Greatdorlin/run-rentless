"use client";

import { FormEvent, useState } from "react";
import { interestOptions, teamSizes } from "@/content/site";

type FormStatus = "idle" | "submitting" | "saved" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not add you right now.");
      setFirstName(String(data.get("firstName") ?? ""));
      setStatus("saved");
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not add you right now.");
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="form-success__mark">✓</span>
        <p className="eyebrow eyebrow--dark"><span /> You&apos;re on the list</p>
        <h3>{firstName ? `${firstName}, you’re` : "You’re"} in.</h3>
        <p>Your details have been securely added to the Run Rentless launch list. We will be in touch with relevant product, demo, and launch opportunities.</p>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="field-row">
        <label><span>First name</span><input name="firstName" autoComplete="given-name" required maxLength={80} placeholder="Your first name" /></label>
        <label><span>Last name</span><input name="lastName" autoComplete="family-name" required maxLength={80} placeholder="Your last name" /></label>
      </div>
      <label><span>Work email</span><input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@company.com" /></label>
      <label><span>Company name</span><input name="company" autoComplete="organization" required placeholder="Your organisation" /></label>
      <div className="field-row">
        <label><span>Software interest</span><select name="interest" required defaultValue=""><option value="" disabled>Choose one</option>{interestOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Team size</span><select name="teamSize" required defaultValue=""><option value="" disabled>Choose a range</option>{teamSizes.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <label><span>Current software <em>Optional</em></span><input name="currentSoftware" placeholder="What are you using today?" /></label>
      <label className="consent-field">
        <input name="marketingConsent" type="checkbox" required />
        <span>I agree that Run Rentless may use these details for waitlist updates, product demos, and launch opportunities. I can opt out at any time.</span>
      </label>
      <label className="honeypot-field" aria-hidden="true"><span>Website</span><input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      {status === "error" && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--dark button--wide" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Adding you…" : "Join the waitlist"} <span aria-hidden="true">↗</span></button>
      <p className="form-privacy">Your information is used only for Run Rentless products, demos, and launch opportunities. You can opt out at any time.</p>
    </form>
  );
}
