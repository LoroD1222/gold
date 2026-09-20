import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://goldentrips.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/tanzania-safaris`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tanzania-safaris/great-migration-river-crossing-serengeti`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
