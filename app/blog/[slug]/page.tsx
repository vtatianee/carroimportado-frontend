import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import NavHeader from "../../components/NavHeader";
import { getPostBySlug, getPublishedPosts, getPostBody, getRelatedSlugs, type BlogPost } from "../../lib/blog";
import { SEO_POSTS } from "../../lib/blog-seo";
import { formatPostDate } from "../../lib/date";

// Gera as rotas estáticas apenas para posts publicados
export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };
  const seo = SEO_POSTS[post.slug];

  return {
    // absolute: sem o sufixo "| Carro Importado" do layout. O título longo do
    // post era cortado na busca justo antes do sufixo; o nome do site já
    // aparece no resultado pelo schema WebSite da home.
    title: { absolute: seo?.titulo ?? post.title },
    description: seo?.descricao ?? post.excerpt,
    alternates: { canonical: `https://www.carroimportado.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.carroimportado.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage
        ? [{ url: `https://www.carroimportado.com${post.coverImage}`, width: 1200, height: 630 }]
        : [{ url: "https://www.carroimportado.com/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

/**
 * "Leia também": posts com tag em comum primeiro e, se faltar, os mais
 * recentes — todo post termina com 3 links para outros posts.
 */
function postsRelacionados(post: BlogPost, limite = 3): BlogPost[] {
  const publicados = getPublishedPosts();
  const porTag = getRelatedSlugs(post.slug, limite)
    .map((s) => publicados.find((p) => p.slug === s))
    .filter((p): p is BlogPost => !!p);
  const recentes = publicados.filter((p) => p.slug !== post.slug && !porTag.includes(p));
  return [...porTag, ...recentes].slice(0, limite);
}

const LOGO = {
  "@type": "ImageObject",
  url: "https://www.carroimportado.com/icon.png",
  width: 512,
  height: 512,
};

/**
 * Tabelas do markdown rolam dentro do próprio contêiner. Sem isso, uma tabela
 * de 4 colunas provoca scroll horizontal na página inteira no celular.
 */
const MD_COMPONENTS = {
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto my-6">
      <table {...props} />
    </div>
  ),
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const body = getPostBody(slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Carro Importado", url: "https://www.carroimportado.com" },
    publisher: {
      "@type": "Organization",
      name: "Carro Importado",
      url: "https://www.carroimportado.com",
      logo: LOGO,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.carroimportado.com/blog/${post.slug}`,
    },
    inLanguage: "pt-BR",
    keywords: post.tags.join(", "),
    ...(post.coverImage
      ? { image: `https://www.carroimportado.com${post.coverImage}` }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://www.carroimportado.com/blog" },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: `https://www.carroimportado.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]) }}
      />
      <NavHeader activePage="blog" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-slate-600 truncate">{post.title}</span>
        </div>

        {/* Header do post */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-3">
            {post.title}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              {formatPostDate(post.date)}
            </span>
            <span>·</span>
            <span>{post.readTimeMin} min de leitura</span>
          </div>
        </header>

        {/* next/image: a capa é o maior elemento da tela (LCP). Servida no
            tamanho da coluna e em WebP/AVIF, em vez do JPEG original de até 570 KB. */}
        {post.coverImage && (
          <div className="relative w-full h-64 mb-8 overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        )}

        {/* Conteúdo do post */}
        {/* `sm:prose-base` em vez de `sm:prose`: o `prose` cheio reaplica
            max-width:65ch dentro do media query e vence o `max-w-none`, deixando
            o corpo do texto (578px) mais estreito que o título (672px). O
            modificador de tamanho só ajusta a tipografia, sem mexer na largura. */}
        <article className="prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-table:text-sm">
          {body ? (
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={MD_COMPONENTS}
            >
              {body}
            </Markdown>
          ) : (
            <p className="text-slate-400 italic">Conteúdo em preparação.</p>
          )}
        </article>

        {/* CTA final */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="font-bold text-slate-900 mb-1">Calcule o custo de importação</p>
          <p className="text-slate-500 text-sm mb-4">
            Use nossa calculadora gratuita para estimar impostos e custo total de qualquer carro dos EUA.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            🚗 Abrir calculadora
          </Link>
        </div>

        <nav className="mt-12" aria-labelledby="leia-tambem">
          <h2 id="leia-tambem" className="text-lg font-bold text-slate-900 mb-4">
            Leia também
          </h2>
          <ul className="space-y-3">
            {postsRelacionados(post).map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition"
                >
                  <span className="block font-semibold text-slate-900 leading-snug">{r.title}</span>
                  <span className="block text-xs text-slate-500 mt-1">
                    {formatPostDate(r.date)} · {r.readTimeMin} min de leitura
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 text-center">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
            ← Voltar ao blog
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-4">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 carroimportado.com</p>
        </div>
      </footer>
    </div>
  );
}
