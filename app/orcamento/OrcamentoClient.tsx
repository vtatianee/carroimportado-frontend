"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORIAS_RFQ } from "../data/empresas";

type Status = "idle" | "loading" | "success" | "error";

function fmt(n: string | null) {
  if (!n) return null;
  const num = Number(n);
  return isNaN(num) ? null : num;
}

export default function OrcamentoClient() {
  const params = useSearchParams();

  const priceUsd = fmt(params.get("price_usd"));
  const year = fmt(params.get("year"));
  const make = params.get("make") || "";
  const model = params.get("model") || "";
  const isClassic = params.get("is_classic") === "true";

  const carLabel = [year, make, model].filter(Boolean).join(" ") || "Veículo";

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    estado: "",
  });

  function toggleCategoria(id: string) {
    setCategorias((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (categorias.length === 0) {
      setErrorMsg("Selecione ao menos um tipo de serviço.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/solicitar-orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categorias,
          carro: { price_usd: priceUsd, year, make, model, is_classic: isClassic },
        }),
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
            <Link href="/empresas" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">
              Empresas
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Calculadora</Link>
          <span>›</span>
          <span className="text-slate-600">Solicitar orçamentos</span>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Pedido enviado!</h1>
            <p className="text-slate-600 text-sm mb-2">
              As empresas receberão seus dados e entrarão em contato diretamente no seu e-mail.
            </p>
            <p className="text-slate-500 text-xs mb-6">
              Responda diretamente a elas — você terá controle total da negociação.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              ← Voltar à calculadora
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Solicitar orçamentos reais
              </h1>
              <p className="text-slate-500 text-sm">
                Preencha uma vez e enviaremos seu pedido para as empresas do nosso diretório
                que oferecem o serviço selecionado. Elas respondem diretamente no seu e-mail.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">

              {/* Dados do carro */}
              {(priceUsd || make || year) && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Veículo da simulação</p>
                  <p className="text-slate-900 font-medium">{carLabel}</p>
                  {priceUsd && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      Valor: US$ {priceUsd.toLocaleString("pt-BR")}
                      {isClassic && <span className="ml-2 text-amber-600 font-medium">· Clássico (+30 anos)</span>}
                    </p>
                  )}
                </div>
              )}

              {/* Serviços */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Quais serviços precisa cotar? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {CATEGORIAS_RFQ.map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        categorias.includes(cat.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={categorias.includes(cat.id)}
                        onChange={() => toggleCategoria(cat.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{cat.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cat.id === "despachante" && "Desembaraço aduaneiro, documentação e liberação na alfândega"}
                          {cat.id === "importadora" && "Processo completo de importação (compra + frete + desembaraço)"}
                          {cat.id === "exportadora" && "Frete marítimo RORO ou container a partir dos EUA"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Dados de contato */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Seus dados de contato</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nome"
                      type="text"
                      required
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">As empresas responderão neste e-mail</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        WhatsApp <span className="text-slate-400 font-normal">(opcional)</span>
                      </label>
                      <input
                        name="whatsapp"
                        type="tel"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="+55 11 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Estado de destino <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="estado"
                        required
                        value={form.estado}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option value="">Selecione</option>
                        {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aviso */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                ⚠️ <strong>Não temos vínculo comercial</strong> com as empresas listadas.
                Os orçamentos chegam diretamente delas — analise e negocie por conta própria.
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm cursor-pointer"
              >
                {status === "loading" ? "Enviando..." : "Solicitar orçamentos →"}
              </button>

              <p className="text-xs text-center text-slate-400">
                Seus dados serão compartilhados apenas com as empresas selecionadas para este pedido.
              </p>
            </form>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 carroimportado.com</p>
        </div>
      </footer>
    </div>
  );
}
