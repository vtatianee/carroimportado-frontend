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
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /privacy e /terms têm robots noindex — omitidos do sitemap intencionalmente
  ];
}
