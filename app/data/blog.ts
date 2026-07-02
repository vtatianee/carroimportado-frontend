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
    slug: "governo-avalia-nova-alta-imposto-importacao-veiculos-2026",
    title: "Governo avalia nova rodada de altas no imposto de importação de veículos em 2026",
    excerpt:
      "Com a 35% dos elétricos e híbridos já em vigor, a equipe econômica estuda elevar tarifas em mais setores para arrecadar até R$ 14 bilhões. Entenda o que está em jogo para quem quer importar um clássico americano.",
    date: "2026-07-02",
    readTimeMin: 4,
    tags: ["Impostos", "Legislação", "Mercado"],
    published: true,
    coverImage: "/blog/governo-avalia-nova-alta-imposto-importacao-veiculos-2026.jpg",
  },
  {
    slug: "imposto-importacao-eletricos-hibridos-35-2026",
    title: "Imposto de importação de elétricos e híbridos sobe para 35% em julho de 2026",
    excerpt:
      "A partir de julho, carros elétricos e híbridos importados passam a pagar a mesma alíquota máxima de 35% que veículos a combustão. Entenda o que muda no cálculo e quem ainda escapa da alta.",
    date: "2026-06-30",
    readTimeMin: 4,
    tags: ["Impostos", "Elétricos", "Legislação"],
    published: true,
    coverImage: "/blog/imposto-importacao-eletricos-hibridos-35-2026.jpg",
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
