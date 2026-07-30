import { NextRequest } from "next/server";
import { getPublishedPosts } from "../../../../data/blog";
import { contentResponse } from "../../../../lib/content/respond";
import { toApiPost } from "../../../../lib/content/blog-api";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 3600;

export async function GET(req: NextRequest) {
  const posts = getPublishedPosts().map(toApiPost);

  // O post mais recente é uma data de conteúdo de verdade, melhor que o
  // timestamp de deploy para o app decidir se vale rebaixar o cache.
  const updatedAt = posts[0]?.date
    ? new Date(posts[0].date).toISOString()
    : undefined;

  return contentResponse(req, { posts }, { sMaxAge: S_MAX_AGE, updatedAt });
}
