"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PECAS, ESPECIALIDADE_CORES, type Peca } from "../data/pecas";
import NavHeader from "../components/NavHeader";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full
              ? "text-amber-400"
              : i === full && half
              ? "text-amber-300"
              : "text-slate-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function PecaCard({ peca }: { peca: Peca }) {
  const flag = peca.pais === "US" ? "🇺🇸" : "🇧🇷";

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-snug">{peca.nome}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {flag} {peca.cidade}, {peca.estado}
            </p>
          </div>
          {peca.rating !== null && (
            <div className="flex-shrink-0 text-right">
              <StarRating rating={peca.rating} />
              <p className="text-xs text-slate-500 mt-0.5">
                {peca.rating.toFixed(1)}
                {peca.reviews ? ` (${peca.reviews})` : ""}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {peca.especialidades.map((esp) => (
            <span
              key={esp}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                ESPECIALIDADE_CORES[esp] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {esp}
            </span>
          ))}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed flex-1">{peca.descricao}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {peca.website && (
            <a
              href={peca.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Site
            </a>
          )}
          {peca.whatsapp && (
            <a
              href={`https://wa.me/${peca.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}
          {peca.email && !peca.whatsapp && (
            <a
              href={`mailto:${peca.email}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              E-mail
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const PAIS_LABELS = { todos: "🌎 Todos", US: "🇺🇸 EUA", BR: "🇧🇷 Brasil" } as const;
type PaisFilter = keyof typeof PAIS_LABELS;

const ALL_ESPECIALIDADES = Array.from(
  new Set(PECAS.flatMap((p) => p.especialidades))
).sort();

export default function PecasClient() {
  const [paisFilter, setPaisFilter] = useState<PaisFilter>("todos");
  const [search, setSearch] = useState("");
  const [espFilter, setEspFilter] = useState("");

  const filtered = useMemo(() => {
    return PECAS.filter((p) => {
      if (paisFilter !== "todos" && p.pais !== paisFilter) return false;
      if (espFilter && !p.especialidades.includes(espFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.nome.toLowerCase().includes(q) ||
          p.cidade.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.especialidades.some((esp) => esp.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [paisFilter, search, espFilter]);

  const usCount = filtered.filter((p) => p.pais === "US").length;
  const brCount = filtered.filter((p) => p.pais === "BR").length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavHeader activePage="pecas" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3">
            Peças para carros americanos
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Fornecedoras de peças de reposição nos EUA e importadoras no Brasil.
            Motor, suspensão, freios, elétrica e itens raros para muscle cars e clássicos.
          </p>
          <p className="text-xs text-slate-400 mt-3">
            ⚠️ Não temos vínculo comercial com nenhum dos fornecedores listados. Faça sua própria pesquisa antes de contratar.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <div className="bg-white border-b border-slate-200 sticky top-[57px] z-[9] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar fornecedor, cidade, especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex bg-slate-100 rounded-lg p-1 gap-1 flex-shrink-0">
            {(Object.keys(PAIS_LABELS) as PaisFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setPaisFilter(key)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  paisFilter === key
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {PAIS_LABELS[key]}
              </button>
            ))}
          </div>

          <select
            value={espFilter}
            onChange={(e) => setEspFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          >
            <option value="">Todas as especialidades</option>
            {ALL_ESPECIALIDADES.map((esp) => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultado */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-600 font-medium">Nenhum fornecedor encontrado</p>
            <p className="text-sm mt-1">Tente outro termo ou remova os filtros</p>
          </div>
        ) : (
          <>
            {(paisFilter === "todos" || paisFilter === "US") && usCount > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  🇺🇸 Fornecedoras de Peças — EUA
                  <span className="text-slate-300 font-normal normal-case tracking-normal">({usCount})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.filter((p) => p.pais === "US").map((p) => (
                    <PecaCard key={p.id} peca={p} />
                  ))}
                </div>
              </section>
            )}

            {(paisFilter === "todos" || paisFilter === "BR") && brCount > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  🇧🇷 Importadoras de Peças — Brasil
                  <span className="text-slate-300 font-normal normal-case tracking-normal">({brCount})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.filter((p) => p.pais === "BR").map((p) => (
                    <PecaCard key={p.id} peca={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA cadastro */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center mt-4">
          <p className="text-2xl mb-2">🔧</p>
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            Seu fornecedor não está aqui?
          </h3>
          <p className="text-slate-600 text-sm mb-4 max-w-md mx-auto">
            Se você tem uma empresa especializada em fornecimento ou importação de peças
            para carros americanos e quer aparecer neste diretório, entre em contato.
          </p>
          <Link
            href="/pecas/cadastro"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Solicitar cadastro
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>© 2026 carroimportado.com — Calculadora de importação de veículos EUA → Brasil</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacidade</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Termos</Link>
            <Link href="/sobre" className="hover:text-slate-700 transition-colors">Sobre</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
