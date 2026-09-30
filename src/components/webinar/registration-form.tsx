"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { WEBINAR_WHATSAPP_URL, webinarPhase } from "@/lib/webinar";
import { businessSectors, normalizeBusinessSector, positions } from "@/lib/business-profile";
import { WebinarShare } from "@/components/webinar/webinar-share";

type AttendingAs = "individual" | "company";

function SearchableChoice({ id, label, name, options, value, onChange, placeholder, maxLength }: {
  id: string;
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
}) {
  const [open, setOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const matches = options.filter((option) => option.toLowerCase().includes(query) || (name === "businessSector" && normalizeBusinessSector(value) === option));
  return <div className="webinar-form__search-choice">
    <label htmlFor={id}>{label}</label>
    <div className="webinar-form__search-control">
      <input id={id} name={name} type="text" autoComplete={name === "position" ? "organization-title" : "off"} maxLength={maxLength} required value={value} onChange={(event) => { onChange(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={placeholder} />
      <button type="button" aria-label={`${open ? "Hide" : "Show"} ${label.toLowerCase()} options`} aria-expanded={open} aria-controls={`${id}-options`} onClick={() => setOpen(!open)}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 9 7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
    </div>
    {open && <div id={`${id}-options`} className="webinar-form__option-list" aria-label={`${label} options`}>
      {matches.map((option) => <button key={option} type="button" onClick={() => { onChange(option); setOpen(false); }}>{option}</button>)}
      {matches.length === 0 && <button type="button" onClick={() => setOpen(false)}>Use “{value}”</button>}
    </div>}
  </div>;
}

export function RegistrationForm() {
  const [attendingAs, setAttendingAs] = useState<AttendingAs>("individual");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "duplicate">("idle");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [position, setPosition] = useState("");
  const [businessSector, setBusinessSector] = useState("");
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
          position: data.get("position"),
          positionOther: data.get("positionOther"),
          businessSector: data.get("businessSector"),
          businessSectorOther: data.get("businessSectorOther"),
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
      <div className="webinar-form__group">
        <span>One more step</span>
        <h4>Be ready when we go live.</h4>
        <p>Join the event WhatsApp group for the joining link, reminders and any last-minute updates.</p>
        <a href={WEBINAR_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Join the WhatsApp group <span aria-hidden="true">↗</span></a>
      </div>
      <p>{status === "success" ? "Your confirmation email is on its way. Check Spam or Promotions if you do not see it." : "Your email is already on the webinar list. If you need your details again, contact us."}</p>
      <strong>Saturday, 10th October 2026 · 6PM GMT+1</strong>
      <WebinarShare compact />
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
        <SearchableChoice id="webinar-position" label="Your role" name="position" options={positions} value={position} onChange={setPosition} maxLength={80} placeholder="Search or choose your role" />
        {position.trim().toLowerCase() === "other" && <label>What is your role?<input name="positionOther" maxLength={80} required placeholder="Type your role" /></label>}
        <SearchableChoice id="webinar-sector" label="Business sector" name="businessSector" options={businessSectors} value={businessSector} onChange={setBusinessSector} maxLength={100} placeholder="Search or choose your sector" />
        {businessSector.trim().toLowerCase() === "other" && <label>What is your sector?<input name="businessSectorOther" maxLength={100} required placeholder="Type your sector" /></label>}
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
