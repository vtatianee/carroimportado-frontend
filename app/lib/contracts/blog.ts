import { z } from "zod";

/**
 * Contrato dos posts do blog.
 *
 * `BlogPostFrontmatterSchema` valida o frontmatter dos arquivos em
 * content/blog/*.md no momento da leitura — post malformado quebra o
 * `next build` em vez de ir para produção quebrado.
 *
 * `BlogPostSchema` é o que sai na API: mesmo shape, mas com `coverImage` e
 * `webUrl` já absolutizados, porque o app não tem /public para resolver
 * caminho relativo.
 */

// Aceita "2026-07-23" (o formato usado em todos os posts hoje)
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve ser YYYY-MM-DD");

export const BlogPostFrontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: IsoDate,
  readTimeMin: z.number().int().positive(),
  tags: z.array(z.string()).min(1),
  published: z.boolean(),
  coverImage: z.string().optional(),
});

export const BlogPostSchema = BlogPostFrontmatterSchema.extend({
  coverImage: z.string().url().optional(),
  webUrl: z.string().url(),
});

export const TocEntrySchema = z.object({
  depth: z.number().int().min(2).max(4),
  text: z.string(),
  id: z.string(),
});

export const BlogListSchema = z.object({
  posts: z.array(BlogPostSchema),
});

export const BlogDetailSchema = z.object({
  post: BlogPostSchema,
  format: z.literal("markdown-gfm"),
  body: z.string(),
  toc: z.array(TocEntrySchema),
  related: z.array(z.string()),
});

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type TocEntry = z.infer<typeof TocEntrySchema>;
export type BlogList = z.infer<typeof BlogListSchema>;
export type BlogDetail = z.infer<typeof BlogDetailSchema>;
