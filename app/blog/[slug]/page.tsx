import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavHeader from "../../components/NavHeader";
import { getPostBySlug, getPublishedPosts } from "../../data/blog";

// Gera as rotas estáticas apenas para posts publicados
export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.excerpt,
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

// Importa dinamicamente o conteúdo do post pelo slug
async function loadPostContent(slug: string): Promise<React.ComponentType | null> {
  try {
    const mod = await import(`./content/${slug}`);
    return mod.default ?? null;
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const PostContent = await loadPostContent(slug);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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
              {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{post.readTimeMin} min de leitura</span>
          </div>
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl mb-8 object-cover max-h-64"
          />
        )}

        {/* Conteúdo do post */}
        <article className="prose prose-slate prose-sm sm:prose max-w-none">
          {PostContent ? <PostContent /> : (
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
