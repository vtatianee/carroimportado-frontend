import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_VERSION } from "../contracts";

/**
 * Resposta padrão do content API.
 *
 * Envelopa o payload, calcula ETag forte a partir do conteúdo, responde 304
 * quando o cliente já tem a versão atual e aplica os headers de cache.
 *
 * IMPORTANTE: isto só funciona porque `api/content` foi excluído do
 * headers() em next.config.ts. Aquele regex casava com /api/* e carimbava
 * `s-maxage=0`, e headers do next.config vencem os do route handler — ou seja,
 * qualquer cache definido aqui era silenciosamente anulado. Se o cache parar de
 * funcionar, olhar aquele arquivo primeiro.
 */

/** Muda a cada deploy; usado como buildId no manifest. */
export const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "dev";

/**
 * Sinal de "mudou" que o app deve usar é o ETag (derivado do conteúdo), não
 * este timestamp — ele reflete o início da instância serverless, não a edição
 * do conteúdo.
 */
export const DEPLOY_TIME = new Date().toISOString();

export function etagOf(payload: unknown): string {
  const hash = createHash("sha1").update(JSON.stringify(payload)).digest("hex");
  return `"${hash}"`;
}

interface RespondOptions {
  /** Segundos de cache no CDN. 3600 para conteúdo, 60 para config/manifest. */
  sMaxAge: number;
  /** ISO. Quando o conteúdo tem data própria (ex: post mais recente), passe-a. */
  updatedAt?: string;
}

export function contentResponse(
  req: NextRequest,
  data: unknown,
  { sMaxAge, updatedAt }: RespondOptions
): NextResponse {
  const body = {
    v: CONTENT_VERSION,
    updatedAt: updatedAt ?? DEPLOY_TIME,
    data,
  };

  // ETag sobre `data` apenas: se incluísse updatedAt, o DEPLOY_TIME mudaria o
  // hash a cada cold start mesmo com conteúdo idêntico, quebrando todo 304.
  const etag = etagOf(data);

  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    "CDN-Cache-Control": `public, s-maxage=${sMaxAge}`,
    ETag: etag,
    "x-content-version": String(CONTENT_VERSION),
    Vary: "Accept-Encoding",
  };

  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(body, { headers });
}

/** Erro no formato do content API (mesmo envelope para o cliente não ter dois parsers). */
export function contentError(status: number, error: string, message?: string) {
  return NextResponse.json(
    { v: CONTENT_VERSION, error, ...(message ? { message } : {}) },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "x-content-version": String(CONTENT_VERSION),
      },
    }
  );
}
