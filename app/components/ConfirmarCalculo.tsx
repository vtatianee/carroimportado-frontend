"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ESTADOS } from "../lib/estados";

/**
 * Captura de lead logo abaixo do resultado da calculadora (só com resultado
 * real, nunca no exemplo). Dois caminhos:
 *  1. "Quer que um despachante confirme esse valor em 24h?" — mesmo envio do
 *     /orcamento (POST /api/solicitar-orcamento, source=calculator_result),
 *     com WhatsApp obrigatório. O dono é notificado por e-mail.
 *  2. "Receber meu cálculo por e-mail" — resumo em HTML (sem lib de PDF no
 *     repo). Só aparece com domínio verificado na Resend (`envioPorEmail`).
 *
 * Os dados do cálculo pré-preenchem carro, preço e estado. O que o cálculo não
 * tiver fica vazio: nada é inventado.
 */

export type DadosDoCalculo = {
  carro: string;
  precoUsd: number | null;
  estado: string;
  isClassic: boolean;
  cambio: number;
  totalBrl: number;
  impostosBrl: number;
};

type Erros = Partial<Record<"nome" | "email" | "whatsapp" | "carro" | "preco" | "estado", string>>;

const soDigitos = (s: string) => s.replace(/\D/g, "");
const emailValido = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const campo =
  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900";
const comErro = (erro?: string) => `${campo} ${erro ? "border-red-400" : "border-slate-300"}`;

function MensagemErro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="text-sm text-red-600 mt-1">
      {texto}
    </p>
  );
}

export default function ConfirmarCalculo({
  dados,
  envioPorEmail,
}: {
  dados: DadosDoCalculo;
  envioPorEmail: boolean;
}) {
  const estadoInicial = ESTADOS.some((e) => e.value === dados.estado) ? dados.estado : "";
  const [form, setForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    carro: dados.carro,
    preco: dados.precoUsd ? String(dados.precoUsd) : "",
    estado: estadoInicial,
  });
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erroEnvio, setErroEnvio] = useState("");

  function mudar(nome: keyof typeof form, valor: string) {
    setForm((f) => ({ ...f, [nome]: valor }));
    if (erros[nome as keyof Erros]) setErros((e) => ({ ...e, [nome]: undefined }));
  }

  function validar(): Erros {
    const e: Erros = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome.";
    if (!emailValido(form.email)) e.email = "Informe um e-mail válido.";
    const dig = soDigitos(form.whatsapp);
    if (!dig) e.whatsapp = "Informe seu WhatsApp com DDD.";
    else if (dig.length < 10 || dig.length > 13) e.whatsapp = "WhatsApp com DDD: ao menos 10 dígitos.";
    if (!form.carro.trim()) e.carro = "Informe o modelo e o ano do carro.";
    if (!(Number(form.preco) > 0)) e.preco = "Informe o preço do carro em dólares.";
    if (!form.estado) e.estado = "Selecione o estado de destino.";
    return e;
  }

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    setStatus("enviando");
    setErroEnvio("");
    try {
      const res = await fetch("/api/solicitar-orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "calculator_result",
          nome: form.nome.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          estado: form.estado,
          carro: { descricao: form.carro.trim(), price_usd: Number(form.preco), is_classic: dados.isClassic },
          total_brl: dados.totalBrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErroEnvio(data.error || "Erro ao enviar. Tente novamente.");
        setStatus("erro");
      } else {
        setStatus("ok");
      }
    } catch {
      setErroEnvio("Erro de conexão. Tente novamente.");
      setStatus("erro");
    }
  }

  return (
    <section
      aria-labelledby="confirmar-calculo"
      className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-6"
    >
      {status === "ok" ? (
        <div role="status" className="text-center py-4">
          <p className="text-4xl mb-3" aria-hidden="true">✅</p>
          <p className="font-bold text-slate-900">
            Recebido! Vamos confirmar seu cálculo e te chamar no WhatsApp em até 24h úteis.
          </p>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate className="space-y-4">
          <div>
            <h2 id="confirmar-calculo" className="text-lg font-bold text-slate-900">
              Quer que um despachante confirme esse valor em 24h?
            </h2>
            <p className="text-slate-600 mt-1">
              Deixe seus dados e a gente te chama no WhatsApp com a confirmação — sem compromisso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cc-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
              <input id="cc-nome" value={form.nome} onChange={(e) => mudar("nome", e.target.value)}
                autoComplete="name" aria-invalid={!!erros.nome} aria-describedby="cc-nome-erro" className={comErro(erros.nome)} />
              <MensagemErro id="cc-nome-erro" texto={erros.nome} />
            </div>
            <div>
              <label htmlFor="cc-whatsapp" className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (com DDD) *</label>
              <input id="cc-whatsapp" type="tel" inputMode="tel" value={form.whatsapp} onChange={(e) => mudar("whatsapp", e.target.value)}
                autoComplete="tel" placeholder="(11) 99999-9999" aria-invalid={!!erros.whatsapp} aria-describedby="cc-whatsapp-erro" className={comErro(erros.whatsapp)} />
              <MensagemErro id="cc-whatsapp-erro" texto={erros.whatsapp} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cc-email" className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input id="cc-email" type="email" value={form.email} onChange={(e) => mudar("email", e.target.value)}
                autoComplete="email" aria-invalid={!!erros.email} aria-describedby="cc-email-erro" className={comErro(erros.email)} />
              <MensagemErro id="cc-email-erro" texto={erros.email} />
            </div>
            <div>
              <label htmlFor="cc-carro" className="block text-sm font-medium text-slate-700 mb-1">Carro — modelo e ano *</label>
              <input id="cc-carro" value={form.carro} onChange={(e) => mudar("carro", e.target.value)}
                placeholder="ex: 2019 Ford Mustang GT" aria-invalid={!!erros.carro} aria-describedby="cc-carro-erro" className={comErro(erros.carro)} />
              <MensagemErro id="cc-carro-erro" texto={erros.carro} />
            </div>
            <div>
              <label htmlFor="cc-preco" className="block text-sm font-medium text-slate-700 mb-1">Preço do carro nos EUA (US$) *</label>
              <input id="cc-preco" type="number" inputMode="numeric" min="1" value={form.preco} onChange={(e) => mudar("preco", e.target.value)}
                aria-invalid={!!erros.preco} aria-describedby="cc-preco-erro" className={comErro(erros.preco)} />
              <MensagemErro id="cc-preco-erro" texto={erros.preco} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cc-estado" className="block text-sm font-medium text-slate-700 mb-1">Estado de destino no Brasil *</label>
              <select id="cc-estado" value={form.estado} onChange={(e) => mudar("estado", e.target.value)}
                aria-invalid={!!erros.estado} aria-describedby="cc-estado-erro" className={`${comErro(erros.estado)} bg-white`}>
                <option value="">Selecione</option>
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
              <MensagemErro id="cc-estado-erro" texto={erros.estado} />
            </div>
          </div>

          {status === "erro" && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{erroEnvio}</p>
          )}

          <button type="submit" disabled={status === "enviando"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3.5 rounded-xl transition-colors">
            {status === "enviando" ? "Enviando..." : "Quero a confirmação em 24h"}
          </button>

          {/* Transparência (LGPD): o envio é o mesmo do /orcamento, que vai também às empresas. */}
          <p className="text-xs text-slate-500 leading-relaxed">
            Ao enviar, seus dados vão para a equipe do carroimportado.com e para os despachantes do nosso{" "}
            <Link href="/empresas" className="underline hover:text-slate-700">diretório</Link>, que podem entrar em
            contato com você. Veja a <Link href="/privacy" className="underline hover:text-slate-700">Política de Privacidade</Link>.
          </p>
        </form>
      )}

      {envioPorEmail && <ReceberPorEmail dados={dados} carro={form.carro} />}
    </section>
  );
}

