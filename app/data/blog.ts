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
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "imposto-importacao-eletricos-hibridos-35-2026",
    title: "Imposto de importação de elétricos e híbridos sobe para 35% em julho de 2026",
    excerpt:
      "A partir de julho, carros elétricos e híbridos importados passam a pagar a mesma alíquota máxima de 35% que veículos a combustão. Entenda o que muda no cálculo e quem ainda escapa da alta.",
    date: "2026-06-30",
    readTimeMin: 4,
    tags: ["Impostos", "Elétricos", "Legislação"],
    published: true,
  },
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.published).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug && p.published);
}
