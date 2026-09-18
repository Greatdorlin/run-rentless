"use client";

import { useState } from "react";
import type { AuditTool } from "@/lib/audit";

export function WorkflowQuestion({ tool, features, index, count, update, back, next, finish }: {
  tool: AuditTool; features: string[]; index: number; count: number;
  update: (patch: Partial<AuditTool>) => void; back: () => void; next: () => void; finish: () => void;
}) {
  const [question, setQuestion] = useState(0);
  const advance = () => question < 2 ? setQuestion(question + 1) : next();
  return <div className="audit-panel guided-question">
    <p className="eyebrow eyebrow--dark"><span /> {tool.name} · Tool {index + 1} of {count}</p>
    <p className="question-count">Question {question + 1} of 3 · Optional</p>
    {question === 0 && <fieldset><legend><h1>Does it make work easier?</h1></legend><p>Tell us how often your team has to work around this tool.</p><div className="guided-options">{[{ value: "Rarely", label: "It usually does the job" }, { value: "Sometimes", label: "We sometimes work around it" }, { value: "Constantly", label: "We constantly work around it" }].map(({ value, label }) => <button key={value} type="button" aria-pressed={tool.workaround === value} className={tool.workaround === value ? "selected" : ""} onClick={() => update({ workaround: tool.workaround === value ? "Not answered" : value })}>{label}</button>)}</div></fieldset>}
    {question === 1 && <fieldset><legend><h1>What do you use it for?</h1></legend><p>Choose the jobs it does. This helps us spot where your tools may overlap.</p><div className="check-grid">{features.map((feature) => <label key={feature}><input type="checkbox" checked={tool.features.includes(feature)} onChange={() => update({ features: tool.features.includes(feature) ? tool.features.filter((item) => item !== feature) : [...tool.features, feature] })} />{feature}</label>)}</div></fieldset>}
    {question === 2 && <label className="question"><h1>What is the one thing you wish it did better?</h1><p>A daily frustration or missing feature is enough. We use your answer to explain what is worth investigating.</p><textarea autoFocus maxLength={600} value={tool.wish} onChange={(event) => update({ wish: event.target.value })} placeholder={tool.category === "Scheduling" ? "For example: Assign bookings to the right branch automatically." : "For example: Remind the right person when a customer has not heard back."} /></label>}
    <div className="audit-actions"><button type="button" className="text-button" onClick={() => question ? setQuestion(question - 1) : back()}>Back</button><button type="button" className="text-button" onClick={advance}>Skip this question</button><button type="button" className="button" onClick={advance}>{question < 2 ? "Continue" : index < count - 1 ? "Next tool" : "Show My Action Plan"} <span aria-hidden="true">→</span></button></div>
    <button type="button" className="text-button guided-finish" onClick={finish}>Show my plan with what I’ve shared</button>
  </div>;
}
