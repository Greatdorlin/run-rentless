"use client";

import { useState, type FormEvent } from "react";

const concepts = [
  { match: /book|salon|appointment|schedule/i, name: "Booking app", steps: ["Choose a time", "Confirm the booking", "See the schedule"], rows: [["Tuesday", "10:30 AM", "Available"], ["Service selected", "Time reserved", "Confirmation prepared"], ["New appointment", "Customer details", "Follow-up reminder"]], actions: ["Book this time", "Confirm appointment", "Try the flow again"] },
  { match: /stock|inventory|shop|store|order|ecommerce/i, name: "Stock manager", steps: ["See your products", "Record an order", "Know what to restock"], rows: [["Product A · 12 left", "Product B · 3 left", "Product C · 24 left"], ["Product B selected", "Quantity: 2", "Stock after sale: 1"], ["Product B is running low", "Add to reorder list", "Review before buying"]], actions: ["Try a sample order", "Record this sale", "Try the flow again"] },
  { match: /crm|lead|sales|customer|follow/i, name: "Customer tracker", steps: ["Capture a lead", "Plan the follow-up", "See the next step"], rows: [["New website enquiry", "Interested in a quote", "Waiting for a reply"], ["Assign someone to reply", "Prepare a quote", "Set a reminder"], ["Quote ready for review", "Follow-up scheduled", "Conversation in one place"]], actions: ["Add this sample lead", "Save the next step", "Try the flow again"] },
  { match: /website|landing|portfolio/i, name: "Business website", steps: ["Show your offer", "Receive an enquiry", "Follow up"], rows: [["Your service explained", "Examples of your work", "A clear way to contact you"], ["Customer chooses a service", "Shares what they need", "Leaves a contact email"], ["Enquiry saved", "Reply reminder created", "Ready to send a quote"]], actions: ["Try the enquiry flow", "Submit sample enquiry", "Try the flow again"] },
  { match: /assistant|quote|report|draft|email/i, name: "AI assistant", steps: ["Give it the details", "Prepare a draft", "Review before sending"], rows: [["Your approved business info", "The customer request", "Your preferred format"], ["Relevant details gathered", "Draft arranged for review", "Missing information flagged"], ["Check the facts", "Make your changes", "You approve the final version"]], actions: ["Show a sample draft flow", "Open review step", "Try the flow again"] },
  { match: /./, name: "Your custom tool", steps: ["Add the information", "Organise the work", "Review the result"], rows: [["What someone needs", "The details your tool uses", "Who will use it"], ["One useful action", "A clear next step", "Progress you can see"], ["Check it with a real example", "See what needs improving", "Plan the next feature"]], actions: ["Explore a starting flow", "See the result step", "Try the flow again"] },
];

export function IdeaPreview() {
  const [idea, setIdea] = useState("");
  const [preview, setPreview] = useState("");
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("10:30 AM");
  const [quantity, setQuantity] = useState(2);
  const concept = concepts.find((item) => item.match.test(preview)) || concepts[5];
  function show(value: string) { if (!value.trim()) return; setIdea(value); setPreview(value.trim()); setStep(0); }
  function submit(event: FormEvent) { event.preventDefault(); show(idea); }
  function carryIdea() {
    window.dispatchEvent(new CustomEvent("moredone:idea", { detail: preview }));
    document.getElementById("join")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <section className="md-idea-section" aria-labelledby="md-idea-title"><div className="md-shell"><div className="md-idea">
    <div className="md-idea__intro"><h2 id="md-idea-title">Try a little of what you could build.</h2><p>Enter your idea to open an example you can click through.</p></div>
    <form onSubmit={submit} className="md-idea__form"><label className="md-idea__label" htmlFor="md-idea-input">What would you like to build?</label><div><input id="md-idea-input" value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={180} required placeholder="A booking app for my salon…" /><button type="submit">Preview my idea <span aria-hidden="true">↗</span></button></div></form>
    <div className="md-idea__examples"><span>Try an idea:</span>{["A CRM for my agency", "A stock manager for my shop", "A website for my business"].map((example) => <button type="button" key={example} onClick={() => show(example)}>{example}</button>)}</div>
    {preview && <div className="md-idea__reveal" key={preview}>
      <div className="md-idea__caption"><span>INTERACTIVE CONCEPT</span><button type="button" onClick={() => setPreview("")}>Close preview ×</button></div>
      <h3 className="md-idea__name">{preview}</h3>
      <div className="md-idea__workspace"><div className="md-idea__steps" role="group" aria-label="Explore the suggested flow">{concept.steps.map((title, index) => <button key={title} type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>{index + 1}</span>{title}</button>)}</div>
        <div className="md-idea__screen" key={`${preview}-${step}`}><div className="md-idea__screen-bar"><i /><i /><i /><span>{concept.name}</span></div><h4>{concept.steps[step]}</h4>
          {concept.name === "Booking app" ? <div className="md-idea__demo">
            <p>{step === 0 ? "Pick a sample appointment time" : step === 1 ? "Your appointment is ready to confirm" : "Your schedule has a new appointment"}</p>
            {step === 0 ? <div className="md-idea__slots">{["10:30 AM", "12:00 PM", "2:30 PM"].map((time) => <button type="button" key={time} aria-pressed={choice === time} onClick={() => setChoice(time)}>{time}</button>)}</div> : <div className="md-idea__receipt"><strong>Tuesday · {choice}</strong><span>{step === 1 ? "Sample customer · 30-minute visit" : "Confirmed · shown in your schedule"}</span></div>}
          </div> : concept.name === "Stock manager" ? <div className="md-idea__demo"><p>{step === 0 ? "Sample item: 3 in stock" : step === 1 ? "Record how many were sold" : "Your stock count has updated"}</p>{step < 2 ? <label>Items sold<input type="number" min={1} max={3} value={quantity} onChange={(event) => setQuantity(Math.min(3, Math.max(1, Number(event.target.value) || 1)))} /></label> : <div className="md-idea__receipt"><strong>{3 - quantity} left in stock</strong><span>{3 - quantity <= 1 ? "Low stock: time to reorder" : "Stock updated after your sale"}</span></div>}</div>
          : <ul>{concept.rows[step].map((row) => <li key={row}><span aria-hidden="true">✓</span>{row}</li>)}</ul>}
          <button type="button" onClick={() => setStep((step + 1) % 3)}>{concept.actions[step]} <span aria-hidden="true">→</span></button></div>
      </div>
      <div className="md-idea__handoff"><p>This is an example matched to your idea. Your challenge project starts with the job you want it to do.</p><button type="button" onClick={carryIdea}>Bring this idea to the challenge ↗</button></div>
    </div>}
  </div></div></section>;
}
