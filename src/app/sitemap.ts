import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.runrentless.com";
  // Do not invent a fresh modification date every time an unrelated build runs.
  return ["", "/webinar", "/privacy", "/terms", "/contact"].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "/webinar" ? "weekly" : path ? "yearly" : "monthly", priority: path === "/webinar" ? 0.9 : path ? 0.5 : 1 }));
}
