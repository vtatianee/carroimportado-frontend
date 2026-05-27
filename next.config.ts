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
        // Aplica a todas as rotas de página (não a _next/static)
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
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
