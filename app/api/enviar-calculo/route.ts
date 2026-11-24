import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { ENVIA_PARA_QUALQUER_UM, REMETENTE, contarLead, escaparHtml } from "../../lib/email";

/**
 * "Receber meu cálculo por e-mail": manda ao visitante o resumo do cálculo
 * que ele acabou de fazer. Em HTML no corpo do e-mail — o repo não tem lib de
 * PDF, e instalar uma não foi aprovado.
 *
 * Só funciona com domínio verificado na Resend (RESEND_FROM): o remetente de
 * teste não entrega para visitantes. Sem ele a rota responde 503, e a home nem
 * mostra o botão (ver app/page.tsx).
 *
 * Endereço e números vêm do navegador. Para isto não virar um disparador de
 * e-mail com conteúdo livre, o formato é fechado: números com limite, nome e
 * carro curtos e escapados, e o texto do e-mail é fixo.
 */
const Pedido = z
  .object({
    nome: z.string().trim().min(1).max(80),
    email: z.string().trim().max(200).email(),
    carro: z.string().trim().max(120).optional().default(""),
    preco_usd: z.number().positive().max(10_000_000),
    cambio: z.number().positive().max(100),
    total_brl: z.number().positive().max(1e9),
    impostos_brl: z.number().nonnegative().max(1e9),
    estado: z.string().regex(/^[A-Z]{2,5}$/),
  })
  .strict();

const brl = (n: number) => `R$ ${Math.round(n).toLocaleString("pt-BR")}`;

export async function POST(req: NextRequest) {
  if (!ENVIA_PARA_QUALQUER_UM || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Envio por e-mail indisponível no momento." }, { status: 503 });
  }
  try {
    const parsed = Pedido.safeParse(await req.json());
    if (!parsed.success) {
      const campo = parsed.error.issues[0]?.path[0];
      return NextResponse.json(
        { error: campo === "email" ? "E-mail inválido." : "Preencha nome e e-mail." },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const carro = d.carro || "Seu veículo";
    const estado = d.estado === "OTHER" ? "Outros estados" : d.estado;
    const refazer = `https://www.carroimportado.com/?preco=${Math.round(d.preco_usd)}#calculadora`;

    const linhas: [string, string][] = [
      ["Carro", escaparHtml(carro)],
      ["Preço nos EUA", `US$ ${Math.round(d.preco_usd).toLocaleString("pt-BR")}`],
      ["Câmbio (PTAX) usado", `R$ ${d.cambio.toFixed(4).replace(".", ",")}`],
      ["Estado de destino", escaparHtml(estado)],
      ["Total de impostos e taxas", brl(d.impostos_brl)],
      ["Total estimado no Brasil", `<strong>${brl(d.total_brl)}</strong>`],
    ];

    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: REMETENTE,
      to: d.email,
      subject: `Seu cálculo de importação: ${carro}`,
      html: `<div style="font-family:sans-serif;max-width:560px;color:#0f172a">
        <h2 style="color:#1e293b">Seu cálculo no carroimportado.com</h2>
        <p style="color:#475569;font-size:14px">Olá ${escaparHtml(d.nome)}, aqui está o resumo do cálculo que você fez.</p>
        <table cellpadding="8" style="border-collapse:collapse;font-size:14px;width:100%;margin:16px 0">
          ${linhas.map(([k, v]) => `<tr><td style="color:#64748b;border-bottom:1px solid #f1f5f9">${k}</td><td style="border-bottom:1px solid #f1f5f9;text-align:right">${v}</td></tr>`).join("")}
        </table>
        <p style="font-size:14px"><a href="${refazer}" style="color:#2563eb">Refazer ou ajustar o cálculo →</a></p>
        <p style="color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px;font-size:12px">
          Valores estimados, sem validade legal. O valor final é definido pela Receita Federal e pelos prestadores do processo.
        </p>
        <p style="color:#94a3b8;font-size:12px;margin-top:20px">carroimportado.com — Calculadora de importação de carros EUA → Brasil</p>
      </div>`,
    });
    if (error) {
      console.error("[enviar-calculo] Resend:", error);
      return NextResponse.json({ error: "Não foi possível enviar agora. Tente novamente." }, { status: 502 });
    }
    await contarLead(req, "calculator_pdf");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[enviar-calculo] Erro:", err);
    return NextResponse.json({ error: "Não foi possível enviar agora. Tente novamente." }, { status: 500 });
  }
}
