import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EMPRESAS, CATEGORIAS_RFQ } from "../../data/empresas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, email, whatsapp, estado, categorias, carro } = body;

    if (!nome || !email || !estado) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (!Array.isArray(categorias) || categorias.length === 0) {
      return NextResponse.json({ error: "Selecione ao menos um tipo de serviço." }, { status: 400 });
    }

    // Resolve empresas elegíveis (com email) por categoria selecionada
    const especialidadesAlvo = new Set<string>();
    for (const catId of categorias) {
      const cat = CATEGORIAS_RFQ.find((c) => c.id === catId);
      if (cat) cat.especialidades.forEach((e) => especialidadesAlvo.add(e));
    }

    const empresasElegiveis = EMPRESAS.filter(
      (e) => e.email && e.especialidades.some((esp) => especialidadesAlvo.has(esp))
    );

    // Deduplica por id
    const seen = new Set<string>();
    const destinatarias = empresasElegiveis.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    }).slice(0, 8);

    const carroLabel = [carro?.year, carro?.make, carro?.model].filter(Boolean).join(" ") || "Não especificado";
    const carroHtml = `
      <tr><td style="color:#64748b"><strong>Veículo</strong></td><td>${carroLabel}${carro?.is_classic ? " (Clássico +30 anos)" : ""}</td></tr>
      ${carro?.price_usd ? `<tr><td style="color:#64748b"><strong>Valor (FOB)</strong></td><td>US$ ${Number(carro.price_usd).toLocaleString("pt-BR")}</td></tr>` : ""}
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[solicitar-orcamento] RESEND_API_KEY não configurada — apenas logando.");
      console.log("[solicitar-orcamento]", { nome, email, categorias, destinatarias: destinatarias.map((e) => e.nome) });
      return NextResponse.json({ ok: true, empresas_contatadas: destinatarias.length });
    }

    const resend = new Resend(apiKey);

    // Email para cada empresa
    for (const empresa of destinatarias) {
      const categoriasLabel = categorias
        .map((id: string) => CATEGORIAS_RFQ.find((c) => c.id === id)?.label ?? id)
        .join(", ");

      const htmlEmpresa = `
        <div style="font-family:sans-serif;max-width:560px">
          <h2 style="color:#1e293b">Pedido de orçamento — carroimportado.com</h2>
          <p style="color:#475569;font-size:14px">
            Um usuário do carroimportado.com solicita orçamento para importação de veículo americano.
            Responda diretamente a este e-mail para entrar em contato.
          </p>
          <table cellpadding="8" style="border-collapse:collapse;font-size:14px;width:100%;margin:16px 0">
            <tr><td style="color:#64748b"><strong>Nome</strong></td><td>${nome}</td></tr>
            <tr><td style="color:#64748b"><strong>E-mail</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            ${whatsapp ? `<tr><td style="color:#64748b"><strong>WhatsApp</strong></td><td>${whatsapp}</td></tr>` : ""}
            <tr><td style="color:#64748b"><strong>Estado destino</strong></td><td>${estado}</td></tr>
            ${carroHtml}
            <tr><td style="color:#64748b"><strong>Serviços</strong></td><td>${categoriasLabel}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #e2e8f0"/>
          <p style="color:#94a3b8;font-size:12px">
            Pedido recebido via carroimportado.com/orcamento — responda diretamente ao usuário.
          </p>
        </div>
      `;

      await resend.emails.send({
        from: "carroimportado.com <onboarding@resend.dev>",
        to: empresa.email!,
        replyTo: email,
        subject: `Pedido de orçamento — ${carroLabel} (${estado})`,
        html: htmlEmpresa,
      });
    }

    // Email de confirmação para o usuário
    const nomesEmpresas = destinatarias.map((e) => e.nome).join(", ");
    const htmlConfirmacao = `
      <div style="font-family:sans-serif;max-width:560px">
        <h2 style="color:#1e293b">Seu pedido foi enviado!</h2>
        <p style="color:#475569;font-size:14px">
          Olá ${nome}, seu pedido de orçamento foi encaminhado para as seguintes empresas:
        </p>
        <ul style="font-size:14px;color:#334155;padding-left:20px">
          ${destinatarias.map((e) => `<li>${e.nome} (${e.cidade}/${e.estado})</li>`).join("")}
        </ul>
        <p style="color:#475569;font-size:14px">
          Elas entrarão em contato diretamente neste e-mail. Fique de olho na caixa de entrada
          e na pasta de spam nos próximos dias.
        </p>
        <p style="color:#94a3b8;font-size:12px;margin-top:20px">
          carroimportado.com — Calculadora de importação de carros EUA → Brasil
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "carroimportado.com <onboarding@resend.dev>",
      to: email,
      subject: `Seu pedido de orçamento foi enviado para ${destinatarias.length} empresa${destinatarias.length > 1 ? "s" : ""}`,
      html: htmlConfirmacao,
    });

    console.log(`[solicitar-orcamento] ${nome} → ${destinatarias.length} empresas: ${nomesEmpresas}`);
    return NextResponse.json({ ok: true, empresas_contatadas: destinatarias.length });
  } catch (err) {
    console.error("[solicitar-orcamento] Erro:", err);
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
