import type { NextRequest } from "next/server";

/**
 * IP de quem abriu o site. O backend só vê o IP da Vercel (todo o site chega
 * por aqui), então sem isto o rate limit dele seria um balde único para todos
 * os visitantes.
 *
 * Ordem: cf-connecting-ip primeiro, porque www.carroimportado.com passa pela
 * Cloudflare, que sobrescreve esse cabeçalho com o IP real — x-real-ip e
 * x-forwarded-for, ali, seriam o IP da Cloudflare. Quem acessa o *.vercel.app
 * direto consegue inventar o cf-connecting-ip; o backend tem um teto global
 * para o site justamente por isso.
 */
export function ipDoVisitante(req: NextRequest): string | null {
  const cloudflare = req.headers.get("cf-connecting-ip");
  if (cloudflare) return cloudflare.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const encaminhado = req.headers.get("x-forwarded-for");
  return encaminhado ? encaminhado.split(",")[0].trim() : null;
}

/** Cabeçalhos de toda chamada do proxy ao backend (o backend valida o formato do IP). */
export function cabecalhosBackend(req: NextRequest): Record<string, string> {
  const cabecalhos: Record<string, string> = {};
  if (process.env.INTERNAL_SECRET) cabecalhos["x-internal-secret"] = process.env.INTERNAL_SECRET;
  const ip = ipDoVisitante(req);
  if (ip) cabecalhos["x-cliente-ip"] = ip;
  return cabecalhos;
}
