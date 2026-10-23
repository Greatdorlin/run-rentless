import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.runrentless.com";
  // Do not invent a fresh modification date every time an unrelated build runs.
  return ["", "/webinar", "/moredone", "/privacy", "/terms", "/contact"].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "/webinar" || path === "/moredone" ? "weekly" : path ? "yearly" : "monthly", priority: path === "/webinar" ? 0.9 : path === "/moredone" ? 0.8 : path ? 0.5 : 1 }));
}
