import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { EMPRESAS, CATEGORIAS_RFQ } from "../../data/empresas";
import { DONO_EMAIL, REMETENTE, contarLead, escaparHtml } from "../../lib/email";

/**
 * Pedido de orçamento. Atende dois formulários com a MESMA entrega:
 *  - /orcamento (source "orcamento"): WhatsApp opcional, serviços escolhidos;
 *  - bloco abaixo do resultado da calculadora (source "calculator_result"):
 *    WhatsApp obrigatório (a promessa é "te chamamos no WhatsApp"), serviço
 *    fixo "despachante", carro e total calculado vindos do cálculo.
 *
 * Entrega: e-mail para até 8 empresas do diretório, notificação para o dono e
 * confirmação para o visitante. A notificação ao dono é a parte que garante o
 * pedido: enquanto não houver domínio verificado na Resend (ver lib/email.ts),
 * só ela é entregue. Por isso o "ok" depende dela.
 *
 * Todo envio confere `error`: o SDK v6 da Resend não lança exceção em falha
 * da API, devolve { error }. Antes não se conferia, e o visitante via
 * "enviado" para pedidos que nunca saíram.
 */

const soDigitos = (s: string) => s.replace(/\D/g, "");

const Pedido = z.object({
  source: z.enum(["orcamento", "calculator_result"]).default("orcamento"),
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().max(200).email(),
  whatsapp: z.string().trim().max(40).optional().default(""),
  estado: z.string().trim().min(1).max(40),
  categorias: z.array(z.string().max(40)).max(10).optional().default([]),
  carro: z
    .object({
      descricao: z.string().trim().max(120).optional(),
      year: z.union([z.string(), z.number()]).optional().nullable(),
      make: z.string().max(60).optional().nullable(),
      model: z.string().max(80).optional().nullable(),
      price_usd: z.union([z.string(), z.number()]).optional().nullable(),
      is_classic: z.boolean().optional().nullable(),
    })
    .optional()
    .default({}),
  total_brl: z.number().positive().max(1e9).optional(),
});

const ROTULO_ESTADO: Record<string, string> = { OTHER: "Outros estados" };

