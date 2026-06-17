import type { Metadata } from "next";
import Link from "next/link";
import NavHeader from "../components/NavHeader";
import { getPublishedPosts } from "../data/blog";

export const metadata: Metadata = {
  title: "Blog — Importação de Carros dos EUA",
  description:
    "Artigos, guias e dicas sobre importação de carros americanos para o Brasil. Impostos, documentação, melhores modelos e mais.",
  alternates: { canonical: "https://www.carroimportado.com/blog" },
  openGraph: {
    title: "Blog — Importação de Carros dos EUA para o Brasil",
    description:
      "Artigos e guias sobre importação de carros americanos: impostos, documentação, melhores modelos e dicas práticas.",
    url: "https://www.carroimportado.com/blog",
    images: [{ url: "https://www.carroimportado.com/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavHeader activePage="blog" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Blog</h1>
          <p className="text-slate-500 text-base">
            Guias, análises e dicas sobre importação de carros dos EUA para o Brasil.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-4xl mb-4">✍️</p>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Em breve</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Estamos preparando artigos sobre importação de carros americanos.
              Volte em breve ou explore o guia completo enquanto isso.
            </p>
            <Link
              href="/guia"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              📋 Ver guia de importação
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      {" · "}{post.readTimeMin} min de leitura
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-blue-600 font-semibold hover:underline"
                  >
                    Ler artigo →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-4">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 carroimportado.com</p>
        </div>
      </footer>
    </div>
  );
}
