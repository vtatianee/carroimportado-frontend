"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

export default function CadastroClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nome: "",
    pais: "",
    cidade: "",
    estado: "",
    especialidades: "",
    website: "",
    whatsapp: "",
    contato: "",
    email: "",
    mensagem: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/empresa-cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Erro ao enviar. Tente novamente.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500" />
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">
              carro<span className="text-blue-600">importado</span>.com
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">
              Calculadora
            </Link>
            <Link href="/guia" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">
              Guia
            </Link>
            <Link href="/empresas" className="text-sm text-blue-600 font-semibold px-3 py-1.5 rounded-lg bg-blue-50 hidden sm:block">
              Empresas
            </Link>
            <Link href="/guia#checklist" className="text-sm text-white font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              Checklist
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/empresas" className="hover:text-blue-600 transition-colors">Empresas</Link>
          <span>›</span>
          <span className="text-slate-600">Solicitar cadastro</span>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Solicitação enviada!</h1>
            <p className="text-slate-600 text-sm mb-6">
              Recebemos seus dados e entraremos em contato em breve pelo e-mail informado.
            </p>
            <Link
              href="/empresas"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              ← Voltar ao diretório
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Cadastrar empresa
              </h1>
              <p className="text-slate-500 text-sm">
                Preencha o formulário abaixo. Vamos avaliar e entrar em contato pelo e-mail informado.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome da empresa <span className="text-red-500">*</span>
                </label>
                <input
                  name="nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex: Latin American Cargo"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* País */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    País <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pais"
                    required
                    value={form.pais}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="US">🇺🇸 EUA</option>
                    <option value="BR">🇧🇷 Brasil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                  <input
                    name="cidade"
                    type="text"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Ex: Miami"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado / UF</label>
                  <input
                    name="estado"
                    type="text"
                    value={form.estado}
                    onChange={handleChange}
                    placeholder="Ex: FL ou SP"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidades</label>
                <input
                  name="especialidades"
                  type="text"
                  value={form.especialidades}
                  onChange={handleChange}
                  placeholder="Ex: Exportação, RORO, Clássicos, Despachante"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Website + WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input
                    name="website"
                    type="text"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="www.suaempresa.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                  <input
                    name="whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+55 11 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Contato + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Seu nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="contato"
                    type="text"
                    required
                    value={form.contato}
                    onChange={handleChange}
                    placeholder="Nome de quem está enviando"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Seu e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contato@suaempresa.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Informações adicionais
                </label>
                <textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Conte mais sobre sua empresa, anos de experiência, diferenciais, etc."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  ⚠️ {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer"
              >
                {status === "loading" ? "Enviando..." : "Enviar solicitação →"}
              </button>

              <p className="text-xs text-center text-slate-400">
                Seus dados serão usados apenas para avaliar o cadastro. Não compartilhamos com terceiros.
              </p>
            </form>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 carroimportado.com</p>
        </div>
      </footer>
    </div>
  );
}
