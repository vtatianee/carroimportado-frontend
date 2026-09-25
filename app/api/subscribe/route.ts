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
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      // O SDK v6 do Resend retorna { data, error } em vez de lançar exceção
      // em falhas da API — sem checar `error` aqui, um 4xx/5xx do Resend
      // (audience inválida, email rejeitado, etc.) passava batido e o
      // usuário via "cadastro realizado" para um cadastro que não aconteceu.
      if (error) {
        console.error("[subscribe] Erro Resend (contacts.create):", error);
        return NextResponse.json({ error: "Erro ao cadastrar. Tente novamente." }, { status: 500 });
      }
    } else {
      // Sem audience: envia notificação ao admin por email
      const { error } = await resend.emails.send({
        from: "carroimportado.com <onboarding@resend.dev>",
        to: "arche.boost@gmail.com",
        subject: "Novo cadastro — carroimportado.com",
        text: `Novo email cadastrado na lista de espera: ${email}`,
      });
      if (error) {
        console.error("[subscribe] Erro Resend (emails.send):", error);
        return NextResponse.json({ error: "Erro ao cadastrar. Tente novamente." }, { status: 500 });
      }
    }

    console.log(`[subscribe] Cadastrado com sucesso: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Erro Resend:", err);
    return NextResponse.json({ error: "Erro ao cadastrar. Tente novamente." }, { status: 500 });
  }
}
