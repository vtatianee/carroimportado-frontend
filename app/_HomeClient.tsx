"use client";

import { useState, useEffect } from "react";
import NavHeader from "./components/NavHeader";

// ── Histórico de pesquisas (localStorage) ─────────────────────────────────────
const HISTORY_KEY = "search_history";
const MAX_HISTORY = 5;

interface HistoryEntry {
  id: string;            // timestamp como ID único
  listing_url: string;   // URL do anúncio no Cars.com
  title: string;         // "2019 Ford Mustang GT"
  photo: string | null;  // primeira foto
  price_usd: number;
  is_classic: boolean;
  searched_at: number;   // Date.now()
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)); } catch { /* quota */ }
}

// As chamadas à API passam pelo proxy Next.js (app/api/*) para não expor a URL do backend no browser.

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
  ipi_rate_pct: number;
  is_classic: boolean;
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

// ── Ícones SVG (Heroicons outline) ───────────────────────────────────────────
const IconBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
  </svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);
const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);
const IconPencil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
      <span className="text-blue-600 shrink-0">{icon}</span>
      {children}
    </h3>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1" style={{ verticalAlign: "middle" }}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        aria-label="Mais informações"
        className="w-4 h-4 rounded-full bg-slate-200 hover:bg-blue-100 text-slate-500 hover:text-blue-600 flex items-center justify-center text-[10px] font-bold leading-none transition-colors cursor-help focus:outline-none"
      >
        ?
      </button>
      {open && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none leading-relaxed">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
}

