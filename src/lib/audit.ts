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

export const hasRequest = (tool: AuditTool) => Boolean(tool.wish.trim()) && !/^(none|nothing|no|n\/?a|not sure|all good|nothing really)[.!\s]*$/i.test(tool.wish.trim());
export const hasWorkflowAnswer = (tool: AuditTool) => hasRequest(tool) || ["Rarely", "Sometimes", "Constantly"].includes(tool.workaround);

export function verdict(tool: AuditTool): Verdict {
  const friction = hasRequest(tool) || ["Sometimes", "Constantly"].includes(tool.workaround);
  // Rebuilding a connector network or core business infrastructure needs more evidence.
  if (["Automation", "Finance", "Documents", "Marketing & Email"].includes(tool.category)) return friction ? "BUILD AROUND" : "KEEP";
  if (tool.workaround === "Constantly") return "LOOK CLOSER";
  if (friction) return "BUILD AROUND";
  return "KEEP";
}

export function explanation(tool: AuditTool) {
  if (!hasWorkflowAnswer(tool)) return "Not enough detail yet. You have not told us whether this tool meets your needs. Keep it in place while you review it; this is not a recommendation against replacement.";
  const result = verdict(tool);
  if (tool.category === "Scheduling") {
    if (result === "LOOK CLOSER") return "You constantly work around your booking tool. Compare a better setup, another service and a custom booking workflow. Check calendar connections, reminders and running costs before choosing.";
    if (result === "BUILD AROUND") return "Start by fixing the booking step that causes trouble. Settings, an integration or a small add-on may be enough. Consider replacement only if those cannot meet your needs.";
    return "You rarely work around this booking tool and named no missing feature. Keep it for now. Before building your own, compare its actual bill with the cost of calendar connections, reminders and support.";
  }
  if (result === "LOOK CLOSER") return "You told us your team constantly works around this tool. Compare improving the setup, switching tools and owning this workflow. We need to check your data, integrations and running costs before recommending replacement.";
  if (result === "BUILD AROUND") {
    const reason = tool.workaround === "Constantly" ? "Your team constantly works around this tool." : hasRequest(tool) ? "You named something this tool could do better." : "Your team sometimes works around this tool.";
    const caution = tool.category === "Automation" ? "Keep the existing connections where useful; focus on the step that is failing." : ["Finance", "Documents", "Marketing & Email"].includes(tool.category) ? "Check the services, data and obligations you rely on before replacing the whole platform." : "If that cannot solve it, assess a replacement.";
    return `${reason} First check settings, integrations or a small add-on. ${caution}`;
  }
  return "You rarely work around this tool and named no missing feature. Keep it for now. We have not checked alternatives or the cost of replacing it.";
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
