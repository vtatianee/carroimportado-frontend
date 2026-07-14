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
    slug: "despachante-aduaneiro-importacao-carro-americano",
    title: "Despachante aduaneiro para importação de carro americano: o que faz, quanto cobra e como escolher",
    excerpt:
      "O despachante aduaneiro é o profissional que conduz o desembaraço do seu carro na alfândega — sem ele, dificilmente o processo avança. Entenda o que está incluído nos honorários (R$ 4.000–10.000), quais custos são cobrados à parte e o que observar antes de contratar.",
    date: "2026-07-14",
    readTimeMin: 5,
    tags: ["Guia", "Despachante", "Processo", "Custos"],
    published: true,
    coverImage: "/blog/despachante-aduaneiro-importacao-carro-americano.jpg",
  },
  {
    slug: "icms-importacao-carro-por-estado-brasil-2026",
    title: "ICMS na importação de carros: qual estado cobra menos e quanto isso muda o custo total",
    excerpt:
      "A alíquota de ICMS varia de 12% (SP, SC, RS, PR, MG) a 20% (RJ) — e por causa do cálculo 'por dentro', essa diferença representa R$ 30.000 a R$ 60.000 no custo total de um clássico americano. Entenda como funciona e o que vale simular antes de decidir.",
    date: "2026-07-09",
    readTimeMin: 5,
    tags: ["Impostos", "ICMS", "Estados", "Custos"],
    published: true,
    coverImage: "/blog/icms-importacao-carro-por-estado-brasil-2026.jpg",
  },
  {
    slug: "cambio-dolar-julho-2026-importacao-carro-americano",
    title: "Dólar a R$ 5,15 vs. R$ 6,27: quanto a queda do câmbio economiza de verdade na importação do seu carro",
    excerpt:
      "O dólar caiu 18% desde o pico de dezembro de 2024. Num processo com impostos em cascata, essa diferença no câmbio vale muito mais do que parece — estamos falando de R$ 50–66 mil a mais ou a menos no custo total de um clássico americano.",
    date: "2026-07-07",
    readTimeMin: 4,
    tags: ["Câmbio", "Custos", "Mercado"],
    published: true,
    coverImage: "/blog/cambio-dolar-julho-2026-importacao-carro-americano.jpg",
  },
  {
    slug: "custos-ocultos-importacao-carro-eua-brasil",
    title: "Os custos ocultos de importar um carro americano que ninguém calcula antes",
    excerpt:
      "AFRMM, capatazia, armazenagem, despachante, frete interno — esses itens somam 15% a 25% do custo total e raramente aparecem nas simulações. Entenda cada um e por que eles encarecem ainda mais os impostos.",
    date: "2026-07-02",
    readTimeMin: 5,
    tags: ["Guia", "Custos", "Importação"],
    published: true,
    coverImage: "/blog/custos-ocultos-importacao-carro-eua-brasil.jpg",
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
