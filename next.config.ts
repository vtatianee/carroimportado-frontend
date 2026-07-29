import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect de carroimportado.com → www.carroimportado.com
  // configurado no Vercel como 308 Permanent Redirect (não via código).

  // Impede o Cloudflare de cachear páginas HTML por longos períodos.
  // s-maxage=0 diz a proxies/CDNs (Cloudflare) para não cachearem;
  // Vercel ainda usa seu próprio edge cache interno separado.
  async headers() {
    return [
      {
        // Aplica a todas as rotas de página (não a _next/static).
        //
        // `api/content` fica de fora porque é a API de conteúdo consumida pelo
        // app iOS: ela precisa ser cacheada no CDN (s-maxage=3600) e os headers
        // definidos aqui vencem os do route handler, anulando qualquer cache.
        // As demais rotas /api/* (analyze, calculate, search, reverse) continuam
        // incluídas de propósito — são dinâmicas e não devem ser cacheadas.
        source: "/((?!_next/static|_next/image|favicon.ico|api/content).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
