import type { MetadataRoute } from "next";
import { getPublishedPosts } from "./data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.carroimportado.com";

  const postEntries: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: base + "/",
      lastModified: new Date("2026-06-09"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/guia`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/empresas`,
      lastModified: new Date("2026-05-27"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/pecas`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date("2026-06-17"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date("2026-05-27"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // /privacy e /terms têm robots noindex — omitidos do sitemap intencionalmente
    ...postEntries,
  ];
}
