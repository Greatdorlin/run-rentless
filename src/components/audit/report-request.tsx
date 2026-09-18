"use client";

import { useState, type FormEvent } from "react";
import { budgetRanges, deliveryPreferences } from "@/lib/audit";

export function ReportRequest({ interest, interested, sending, error, submit, download }: {
  interest: string; interested: boolean; sending: boolean; error: string;
  submit: (event: FormEvent<HTMLFormElement>) => void; download: () => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ email: "", firstName: "", lastName: "", company: "", companySize: "", budgetRange: "", deliveryPreference: "" });
  const set = (key: keyof typeof values, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const advance = (event: FormEvent<HTMLFormElement>) => {
    if (step < 3) { event.preventDefault(); setStep(step + 1); } else submit(event);
  };
  return <form id="report-request" className="report-form report-form--guided" onSubmit={advance}>
    <div><p className="eyebrow eyebrow--dark"><span /> Keep your action plan</p><h2>{interested ? "Let’s talk through your results." : "Take your next steps with you."}</h2><p>Get your cost breakdown, the reasons behind each recommendation and what to check before making a change.</p><p className="question-count">Step {step + 1} of 4</p></div>
    <div className="report-fields">
      {Object.entries(values).map(([key, value]) => <input key={key} type="hidden" name={key} value={(key === "company" || key === "companySize") && !value ? "Not provided" : key === "budgetRange" && !interested ? "" : value} />)}
      <input type="hidden" name="savingsInterest" value={interest} />
      {step === 0 && <label><span>Where should we send your plan?</span><input required type="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} placeholder="Your email address" /><small>No phone number. No account to create.</small></label>}
      {step === 1 && <fieldset className="guided-name"><legend>What should we call you?</legend><label><span>First name</span><input autoFocus required autoComplete="given-name" value={values.firstName} onChange={(event) => set("firstName", event.target.value)} /></label><label><span>Last name</span><input required autoComplete="family-name" value={values.lastName} onChange={(event) => set("lastName", event.target.value)} /></label></fieldset>}
      {step === 2 && <label><span>Which company is this for? (optional)</span><input autoFocus autoComplete="organization" value={values.company} onChange={(event) => set("company", event.target.value)} placeholder="Company name" /><small>You can leave this blank.</small></label>}
      {step === 3 && <>
        <p>Your plan will go to <strong>{values.email}</strong>.</p>
        <details className="optional-context"><summary>Add a little context (optional)</summary><label><span>Team size</span><select value={values.companySize} onChange={(event) => set("companySize", event.target.value)}><option value="">Prefer not to say</option>{["1 to 10", "11 to 25", "26 to 50", "51 to 100", "100+"].map((value) => <option key={value}>{value}</option>)}</select></label>
          {interested && <fieldset className="choice-field"><legend>Possible project budget in USD</legend><p>A guide, not a commitment.</p>{budgetRanges.map((value) => <button type="button" key={value} aria-pressed={values.budgetRange === value} className={values.budgetRange === value ? "selected" : ""} onClick={() => set("budgetRange", values.budgetRange === value ? "" : value)}>{value}</button>)}</fieldset>}
          <fieldset className="choice-field"><legend>How would you like help?</legend>{deliveryPreferences.map((value) => <button type="button" key={value} aria-pressed={values.deliveryPreference === value} className={values.deliveryPreference === value ? "selected" : ""} onClick={() => set("deliveryPreference", values.deliveryPreference === value ? "" : value)}>{value}</button>)}</fieldset>
        </details>
        <label className="consent-field"><input required type="checkbox" name="reportConsent" /><span>{interested ? "Use my details to send my plan and contact me about these results." : "Use my details to prepare and email my plan through Sender."} <a href="/privacy">Privacy Policy</a></span></label>
        <label className="consent-field"><input type="checkbox" name="marketingConsent" /><span>Also send me relevant Run Rentless updates. Optional. I can unsubscribe.</span></label>
      </>}
      <input className="honeypot-field" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && <div role="alert"><p className="form-error">{error}</p><button type="button" className="text-button" onClick={download}>Download my plan instead</button></div>}
      <div className="audit-actions">{step > 0 && <button type="button" className="text-button" disabled={sending} onClick={() => setStep(step - 1)}>Back</button>}<button className="button" disabled={sending}>{sending ? "Sending..." : step < 3 ? "Continue" : interested ? "Request My Review & Plan" : "Email My Action Plan"} <span aria-hidden="true">→</span></button></div>
    </div>
  </form>;
}
