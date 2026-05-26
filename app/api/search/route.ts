import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = searchParams.toString();

    const res = await fetch(`${BACKEND_URL}/api/search?${params}`, {
      // 30s timeout — scraping pode ser lento
      signal: AbortSignal.timeout(30_000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[/api/search proxy] error:", err);
    return NextResponse.json(
      { error: "Erro ao buscar anúncios." },
      { status: 500 }
    );
  }
}
