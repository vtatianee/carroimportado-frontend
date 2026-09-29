import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
// A importação costuma levar ~10 s. Se passar disto, o backend termina sozinho
// mesmo assim (ele não cancela quando quem chamou desiste de esperar).
export const maxDuration = 60;

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";

function segredoValido(authHeader: string | null, secret: string): boolean {
  if (!authHeader) return false;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Cron semanal (vercel.json) da importação de carros do jogo. Só repassa ao
 * backend, que faz o scraping e grava no banco — é lá que fica o
 * x-internal-secret exigido por GET /api/jogo/import.
 */
export async function GET(req: NextRequest) {
  const CRON_SECRET = process.env.CRON_SECRET;
  const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

  // Fail-closed, como o weekly-report: cada execução gasta créditos do ScraperAPI.
  if (!CRON_SECRET || !INTERNAL_SECRET) {
    console.error("[jogo/import] CRON_SECRET ou INTERNAL_SECRET não configurado — rota bloqueada.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!segredoValido(req.headers.get("authorization"), CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/jogo/import`, {
      headers: { "x-internal-secret": INTERNAL_SECRET },
      signal: AbortSignal.timeout(55_000),
      cache: "no-store",
    });
    const resumo = await res.json().catch(() => null);
    if (!res.ok) console.error("[jogo/import] backend respondeu", res.status, resumo);
    else console.log("[jogo/import] concluída:", JSON.stringify(resumo));
    return NextResponse.json(resumo ?? { error: "Resposta inválida do backend" }, { status: res.status });
  } catch (err) {
    console.error("[jogo/import] erro:", err);
    return NextResponse.json({ error: "Falha ao chamar o backend" }, { status: 502 });
  }
}
