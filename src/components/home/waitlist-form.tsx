"use client";

import { FormEvent, useState } from "react";
import { interestOptions, teamSizes } from "@/content/site";

type FormStatus = "idle" | "saved";

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const safeDraft = Object.fromEntries(data.entries());
    window.localStorage.setItem("run-rentless-waitlist-draft", JSON.stringify(safeDraft));
    setName(String(data.get("fullName") ?? ""));
    setStatus("saved");
  }

  if (status === "saved") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="form-success__mark">✓</span>
        <p className="eyebrow eyebrow--dark"><span /> Details saved</p>
        <h3>{name ? `${name.split(" ")[0]}, your` : "Your"} early-access details are ready.</h3>
        <p>This launch preview saves your details on this device only. Email delivery is not connected yet, so nothing has been sent to Run Rentless.</p>
        <button className="text-button" type="button" onClick={() => setStatus("idle")}>Review or edit details →</button>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="field-row">
        <label><span>Full name</span><input name="fullName" autoComplete="name" required placeholder="Your full name" /></label>
        <label><span>Work email</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
      </div>
      <label><span>Company name</span><input name="company" autoComplete="organization" required placeholder="Your organisation" /></label>
      <div className="field-row">
        <label><span>Software interest</span><select name="interest" required defaultValue=""><option value="" disabled>Choose one</option>{interestOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Team size</span><select name="teamSize" required defaultValue=""><option value="" disabled>Choose a range</option>{teamSizes.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <label><span>Current software <em>Optional</em></span><input name="currentSoftware" placeholder="What are you using today?" /></label>
      <button className="button button--dark button--wide" type="submit">Save my early-access details <span aria-hidden="true">↗</span></button>
      <p className="form-privacy">Your information is intended only for Run Rentless products, demos, and launch opportunities. This preview stores entries locally until a secure submission service is connected.</p>
    </form>
  );
}
