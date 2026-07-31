import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { BlogPostFrontmatterSchema, type TocEntry } from "./contracts";

/**
 * Leitor dos posts do blog.
 *
 * Fonte única: content/blog/<slug>.md, com metadados no frontmatter.
 *
 * Mantém a MESMA superfície exportada que app/data/blog.ts tinha (BlogPost,
 * BLOG_POSTS, getPublishedPosts, getPostBySlug), para que app/blog/page.tsx,
 * app/sitemap.ts e o content API não precisassem mudar além do import.
 *
 * Para publicar um post: criar content/blog/<slug>.md com o frontmatter
 * (slug, title, excerpt, date, readTimeMin, tags, published, coverImage).
 * O frontmatter é validado por zod na leitura — post malformado quebra o
 * `next build` em vez de ir para produção quebrado.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTimeMin: number;
  tags: string[];
  published: boolean;
  coverImage?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function readMarkdownPosts(): { post: BlogPost; body: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);

      // gray-matter converte `date: 2026-07-30` do YAML em Date. Normalizamos
      // de volta para "YYYY-MM-DD" antes de validar — datas de post são dias de
      // calendário, não instantes (ver app/lib/date.ts).
      const normalized = {
        ...data,
        date: data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : data.date,
        slug: data.slug ?? file.replace(/\.md$/, ""),
      };

      const parsed = BlogPostFrontmatterSchema.safeParse(normalized);
      if (!parsed.success) {
        // Falha no build em vez de publicar post quebrado.
        throw new Error(
          `Frontmatter inválido em content/blog/${file}:\n` +
            parsed.error.issues
              .map((i) => `  ${i.path.join(".") || "(raiz)"}: ${i.message}`)
              .join("\n")
        );
      }

      return { post: parsed.data as BlogPost, body: content.trim() };
    });
}

let _cache: { post: BlogPost; body: string }[] | null = null;

function allPosts(): { post: BlogPost; body: string }[] {
  if (!_cache) _cache = readMarkdownPosts();
  return _cache;
}

export const BLOG_POSTS: BlogPost[] = allPosts().map((p) => p.post);

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.published).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug && p.published);
}

/** Corpo em markdown. Retorna null para posts ainda não convertidos. */
export function getPostBody(slug: string): string | null {
  const found = allPosts().find((p) => p.post.slug === slug);
  return found && found.body ? found.body : null;
}

/**
 * Índice de seções, calculado no servidor para o app não precisar de um parser
 * de markdown só para montar a lista de atalhos. Os ids batem com os que o
 * rehype-slug gera no site, então âncoras funcionam nos dois.
 */
export function getToc(body: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  for (const line of body.split("\n")) {
    const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/\*\*/g, "").replace(/\*/g, "").trim();
    toc.push({ depth: m[1].length, text, id: slugger.slug(text) });
  }

  return toc;
}

/** Até 3 posts que compartilham tag com o dado, mais recentes primeiro. */
export function getRelatedSlugs(slug: string, limit = 3): string[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  return getPublishedPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit)
    .map((p) => p.slug);
}
