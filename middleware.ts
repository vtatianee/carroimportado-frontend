import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Impede o browser e o Cloudflare de cachear páginas HTML.
 * "no-cache" = sempre revalida com o servidor antes de usar cache.
 * O browser guarda a cópia mas verifica se ainda está atualizada (HTTP 304 se não mudou).
 * Isso garante que novos deploys aparecem imediatamente para todos os usuários.
 *
 * _next/static, _next/image e api/ ficam de fora — esses têm seu próprio cache.
 */
export function middleware(request: NextRequest) {
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
