import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.runrentless.com";
  return ["", "/webinar", "/privacy", "/terms", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path ? "yearly" : "monthly", priority: path === "/webinar" ? 0.9 : path ? 0.5 : 1 }));
}
