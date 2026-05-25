import { NextRequest, NextResponse } from "next/server";

// TODO: integre com seu serviço de email (Resend, Mailchimp, etc.)
// Por enquanto, loga o email no servidor e retorna sucesso.

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    // Log no servidor (visível nos logs do Vercel)
    console.log(`[subscribe] Novo cadastro: ${email}`);

    // TODO: salvar em banco de dados ou enviar para serviço de email
    // Exemplo com Resend:
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Erro:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
