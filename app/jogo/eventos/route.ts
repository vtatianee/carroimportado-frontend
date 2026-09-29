import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";

// Proxy para POST /api/eventos do backend, no mesmo padrão das rotas em
// app/api/*: o navegador não fala direto com o Railway, e o x-internal-secret
// fica só no servidor. A validação do evento é feita no backend.
export async function POST(req: NextRequest) {
  const corpo = await req.text();
  if (corpo.length > 1000) return new NextResponse(null, { status: 413 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/eventos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.INTERNAL_SECRET ? { "x-internal-secret": process.env.INTERNAL_SECRET } : {}),
      },
      body: corpo,
      signal: AbortSignal.timeout(5_000),
    });
    return new NextResponse(null, { status: res.ok ? 204 : res.status });
  } catch (err) {
    console.error("[/jogo/eventos proxy] error:", err);
    return new NextResponse(null, { status: 502 });
  }
}
