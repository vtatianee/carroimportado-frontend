import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.carroimportado.com";
  const now = new Date();

  return [
    {
      url: base + "/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/guia`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date("2026-05-27"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // /privacy e /terms têm robots noindex — omitidos do sitemap intencionalmente
  ];
}
