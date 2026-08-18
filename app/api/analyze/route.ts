import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Diagnóstico temporário: confirma se a env var chega no runtime da
    // função sem logar o valor. Remover depois de confirmar em produção.
    console.log("[/api/analyze proxy] INTERNAL_SECRET presente:", !!process.env.INTERNAL_SECRET);

    const res = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.INTERNAL_SECRET ? { "x-internal-secret": process.env.INTERNAL_SECRET } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[/api/analyze proxy] error:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}
