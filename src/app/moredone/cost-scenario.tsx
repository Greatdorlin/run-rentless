"use client";

import { useState } from "react";
import type { MoreDoneCountry } from "@/lib/moredone";

const examples = {
  ng: [100000, 250000, 500000],
  rw: [40000, 200000, 650000],
  other: [50, 300, 1000],
};
const cases = [
  ["Working solo", "A booking app and a website that collects customer enquiries."],
  ["Small team", "A customer tracker with follow-up reminders and shared tasks."],
  ["Growing business", "One place to track orders, stock and customer updates."],
];

export function CostScenario({ country }: { country: MoreDoneCountry }) {
  const startingExample = country === "ng" ? 0 : 1;
  const [selected, setSelected] = useState<number | null>(startingExample);
  const [bill, setBill] = useState(String(examples[country][startingExample]));
  const [reduction, setReduction] = useState(25);
  const currency = country === "ng" ? "NGN" : country === "rw" ? "RWF" : "USD";
  const money = (value: number) => new Intl.NumberFormat(country === "ng" ? "en-NG" : "en", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  const monthly = Math.min(1000000000, Math.max(0, Number(bill) || 0));
  const difference = monthly * reduction / 100;

  return <section className="md-cost-scenario" aria-labelledby="md-scenario-title">
    <h3 id="md-scenario-title">See what your software costs you.</h3>
    <p>A monthly bill looks different when you see the whole year. Try your numbers below.</p>
    <div className="md-scenario-cases" role="group" aria-label="Choose an example monthly budget">
      {cases.map(([label], index) => <button type="button" key={label} aria-pressed={selected === index} onClick={() => { setSelected(index); setBill(String(examples[country][index])); }}><span>{label}</span><strong>{money(examples[country][index])}</strong></button>)}
    </div>
    <p className="md-scenario-example">{selected === null ? "Use your actual bill to explore a change that matters to you." : cases[selected][1]}</p>
    <label className="md-scenario-bill" htmlFor="md-monthly-bill">What do you pay each month? <span>{currency}</span></label>
    <input id="md-monthly-bill" type="number" inputMode="decimal" min="0" max="1000000000" step="any" value={bill} onChange={(event) => { setBill(event.target.value); setSelected(null); }} />
    <div className="md-scenario-slider-label"><label htmlFor="md-cost-reduction">If that bill fell by</label><output htmlFor="md-cost-reduction">{reduction}%</output></div>
    <input id="md-cost-reduction" type="range" min="0" max="50" step="5" value={reduction} aria-valuetext={`${reduction} percent bill reduction`} onChange={(event) => setReduction(Number(event.target.value))} />
    <div className="md-scenario-scale" aria-hidden="true"><span>0%</span><span>50%</span></div>
    <div className="md-scenario-result" aria-live="polite" aria-atomic="true">
      <div className="md-scenario-result__main"><span>You would keep this much each year</span><strong>{money(difference * 12)}</strong></div>
      <div><span>Your bill today, over a year</span><strong>{money(monthly * 12)}</strong></div>
      <div><span>Your new monthly bill</span><strong>{money(monthly - difference)}</strong></div>
    </div>
    <p className="md-scenario-note">This example uses the bill and percentage you choose. Include the cost of building and running your tool when comparing options.</p>
    <a className="md-underlink" href="#join">Learn to build your own tool. Join the cohort ↗</a>
  </section>;
}
