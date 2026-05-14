"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.carroimportado.com";

const ESTADOS = [
  { value: "SP", label: "São Paulo (SP) — ICMS 12%" },
  { value: "RJ", label: "Rio de Janeiro (RJ) — ICMS 20%" },
  { value: "MG", label: "Minas Gerais (MG) — ICMS 12%" },
  { value: "SC", label: "Santa Catarina (SC) — ICMS 12%" },
  { value: "RS", label: "Rio Grande do Sul (RS) — ICMS 12%" },
  { value: "PR", label: "Paraná (PR) — ICMS 12%" },
  { value: "OTHER", label: "Outros estados — ICMS 17%" },
];

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtUSD(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

interface ImportCosts {
  icms_rate_pct: number;
  effective_tax_rate_pct: number;
  total_landed_brl: number;
  valor_mercado_estimado_brl: number;
  valor_aduaneiro: {
    fob_usd: number; fob_brl: number; frete_usd: number; frete_brl: number;
    frete_fonte: string; frete_sugerido: { min_usd: number; max_usd: number; nota: string };
    seguro_usd: number; seguro_brl: number; cif_usd: number; cif_brl: number;
  };
  desembaraco_aduaneiro: {
    despachante_honorarios_usd: number; thc_usd: number;
    afrmm_usd: number; armazenagem_capatazia_usd: number;
    total_usd: number; total_brl: number;
  };
  breakdown_brl: {
    ii_imposto_importacao: number; ipi: number; pis: number;
    cofins: number; icms: number; desembaraco: number;
    total_taxes: number; total_landed: number;
  };
}

interface AnalyzeResult {
  plano?: string;
  modo?: string;
  cotacao_dolar: { valor: number; fonte: string; data: string | null; nota: string };
  car_data: {
    price_usd: number; year: number | null; make: string | null; model: string | null;
    mileage_miles: number | null; condition: string | null; photos: string[]; is_classic: boolean;
  };
  description_pt?: string | null;
  import_costs: ImportCosts;
  benchmark_brasil?: {
    source: string; fipe_code: string | null; descricao: string | null;
    preco_brl: number | null; mes_referencia: string | null; nota: string;
    comparativo: {
      custo_importar_brl: number; preco_local_brl: number; diferenca_brl: number;
      importar_e_mais_caro: boolean; contexto: string;
    } | null;
  };
}

// ── Carrossel de fotos ────────────────────────────────────────────────────────
function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  if (photos.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx((i) => (i + 1) % photos.length);

  return (
    <div className="relative w-full sm:w-80 shrink-0 bg-slate-100 overflow-hidden" style={{ minHeight: 200 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[idx]}
        alt={`${alt} — foto ${idx + 1}`}
        className="w-full h-56 sm:h-full object-cover"
      />
      {photos.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors">
            ‹
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors">
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {idx + 1}/{photos.length}
          </span>
        </>
      )}
    </div>
  );
}

// ── Row de custo ──────────────────────────────────────────────────────────────
function Row({ label, brl, usd, bold }: { label: string; brl: number; usd?: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-1.5 ${bold ? "font-semibold border-t border-slate-100 mt-1 pt-3" : ""}`}>
      <span className="text-slate-600 text-sm">{label}</span>
      <div className="text-right shrink-0">
        <span className="text-slate-900 text-sm">R$ {fmt(brl)}</span>
        {usd !== undefined && <span className="text-slate-400 text-xs ml-2">(USD {fmtUSD(usd)})</span>}
      </div>
    </div>
  );
}

// ── Bloco de resultados (reutilizado pelos dois modos) ────────────────────────
function Results({ result }: { result: AnalyzeResult }) {
  const { car_data: car, import_costs: ic, benchmark_brasil: bm, cotacao_dolar: cd } = result;
  const va = ic.valor_aduaneiro;
  const da = ic.desembaraco_aduaneiro;
  const bd = ic.breakdown_brl;

  const carTitle = [car.year, car.make, car.model].filter(Boolean).join(" ") || "Veículo";

  return (
    <div className="space-y-6">
      {/* Car card */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <PhotoCarousel photos={car.photos} alt={carTitle} />
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{carTitle}</h2>
                {(car.mileage_miles || car.condition) && (
                  <p className="text-slate-500 text-sm mt-1">
                    {car.mileage_miles ? `${car.mileage_miles.toLocaleString("en-US")} milhas` : ""}
                    {car.mileage_miles && car.condition ? " · " : ""}
                    {car.condition || ""}
                    {car.is_classic && <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Clássico</span>}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">USD {fmtUSD(car.price_usd)}</p>
                <p className="text-slate-400 text-xs mt-0.5">Preço nos EUA (FOB)</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              💱 {cd.nota}
            </div>
          </div>
        </div>
      </section>

      {/* Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-sm">
          <p className="text-blue-100 text-sm mb-1">Total internado no Brasil</p>
          <p className="text-3xl font-bold">R$ {fmt(ic.total_landed_brl)}</p>
          <p className="text-blue-200 text-xs mt-2">Carga tributária: {ic.effective_tax_rate_pct.toFixed(1)}% sobre FOB</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500 text-sm mb-1">Valor de mercado estimado</p>
          <p className="text-2xl font-bold text-slate-900">R$ {fmt(ic.valor_mercado_estimado_brl)}</p>
          <p className="text-slate-400 text-xs mt-2">+25% prêmio de revenda típico</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500 text-sm mb-1">Câmbio utilizado</p>
          <p className="text-2xl font-bold text-slate-900">R$ {cd.valor.toFixed(4)}</p>
          <p className="text-slate-400 text-xs mt-2">{cd.fonte}</p>
        </div>
      </div>

      {/* Valor aduaneiro */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">📦 Valor Aduaneiro (CIF)</h3>
        <Row label="FOB — Preço do veículo nos EUA" brl={va.fob_brl} usd={va.fob_usd} />
        <Row label={`Frete marítimo (${va.frete_fonte})`} brl={va.frete_brl} usd={va.frete_usd} />
        <Row label="Seguro marítimo (1,5% do FOB)" brl={va.seguro_brl} usd={va.seguro_usd} />
        <Row label="CIF — Valor Aduaneiro total" brl={va.cif_brl} usd={va.cif_usd} bold />
        {va.frete_fonte.includes("estimativa") && (
          <p className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-lg p-3">💡 {va.frete_sugerido?.nota}</p>
        )}
      </section>

      {/* Impostos */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">🏛️ Impostos</h3>
        <Row label="II — Imposto de Importação (35% do FOB)" brl={bd.ii_imposto_importacao} />
        <Row label="IPI (18,81% sobre FOB + II)" brl={bd.ipi} />
        <Row label="PIS (2,62% do CIF)" brl={bd.pis} />
        <Row label="COFINS (12,57% do CIF)" brl={bd.cofins} />
        <Row label={`ICMS — ${ic.icms_rate_pct}% (cálculo por dentro)`} brl={bd.icms} />
        <Row label="Total de impostos" brl={bd.total_taxes} bold />
      </section>

      {/* Desembaraço */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">🛃 Desembaraço Aduaneiro</h3>
        <Row label="Despachante (honorários)" brl={da.despachante_honorarios_usd * cd.valor} usd={da.despachante_honorarios_usd} />
        <Row label="THC — Terminal Handling Charge" brl={da.thc_usd * cd.valor} usd={da.thc_usd} />
        <Row label="AFRMM — 25% do frete (Lei 10.893/2004)" brl={da.afrmm_usd * cd.valor} usd={da.afrmm_usd} />
        <Row label="Armazenagem e capatazia" brl={da.armazenagem_capatazia_usd * cd.valor} usd={da.armazenagem_capatazia_usd} />
        <Row label="Total desembaraço" brl={da.total_brl} usd={da.total_usd} bold />
      </section>

      {/* Benchmark FIPE */}
      {bm?.preco_brl && bm?.comparativo && (
        <section className={`rounded-2xl border shadow-sm p-6 ${bm.comparativo.importar_e_mais_caro ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
          <h3 className="font-semibold text-slate-900 mb-4">📊 Comparativo com o mercado brasileiro</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Custo de importar</p>
              <p className="text-2xl font-bold text-slate-900">R$ {fmt(bm.comparativo.custo_importar_brl)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Preço no Brasil ({bm.source})</p>
              <p className="text-2xl font-bold text-slate-900">R$ {fmt(bm.preco_brl)}</p>
              {bm.descricao && <p className="text-xs text-slate-400 mt-0.5">{bm.descricao}</p>}
            </div>
          </div>
          <div className={`text-sm font-medium px-4 py-3 rounded-xl ${bm.comparativo.importar_e_mais_caro ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}>
            {bm.comparativo.importar_e_mais_caro ? "⚠️" : "✅"} {bm.comparativo.contexto}
          </div>
          {bm.mes_referencia && <p className="text-xs text-slate-400 mt-2">Referência FIPE: {bm.mes_referencia}</p>}
        </section>
      )}

      {/* Descrição IA (planos pagos) */}
      {result.description_pt && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-3">✍️ Sobre este veículo</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.description_pt}</p>
        </section>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<"url" | "manual">("url");

  // Modo URL
  const [url, setUrl] = useState("");
  const [state, setState] = useState("SP");
  const [freteUsd, setFreteUsd] = useState("");

  // Modo manual
  const [priceUsd, setPriceUsd] = useState("");
  const [manualYear, setManualYear] = useState("");
  const [manualMake, setManualMake] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualFrete, setManualFrete] = useState("");
  const [manualCambio, setManualCambio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const body: Record<string, unknown> = { url, state };
      if (freteUsd) body.frete_usd = parseFloat(freteUsd);
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao analisar o anúncio.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const body: Record<string, unknown> = {
        price_usd: parseFloat(priceUsd),
        state: "SP",
      };
      if (manualFrete) body.frete_usd = parseFloat(manualFrete);
      if (manualCambio) body.usd_brl_rate = parseFloat(manualCambio);
      if (manualYear) body.year = parseInt(manualYear);
      if (manualMake) body.make = manualMake;
      if (manualModel) body.model = manualModel;

      const res = await fetch(`${API_URL}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no cálculo.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">carroimportado.com</span>
          </div>
          <span className="text-sm text-slate-500 hidden sm:block">Calculadora de importação EUA → Brasil</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Form card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Quanto custa importar esse carro?
          </h1>
          <p className="text-slate-500 mb-6 text-sm">
            Cole o link de um anúncio do <strong>Cars.com</strong> ou insira os valores manualmente para calcular o custo total de importação para o Brasil.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
            <button onClick={() => { setTab("url"); setResult(null); setError(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              🔗 Cole um link
            </button>
            <button onClick={() => { setTab("manual"); setResult(null); setError(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "manual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              ✏️ Inserir manualmente
            </button>
          </div>

          {/* Tab: URL */}
          {tab === "url" && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link do anúncio (Cars.com)</label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.cars.com/vehicledetail/..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado de destino</label>
                  <select value={state} onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Frete marítimo (USD) <span className="text-slate-400 font-normal">— opcional</span>
                  </label>
                  <input type="number" value={freteUsd} onChange={(e) => setFreteUsd(e.target.value)}
                    placeholder="Estimativa: USD 1.200–2.500" min={100} max={10000}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                {loading ? "⏳ Calculando..." : "Calcular custo de importação →"}
              </button>
            </form>
          )}

          {/* Tab: Manual */}
          {tab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                📍 Cálculo fixado para <strong>São Paulo (SP)</strong> — ICMS 12%
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ano do veículo</label>
                  <input type="number" value={manualYear} onChange={(e) => setManualYear(e.target.value)}
                    placeholder="ex: 1970" min={1900} max={2100}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input type="text" value={manualMake} onChange={(e) => setManualMake(e.target.value)}
                    placeholder="ex: Ford"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                  <input type="text" value={manualModel} onChange={(e) => setManualModel(e.target.value)}
                    placeholder="ex: Mustang GT"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço do veículo (USD) *</label>
                  <input type="number" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)}
                    placeholder="ex: 15000" min={1} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Frete marítimo (USD) <span className="text-slate-400 font-normal">— opcional</span>
                  </label>
                  <input type="number" value={manualFrete} onChange={(e) => setManualFrete(e.target.value)}
                    placeholder="Padrão: USD 1.500" min={100} max={10000}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Câmbio USD/BRL <span className="text-slate-400 font-normal">— opcional</span>
                  </label>
                  <input type="number" value={manualCambio} onChange={(e) => setManualCambio(e.target.value)}
                    placeholder="Padrão: BCB PTAX do dia" min={1} max={20} step={0.01}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                {loading ? "⏳ Calculando..." : "Calcular impostos →"}
              </button>
            </form>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">⚠️ {error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500 text-sm">
            <div className="text-3xl mb-3 animate-pulse">🔍</div>
            {tab === "url" ? "Buscando dados do anúncio e calculando impostos..." : "Calculando impostos..."}
          </div>
        )}

        {/* Resultados */}
        {result && !loading && <Results result={result} />}

        <footer className="text-center text-xs text-slate-400 pb-8 pt-4 space-y-1">
          <p>carroimportado.com — Calculadora de importação de veículos EUA → Brasil</p>
          <p>Os valores são estimativas. Consulte um despachante aduaneiro para cotações precisas.</p>
          <p>
            <a href="/privacy" className="hover:text-slate-600 underline">Política de Privacidade</a>
            {" · "}
            <a href="/terms" className="hover:text-slate-600 underline">Termos de Uso</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
