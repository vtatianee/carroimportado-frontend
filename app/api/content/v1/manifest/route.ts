import { NextRequest } from "next/server";
import { getPublishedPosts } from "../../../../lib/blog";
import { EMPRESAS, CATEGORIAS_RFQ, ESPECIALIDADE_CORES as CORES_EMPRESAS } from "../../../../data/empresas";
import { PECAS, ESPECIALIDADE_CORES as CORES_PECAS } from "../../../../data/pecas";
import { STEPS, COSTS_SUMMARY, CHECKLIST_GROUPS } from "../../../../data/guia";
import { contentResponse, etagOf, BUILD_ID, DEPLOY_TIME } from "../../../../lib/content/respond";
import { coresToHex } from "../../../../lib/content/palette";
import { toApiPost } from "../../../../lib/content/blog-api";

export const dynamic = "force-dynamic";

const S_MAX_AGE = 60;

/**
 * Índice de todas as coleções, com o ETag de cada uma.
 *
 * O app chama isto no cold start (e no foreground, no máximo 1x/hora) e compara
 * os ETags com os que tem em cache. Quando nada mudou, economiza quatro
 * requisições — que é a diferença entre abrir o app instantâneo e esperar rede.
 *
 * Os payloads abaixo precisam ser montados EXATAMENTE como cada rota monta o
 * seu, senão o ETag daqui não bate com o de lá e o app rebaixa cache à toa.
 */
export async function GET(req: NextRequest) {
  const posts = getPublishedPosts().map(toApiPost);

  const blogPayload = { posts };
  const empresasPayload = {
    empresas: EMPRESAS,
    categorias: CATEGORIAS_RFQ,
    especialidadeCores: coresToHex(CORES_EMPRESAS),
  };
  const pecasPayload = {
    pecas: PECAS,
    especialidadeCores: coresToHex(CORES_PECAS),
  };
  const guiaPayload = {
    steps: STEPS,
    costsSummary: COSTS_SUMMARY,
    checklist: CHECKLIST_GROUPS,
    checklistStorageKey: "carroimportado_checklist_v1",
  };

  return contentResponse(
    req,
    {
      buildId: BUILD_ID,
      collections: {
        blog: {
          etag: etagOf(blogPayload),
          count: posts.length,
          updatedAt: posts[0]?.date ? new Date(posts[0].date).toISOString() : DEPLOY_TIME,
        },
        empresas: {
          etag: etagOf(empresasPayload),
          count: EMPRESAS.length,
          updatedAt: DEPLOY_TIME,
        },
        pecas: {
          etag: etagOf(pecasPayload),
          count: PECAS.length,
          updatedAt: DEPLOY_TIME,
        },
        guia: {
          etag: etagOf(guiaPayload),
          count: STEPS.length,
          updatedAt: DEPLOY_TIME,
        },
      },
    },
    { sMaxAge: S_MAX_AGE }
  );
}
