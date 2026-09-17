"use client";

import { FormEvent, useMemo, useState } from "react";

type Category = "CRM & Sales" | "Marketing & Email" | "Project Management" | "Operations" | "Customer Support" | "HR" | "Finance" | "Forms" | "Scheduling" | "Reporting" | "Automation" | "Documents" | "Other";
type Tool = { id: number; name: string; category: Category; currency: string; amount: string; billing: "Monthly" | "Yearly"; features: string[]; fit: string; users: string; data: string; criticality: string; wish: string };

const categories: Category[] = ["CRM & Sales", "Marketing & Email", "Project Management", "Operations", "Customer Support", "HR", "Finance", "Forms", "Scheduling", "Reporting", "Automation", "Documents", "Other"];
const catalogue: Array<[string, Category]> = [
  ["HubSpot", "CRM & Sales"], ["Zoho", "CRM & Sales"], ["Salesforce", "CRM & Sales"], ["Pipedrive", "CRM & Sales"],
  ["Mailchimp", "Marketing & Email"], ["Klaviyo", "Marketing & Email"], ["Brevo", "Marketing & Email"],
  ["Asana", "Project Management"], ["Monday.com", "Project Management"], ["ClickUp", "Project Management"], ["Trello", "Project Management"],
  ["Airtable", "Operations"], ["Notion", "Documents"], ["Google Workspace", "Documents"], ["Microsoft 365", "Documents"],
  ["Zendesk", "Customer Support"], ["Intercom", "Customer Support"], ["BambooHR", "HR"], ["Xero", "Finance"], ["QuickBooks", "Finance"],
  ["Typeform", "Forms"], ["Jotform", "Forms"], ["Calendly", "Scheduling"], ["Looker Studio", "Reporting"], ["Power BI", "Reporting"],
  ["Zapier", "Automation"], ["Make", "Automation"], ["Slack", "Operations"],
];
const featureSets: Record<Category, string[]> = {
  "CRM & Sales": ["Contacts", "Leads", "Pipeline", "Follow-ups", "Reporting", "Email", "Automations", "Quotes", "Customer support", "Other"],
  "Marketing & Email": ["Campaigns", "Email lists", "Automations", "Segmentation", "Forms", "Reporting", "Templates", "Other"],
  "Project Management": ["Projects", "Tasks", "Approvals", "Timelines", "Workload", "Reporting", "Automations", "Other"],
  Operations: ["Records", "Approvals", "Workflows", "Team access", "Reporting", "Automations", "Other"],
  "Customer Support": ["Tickets", "Inbox", "Knowledge base", "SLAs", "Reporting", "Automations", "Other"],
  HR: ["Employee records", "Leave", "Onboarding", "Reviews", "Documents", "Reporting", "Other"],
  Finance: ["Invoices", "Expenses", "Payroll", "Reconciliation", "Reporting", "Approvals", "Other"],
  Forms: ["Forms", "Conditional logic", "Payments", "File uploads", "Notifications", "Reporting", "Other"],
  Scheduling: ["Bookings", "Availability", "Reminders", "Payments", "Team calendars", "Other"],
  Reporting: ["Dashboards", "Data sources", "Scheduled reports", "Sharing", "Alerts", "Other"],
  Automation: ["Triggers", "Multi-step workflows", "Data transfer", "Approvals", "Notifications", "Other"],
  Documents: ["Documents", "Storage", "Collaboration", "Permissions", "Templates", "Other"],
  Other: ["Core workflow", "Team access", "Reporting", "Automations", "Other"],
};
const symbols: Record<string, string> = { GBP: "£", USD: "$", EUR: "€", NGN: "₦", Other: "" };

const blankTool = (name: string, category: Category, id: number): Tool => ({ id, name, category, currency: "GBP", amount: "", billing: "Monthly", features: [], fit: "Mostly", users: "3 or more", data: "Some", criticality: "Major disruption", wish: "" });

