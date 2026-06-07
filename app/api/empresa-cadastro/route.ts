import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, pais, cidade, estado, especialidades, website, whatsapp, contato, email, mensagem } = body;

    if (!nome || !email || !contato) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[empresa-cadastro] RESEND_API_KEY não configurada — apenas logando.");
      console.log("[empresa-cadastro]", body);
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(apiKey);

    const htmlBody = `
      <h2>Nova solicitação de cadastro — Diretório de Empresas</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td style="color:#64748b;white-space:nowrap"><strong>Empresa</strong></td><td>${nome}</td></tr>
        <tr><td style="color:#64748b"><strong>País</strong></td><td>${pais === "US" ? "🇺🇸 EUA" : pais === "BR" ? "🇧🇷 Brasil" : pais}</td></tr>
        <tr><td style="color:#64748b"><strong>Cidade / Estado</strong></td><td>${cidade}${estado ? ` — ${estado}` : ""}</td></tr>
        <tr><td style="color:#64748b"><strong>Especialidades</strong></td><td>${especialidades || "—"}</td></tr>
        <tr><td style="color:#64748b"><strong>Website</strong></td><td>${website ? `<a href="${website}">${website}</a>` : "—"}</td></tr>
        <tr><td style="color:#64748b"><strong>WhatsApp</strong></td><td>${whatsapp || "—"}</td></tr>
        <tr><td style="color:#64748b"><strong>Contato</strong></td><td>${contato}</td></tr>
        <tr><td style="color:#64748b"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="color:#64748b;vertical-align:top"><strong>Mensagem</strong></td><td style="white-space:pre-wrap">${mensagem || "—"}</td></tr>
      </table>
      <hr style="margin:20px 0;border:none;border-top:1px solid #e2e8f0"/>
      <p style="color:#94a3b8;font-size:12px">Enviado via carroimportado.com/empresas/cadastro</p>
    `;

    await resend.emails.send({
      from: "carroimportado.com <onboarding@resend.dev>",
      to: "arche.boost@gmail.com",
      replyTo: email,
      subject: `Solicitação de cadastro: ${nome}`,
      html: htmlBody,
    });

    console.log(`[empresa-cadastro] Solicitação enviada: ${nome} <${email}>`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[empresa-cadastro] Erro:", err);
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
