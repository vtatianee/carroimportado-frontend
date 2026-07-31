import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Pede ao browser que revalide páginas HTML antes de reusar o cache.
 * "no-cache" = guarda a cópia, mas sempre confirma com o servidor (HTTP 304 se
 * não mudou). Isso faz novos deploys aparecerem imediatamente.
 *
 * _next/static, _next/image e api/ ficam de fora — têm seu próprio cache.
 *
 * ATENÇÃO ao `CDN-Cache-Control` abaixo: ele NÃO controla o Cloudflare neste
 * projeto. Esse header só é interpretado no plano Enterprise, e o domínio está
 * no plano free — ou seja, é inerte hoje. Mantido porque é o header correto por
 * padrão e passa a valer se o plano mudar, mas não confie nele.
 *
 * Quem de fato decide o cache de HTML são as Cache Rules do painel do
 * Cloudflare. Em 14/07/2026 uma regra chamada "Static files - images and fonts"
 * ficou com a lista de extensões vazia — `extension in {""}` casa com URLs SEM
 * extensão, isto é, todas as páginas — e com a opção "Ignore cache-control
 * header", o que fez o Cloudflare guardar HTML por 1 mês ignorando tudo o que
 * este arquivo e o next.config.ts enviam. Sintoma: post novo em 404 ou ausente
 * da listagem, sem que hard refresh resolvesse. Corrigido em 30/07/2026.
 *
 * Se cache voltar a dar problema, verificar as Cache Rules ANTES de mexer aqui:
 *   curl -sI https://www.carroimportado.com/blog | grep -iE 'cf-cache-status|cache-control'
 * O esperado para HTML é `DYNAMIC` (ou `BYPASS`) e `no-cache, must-revalidate`.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-cache, must-revalidate');
  response.headers.set('CDN-Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas as rotas de página, exceto:
     * - _next/static (assets JS/CSS com hash — cacheados para sempre)
     * - _next/image  (otimização de imagens)
     * - favicon.ico
     * - /api/        (rotas de API têm seu próprio controle de cache)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/).*)',
  ],
};
