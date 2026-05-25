import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redireciona carroimportado.com → www.carroimportado.com (301 permanente)
      // Resolve o problema de canonical duplicado no Google Search Console.
      // O ads.txt também redireciona para www — AdSense segue 301/308.
      {
        source: "/:path*",
        has: [{ type: "host", value: "carroimportado.com" }],
        destination: "https://www.carroimportado.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