function ReceberPorEmail({ dados, carro }: { dados: DadosDoCalculo; carro: string }) {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState<{ nome?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erroEnvio, setErroEnvio] = useState("");

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e: { nome?: string; email?: string } = {};
    if (!nome.trim()) e.nome = "Informe seu nome.";
    if (!emailValido(email)) e.email = "Informe um e-mail válido.";
    setErros(e);
    if (Object.keys(e).length > 0) return;
    if (!dados.precoUsd) {
      setErroEnvio("Faça um cálculo com o preço do carro para receber o resumo.");
      setStatus("erro");
      return;
    }
    setStatus("enviando");
    try {
      const res = await fetch("/api/enviar-calculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          carro: carro.trim().slice(0, 120),
          preco_usd: dados.precoUsd,
          cambio: dados.cambio,
          total_brl: dados.totalBrl,
          impostos_brl: dados.impostosBrl,
          estado: dados.estado,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErroEnvio(data.error || "Não foi possível enviar agora. Tente novamente.");
        setStatus("erro");
      } else {
        setStatus("ok");
      }
    } catch {
      setErroEnvio("Erro de conexão. Tente novamente.");
      setStatus("erro");
    }
  }

  return (
    <div className="mt-5 pt-5 border-t border-slate-100">
      {status === "ok" ? (
        <p role="status" className="text-sm font-medium text-green-700">Enviado! Confira seu e-mail (e a caixa de spam).</p>
      ) : !aberto ? (
        <button type="button" onClick={() => setAberto(true)} className="text-sm font-semibold text-blue-700 hover:underline">
          📧 Receber meu cálculo por e-mail
        </button>
      ) : (
        <form onSubmit={enviar} noValidate className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">Receber meu cálculo por e-mail</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="ce-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
              <input id="ce-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name"
                aria-invalid={!!erros.nome} aria-describedby="ce-nome-erro" className={comErro(erros.nome)} />
              <MensagemErro id="ce-nome-erro" texto={erros.nome} />
            </div>
            <div>
              <label htmlFor="ce-email" className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input id="ce-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                aria-invalid={!!erros.email} aria-describedby="ce-email-erro" className={comErro(erros.email)} />
              <MensagemErro id="ce-email-erro" texto={erros.email} />
            </div>
          </div>
          {status === "erro" && <p role="alert" className="text-sm text-red-700">{erroEnvio}</p>}
          <button type="submit" disabled={status === "enviando"}
            className="px-5 py-2.5 rounded-xl border border-blue-600 text-blue-700 font-semibold text-sm hover:bg-blue-50 disabled:opacity-50">
            {status === "enviando" ? "Enviando..." : "Enviar para meu e-mail"}
          </button>
        </form>
      )}
    </div>
  );
}
