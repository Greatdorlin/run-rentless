export const moreDonePlans = {
  1: { label: "One place", amount: 12000000, usd: 100 },
  2: { label: "Two places", amount: 0, usd: 180 },
  3: { label: "Three places", amount: 30000000, usd: 250 },
  5: { label: "Five places", amount: 45000000, usd: 375 },
} as const;

export type MoreDoneSeats = keyof typeof moreDonePlans;

export function isMoreDoneSeats(value: unknown): value is MoreDoneSeats {
  return value === 1 || value === 2 || value === 3 || value === 5;
}

export function isMoreDoneNairaSeats(value: unknown): value is 1 | 3 | 5 {
  return value === 1 || value === 3 || value === 5;
}

export const moreDoneProjects = [
  "Customer tracker",
  "Booking and scheduling",
  "Team workboard",
  "Business website",
  "Sales follow-up",
  "Reports and dashboards",
  "AI assistant for my team",
  "A tool for my clients",
  "Something else",
] as const;

export function cleanMoreDoneText(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
