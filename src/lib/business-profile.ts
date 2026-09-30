export const positions = [
  "Founder / Owner", "CEO / Managing Director", "Business Manager", "Operations Manager",
  "Brand Manager", "Marketing Manager", "Sales Manager", "Finance Manager",
  "HR Manager", "Product Manager", "Technology Lead", "Consultant", "Other",
] as const;

export const businessSectors = [
  "Agriculture", "Arts & Entertainment", "Automotive", "Beauty & Personal Care",
  "Construction & Property", "Consulting & Professional Services", "Education",
  "Energy & Utilities", "Finance", "Food & Hospitality", "Government & Nonprofit",
  "Health", "Logistics & Transport", "Manufacturing", "Marketing & Media",
  "Retail & E-commerce", "Software", "Telecommunications", "Travel & Tourism", "Other",
] as const;

const sectorAliases: Record<string, (typeof businessSectors)[number]> = {
  saas: "Software", "software as a service": "Software", tech: "Software",
  "software development": "Software", it: "Software", "information technology": "Software",
  healthtech: "Health", healthcare: "Health", medical: "Health", medtech: "Health",
  fintech: "Finance", banking: "Finance", insurance: "Finance",
  edtech: "Education", elearning: "Education",
  ecommerce: "Retail & E-commerce", "e-commerce": "Retail & E-commerce",
  retail: "Retail & E-commerce", hospitality: "Food & Hospitality",
  realestate: "Construction & Property", "real estate": "Construction & Property",
  agency: "Marketing & Media", advertising: "Marketing & Media",
  ngo: "Government & Nonprofit", nonprofit: "Government & Nonprofit",
};

export function normalizeBusinessSector(value: string) {
  const entered = value.trim().replace(/\s+/g, " ").slice(0, 100);
  if (!entered) return "";
  const match = businessSectors.find((sector) => sector.toLowerCase() === entered.toLowerCase());
  return match || sectorAliases[entered.toLowerCase()] || entered;
}
