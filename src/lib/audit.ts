export type Billing = "Monthly" | "Quarterly" | "Yearly";
export type Verdict = "KEEP" | "LOOK CLOSER" | "BUILD AROUND";
export type AuditCharge = { id: number; label: string; type: string; rate: string; quantity: string; billing: Billing };
export type AuditTool = {
  id: number; name: string; category: string; currency: string;
  costMode: "actual" | "calculate"; amount: string; billing: Billing; billBasis: string;
  charges: AuditCharge[]; features: string[]; workaround: string; users: string;
  data: string; criticality: string; wish: string;
};

export const budgetRanges = ["Under $2,500", "$2,500 to $5,000", "$5,000 to $10,000", "$10,000 to $25,000", "$25,000+", "Not sure yet"];
export const deliveryPreferences = ["Done with you", "Done for you", "Assessment only", "Not sure yet"];
export const factor = (billing: Billing) => billing === "Yearly" ? 1 / 12 : billing === "Quarterly" ? 1 / 3 : 1;
const numeric = (value: string) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
export const chargeMonthly = (charge: AuditCharge) => (numeric(charge.rate) ?? 0) * (numeric(charge.quantity) ?? 0) * factor(charge.billing);
export const hasCost = (tool: AuditTool) => tool.costMode === "actual" ? numeric(tool.amount) !== null : tool.charges.length > 0 && tool.charges.every((charge) => numeric(charge.rate) !== null && numeric(charge.quantity) !== null);
export const monthlyOf = (tool: AuditTool) => tool.costMode === "actual" ? (numeric(tool.amount) ?? 0) * factor(tool.billing) : tool.charges.reduce((sum, charge) => sum + chargeMonthly(charge), 0);
export const headcountPriced = (tool: AuditTool) => tool.costMode === "actual" ? tool.billBasis === "Per user / seat" : tool.charges.some((charge) => charge.type === "Per user / seat");
export const usagePriced = (tool: AuditTool) => tool.costMode === "actual" ? ["Usage", "Contacts", "Mixed"].includes(tool.billBasis) : tool.charges.some((charge) => ["Per contact", "Per email", "Per task / automation", "Per location / branch", "Per transaction", "Usage based", "Base fee + usage"].includes(charge.type));
export const flatPriced = (tool: AuditTool) => tool.costMode === "actual" ? tool.billBasis === "Flat fee" : tool.charges.every((charge) => charge.type === "Flat fee");
export function money(value: number, currency: string) {
  const prefix = ({ USD: "$", GBP: "£", EUR: "€", NGN: "₦" } as Record<string, string>)[currency] || `${currency} `;
  return `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function verdict(tool: AuditTool): Verdict {
  const friction = tool.wish.trim() !== "" || tool.workaround === "Constantly";
  if (tool.category === "Automation") return friction ? "BUILD AROUND" : "KEEP";
  if (friction) return "LOOK CLOSER";
  if (tool.workaround === "Sometimes") return "BUILD AROUND";
  return "KEEP";
}

export function explanation(tool: AuditTool) {
  if (tool.category === "Automation") return "Its value is connecting other products. Recreating that connector network is unlikely to make sense. Building around a specific gap or consolidating other tools may reduce its workload.";
  if (verdict(tool) === "LOOK CLOSER") return "You identified a missing capability or frequent workarounds. That gives us a reason to investigate this workflow, but it does not yet establish that replacing the tool is worthwhile.";
  if (verdict(tool) === "BUILD AROUND") return "You sometimes work around this tool. A focused extension may solve that problem while keeping the parts that already work.";
  return "Your answers do not yet show a clear reason to replace this tool. Keep it for now. We have not assessed its value, alternatives or replacement cost in detail.";
}

export function summarizeAudit(tools: AuditTool[], currentTeam = "", futureTeam = "") {
  const totals: Record<string, number> = {};
  const futureTotals: Record<string, number> = {};
  const counts: Record<Verdict, number> = { KEEP: 0, "LOOK CLOSER": 0, "BUILD AROUND": 0 };
  const growthKnown = Number(currentTeam) > 0 && Number(futureTeam) > 0;
  const ratio = growthKnown ? Number(futureTeam) / Number(currentTeam) : 1;
  for (const tool of tools) {
    counts[verdict(tool)] += 1;
    if (!hasCost(tool)) continue;
    totals[tool.currency] = (totals[tool.currency] || 0) + monthlyOf(tool);
    const future = tool.costMode === "actual"
      ? monthlyOf(tool) * (headcountPriced(tool) ? ratio : 1)
      : tool.charges.reduce((sum, charge) => sum + chargeMonthly(charge) * (charge.type === "Per user / seat" ? ratio : 1), 0);
    futureTotals[tool.currency] = (futureTotals[tool.currency] || 0) + future;
  }
  const currencies = Object.keys(totals);
  const investigations = tools.filter((tool) => verdict(tool) === "LOOK CLOSER");
  // Rank money only within one currency. With mixed currencies, use reported friction.
  const priority = [...investigations].sort((a, b) => Number(b.workaround === "Constantly") - Number(a.workaround === "Constantly") || (a.currency === b.currency ? monthlyOf(b) - monthlyOf(a) : 0))[0];
  const overlaps = [...new Set(tools.map((tool) => tool.category))].map((category) => ({ category, tools: tools.filter((tool) => tool.category === category) })).filter((group) => group.tools.length > 1);
  const headcount = tools.filter(headcountPriced).length;
  return { totals, futureTotals, counts, priority, overlaps, currencies, growthKnown, headcount, usage: tools.filter(usagePriced).length, flat: tools.filter(flatPriced).length, unknownCosts: tools.filter((tool) => !hasCost(tool)).length };
}
