import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Fallback para quando a chave não está configurada (desenvolvimento local)
      console.warn("[subscribe] RESEND_API_KEY não configurada — apenas logando.");
      console.log(`[subscribe] Novo cadastro: ${email}`);
      return NextResponse.json({ ok: true });
    }

    // Instancia Resend dentro do handler para evitar erro em build time
    const resend = new Resend(apiKey);
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      // Adiciona contato à audience do Resend (lista de emails / newsletter)
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    } else {
      // Sem audience: envia notificação ao admin por email
      await resend.emails.send({
        from: "carroimportado.com <onboarding@resend.dev>",
        to: "arche.boost@gmail.com",
        subject: "Novo cadastro — carroimportado.com",
        text: `Novo email cadastrado na lista de espera: ${email}`,
      });
    }

    console.log(`[subscribe] Cadastrado com sucesso: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Erro Resend:", err);
    return NextResponse.json({ error: "Erro ao cadastrar. Tente novamente." }, { status: 500 });
  }
}