export async function POST(req: NextRequest) {
  try {
    const corpo = await req.json();
    const parsed = Pedido.safeParse(corpo);
    if (!parsed.success) {
      // Como antes: campo vazio pede "preencha"; e-mail preenchido e mal formado, "inválido".
      const emailMalFormado =
        parsed.error.issues.some((i) => i.path[0] === "email") && typeof corpo?.email === "string" && corpo.email.trim() !== "";
      return NextResponse.json(
        { error: emailMalFormado ? "E-mail inválido." : "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }
    const { source, nome, email, whatsapp, estado, carro, total_brl } = parsed.data;
    const daCalculadora = source === "calculator_result";

    // A calculadora não tem seletor de serviço: o pedido é a confirmação por um despachante.
    const categorias = daCalculadora ? ["despachante"] : parsed.data.categorias;
    if (categorias.length === 0) {
      return NextResponse.json({ error: "Selecione ao menos um tipo de serviço." }, { status: 400 });
    }

    const digitos = soDigitos(whatsapp);
    if (daCalculadora && (digitos.length < 10 || digitos.length > 13)) {
      return NextResponse.json({ error: "Informe um WhatsApp com DDD (ao menos 10 dígitos)." }, { status: 400 });
    }
    const precoUsd = Number(carro.price_usd);
    if (daCalculadora && (!carro.descricao || !(precoUsd > 0))) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    // Resolve empresas elegíveis (com email) por categoria selecionada
    const especialidadesAlvo = new Set<string>();
    for (const catId of categorias) {
      const cat = CATEGORIAS_RFQ.find((c) => c.id === catId);
      if (cat) cat.especialidades.forEach((e) => especialidadesAlvo.add(e));
    }
    const seen = new Set<string>();
    const destinatarias = EMPRESAS.filter(
      (e) => e.email && e.especialidades.some((esp) => especialidadesAlvo.has(esp)),
    )
      .filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)))
      .slice(0, 8);

    const carroLabel =
      carro.descricao ||
      [carro.year, carro.make, carro.model].filter(Boolean).join(" ") ||
      "Não especificado";
    const estadoLabel = ROTULO_ESTADO[estado] ?? estado;
    const precoTexto = precoUsd > 0 ? `US$ ${precoUsd.toLocaleString("pt-BR")}` : "";
    const totalTexto = total_brl ? `R$ ${Math.round(total_brl).toLocaleString("pt-BR")}` : "";

    const linhas: [string, string][] = [
      ["Nome", escaparHtml(nome)],
      ["E-mail", `<a href="mailto:${escaparHtml(email)}">${escaparHtml(email)}</a>`],
      ...(whatsapp ? [["WhatsApp", escaparHtml(whatsapp)] as [string, string]] : []),
      ["Estado destino", escaparHtml(estadoLabel)],
      ["Veículo", `${escaparHtml(carroLabel)}${carro.is_classic ? " (Clássico +30 anos)" : ""}`],
      ...(precoTexto ? [["Valor (FOB)", precoTexto] as [string, string]] : []),
      ...(totalTexto ? [["Total calculado no site", totalTexto] as [string, string]] : []),
    ];
    const tabela = `<table cellpadding="8" style="border-collapse:collapse;font-size:14px;width:100%;margin:16px 0">
      ${linhas.map(([k, v]) => `<tr><td style="color:#64748b"><strong>${k}</strong></td><td>${v}</td></tr>`).join("")}
    </table>`;
    const categoriasLabel = categorias
      .map((id) => CATEGORIAS_RFQ.find((c) => c.id === id)?.label ?? id)
      .join(", ");

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[solicitar-orcamento] RESEND_API_KEY não configurada — apenas logando.");
      console.log("[solicitar-orcamento]", { source, nome, categorias, destinatarias: destinatarias.map((e) => e.nome) });
      return NextResponse.json({ ok: true, empresas_contatadas: destinatarias.length });
    }
    const resend = new Resend(apiKey);

    // 1. Empresas do diretório
    const entregues: string[] = [];
    for (const empresa of destinatarias) {
      const { error } = await resend.emails.send({
        from: REMETENTE,
        to: empresa.email!,
        replyTo: email,
        subject: `Pedido de orçamento — ${carroLabel} (${estadoLabel})`,
        html: `<div style="font-family:sans-serif;max-width:560px">
          <h2 style="color:#1e293b">Pedido de orçamento — carroimportado.com</h2>
          <p style="color:#475569;font-size:14px">
            Um usuário do carroimportado.com solicita orçamento para importação de veículo americano.
            Responda diretamente a este e-mail para entrar em contato.
          </p>
          ${tabela}
          <p style="font-size:14px"><strong>Serviços:</strong> ${escaparHtml(categoriasLabel)}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #e2e8f0"/>
          <p style="color:#94a3b8;font-size:12px">Pedido recebido via carroimportado.com — responda diretamente ao usuário.</p>
        </div>`,
      });
      if (error) console.error(`[solicitar-orcamento] empresa ${empresa.nome} não recebeu:`, error);
      else entregues.push(empresa.nome);
    }

    // 2. Dono do site — é o que garante que o pedido não se perde.
    const { error: erroDono } = await resend.emails.send({
      from: REMETENTE,
      to: DONO_EMAIL,
      replyTo: email,
      subject: daCalculadora
        ? "[Lead carroimportado] Novo pedido de confirmação"
        : "[Lead carroimportado] Novo pedido de orçamento (/orcamento)",
      html: `<div style="font-family:sans-serif;max-width:560px">
        <h2 style="color:#1e293b">${daCalculadora ? "Novo pedido de confirmação do cálculo" : "Novo pedido de orçamento"}</h2>
        ${tabela}
        <p style="font-size:14px"><strong>Serviços:</strong> ${escaparHtml(categoriasLabel)}</p>
        <p style="font-size:13px;color:#475569">
          Empresas que receberam: ${entregues.length ? escaparHtml(entregues.join(", ")) : "nenhuma (envio às empresas falhou — ver logs da Vercel)"}
        </p>
        <p style="font-size:12px;color:#94a3b8">source=${source}</p>
      </div>`,
    });
    if (erroDono) console.error("[solicitar-orcamento] notificação ao dono falhou:", erroDono);

    // Ninguém recebeu: o pedido se perderia. Na calculadora a promessa é "a gente
    // te chama", então sem o dono avisado também não é "recebido".
    if ((erroDono && entregues.length === 0) || (daCalculadora && erroDono)) {
      return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 502 });
    }

    // 3. Confirmação para o visitante (falha aqui não invalida o pedido)
    const { error: erroConfirmacao } = await resend.emails.send({
      from: REMETENTE,
      to: email,
      subject: daCalculadora ? "Recebemos seu pedido de confirmação do cálculo" : "Seu pedido de orçamento foi enviado",
      html: `<div style="font-family:sans-serif;max-width:560px">
        <h2 style="color:#1e293b">${daCalculadora ? "Recebemos seu pedido!" : "Seu pedido foi enviado!"}</h2>
        <p style="color:#475569;font-size:14px">
          Olá ${escaparHtml(nome)}, ${
            daCalculadora
              ? "vamos confirmar seu cálculo e te chamar no WhatsApp em até 24h úteis."
              : "recebemos seu pedido de orçamento."
          }
        </p>
        ${
          entregues.length
            ? `<p style="color:#475569;font-size:14px">Seu pedido também foi encaminhado para:</p>
               <ul style="font-size:14px;color:#334155;padding-left:20px">${destinatarias
                 .filter((e) => entregues.includes(e.nome))
                 .map((e) => `<li>${escaparHtml(e.nome)} (${escaparHtml(e.cidade)}/${escaparHtml(e.estado)})</li>`)
                 .join("")}</ul>
               <p style="color:#475569;font-size:14px">Elas podem entrar em contato diretamente neste e-mail.</p>`
            : ""
        }
        <p style="color:#94a3b8;font-size:12px;margin-top:20px">carroimportado.com — Calculadora de importação de carros EUA → Brasil</p>
      </div>`,
    });
    if (erroConfirmacao) console.error("[solicitar-orcamento] confirmação ao visitante falhou:", erroConfirmacao);

    await contarLead(req, daCalculadora ? "calculator_result" : "orcamento");
    console.log(`[solicitar-orcamento] ${source}: dono=${erroDono ? "falhou" : "ok"}, empresas=${entregues.length}/${destinatarias.length}`);
    return NextResponse.json({ ok: true, empresas_contatadas: entregues.length });
  } catch (err) {
    console.error("[solicitar-orcamento] Erro:", err);
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
