import { explanation, hasCost, money, monthlyOf, summarizeAudit, verdict, type AuditTool, type Billing } from "./audit";

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
  return `${audit.tools.length} tools. ${Object.entries(audit.totals).map(([code, amount]) => `${money(amount, code)}/month, ${money(amount * 12, code)}/year, ${money(amount * 36, code)}/3 years`).join("; ")}. ${audit.counts.KEEP} KEEP, ${audit.counts["LOOK CLOSER"]} LOOK CLOSER, ${audit.counts["BUILD AROUND"]} BUILD AROUND. ${audit.unknownCosts} missing costs.`;
}

export function reportEmail(firstName: string, audit: AuditReport) {
  const costs = Object.entries(audit.totals).map(([code, amount]) => `${code}: ${money(amount, code)}/month | ${money(amount * 12, code)}/year | ${money(amount * 36, code)} over 3 years`).join("\n") || "No complete costs were entered.";
  const growth = audit.growthKnown && audit.headcount ? `At ${audit.futureTeam} people, compared with ${audit.currentTeam} today: ${Object.entries(audit.futureTotals).map(([code, value]) => `${money(value * 12, code)}/year`).join("; ")}. This scenario assumes paid seats grow in proportion to headcount, with rates, base fees and other usage unchanged.` : "No headcount-growth scenario was calculated. Supply current and expected team sizes plus per-seat pricing to explore one.";
  const overlap = audit.overlaps.map((group) => `${group.category}: ${group.tools.map((tool) => tool.name).join(", ")}`).join("\n") || "No shared-category overlap identified.";
  const details = audit.tools.map((tool) => `${tool.name} | ${verdict(tool)}\n${hasCost(tool) ? `${money(monthlyOf(tool), tool.currency)}/month; ${money(monthlyOf(tool) * 12, tool.currency)}/year; ${money(monthlyOf(tool) * 36, tool.currency)} over three years` : "Cost not supplied or incomplete"}\n${explanation(tool)}\nFunctions: ${tool.features.join(", ") || "Not supplied"}\nUsers: ${tool.users || "Not supplied"}; Workarounds: ${tool.workaround || "Not supplied"}\nData: ${tool.data || "Not supplied"}; Impact of outage: ${tool.criticality || "Not supplied"}\nWhat you want to improve: ${tool.wish || "Not supplied"}`).join("\n\n");
  const priority = audit.priority ? `Start with ${audit.priority.name}. ${audit.priority.wish ? `You said: "${audit.priority.wish}". ` : ""}Investigate the workflow, data, integrations, migration, infrastructure and maintenance before deciding to replace anything.` : "Your answers do not yet identify a clear ownership opportunity. Keep what works and investigate specific problems as they arise.";
  const text = `Hi ${firstName},\n\nYOUR SOFTWARE RENT AUDIT\n${audit.tools.length} tools reviewed\n\nYOUR COSTS\n${costs}\n${audit.unknownCosts} tools with missing or incomplete costs excluded. Currencies are kept separate.\n\nGROWTH PROFILE\n${audit.headcount} priced by headcount, ${audit.usage} by usage or contacts, ${audit.flat} flat-price.\n${growth}\n\nINITIAL RECOMMENDATIONS\n${details}\n\nPOSSIBLE OVERLAP\n${overlap}\nShared categories are a prompt to inspect the workflow, not proof of duplication.\n\nYOUR NEXT STEP\n${priority}\n\nBased only on the costs you entered. We have not assumed price increases, extra employees or increased usage in the three-year totals. This is not estimated savings. These initial signals have not been manually reviewed. A Software Ownership Assessment is needed to price a build, migration, infrastructure and maintenance.\n\nTalk to Run Rentless: https://www.runrentless.com/contact\n\nRun Rentless`;
  const tableRows = audit.tools.map((tool) => `<tr><td style="padding:14px 6px;border-bottom:1px solid #d8ded4"><strong>${escape(tool.name)}</strong><br><small>${escape(tool.category)}</small></td><td style="padding:14px 6px;border-bottom:1px solid #d8ded4">${hasCost(tool) ? escape(money(monthlyOf(tool), tool.currency)) + "/mo" : "Not supplied"}</td><td style="padding:14px 6px;border-bottom:1px solid #d8ded4;font-size:12px"><strong>${verdict(tool)}</strong></td></tr>`).join("");
  const detailHtml = audit.tools.map((tool) => `<section style="padding:20px 0;border-bottom:1px solid #d8ded4"><h3>${escape(tool.name)}</h3><p>${escape(explanation(tool))}</p><p><b>Functions:</b> ${escape(tool.features.join(", ") || "Not supplied")}<br><b>Users:</b> ${escape(tool.users || "Not supplied")}<br><b>Workarounds:</b> ${escape(tool.workaround || "Not supplied")}<br><b>Data:</b> ${escape(tool.data || "Not supplied")}<br><b>Outage impact:</b> ${escape(tool.criticality || "Not supplied")}</p>${tool.wish ? `<blockquote style="margin:16px 0;padding-left:16px;border-left:4px solid #c6ff00">${escape(tool.wish)}</blockquote>` : ""}</section>`).join("");
  const html = `<div style="background:#031e19;padding:24px 12px;font-family:Arial,sans-serif;color:#031e19;line-height:1.6"><div style="max-width:680px;margin:auto;background:#fdfff4"><div style="padding:28px;background:#031e19;color:#fdfff4"><img src="https://www.runrentless.com/brand/run-rentless-logo-reverse.png" width="118" alt="Run Rentless"><h1 style="font-size:32px;line-height:1.1">Your Software Rent Audit</h1></div><div style="padding:28px"><p>Hi ${escape(firstName)},</p><p>Your ${audit.tools.length}-tool review is ready. Here is what your numbers and answers tell us.</p><div style="padding:20px;background:#c6ff00"><h2 style="margin-top:0">Your software commitment</h2><p style="white-space:pre-line">${escape(costs)}</p></div><p style="font-size:12px">${audit.unknownCosts} missing or incomplete costs excluded. Currencies are kept separate.</p><table style="width:100%;border-collapse:collapse">${tableRows}</table><h2>How the cost could grow</h2><p>${audit.headcount} tools priced by headcount. ${audit.usage} priced by usage or contacts. ${audit.flat} flat-price.</p><p>${escape(growth)}</p><h2>What to keep, investigate or build around</h2>${detailHtml}<h2>Possible overlap</h2><p style="white-space:pre-line">${escape(overlap)}</p><p>Shared categories do not prove duplication. Check whether the tools support the same workflow.</p><h2>Your next step</h2><p>${escape(priority)}</p><p><a href="https://www.runrentless.com/contact" style="display:inline-block;padding:14px 22px;background:#031e19;color:#fdfff4;text-decoration:none;font-weight:bold">Talk to Run Rentless</a></p><p style="font-size:12px">Based only on the costs you entered. The three-year totals assume unchanged prices and usage. This is not estimated savings. These initial signals have not been manually reviewed. An assessment is needed before recommending a replacement.</p></div></div></div>`;
  return { text, html };
}
