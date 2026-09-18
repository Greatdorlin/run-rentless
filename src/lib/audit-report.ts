import { verdictLabels, hasRequest, headcountPriced, explanation, hasCost, money, monthlyOf, summarizeAudit, verdict, type AuditTool, type Billing } from "./audit";

const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const numberInput = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1_000_000_000 ? String(parsed) : "";
};
const billing = (value: unknown): Billing => value === "Quarterly" || value === "Yearly" ? value : "Monthly";
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export function parseAudit(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.tools) || source.tools.length === 0 || source.tools.length > 30) return null;
  const tools: AuditTool[] = source.tools.map((value, id) => {
    const tool = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return {
      id, name: text(tool.name, 100), category: text(tool.category, 80), currency: /^[A-Z]{3}$/.test(String(tool.currency)) ? String(tool.currency) : "Other",
      costMode: tool.costMode === "calculate" ? "calculate" : "actual", amount: numberInput(tool.amount), billing: billing(tool.billing), billBasis: text(tool.billBasis, 60),
      charges: Array.isArray(tool.charges) ? tool.charges.slice(0, 20).map((value, id) => {
        const charge = value && typeof value === "object" ? value as Record<string, unknown> : {};
        return { id, label: text(charge.label, 100), type: text(charge.type, 60), rate: numberInput(charge.rate), quantity: numberInput(charge.quantity), billing: billing(charge.billing) };
      }) : [],
      features: Array.isArray(tool.features) ? tool.features.slice(0, 20).map((feature) => text(feature, 80)).filter(Boolean) : [],
      workaround: text(tool.workaround, 40), users: text(tool.users, 40), data: text(tool.data, 80), criticality: text(tool.criticality, 80), wish: text(tool.wish, 600),
    };
  });
  if (tools.some((tool) => !tool.name)) return null;
  const currentTeam = numberInput(source.currentTeam), futureTeam = numberInput(source.futureTeam);
  return { tools, currentTeam, futureTeam, ...summarizeAudit(tools, currentTeam, futureTeam) };
}

export type AuditReport = NonNullable<ReturnType<typeof parseAudit>>;
export function auditSummary(audit: AuditReport) {
  return `${audit.tools.length} tools. ${Object.entries(audit.totals).map(([code, amount]) => `${money(amount, code)}/month, ${money(amount * 12, code)}/year, ${money(amount * 36, code)}/3 years`).join("; ")}. ${audit.counts.KEEP} Retain, ${audit.counts["BUILD AROUND"]} Upgrade, ${audit.counts["LOOK CLOSER"]} New options. ${audit.unknownCosts} missing costs.`;
}

export function reportEmail(firstName: string, audit: AuditReport) {
  const sections: { title: string; lines: string[] }[] = [];
  const priority = audit.priority;
  sections.push({ title: "Start here", lines: [priority
    ? `Look at ${priority.name} first. You said your team often has to find ways around it. Check whether a better setup could solve the problem before paying to replace it.`
    : "Start with the advice for each tool below. There is no clear reason to replace a tool just because you pay for it."] });
  const costs = Object.entries(audit.totals).map(([code, amount]) =>
    `${money(amount, code)} a month · ${money(amount * 12, code)} a year · ${money(amount * 36, code)} over 3 years`);
  if (costs.length) sections.push({ title: "What you spend", lines: [...costs, "The 3-year total assumes your bill stays the same."] });
  if (audit.unknownCosts) sections.push({ title: "Bills to add", lines: [
    `We have not included ${audit.tools.filter((tool) => !hasCost(tool)).map((tool) => tool.name).join(", ")} in the total because the bill is missing or unfinished.`
  ] });
  if (audit.currencies.length > 1) sections.push({ title: "Bills in different currencies", lines: ["Each currency has its own total. We have not converted your bills."] });
  for (const tool of audit.tools) {
    sections.push({ title: `${tool.name}: ${verdictLabels[verdict(tool)]}`, lines: [
      ...(hasCost(tool) ? [`${money(monthlyOf(tool), tool.currency)} a month`] : []),
      explanation(tool),
      ...(tool.features.length ? [`You use it for: ${tool.features.join(", ")}.`] : []),
      ...(hasRequest(tool) ? [`You want: “${tool.wish}”`] : []),
    ] });
  }
  if (audit.headcount) sections.push({ title: "Before adding more people", lines: [
    `${audit.tools.filter(headcountPriced).map((tool) => tool.name).join(", ")} charges by user. Check who needs paid access before adding accounts.`,
    ...(audit.growthKnown ? [
      `With ${audit.futureTeam} people instead of ${audit.currentTeam}, your yearly total could be ${Object.entries(audit.futureTotals).map(([code, value]) => money(value * 12, code)).join(" + ")}.`,
      "This assumes paid accounts grow at the same rate as your team. Other charges stay the same."
    ] : [])
  ] });
  if (audit.overlaps.length) sections.push({ title: "Are you paying twice for the same job?", lines: [
    ...audit.overlaps.map((group) => `${group.tools.map((tool) => tool.name).join(" and ")} are similar types of tools. Check whether your team uses them for the same task. You may still need both.`)
  ] });
  sections.push({ title: "Want help deciding?", lines: [
    "We can check what your team needs, what a change would cost and whether it is worth doing.",
    "We may recommend keeping your tools, improving them or building something for your business.",
    "Talk through my results: https://www.runrentless.com/contact"
  ] });
  const note = "This automated review uses your answers. We would check the full cost before recommending a change. No savings are promised.";
  const text = `Hi ${firstName},\n\nYOUR TOOL ACTION PLAN\n\n${sections.map((section) => `${section.title.toUpperCase()}\n${section.lines.join("\n")}`).join("\n\n")}\n\n${note}\n\nRun Rentless`;
  const content = sections.map((section) => `<section style="padding:20px 0;border-bottom:1px solid #d8ded4"><h2 style="margin:0 0 12px;font-size:22px;line-height:1.3">${escape(section.title)}</h2>${section.lines.map((line) => line.startsWith("Talk through my results:") ? '<p><a href="https://www.runrentless.com/contact" style="display:inline-block;padding:14px 22px;background:#031e19;color:#fdfff4;text-decoration:none;font-weight:bold">Talk Through My Results</a></p>' : `<p style="margin:10px 0">${escape(line)}</p>`).join("")}</section>`).join("");
  const html = `<div style="background:#031e19;padding:24px 12px;font-family:Arial,sans-serif;color:#031e19;line-height:1.6"><div style="max-width:680px;margin:auto;background:#fdfff4"><div style="padding:28px;background:#031e19;color:#fdfff4"><img src="https://www.runrentless.com/brand/run-rentless-logo-reverse.png" width="118" alt="Run Rentless"><h1 style="font-size:30px;line-height:1.15">Your tool action plan</h1></div><div style="padding:28px"><p>Hi ${escape(firstName)},</p><p>Here is what to check and what to do next.</p>${content}<p style="font-size:12px;margin-top:24px">${escape(note)}</p></div></div></div>`;
  return { text, html };
}
