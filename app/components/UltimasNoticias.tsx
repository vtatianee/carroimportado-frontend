import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "../lib/blog";
import { formatPostDate } from "../lib/date";

/**
 * "Últimas notícias" da home: os 3 posts mais recentes.
 *
 * Server Component de propósito: lê o blog do disco (fs) e sai pronto no HTML,
 * sem nada no JavaScript do cliente. Entra na home (que é client) como prop,
 * montado em app/page.tsx. Como os posts vivem no repositório, cada deploy de
 * post novo já atualiza a lista.
 *
 * Fica longe do topo (depois do card do jogo): não compete com a calculadora
 * nem com o pedido de orçamento, e não encosta no futuro slot de anúncio
 * abaixo do resultado — card com imagem colado em anúncio gera clique
 * acidental, que a política do AdSense pune.
 *
 * Sem trecho: os títulos já têm ~100 caracteres. Celular = lista com
 * miniatura; desktop = 3 cards com capa 16:9. Imagens com lazy load e espaço
 * reservado (sem CLS, sem impacto no LCP).
 */
export default function UltimasNoticias({ limite = 3 }: { limite?: number }) {
  const posts = getPublishedPosts().slice(0, limite);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="ultimas-noticias"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2 id="ultimas-noticias" className="text-lg font-bold text-slate-900">
          Últimas notícias sobre importação
        </h2>
        <Link href="/blog" className="hidden sm:inline shrink-0 text-sm font-semibold text-blue-700 hover:underline">
          Ver todas →
        </Link>
      </div>

      <ul className="divide-y divide-slate-100 sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
        {posts.map((post) => (
          <li key={post.slug} className="py-3 first:pt-0 last:pb-0 sm:py-0">
            <Link href={`/blog/${post.slug}`} className="group flex gap-3 sm:flex-col">
              {post.coverImage && (
                <div className="relative w-24 h-[72px] sm:w-full sm:h-auto sm:aspect-[16/9] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 300px, 96px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 leading-snug line-clamp-3 sm:line-clamp-2 group-hover:text-blue-700">
                  {post.title}
                </p>
                <p className="text-sm text-slate-500 mt-1">{formatPostDate(post.date)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/blog" className="sm:hidden block mt-3 text-sm font-semibold text-blue-700 hover:underline">
        Ver todas as notícias →
      </Link>
    </section>
  );
}
