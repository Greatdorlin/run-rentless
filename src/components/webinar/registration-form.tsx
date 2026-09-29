"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { webinarPhase } from "@/lib/webinar";

type AttendingAs = "individual" | "company";

export function RegistrationForm() {
  const [attendingAs, setAttendingAs] = useState<AttendingAs>("individual");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "duplicate">("idle");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phase, setPhase] = useState<ReturnType<typeof webinarPhase>>("upcoming");

  useEffect(() => {
    const update = () => setPhase(webinarPhase(Date.now()));
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 60_000);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          email: data.get("email"),
          attendingAs: data.get("attendingAs"),
          companyName: data.get("companyName"),
          phoneNumber: data.get("phoneNumber"),
          eventConsent: data.get("eventConsent") === "on",
          website: data.get("website"),
        }),
      });
      const result = await response.json() as { ok?: boolean; emailSent?: boolean; alreadyRegistered?: boolean; message?: string };
      if (!result.ok) throw new Error(result.message || "Please try again.");
      setFirstName(String(data.get("firstName") || ""));
      if (!result.emailSent && !result.alreadyRegistered) throw new Error("Your spot is saved, but the email could not be sent. Please try again.");
      setStatus(result.alreadyRegistered ? "duplicate" : "success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.");
      setStatus("idle");
    }
  }

  if (phase === "ended") return <div className="webinar-form__closed"><h3>Registration has closed.</h3><p>The live event ended at 8PM GMT+1 on 10th October 2026. You can still explore Run Rentless.</p><Link href="/">Go to the homepage <span aria-hidden="true">↗</span></Link></div>;

  if (status === "success" || status === "duplicate") return (
    <div className="webinar-form__success" role="status">
      <span className="webinar-form__success-mark" aria-hidden="true">✓</span>
      <h3>{status === "success" ? "Your spot is confirmed." : `${firstName}, you’re already registered.`}</h3>
      <p>{status === "success" ? "We’ve just sent your confirmation email. Check Spam or Promotions if you do not see it. Move it to your inbox and mark it as important so you do not miss the webinar details." : "Your email is already on the webinar list. If you need your details again, contact us."}</p>
      <strong>Saturday, 10th October 2026 · 6PM GMT+1</strong>
      <Link href="/contact">Questions? Contact us <span aria-hidden="true">↗</span></Link>
    </div>
  );

  return (
    <form className="webinar-form" onSubmit={submit}>
      <div className="webinar-form__heading"><span>Free live webinar</span><h3>Get a spot.</h3><p>Bring one costly tool or slow task. No technical background needed.</p></div>
      <div className="webinar-form__fields">
        <label>First name<input name="firstName" autoComplete="given-name" maxLength={80} required placeholder="Your first name" /></label>
        <label>Work email<input name="email" type="email" autoComplete="email" maxLength={160} required placeholder="you@company.com" /></label>
        <fieldset className="webinar-form__choice"><legend>Attending as</legend><div>
          <label><input type="radio" name="attendingAs" value="individual" checked={attendingAs === "individual"} onChange={() => setAttendingAs("individual")} /><span>An individual</span></label>
          <label><input type="radio" name="attendingAs" value="company" checked={attendingAs === "company"} onChange={() => setAttendingAs("company")} /><span>A company</span></label>
        </div></fieldset>
        {attendingAs === "company" && <label>Company name<input name="companyName" autoComplete="organization" maxLength={120} required placeholder="Your company" /></label>}
        <label>Phone number<input name="phoneNumber" type="tel" autoComplete="tel" maxLength={32} required placeholder="Include your country code" /></label>
        <label className="webinar-form__consent"><input type="checkbox" name="eventConsent" required /><span>I agree to receive my confirmation and webinar updates by email. See our <Link href="/privacy">Privacy Policy</Link>.</span></label>
        <label className="webinar-form__trap" aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
      </div>
      {error && <p className="webinar-form__error" role="alert">{error}</p>}
      <button className="webinar-form__submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Saving your spot…" : "Register free"}<span aria-hidden="true">↗</span></button>
      <p className="webinar-form__footnote">Free to attend. We’ll email your joining details before the event.</p>
    </form>
  );
}