export function SoftwareRentAudit() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [tools, setTools] = useState<Tool[]>([]);
  const [active, setActive] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const filtered = catalogue.filter(([name, cat]) => (category === "All" || cat === category) && name.toLowerCase().includes(query.toLowerCase()));
  const monthly = useMemo(() => tools.reduce((sum, tool) => sum + (Number(tool.amount) || 0) / (tool.billing === "Yearly" ? 12 : 1), 0), [tools]);
  const currency = tools[0]?.currency || "GBP";
  const money = (value: number) => `${symbols[currency]}${Math.round(value).toLocaleString()}`;
  const current = tools[active];

  function addTool(name: string, cat: Category) {
    if (tools.some((tool) => tool.name.toLowerCase() === name.toLowerCase())) return;
    setTools((value) => [...value, blankTool(name, cat, Date.now())]);
    setQuery("");
  }
  function update(id: number, patch: Partial<Tool>) { setTools((value) => value.map((tool) => tool.id === id ? { ...tool, ...patch } : tool)); }
  function classification(tool: Tool) {
    if (tool.category === "Automation" && tool.features.length > 2) return "KEEP";
    if (tool.wish.trim() || tool.fit === "We work around it constantly" || tool.fit === "No") return "OWN";
    if (tool.category === "Operations" || tool.category === "Reporting") return "EXTEND";
    return "KEEP";
  }
  const counts = tools.reduce((acc, tool) => ({ ...acc, [classification(tool)]: acc[classification(tool)] + 1 }), { KEEP: 0, OWN: 0, EXTEND: 0 } as Record<string, number>);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim().split(/\s+/);
    const payload = {
      firstName: name[0], lastName: name.slice(1).join(" ") || "Not provided", email: form.get("email"), company: form.get("company"),
      interest: "Software Rent Audit", teamSize: form.get("companySize"), marketingConsent: true,
      currentSoftware: tools.map((tool) => `${tool.name} (${classification(tool)}, ${tool.currency} ${tool.amount || "cost skipped"}/${tool.billing.toLowerCase()})`).join("; ").slice(0, 160),
    };
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      setSubmitted(true);
    } catch { setError("We could not prepare your report right now. Please try again."); }
    finally { setSending(false); }
  }

  return <div className="audit-page">
    {!started ? <section className="audit-hero hero" id="audit">
      <div className="shell audit-hero__grid">
        <div>
          <p className="eyebrow"><span /> Free software rent audit</p>
          <h1>Add the tools your company pays for.</h1>
          <p className="audit-hero__lede">In a few minutes, see what you spend, what probably makes sense to keep, and which workflows may be worth owning instead.</p>
          <ul className="audit-hero__list"><li>What you spend today</li><li>What that becomes over 3 years</li><li>What may be worth keeping, owning or extending</li><li>Where several tools may be doing one job</li></ul>
          <button className="button audit-start" onClick={() => setStarted(true)}>Start my free audit <span>↗</span></button>
          <p className="audit-trust">Takes about 5 minutes. No email required to start.</p>
        </div>
        <div className="audit-hero__preview" aria-hidden="true"><span>7 tools</span><strong>£1,840</strong><small>current monthly spend</small><div><b>KEEP</b><b>OWN</b><b>EXTEND</b></div></div>
      </div>
      <div className="shell audit-honesty">We may tell you to keep what you already have.</div>
    </section> : <section className="audit-workspace" id="audit">
      <div className="shell audit-shell">
        <header className="audit-progress"><div><span>Software Rent Audit</span><strong>Step {step} of 4</strong></div><progress value={step} max="4" /></header>
        {step === 1 && <div className="audit-panel">
          <p className="eyebrow eyebrow--dark"><span /> Your software stack</p><h1>What does your company pay for?</h1><p>Search for a tool or add any software in the world.</p>
          <div className="tool-search"><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search HubSpot, Zoho, Mailchimp, Airtable..." />{query && !catalogue.some(([name]) => name.toLowerCase() === query.toLowerCase()) && <button onClick={() => addTool(query, category === "All" ? "Other" : category)}>Add “{query}”</button>}</div>
          <div className="category-list"><button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>All</button>{categories.map((cat) => <button className={category === cat ? "active" : ""} key={cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div>
          <div className="tool-grid">{filtered.slice(0, 18).map(([name, cat]) => <button key={name} className={tools.some((t) => t.name === name) ? "selected" : ""} onClick={() => addTool(name, cat)}><span>{tools.some((t) => t.name === name) ? "✓" : "+"}</span>{name}<small>{cat}</small></button>)}</div>
          {tools.length > 0 && <div className="selected-tools">{tools.map((tool) => <span key={tool.id}>✓ {tool.name}<button aria-label={`Remove ${tool.name}`} onClick={() => setTools((v) => v.filter((t) => t.id !== tool.id))}>×</button></span>)}</div>}
          <div className="audit-actions"><span>{tools.length} {tools.length === 1 ? "tool" : "tools"} added</span><button className="button" disabled={!tools.length} onClick={() => setStep(2)}>Add real costs <span>→</span></button></div>
        </div>}
        {step === 2 && <div className="audit-panel"><p className="eyebrow eyebrow--dark"><span /> Your actual numbers</p><h1>What do you really pay?</h1><p>Your invoice is the truth. We do not use public list prices.</p>
          <div className="cost-list">{tools.map((tool) => <div className="cost-row" key={tool.id}><strong>{tool.name}</strong><select value={tool.currency} onChange={(e) => update(tool.id, { currency: e.target.value })}>{["NGN","USD","GBP","EUR","Other"].map((v) => <option key={v}>{v}</option>)}</select><input inputMode="decimal" value={tool.amount} onChange={(e) => update(tool.id, { amount: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="Amount" /><select value={tool.billing} onChange={(e) => update(tool.id, { billing: e.target.value as Tool["billing"] })}><option>Monthly</option><option>Yearly</option></select></div>)}</div>
          <p className="audit-note">Skip any amount you do not know. We will never pretend public pricing is your bill.</p><div className="audit-actions"><button className="text-button" onClick={() => setStep(1)}>Back</button><button className="button" onClick={() => setStep(3)}>Review usage <span>→</span></button></div>
        </div>}
        {step === 3 && current && <div className="audit-panel"><p className="eyebrow eyebrow--dark"><span /> Tool {active + 1} of {tools.length}</p><h1>{current.name}</h1><p>We only ask what changes the recommendation.</p>
          <div className="question"><h3>What do you use it for?</h3><div className="check-grid">{featureSets[current.category].map((feature) => <label key={feature}><input type="checkbox" checked={current.features.includes(feature)} onChange={() => update(current.id, { features: current.features.includes(feature) ? current.features.filter((v) => v !== feature) : [...current.features, feature] })} />{feature}</label>)}</div></div>
          <label className="question"><h3>What do you wish it did?</h3><textarea value={current.wish} onChange={(e) => update(current.id, { wish: e.target.value })} placeholder="For example: Automatically give a lead to someone else if nobody follows up within 48 hours." /></label>
          <div className="question-grid"><label><span>How well does it fit?</span><select value={current.fit} onChange={(e) => update(current.id, { fit: e.target.value })}>{["Very well","Mostly","We work around it constantly","No"].map((v) => <option key={v}>{v}</option>)}</select></label><label><span>How many people use it?</span><select value={current.users} onChange={(e) => update(current.id, { users: e.target.value })}>{["1 to 2","3 or more","Not sure"].map((v) => <option key={v}>{v}</option>)}</select></label><label><span>How much important data?</span><select value={current.data} onChange={(e) => update(current.id, { data: e.target.value })}>{["Very little","Some","Years of important data"].map((v) => <option key={v}>{v}</option>)}</select></label><label><span>If it stopped working?</span><select value={current.criticality} onChange={(e) => update(current.id, { criticality: e.target.value })}>{["Minor inconvenience","Major disruption","Business-critical"].map((v) => <option key={v}>{v}</option>)}</select></label></div>
          <div className="audit-actions"><button className="text-button" onClick={() => active ? setActive(active - 1) : setStep(2)}>Back</button><button className="button" onClick={() => active < tools.length - 1 ? setActive(active + 1) : setStep(4)}>{active < tools.length - 1 ? "Next tool" : "See my preview"} <span>→</span></button></div>
        </div>}
        {step === 4 && <div className="audit-panel audit-results"><p className="eyebrow eyebrow--dark"><span /> Your audit preview</p><h1>Something here looks worth investigating.</h1>
          <div className="spend-grid"><div><span>Monthly spend</span><strong>{money(monthly)}</strong></div><div><span>Annual spend</span><strong>{money(monthly * 12)}</strong></div><div><span>3-year spend</span><strong>{money(monthly * 36)}</strong></div></div><p className="audit-note">Based only on the costs you entered. We have not assumed price increases, additional employees or increased usage.</p>
          <div className="result-list">{tools.map((tool) => <article key={tool.id}><span className={`verdict verdict--${classification(tool).toLowerCase()}`}>{classification(tool)}</span><div><h3>{tool.name}</h3><p>{classification(tool) === "KEEP" ? "Renting this probably still makes sense based on what you told us." : classification(tool) === "OWN" ? "There are enough signals to justify examining whether your company should own this workflow." : "The service is useful, but you may benefit from building something around it rather than replacing it."}</p>{tool.wish && <blockquote>“{tool.wish}”</blockquote>}</div></article>)}</div>
          <div className="result-summary"><strong>{tools.length} tools reviewed</strong><span>{counts.KEEP} worth keeping</span><span>{counts.OWN} worth investigating</span><span>{counts.EXTEND} possible extensions</span></div>
          {!submitted ? <form className="report-form" onSubmit={submit}><div><h2>Get the full audit report.</h2><p>A concise business document with your spend, flags, unanswered questions and recommended next steps.</p></div><div className="report-fields"><input required name="name" placeholder="First and last name" /><input required type="email" name="email" placeholder="Work email" /><input required name="company" placeholder="Company" /><select required name="companySize" defaultValue=""><option value="" disabled>Company size</option>{["1–10","11–25","26–50","51–100","100+"].map((v) => <option key={v}>{v}</option>)}</select>{error && <p className="form-error">{error}</p>}<button className="button button--wide" disabled={sending}>{sending ? "Preparing…" : "Send my audit report"}<span>↗</span></button></div></form> : <div className="report-success"><span>✓</span><div><h2>Your audit is ready for review.</h2><p>We have your real inputs. No fabricated savings figure—just a clear basis for deciding what deserves a closer look.</p></div></div>}
          <p className="not-savings"><strong>This is not estimated savings.</strong> It is a review of the recurring spend and workflows that may deserve further investigation. A Software Ownership Assessment is required before recommending replacement.</p>
        </div>}
        {started && <aside className="audit-totals"><span>{tools.length} tools</span><strong>{money(monthly)}</strong><small>current monthly spend</small></aside>}
      </div>
    </section>}
    <section className="audit-principles section" id="how-it-works"><div className="shell"><p className="eyebrow"><span /> Honest by design</p><h2>The free audit should never pretend it knows more than it knows.</h2><div className="principle-grid"><article><span>01</span><h3>KEEP</h3><p>Some software earns its place. We will say so.</p></article><article><span>02</span><h3>OWN</h3><p>Focused, costly workflows with workarounds may deserve an ownership assessment.</p></article><article><span>03</span><h3>EXTEND</h3><p>Sometimes the best answer is building around a useful service, not replacing it.</p></article></div></div></section>
    <section className="audit-next section" id="report"><div className="shell"><p className="eyebrow"><span /> What happens next</p><h2>Audit first. Decide with evidence.</h2><p>The audit identifies what is worth investigating. A Software Ownership Assessment then examines your workflow, data, integrations, migration, infrastructure, maintenance and three-year ownership economics.</p><button className="button" onClick={() => { setStarted(true); setStep(1); document.querySelector("#audit")?.scrollIntoView(); }}>Start my free audit <span>↗</span></button></div></section>
  </div>;
}