// ── Row de custo ──────────────────────────────────────────────────────────────
function Row({ label, brl, usd, bold, tooltip }: { label: string; brl: number; usd?: number; bold?: boolean; tooltip?: string }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-1.5 ${bold ? "font-semibold border-t border-slate-100 mt-1 pt-3" : ""}`}>
      <span className="text-slate-600 text-sm flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      <div className="text-right shrink-0">
        <span className="text-slate-900 text-sm">R$ {fmt(brl)}</span>
        {usd !== undefined && <span className="text-slate-500 text-xs ml-2">(USD {fmtUSD(usd)})</span>}
      </div>
    </div>
  );
}

// ── Gráfico de composição de custos ──────────────────────────────────────────
interface ChartSegment { label: string; valueBrl: number; color: string }

function DonutChart({ segments }: { segments: ChartSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.valueBrl, 0);
  const r = 36;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const len = (seg.valueBrl / total) * circumference;
            const el = (
              <circle key={i} cx="50" cy="50" r={r} fill="none"
                stroke={seg.color} strokeWidth="22"
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-cumulative}
              />
            );
            cumulative += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] text-slate-400 leading-tight">Total</span>
          <span className="text-[11px] font-bold text-slate-800 leading-tight">R$ {fmt(total)}</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 w-full">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-600 truncate">{seg.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 w-10 text-right">{((seg.valueBrl / total) * 100).toFixed(1)}%</span>
              <span className="text-slate-800 font-medium w-24 text-right">R$ {fmt(seg.valueBrl)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostChart({ result }: { result: AnalyzeResult }) {
  const { import_costs: ic, cotacao_dolar: cd } = result;
  const va = ic.valor_aduaneiro;
  const bd = ic.breakdown_brl;
  const da = ic.desembaraco_aduaneiro;

  const segments: ChartSegment[] = [
    { label: "Veículo (FOB)", valueBrl: va.fob_brl, color: "#475569" },
    { label: "Frete + Seguro", valueBrl: va.frete_brl + va.seguro_brl, color: "#94a3b8" },
    { label: "II — Imp. de Importação", valueBrl: bd.ii_imposto_importacao, color: "#ef4444" },
    { label: "IPI", valueBrl: bd.ipi, color: "#f97316" },
    { label: "PIS + COFINS", valueBrl: bd.pis + bd.cofins, color: "#f59e0b" },
    { label: `ICMS (${ic.icms_rate_pct}%)`, valueBrl: bd.icms, color: "#eab308" },
    { label: "Desembaraço aduaneiro", valueBrl: da.total_brl, color: "#3b82f6" },
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <SectionHeading icon={<IconChart />}>Composição do custo total</SectionHeading>
      <DonutChart segments={segments} />
      <p className="text-xs text-slate-400 mt-4">
        Câmbio: R$ {cd.valor.toFixed(4)} · ICMS/{result.import_costs.icms_rate_pct === 20 ? "RJ" : result.import_costs.icms_rate_pct === 12 ? "SP/MG/SC/RS/PR" : "outros estados"}
      </p>
    </section>
  );
}

// ── Exemplo pré-calculado (visível antes de qualquer cálculo) ─────────────────
const EXAMPLE_RESULT: AnalyzeResult = {
  cotacao_dolar: { valor: 5.75, fonte: "BCB PTAX (exemplo)", data: "2026-05-01", nota: "Câmbio de exemplo — USD 1 = R$ 5,75 (BCB PTAX)" },
  car_data: { price_usd: 45000, year: 1969, make: "Ford", model: "Mustang Fastback", mileage_miles: 58420, condition: "Used", photos: [], is_classic: true },
  import_costs: {
    // Mustang 1969 — clássico 30+ anos → IPI = 0% (Lei 9.055/1995)
    // FOB $45k · Frete $2k · Seguro $675 · CIF $47.675 · Taxa R$5,75
    // II=35%·FOB · IPI=0 · PIS=2,62%·CIF · COFINS=12,57%·CIF · ICMS=12% por dentro
    icms_rate_pct: 12, ipi_rate_pct: 0, is_classic: true, effective_tax_rate_pct: 73.4,
    total_landed_brl: 481336, valor_mercado_estimado_brl: 601670,
    valor_aduaneiro: {
      fob_usd: 45000, fob_brl: 258750,
      frete_usd: 2000, frete_brl: 11500, frete_fonte: "estimativa",
      frete_sugerido: { min_usd: 1500, max_usd: 2500, nota: "Frete estimado. Solicite cotação a transportadoras especializadas." },
      seguro_usd: 675, seguro_brl: 3881, cif_usd: 47675, cif_brl: 274131,
    },
    desembaraco_aduaneiro: { despachante_honorarios_usd: 1500, thc_usd: 500, afrmm_usd: 500, armazenagem_capatazia_usd: 375, total_usd: 2875, total_brl: 16531 },
    breakdown_brl: { ii_imposto_importacao: 90563, ipi: 0, pis: 7182, cofins: 34450, icms: 57760, desembaraco: 16531, total_taxes: 189955, total_landed: 481336 },
  },
};

// ── Bloco de resultados (reutilizado pelos dois modos) ────────────────────────
function Results({ result, isExample }: { result: AnalyzeResult; isExample?: boolean }) {
  const { car_data: car, import_costs: ic, benchmark_brasil: bm, cotacao_dolar: cd } = result;
  const va = ic.valor_aduaneiro;
  const da = ic.desembaraco_aduaneiro;
  const bd = ic.breakdown_brl;

  const carTitle = [car.year, car.make, car.model].filter(Boolean).join(" ") || "Veículo";

  // Verifica elegibilidade para importação pela legislação brasileira:
  // Permitido: 0 km (New) OU clássico (30+ anos)
  const isNew = car.condition?.toLowerCase() === "new";
  const isClassic = car.is_classic === true;
  const isRestricted = !isNew && !isClassic;
  const yearUnknown = car.is_classic === null && !isNew;

  return (
    <div className="space-y-6">
      {/* Banner de exemplo */}
      {isExample && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <span className="text-blue-500 text-xl shrink-0">💡</span>
          <div>
            <p className="font-semibold text-blue-800 text-sm">Exemplo de cálculo</p>
            <p className="text-blue-600 text-xs mt-0.5">Cole o link de um anúncio acima para calcular o seu próprio veículo.</p>
          </div>
        </div>
      )}
      {/* Aviso legal — importação restrita */}
      {isRestricted && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5">
          <div className="flex gap-3">
            <span className="text-red-500 text-xl shrink-0">🚫</span>
            <div>
              <p className="font-semibold text-red-800 text-sm mb-1">
                Importação possivelmente não permitida pela legislação brasileira
              </p>
              <p className="text-red-700 text-sm leading-relaxed">
                A legislação brasileira{" "}
                <strong>não permite a importação de veículos usados</strong> com menos
                de 30 anos de fabricação.{" "}
                {car.year
                  ? `Este veículo foi fabricado em ${car.year} e ainda não atingiu o prazo mínimo.`
                  : ""}
                {" "}Os valores abaixo são exibidos apenas para fins de estimativa.
                Consulte um despachante aduaneiro habilitado antes de tomar qualquer decisão.
              </p>
              {yearUnknown && (
                <p className="text-red-600 text-xs mt-2 italic">
                  Ano do veículo não identificado. Verifique se ele tem mais de 30 anos antes de prosseguir.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
          <p className="text-slate-500 text-xs mt-2">+25% prêmio típico no mercado brasileiro</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500 text-sm mb-1">Câmbio utilizado</p>
          <p className="text-2xl font-bold text-slate-900">R$ {cd.valor.toFixed(4)}</p>
          <p className="text-slate-500 text-xs mt-2">{cd.fonte}</p>
        </div>
      </div>

      {/* Gráfico de composição */}
      <CostChart result={result} />

      {/* Valor aduaneiro */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconBox />}>Valor Aduaneiro (CIF)</SectionHeading>
        <Row label="FOB — Preço do veículo nos EUA" brl={va.fob_brl} usd={va.fob_usd}
          tooltip="FOB (Free On Board): preço do veículo no porto de origem nos EUA, sem incluir frete nem seguro." />
        <Row label={`Frete marítimo (${va.frete_fonte})`} brl={va.frete_brl} usd={va.frete_usd}
          tooltip="Custo do transporte marítimo do porto americano até o porto brasileiro (ex: Santos/SP). Varia entre USD 1.200–2.500 dependendo da rota." />
        <Row label="Seguro marítimo (1,5% do FOB)" brl={va.seguro_brl} usd={va.seguro_usd}
          tooltip="Seguro obrigatório calculado em 1,5% do valor FOB, conforme padrão da Receita Federal (IN RFB nº 1.401/2013)." />
        <Row label="CIF — Valor Aduaneiro total" brl={va.cif_brl} usd={va.cif_usd} bold
          tooltip="CIF (Cost, Insurance and Freight): FOB + frete + seguro. É a base legal de cálculo de todos os impostos de importação no Brasil (AVA-GATT / Decreto 6.759/2009)." />
        {va.frete_fonte.includes("estimativa") && (
          <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">💡 {va.frete_sugerido?.nota}</p>
        )}
      </section>

      {/* Impostos */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconBuilding />}>Impostos</SectionHeading>
        <Row label="II — Imposto de Importação (35% do CIF)" brl={bd.ii_imposto_importacao}
          tooltip="II (Imposto de Importação): alíquota fixa de 35% sobre o valor aduaneiro (CIF = FOB + frete + seguro). É o maior imposto isolado na importação de veículos, arrecadado pela Receita Federal. Base legal: Decreto 6.759/2009 (Regulamento Aduaneiro) e Acordo AVA-GATT." />
        <Row label={`IPI (${ic.ipi_rate_pct === 0 ? "0% — isento" : `${ic.ipi_rate_pct.toFixed(2)}% sobre CIF + II`})`} brl={bd.ipi}
          tooltip={`IPI (Imposto sobre Produtos Industrializados): incide sobre CIF + II. Alíquotas TIPI (Decreto 11.158/2022): ≤1.000cc → 7%, 1.001–2.000cc → 18,81%, acima de 2.000cc → 25%. ${ic.is_classic ? "Isento para veículos com 30+ anos de fabricação (Lei 9.055/1995)." : ic.ipi_rate_pct === 0 ? "Isento para veículos elétricos (Decreto 11.394/2023)." : ""}`} />
        <Row label="PIS (2,62% do CIF)" brl={bd.pis}
          tooltip="PIS (Programa de Integração Social): 2,62% sobre o valor CIF. Contribuição federal destinada ao seguro-desemprego e abono salarial." />
        <Row label="COFINS (12,57% do CIF)" brl={bd.cofins}
          tooltip="COFINS (Contribuição para o Financiamento da Seguridade Social): 12,57% sobre o CIF. Destinada à previdência social, saúde pública e assistência social." />
        <Row label={`ICMS — ${ic.icms_rate_pct}% (cálculo por dentro)`} brl={bd.icms}
          tooltip={`ICMS (Imposto sobre Circulação de Mercadorias e Serviços): varia por estado (SP/MG/SC/RS/PR: 12%, RJ: 20%, outros: 17%). Calculado "por dentro" — a alíquota incide sobre uma base que já inclui o próprio ICMS, tornando o impacto real maior que a alíquota nominal.`} />
        <Row label="Total de impostos" brl={bd.total_taxes} bold />
      </section>

      {/* Desembaraço */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconShield />}>Desembaraço Aduaneiro</SectionHeading>
        <Row label="Despachante (honorários)" brl={da.despachante_honorarios_usd * cd.valor} usd={da.despachante_honorarios_usd}
          tooltip="Honorários do despachante aduaneiro habilitado pela Receita Federal, obrigatório para o desembaraço. Valor estimado — pode variar conforme profissional e complexidade." />
        <Row label="THC — Terminal Handling Charge" brl={da.thc_usd * cd.valor} usd={da.thc_usd}
          tooltip="THC (Terminal Handling Charge): taxa cobrada pelo terminal portuário pelo manuseio e movimentação do veículo/contêiner no porto de destino." />
        <Row label="AFRMM — 25% do frete (Lei 10.893/2004)" brl={da.afrmm_usd * cd.valor} usd={da.afrmm_usd}
          tooltip="AFRMM (Adicional ao Frete para Renovação da Marinha Mercante): 25% do valor do frete marítimo, cobrado por lei (Lei 10.893/2004) para financiar a marinha mercante brasileira." />
        <Row label="Armazenagem e capatazia" brl={da.armazenagem_capatazia_usd * cd.valor} usd={da.armazenagem_capatazia_usd}
          tooltip="Capatazia: manuseio da carga dentro do recinto aduaneiro. Armazenagem: custo do período de guarda do veículo no porto. Valores estimados para os primeiros dias — aumentam a cada dia adicional." />
        <Row label="Total desembaraço" brl={da.total_brl} usd={da.total_usd} bold />
      </section>

      {/* Benchmark FIPE */}
      {bm?.preco_brl && bm?.comparativo && (
        <section className={`rounded-2xl border shadow-sm p-6 ${bm.comparativo.importar_e_mais_caro ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
          <SectionHeading icon={<IconChart />}>Comparativo com o mercado brasileiro</SectionHeading>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Custo de importar</p>
              <p className="text-2xl font-bold text-slate-900">R$ {fmt(bm.comparativo.custo_importar_brl)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Preço no Brasil ({bm.source})</p>
              <p className="text-2xl font-bold text-slate-900">R$ {fmt(bm.preco_brl)}</p>
              {bm.descricao && <p className="text-xs text-slate-500 mt-0.5">{bm.descricao}</p>}
            </div>
          </div>
          <div className={`text-sm font-medium px-4 py-3 rounded-xl ${bm.comparativo.importar_e_mais_caro ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}>
            {bm.comparativo.importar_e_mais_caro ? "⚠️" : "✅"} {bm.comparativo.contexto}
          </div>
          {bm.mes_referencia && <p className="text-xs text-slate-500 mt-2">Referência FIPE: {bm.mes_referencia}</p>}
        </section>
      )}

      {/* Descrição IA (planos pagos) */}
      {result.description_pt && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeading icon={<IconPencil />}>Sobre este veículo</SectionHeading>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.description_pt}</p>
        </section>
      )}

      {/* Compartilhar */}
      <ShareResult result={result} />
    </div>
  );
}

// ── Compartilhar resultado ────────────────────────────────────────────────────
function ShareResult({ result }: { result: AnalyzeResult }) {
  const [copied, setCopied] = useState(false);

  const { car_data: car, import_costs: ic, cotacao_dolar: cd } = result;
  const carTitle = [car.year, car.make, car.model].filter(Boolean).join(" ") || "Veículo";

  function buildShareText() {
    const lines = [
      `🚗 *${carTitle}* — importar dos EUA para o Brasil`,
      `💰 Total internado: *R$ ${fmt(ic.total_landed_brl)}*`,
      `🏛️ Carga tributária: *${ic.effective_tax_rate_pct.toFixed(1)}%* do valor do carro`,
      `📊 Câmbio PTAX: R$ ${cd.valor.toFixed(4)}`,
      ``,
      `Calcule o seu: https://www.carroimportado.com`,
    ];
    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback para browsers sem clipboard API
      const el = document.createElement("textarea");
      el.value = buildShareText();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(buildShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function handleX() {
    const text = encodeURIComponent(
      `🚗 ${carTitle} — importar dos EUA para o Brasil\n💰 Total: R$ ${fmt(ic.total_landed_brl)} (${ic.effective_tax_rate_pct.toFixed(1)}% de impostos)\n\nCalcule o seu:`
    );
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent("https://www.carroimportado.com")}`, "_blank", "noopener,noreferrer");
  }

  function handleFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://www.carroimportado.com")}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-700">📤 Compartilhar este cálculo</p>
          <p className="text-xs text-slate-400 mt-0.5">Envie o resultado para amigos ou redes sociais</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* WhatsApp */}
          <button onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>

          {/* X (Twitter) */}
          <button onClick={handleX}
            className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            X
          </button>

          {/* Facebook */}
          <button onClick={handleFacebook}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-medium rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>

          {/* Copiar */}
          <button onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
              copied ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}>
            {copied ? "✓ Copiado!" : "📋 Copiar"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Calculadora reversa ───────────────────────────────────────────────────────
const ICMS_RATES: Record<string, number> = {
  SP: 0.12, MG: 0.12, SC: 0.12, RS: 0.12, PR: 0.12,
  RJ: 0.20,
  OTHER: 0.17,
};

interface ReverseResult {
  fob: number;
  freteUsd: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  desembaraco: number;
  icms: number;
  totalUsd: number;
  totalBrl: number;
  usdBrlRate: number;
  icmsRate: number;
  ipiRate: number;
  state: string;
}

interface SearchListing {
  title: string;
  price_usd: number;
  mileage_miles: number | null;
  condition: string;
  photo_url: string | null;
  photo_count: number | null;
  listing_url: string;
  year: number | null;
  is_classic: boolean | null;
}

function calcReverse(
  budgetBrl: number,
  state: string,
  usdBrlRate: number,
  freteUsd: number,
  vehicleType: string = "standard",
): ReverseResult | null {
  const icmsRate = ICMS_RATES[state] ?? 0.17;
  const desembaraco = 3000;
  const ipiRate = (vehicleType === "electric" || vehicleType === "classic") ? 0 : 0.1881;
  // Coefficient for FOB in the linear equation:
  // total_usd = (coeff * FOB + fixedCosts) / (1 - icmsRate)
  const coeff = 1 + 0.35 + 1.35 * ipiRate + 0.0262 + 0.1257;
  const fixedCosts = freteUsd + desembaraco + freteUsd * 0.0262 + freteUsd * 0.1257;
  const totalUsdTarget = budgetBrl / usdBrlRate;
  const fob = (totalUsdTarget * (1 - icmsRate) - fixedCosts) / coeff;
  if (fob <= 0) return null;

  const cif = fob + freteUsd;
  const ii = fob * 0.35;
  const ipi = (fob + ii) * ipiRate;
  const pis = cif * 0.0262;
  const cofins = cif * 0.1257;
  const subtotal = cif + ii + ipi + pis + cofins + desembaraco;
  const icms = (subtotal / (1 - icmsRate)) * icmsRate;
  const totalUsd = fob + freteUsd + desembaraco + ii + ipi + pis + cofins + icms;
  const totalBrl = totalUsd * usdBrlRate;

  return { fob, freteUsd, ii, ipi, pis, cofins, desembaraco, icms, totalUsd, totalBrl, usdBrlRate, icmsRate, state, ipiRate };
}

function ReverseCalc({
  budget, setBudget,
  state, setState,
  cambio, setCambio,
  frete, setFrete,
  vehicleType, setVehicleType,
}: {
  budget: string; setBudget: (v: string) => void;
  state: string; setState: (v: string) => void;
  cambio: string; setCambio: (v: string) => void;
  frete: string; setFrete: (v: string) => void;
  vehicleType: string; setVehicleType: (v: string) => void;
}) {
  const budgetNum = parseFloat(budget.replace(/\./g, "").replace(",", ".")) || 0;
  const cambioNum = parseFloat(cambio.replace(",", ".")) || 0;
  const freteNum = parseFloat(frete) || 1500;
  const result = budgetNum > 0 && cambioNum > 0 ? calcReverse(budgetNum, state, cambioNum, freteNum, vehicleType) : null;

  const [listings, setListings] = useState<SearchListing[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!result) return;
    setSearching(true);
    setSearchError(null);
    setListings(null);

    const fobMin = Math.round(result.fob * 0.85);
    const fobMax = Math.round(result.fob * 1.15);
    const params = new URLSearchParams({
      priceMin: String(fobMin),
      priceMax: String(fobMax),
      count: "5",
    });
    if (vehicleType === "classic") {
      params.set("yearMax", String(new Date().getFullYear() - 30));
    }

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings);
      } else {
        setSearchError(data.error || "Nenhum anúncio encontrado nessa faixa de preço.");
      }
    } catch {
      setSearchError("Erro de conexão ao buscar anúncios.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        💡 Informe seu orçamento total em reais e veja qual o preço máximo que você pode pagar pelo veículo nos EUA, já considerando todos os impostos e despesas.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Orçamento total (R$) *</label>
          <input
            type="text"
            inputMode="numeric"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="ex: 500.000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Estado de destino</label>
          <select value={state} onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Câmbio USD/BRL *</label>
          <input
            type="text"
            inputMode="decimal"
            value={cambio}
            onChange={(e) => setCambio(e.target.value)}
            placeholder="ex: 5.10"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="mt-1 text-xs text-slate-400">
            Consulte a cotação atual no{" "}
            <a href="https://www.bcb.gov.br/conversao" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Banco Central ↗
            </a>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de veículo</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="standard">Padrão (IPI 18,81%)</option>
            <option value="classic">Clássico +30 anos (IPI isento)</option>
            <option value="electric">Elétrico / Híbrido (IPI isento)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Frete marítimo (USD) <span className="text-slate-400 font-normal">— opcional</span>
          </label>
          <input
            type="number"
            value={frete}
            onChange={(e) => setFrete(e.target.value)}
            placeholder="Padrão: USD 1.500"
            min={100} max={10000}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-5">
          {/* Headline */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-1">Com <strong className="text-slate-700">R$ {fmt(result.totalBrl)}</strong> você pode pagar até:</p>
            <p className="text-4xl font-bold text-green-700 tracking-tight">
              US$ {fmtUSD(result.fob)}
            </p>
            <p className="text-sm text-slate-500 mt-1">pelo veículo nos EUA</p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1 rounded-full">
                Câmbio: R$ {result.usdBrlRate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1 rounded-full">
                {result.state === "OTHER" ? "Outros estados" : result.state} · ICMS {(result.icmsRate * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2 font-medium text-slate-600 text-xs">Custo</th>
                  <th className="text-right px-4 py-2 font-medium text-slate-600 text-xs">USD</th>
                  <th className="text-right px-4 py-2 font-medium text-slate-600 text-xs">BRL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { label: "Veículo (FOB)", usd: result.fob, highlight: true },
                  { label: `Frete marítimo`, usd: result.freteUsd },
                  { label: "II — Imposto de Importação (35%)", usd: result.ii },
                  { label: result.ipiRate === 0 ? "IPI (0% — isento)" : `IPI (${(result.ipiRate * 100).toFixed(2)}%)`, usd: result.ipi },
                  { label: "PIS (2,62%)", usd: result.pis },
                  { label: "COFINS (12,57%)", usd: result.cofins },
                  { label: "Desembaraço aduaneiro", usd: result.desembaraco },
                  { label: `ICMS (${(result.icmsRate * 100).toFixed(0)}%)`, usd: result.icms },
                ].map(({ label, usd, highlight }) => (
                  <tr key={label} className={highlight ? "bg-green-50/50" : ""}>
                    <td className={`px-4 py-2.5 ${highlight ? "font-semibold text-slate-800" : "text-slate-600"}`}>{label}</td>
                    <td className={`px-4 py-2.5 text-right font-mono ${highlight ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                      {fmtUSD(usd)}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono ${highlight ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                      {fmt(usd * result.usdBrlRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-200">
                  <td className="px-4 py-3 font-bold text-slate-900">Total estimado</td>
                  <td className="px-4 py-3 text-right font-bold font-mono text-slate-900">
                    {fmtUSD(result.totalUsd)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold font-mono text-slate-900">
                    {fmt(result.totalBrl)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-slate-500 text-center">
            ⚠️ Estimativa com base nas alíquotas da Receita Federal 2026. Consulte um despachante aduaneiro para cotação exata.
          </p>

          {/* Botão buscar anúncios */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={searching}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              {searching ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Buscando anúncios…
                </>
              ) : (
                <>🔎 Ver anúncios disponíveis no Cars.com</>
              )}
            </button>
          </div>

          {/* Erro de busca */}
          {searchError && (
            <p className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {searchError}
            </p>
          )}

          {/* Cards de anúncios */}
          {listings && listings.length > 0 && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-500 text-center">
                Anúncios ativos no Cars.com entre{" "}
                <strong className="text-slate-700">
                  US$ {fmtUSD(Math.round(result.fob * 0.85))} – {fmtUSD(Math.round(result.fob * 1.15))}
                </strong>
              </p>
              {listings.map((listing, idx) => (
                <a
                  key={idx}
                  href={listing.listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  {/* Foto */}
                  <div className="relative shrink-0 w-28 sm:w-36 bg-slate-100 overflow-hidden">
                    {listing.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.photo_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: "80px" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl" style={{ minHeight: "80px" }}>
                        🚗
                      </div>
                    )}
                    {listing.photo_count && (
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                        1/{listing.photo_count}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center py-3 pr-3 min-w-0">
                    <p className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-blue-700 transition-colors">
                      {listing.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-1.5">
                      {listing.mileage_miles != null && (
                        <span>{listing.mileage_miles.toLocaleString("pt-BR")} milhas</span>
                      )}
                      {listing.mileage_miles != null && <span>·</span>}
                      <span>{listing.condition}</span>
                      {listing.is_classic && (
                        <>
                          <span>·</span>
                          <span className="bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                            Clássico
                          </span>
                        </>
                      )}
                    </p>
                    {cambioNum > 0 && (
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        🔄 Cotação USD/BRL: R$ {cambioNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>

                  {/* Preço */}
                  <div className="shrink-0 flex flex-col items-end justify-center pr-4 py-3">
                    <p className="font-bold text-slate-900 text-base whitespace-nowrap">
                      USD {listing.price_usd.toLocaleString("en-US")}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Preço nos EUA (FOB)</p>
                    {cambioNum > 0 && (
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        ≈ R$ {fmt(listing.price_usd * cambioNum)}
                      </p>
                    )}
                  </div>
                </a>
              ))}

              <p className="text-[11px] text-slate-400 text-center">
                Anúncios exibidos para referência. Disponibilidade pode variar.
              </p>
            </div>
          )}

          {listings && listings.length === 0 && (
            <p className="text-center text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3">
              Nenhum anúncio encontrado nessa faixa de preço no momento. Tente ajustar o orçamento.
            </p>
          )}
        </div>
      )}

      {budgetNum > 0 && cambioNum > 0 && !result && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ⚠️ O orçamento informado é insuficiente para cobrir os custos fixos de importação (frete + desembaraço + impostos mínimos). Tente um valor maior.
        </div>
      )}
    </div>
  );
}

// ── Histórico de pesquisas ────────────────────────────────────────────────────
function SearchHistory({ entries, onClear }: { entries: HistoryEntry[]; onClear: () => void }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          🕐 Pesquisas recentes
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Limpar histórico
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <a
            key={entry.id}
            href={entry.listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            {/* Foto */}
            <div className="w-14 h-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
              {entry.photo ? (
                <img src={entry.photo} alt={entry.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">🚗</div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                {entry.title}
                {entry.is_classic && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-normal">Clássico</span>
                )}
              </p>
              <p className="text-xs text-slate-400 truncate">
                USD {entry.price_usd.toLocaleString("en-US")} · {entry.listing_url.replace("https://", "").split("/")[0]}
              </p>
            </div>
            {/* Seta */}
            <span className="text-slate-300 group-hover:text-blue-400 transition-colors text-sm shrink-0">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Próximos passos ───────────────────────────────────────────────────────────
function NextSteps() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
      <h2 className="font-bold text-base mb-4">O que fazer agora?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href="/guia" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors">
          <span className="text-2xl shrink-0">📋</span>
          <div>
            <p className="font-semibold text-sm">Leia o guia completo</p>
            <p className="text-blue-100 text-xs mt-0.5">8 etapas do processo de importação</p>
          </div>
        </a>
        <a href="/empresas"
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors">
          <span className="text-2xl shrink-0">🏢</span>
          <div>
            <p className="font-semibold text-sm">Encontrar empresa importadora</p>
            <p className="text-blue-100 text-xs mt-0.5">Exportadoras nos EUA e importadoras no Brasil</p>
          </div>
        </a>
        <a href="https://wa.me/?text=Calculei%20o%20custo%20de%20importar%20um%20carro%20dos%20EUA%20no%20carroimportado.com%20%F0%9F%9A%97" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors">
          <span className="text-2xl shrink-0">💬</span>
          <div>
            <p className="font-semibold text-sm">Compartilhar resultado</p>
            <p className="text-blue-100 text-xs mt-0.5">Enviar via WhatsApp</p>
          </div>
        </a>
      </div>
    </section>
  );
}

// ── Captura de email ──────────────────────────────────────────────────────────
function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-green-800">Cadastro realizado!</p>
        <p className="text-green-700 text-sm mt-1">Você receberá novidades sobre importação de veículos e novos recursos da calculadora.</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xl mb-1">📬</p>
        <h2 className="font-bold text-slate-900 text-base mb-1">Fique por dentro das novidades</h2>
        <p className="text-slate-500 text-sm mb-5">
          Receba atualizações sobre regras de importação, mudanças de alíquota e novos recursos da calculadora. Sem spam.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button type="submit" disabled={status === "loading"}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap cursor-pointer">
            {status === "loading" ? "Enviando..." : "Quero receber →"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-500 text-xs mt-2">Erro ao cadastrar. Tente novamente.</p>
        )}
      </div>
    </section>
  );
}

// ── Links úteis ───────────────────────────────────────────────────────────────
const USEFUL_LINKS = [
  {
    category: "Encontrar o veículo",
    icon: "🔍",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
    links: [
      { label: "Cars.com", url: "https://www.cars.com", desc: "Maior marketplace de carros usados dos EUA" },
      { label: "AutoTrader", url: "https://www.autotrader.com", desc: "Anúncios de veículos novos e usados nos EUA" },
      { label: "Bring a Trailer", url: "https://bringatrailer.com", desc: "Leilões de carros clássicos e esportivos" },
    ],
  },
  {
    category: "Governo Brasileiro",
    icon: "🏛️",
    color: "bg-green-50 border-green-100",
    iconBg: "bg-green-100",
    links: [
      { label: "Receita Federal", url: "https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/importacao", desc: "Normas e procedimentos oficiais de importação" },
      { label: "Siscomex", url: "https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/sistemas/siscomex", desc: "Sistema de comércio exterior do Brasil" },
      { label: "SENATRANS", url: "https://www.gov.br/transportes/pt-br/assuntos/transito", desc: "Secretaria Nacional de Trânsito — homologação de veículos importados" },
      { label: "INMETRO", url: "https://www.inmetro.gov.br/qualidade/rtepac/veiculosautomotores.asp", desc: "Requisitos técnicos para homologação" },
      { label: "BCB — PTAX", url: "https://www.bcb.gov.br/conversao", desc: "Cotação oficial do dólar para cálculo dos impostos" },
      { label: "DETRAN (SP)", url: "https://www.detran.sp.gov.br/wps/portal/portaldetran/cidadao/veiculos/fichaServico/emissaoCRLVe/559bc4de-0ae0-4d58-960a-ce5d8e8afa6c", desc: "Emplacamento e transferência de veículos importados" },
    ],
  },
  {
    category: "Governo Americano",
    icon: "🇺🇸",
    color: "bg-red-50 border-red-100",
    iconBg: "bg-red-100",
    links: [
      { label: "NHTSA", url: "https://www.nhtsa.gov/importing-vehicle", desc: "Normas de segurança para exportação dos EUA" },
      { label: "EPA", url: "https://www.epa.gov/importing-vehicles-and-engines", desc: "Requisitos ambientais de emissões" },
      { label: "CBP", url: "https://www.cbp.gov/trade/vehicles", desc: "Alfândega americana — documentação de exportação" },
    ],
  },
  {
    category: "Referências de preço",
    icon: "📊",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
    links: [
      { label: "Tabela FIPE", url: "https://veiculos.fipe.org.br", desc: "Preços de referência no mercado brasileiro" },
      { label: "Kelley Blue Book", url: "https://www.kbb.com", desc: "Valores de mercado de veículos nos EUA" },
    ],
  },
];

function UsefulLinks() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Links úteis para importação</h2>
      <p className="text-sm text-slate-500 mb-6">Fontes oficiais e plataformas essenciais para todo o processo.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {USEFUL_LINKS.map((cat) => (
          <div key={cat.category} className={`rounded-xl border p-4 ${cat.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-base ${cat.iconBg}`}>
                {cat.icon}
              </span>
              <h3 className="text-sm font-semibold text-slate-800">{cat.category}</h3>
            </div>
            <ul className="space-y-2">
              {cat.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 rounded-lg hover:bg-white/70 transition-colors p-1.5 -mx-1.5"
                  >
                    <div className="min-w-0">
                      <span className="text-blue-600 font-medium text-sm group-hover:underline block leading-tight">
                        {link.label} ↗
                      </span>
                      <span className="text-xs text-slate-500 leading-snug">{link.desc}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_ITEMS: { q: string; a: string; guia?: string }[] = [
  {
    q: "Quanto custa importar um carro dos EUA para o Brasil?",
    a: "O custo total inclui o preço do veículo (FOB), frete marítimo (~USD 1.500–2.500), II (35% do FOB), IPI (18,81% — ou 0% para clássicos 30+ anos), PIS (2,62%), COFINS (12,57%), ICMS (12–20% por estado) e desembaraço aduaneiro (~USD 3.000). A carga tributária costuma superar 100% do valor do veículo.",
    guia: "guia",
  },
  {
    q: "Qual é o ICMS para importação de veículos por estado?",
    a: "O ICMS varia por estado: SP, MG, SC, RS e PR cobram 12%. RJ cobra 20%. Os demais estados cobram 17%. O ICMS é calculado \"por dentro\" sobre a base total já com os demais impostos — por isso o impacto real é maior do que a alíquota nominal.",
  },
  {
    q: "Carros clássicos americanos pagam menos imposto no Brasil?",
    a: "Sim. Veículos com mais de 30 anos de fabricação são isentos de IPI na importação (Lei 9.055/1995), o que reduz o custo total em 10–15%. O II de 35% continua sendo aplicado. A calculadora detecta automaticamente veículos clássicos e aplica a alíquota correta.",
    guia: "guia",
  },
  {
    q: "Como funciona a calculadora de importação?",
    a: "Cole o link de um anúncio do Cars.com, insira o preço manualmente ou simule por orçamento disponível. A calculadora aplica as alíquotas da Receita Federal 2026 e a cotação PTAX do Banco Central, exibindo o custo total estimado com o breakdown completo de cada imposto.",
  },
  {
    q: "O que é o valor aduaneiro (CIF)?",
    a: "CIF (Cost, Insurance and Freight) é a base legal de cálculo dos impostos no Brasil. Compõe-se pelo preço do veículo (FOB) + frete marítimo + seguro marítimo (1,5% do FOB). Todos os impostos federais (II, IPI, PIS, COFINS) incidem sobre esse valor.",
    guia: "guia",
  },
  {
    q: "Preciso de um despachante aduaneiro para importar um carro?",
    a: "Sim. A legislação exige despachante habilitado pela Receita Federal para o desembaraço aduaneiro. Além disso, o processo envolve homologação no SENATRANS, licença de importação no Siscomex e laudos do IBAMA — etapas que o despachante coordena.",
    guia: "guia",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Perguntas frequentes sobre importação de carros dos EUA</h2>
      <div className="divide-y divide-slate-100">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left py-4 flex items-start justify-between gap-4 group"
            >
              <span className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                {item.q}
              </span>
              <span className={`shrink-0 text-slate-400 text-lg transition-transform ${open === i ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {open === i && (
              <div className="pb-4">
                <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                {item.guia && (
                  <a href={`/${item.guia}`} className="inline-block mt-2 text-blue-600 text-xs hover:underline font-medium">
                    → Veja mais no guia completo de importação
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Como funciona ─────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
      </svg>
    ),
    label: "Encontrar o veículo",
    desc: "Navegue no Cars.com e escolha o carro que deseja importar",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
      </svg>
    ),
    label: "Copiar o link do anúncio",
    desc: "Copie a URL do anúncio na barra de endereços do navegador",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    label: "Colar o link abaixo",
    desc: "Cole o link no campo da calculadora e selecione o estado de destino",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: "Ver o custo de importação",
    desc: "Veja todos os impostos detalhados e o custo total em reais",
  },
];

function HowItWorks() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Como funciona a calculadora
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mb-10">
          Cole o link do anúncio que encontrou no{" "}
          <a href="https://www.cars.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">Cars.com</a>{" "}
          e veja o custo real com todos os impostos detalhados.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center">
              {/* Step */}
              <div className="flex flex-col items-center gap-3 w-40">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm leading-tight">{step.label}</p>
                <p className="text-slate-400 text-xs leading-snug px-1">{step.desc}</p>
              </div>
              {/* Arrow between steps */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="text-slate-300 text-2xl my-3 sm:my-0 sm:mx-2 rotate-90 sm:rotate-0 shrink-0">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<"url" | "manual" | "reversa">("url");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Carrega histórico do localStorage ao montar
  useEffect(() => { setHistory(loadHistory()); }, []);

  function addToHistory(entry: Omit<HistoryEntry, "id" | "searched_at">) {
    setHistory(prev => {
      // Remove duplicatas da mesma URL
      const filtered = prev.filter(h => h.listing_url !== entry.listing_url);
      const next = [
        { ...entry, id: String(Date.now()), searched_at: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }


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
  const [manualVehicleType, setManualVehicleType] = useState("standard");

  // Calculadora reversa
  const [revBudget, setRevBudget] = useState("");
  const [revState, setRevState] = useState("SP");
  const [revCambio, setRevCambio] = useState("");
  const [revFrete, setRevFrete] = useState("");
  const [revVehicleType, setRevVehicleType] = useState("standard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlResult, setUrlResult] = useState<AnalyzeResult | null>(null);
  const [manualResult, setManualResult] = useState<AnalyzeResult | null>(null);

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setUrlResult(null);
    try {
      const body: Record<string, unknown> = { url, state };
      if (freteUsd) body.frete_usd = parseFloat(freteUsd);
      const res = await fetch(`/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao analisar o anúncio.");
      setUrlResult(data);
      // Salva no histórico
      const cd = data.car_data;
      const title = [cd.year, cd.make, cd.model].filter(Boolean).join(" ") || "Veículo";
      addToHistory({
        listing_url: url,
        title,
        photo: cd.photos?.[0] ?? null,
        price_usd: cd.price_usd,
        is_classic: cd.is_classic,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setManualResult(null);
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
      body.vehicle_type = manualVehicleType;

      const res = await fetch(`/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no cálculo.");
      setManualResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      <NavHeader activePage="home" />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5 sm:py-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight mb-2">
            Encontrou um carro nos EUA?<br className="hidden sm:block" /> Simule o custo de importá-lo para o Brasil.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-4">
            Cole o link do{" "}
            <a href="https://www.cars.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-300 hover:text-blue-200 underline underline-offset-2">Cars.com</a>
            , insira o preço manualmente ou simule por orçamento —
            impostos, frete e desembaraço detalhados em segundos.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
              ✅ Gratuito · Sem cadastro
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
              💱 Câmbio PTAX · Alíquotas 2026
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
              ⚠️ Carga tributária costuma passar de <strong>100%</strong> do valor
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Form card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-slate-500 mb-6 text-sm">
            Cole o link de um anúncio do{" "}
            <a href="https://www.cars.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">Cars.com</a>
            {" "}ou insira os valores manualmente.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 overflow-x-auto">
            <button onClick={() => { setTab("url"); setError(null); }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${tab === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              🔗 <span className="hidden sm:inline">Cole um </span>Link
            </button>
            <button onClick={() => { setTab("manual"); setError(null); }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${tab === "manual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              ✏️ <span className="hidden sm:inline">Inserir </span>Manual
            </button>
            <button onClick={() => { setTab("reversa"); setError(null); }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${tab === "reversa" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              💰 <span className="hidden sm:inline">Simular por </span>Orçamento
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
              <div>
                <button type="submit" disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                  {loading ? "⏳ Calculando..." : "Calcular custo de importação →"}
                </button>
                <p className="mt-2 text-xs text-slate-400">
                  Gratuito · Câmbio PTAX (Banco Central) · Alíquotas Receita Federal 2026 · Sem cadastro
                </p>
              </div>
            </form>
          )}

          {/* Tab: Reversa */}
          {tab === "reversa" && (
            <ReverseCalc
              budget={revBudget} setBudget={setRevBudget}
              state={revState} setState={setRevState}
              cambio={revCambio} setCambio={setRevCambio}
              frete={revFrete} setFrete={setRevFrete}
              vehicleType={revVehicleType} setVehicleType={setRevVehicleType}
            />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de veículo</label>
                  <select value={manualVehicleType} onChange={(e) => setManualVehicleType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="standard">Combustão (padrão)</option>
                    <option value="electric">Elétrico (IPI 0%)</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                  {loading ? "⏳ Calculando..." : "Calcular impostos →"}
                </button>
                <p className="mt-2 text-xs text-slate-400">
                  Gratuito · Câmbio PTAX (Banco Central) · Alíquotas Receita Federal 2026 · Sem cadastro
                </p>
              </div>
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

        {/* Histórico de pesquisas */}
        {history.length > 0 && !loading && (
          <SearchHistory entries={history} onClear={() => {
            saveHistory([]);
            setHistory([]);
          }} />
        )}

        {/* Resultados */}
        {tab === "url" && urlResult && !loading && <Results result={urlResult} />}
        {tab === "manual" && manualResult && !loading && <Results result={manualResult} />}

        {/* Próximos passos — aparece quando há resultado real */}
        {(urlResult || manualResult) && !loading && <NextSteps />}

        {/* Exemplo pré-calculado — visível enquanto não há resultado */}
        {!urlResult && !manualResult && !loading && (
          <Results result={EXAMPLE_RESULT} isExample />
        )}

        {/* Como funciona */}
        <HowItWorks />

        {/* Captura de email */}
        <EmailCapture />

        {/* Links úteis */}
        <UsefulLinks />

        {/* FAQ */}
        <FAQ />

        <footer className="text-center text-xs text-slate-500 pb-8 pt-4 space-y-1.5">
          <p className="font-medium text-slate-600">carroimportado.com — Calculadora de importação de veículos EUA → Brasil</p>
          <p>Alíquotas: Receita Federal · Câmbio: PTAX Banco Central do Brasil · Preços de referência: Tabela FIPE</p>
          <p className="text-slate-400">Os valores são estimativas. Consulte um despachante aduaneiro habilitado para cotações precisas.</p>
          <p>
            <a href="/guia" className="hover:text-slate-700 underline">Guia de Importação</a>
            {" · "}
            <a href="/empresas" className="hover:text-slate-700 underline">Empresas</a>
            {" · "}
            <a href="/sobre" className="hover:text-slate-700 underline">Sobre</a>
            {" · "}
            <a href="/privacy" className="hover:text-slate-700 underline">Privacidade</a>
            {" · "}
            <a href="/terms" className="hover:text-slate-700 underline">Termos</a>
          </p>
          <p className="text-slate-400">© {new Date().getFullYear()} carroimportado.com — Todos os direitos reservados</p>
        </footer>
      </div>
    </main>
  );
}
