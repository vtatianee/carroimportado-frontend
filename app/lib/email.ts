import type { NextRequest } from "next/server";
import { cabecalhosBackend } from "./backend";

/**
 * Remetente dos e-mails do site.
 *
 * ATENÇÃO: sem RESEND_FROM, o site usa o remetente de TESTE da Resend
 * (`onboarding@resend.dev`), que só entrega para o e-mail dono da conta
 * Resend. Para qualquer outro destinatário a Resend responde 403 ("You can
 * only send testing emails to your own email address"). Por isso, até um
 * domínio ser verificado em resend.com/domains e RESEND_FROM ser configurada
 * na Vercel (ex.: "carroimportado.com <contato@carroimportado.com>"):
 *  - e-mails para o dono (DONO_EMAIL) chegam;
 *  - e-mails para empresas do diretório e para visitantes NÃO chegam.
 */
export const REMETENTE = process.env.RESEND_FROM || "carroimportado.com <onboarding@resend.dev>";

/** true quando há domínio próprio verificado: dá para mandar e-mail a qualquer pessoa. */
export const ENVIA_PARA_QUALQUER_UM = Boolean(process.env.RESEND_FROM);

/** Dono do site: recebe a notificação de cada pedido. Confirmado pelo dono em 17/11/2026. */
export const DONO_EMAIL = "arche.boost@gmail.com";

/** Texto vindo de formulário dentro de HTML de e-mail: sem isto, `<a href=...>` no nome vira link. */
export function escaparHtml(texto: unknown): string {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type OrigemLead = "calculator_result" | "calculator_pdf" | "orcamento";

/**
 * Conta o lead no backend (relatório semanal, tabela por modo). Só depois de
 * um envio que deu certo. Falha aqui não pode derrubar o pedido do visitante:
 * a contagem é medição, não parte do fluxo.
 */
export async function contarLead(req: NextRequest, origem: OrigemLead): Promise<void> {
  const backend = process.env.API_URL || "https://api.carroimportado.com";
  try {
    const res = await fetch(`${backend}/api/eventos/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...cabecalhosBackend(req) },
      body: JSON.stringify({ origem }),
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) console.error(`[lead] backend não contou (${origem}): HTTP ${res.status}`);
  } catch (err) {
    console.error(`[lead] backend não contou (${origem}):`, err);
  }
}
