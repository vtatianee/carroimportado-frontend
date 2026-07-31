import { NextRequest } from "next/server";
import {
  getPostBySlug,
  getPostBody,
  getToc,
  getRelatedSlugs,
} from "../../../../../lib/blog";
import { contentResponse, contentError } from "../../../../../lib/content/respond";
import { toApiPost } from "../../../../../lib/content/blog-api";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 3600;

/**
 * Corpo do post em markdown cru.
 *
 * Serve markdown, não HTML pré-renderizado, de propósito: mantém o endpoint
 * burro e permite corrigir o renderizador do app via OTA, sem redeploy do site.
 * O `toc` vem pronto para o app não precisar de um parser só para montar a
 * lista de atalhos — e os ids batem com os que o rehype-slug gera no site.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) {
    return contentError(404, "post_nao_encontrado", `Nenhum post publicado com slug "${slug}".`);
  }

  const body = getPostBody(slug);
  if (!body) {
    // Post existe mas ainda está em TSX (migração incompleta).
    return contentError(
      503,
      "corpo_indisponivel",
      "O conteúdo deste post ainda não está disponível em markdown."
    );
  }

  return contentResponse(
    req,
    {
      post: toApiPost(post),
      format: "markdown-gfm" as const,
      body,
      toc: getToc(body),
      related: getRelatedSlugs(slug),
    },
    { sMaxAge: S_MAX_AGE, updatedAt: new Date(`${post.date}T12:00:00Z`).toISOString() }
  );
}
