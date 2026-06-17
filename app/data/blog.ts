export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;         // ISO: "2026-06-20"
  readTimeMin: number;
  tags: string[];
  published: boolean;   // false = rascunho, não aparece na listagem nem indexado
  coverImage?: string;  // path relativo a /public/blog/
}

// Adicione posts aqui. Só aparecem no site quando published: true.
export const BLOG_POSTS: BlogPost[] = [];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.published).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug && p.published);
}
