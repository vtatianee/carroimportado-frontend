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

// ── Row de custo ──────────────────────────────────────────────────────────────
function Row({ label, brl, usd, bold }: { label: string; brl: number; usd?: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-1.5 ${bold ? "font-semibold border-t border-slate-100 mt-1 pt-3" : ""}`}>
      <span className="text-slate-600 text-sm">{label}</span>
      <div className="text-right shrink-0">
        <span className="text-slate-900 text-sm">R$ {fmt(brl)}</span>
        {usd !== undefined && <span className="text-slate-500 text-xs ml-2">(USD {fmtUSD(usd)})</span>}
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
          <p className="text-slate-500 text-xs mt-2">+25% prêmio típico no mercado brasileiro</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500 text-sm mb-1">Câmbio utilizado</p>
          <p className="text-2xl font-bold text-slate-900">R$ {cd.valor.toFixed(4)}</p>
          <p className="text-slate-500 text-xs mt-2">{cd.fonte}</p>
        </div>
      </div>

      {/* Valor aduaneiro */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconBox />}>Valor Aduaneiro (CIF)</SectionHeading>
        <Row label="FOB — Preço do veículo nos EUA" brl={va.fob_brl} usd={va.fob_usd} />
        <Row label={`Frete marítimo (${va.frete_fonte})`} brl={va.frete_brl} usd={va.frete_usd} />
        <Row label="Seguro marítimo (1,5% do FOB)" brl={va.seguro_brl} usd={va.seguro_usd} />
        <Row label="CIF — Valor Aduaneiro total" brl={va.cif_brl} usd={va.cif_usd} bold />
        {va.frete_fonte.includes("estimativa") && (
          <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">💡 {va.frete_sugerido?.nota}</p>
        )}
      </section>

      {/* Impostos */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconBuilding />}>Impostos</SectionHeading>
        <Row label="II — Imposto de Importação (35% do FOB)" brl={bd.ii_imposto_importacao} />
        <Row label="IPI (18,81% sobre FOB + II)" brl={bd.ipi} />
        <Row label="PIS (2,62% do CIF)" brl={bd.pis} />
        <Row label="COFINS (12,57% do CIF)" brl={bd.cofins} />
        <Row label={`ICMS — ${ic.icms_rate_pct}% (cálculo por dentro)`} brl={bd.icms} />
        <Row label="Total de impostos" brl={bd.total_taxes} bold />
      </section>

      {/* Desembaraço */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeading icon={<IconShield />}>Desembaraço Aduaneiro</SectionHeading>
        <Row label="Despachante (honorários)" brl={da.despachante_honorarios_usd * cd.valor} usd={da.despachante_honorarios_usd} />
        <Row label="THC — Terminal Handling Charge" brl={da.thc_usd * cd.valor} usd={da.thc_usd} />
        <Row label="AFRMM — 25% do frete (Lei 10.893/2004)" brl={da.afrmm_usd * cd.valor} usd={da.afrmm_usd} />
        <Row label="Armazenagem e capatazia" brl={da.armazenagem_capatazia_usd * cd.valor} usd={da.armazenagem_capatazia_usd} />
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

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700">📤 Compartilhar este cálculo</p>
        <p className="text-xs text-slate-400 mt-0.5">Envie o resultado para amigos ou grupos de WhatsApp</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
            copied
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {copied ? "✓ Copiado!" : "📋 Copiar texto"}
        </button>
      </div>
    </section>
  );
}

// ── Links úteis ───────────────────────────────────────────────────────────────
const USEFUL_LINKS = [
  {
    category: "🔍 Encontrar o veículo",
    links: [
      { label: "Cars.com", url: "https://www.cars.com", desc: "Maior marketplace de carros usados dos EUA" },
      { label: "AutoTrader", url: "https://www.autotrader.com", desc: "Anúncios de veículos novos e usados nos EUA" },
      { label: "Bring a Trailer", url: "https://bringatrailer.com", desc: "Leilões de carros clássicos e esportivos" },
    ],
  },
  {
    category: "🏛️ Governo Brasileiro",
    links: [
      { label: "Receita Federal — Importação", url: "https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/importacao", desc: "Normas e procedimentos oficiais de importação" },
      { label: "Siscomex", url: "https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/sistemas/siscomex", desc: "Sistema de comércio exterior do Brasil" },
      { label: "DENATRAN / SENATRAN", url: "https://www.gov.br/senatran/pt-br", desc: "Registro e licenciamento de veículos importados" },
      { label: "INMETRO — Veículos", url: "https://www.inmetro.gov.br/qualidade/rtepac/veiculosautomotores.asp", desc: "Requisitos técnicos para homologação de veículos" },
      { label: "Banco Central — PTAX", url: "https://www.bcb.gov.br/conversao", desc: "Cotação oficial do dólar usada para calcular impostos" },
    ],
  },
  {
    category: "🇺🇸 Governo Americano",
    links: [
      { label: "NHTSA — Conformidade", url: "https://www.nhtsa.gov/importing-vehicle", desc: "Normas de segurança para exportação de veículos dos EUA" },
      { label: "EPA — Emissões", url: "https://www.epa.gov/importing-vehicles-and-engines", desc: "Requisitos ambientais para importação de veículos" },
      { label: "CBP — Exportação", url: "https://www.cbp.gov/trade/vehicles", desc: "Alfândega americana — documentação para exportar veículos" },
    ],
  },
  {
    category: "📊 Referências de preço",
    links: [
      { label: "Tabela FIPE", url: "https://veiculos.fipe.org.br", desc: "Preços de referência de veículos no mercado brasileiro" },
      { label: "Kelley Blue Book", url: "https://www.kbb.com", desc: "Valores de mercado de veículos nos EUA" },
    ],
  },
];

function UsefulLinks() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Links úteis para importação</h2>
      <p className="text-sm text-slate-500 mb-6">Fontes oficiais e plataformas essenciais para todo o processo de importação.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {USEFUL_LINKS.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{cat.category}</h3>
            <ul className="space-y-3">
              {cat.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2"
                  >
                    <span className="text-blue-600 font-medium text-sm group-hover:underline shrink-0">
                      {link.label} ↗
                    </span>
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5 ml-0">{link.desc}</p>
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
const FAQ_ITEMS = [
  {
    q: "Quanto custa importar um carro dos EUA para o Brasil?",
    a: "O custo total inclui o preço do veículo (FOB), frete marítimo (aproximadamente USD 1.500–2.500), Imposto de Importação (35% do FOB), IPI (18,81%), PIS (2,62%), COFINS (12,57%), ICMS (12–20% dependendo do estado) e despesas de desembaraço aduaneiro (~USD 3.000). A carga tributária total costuma superar 100% do valor do veículo nos EUA.",
  },
  {
    q: "Qual é o ICMS para importação de veículos por estado?",
    a: "O ICMS varia por estado de destino: São Paulo (SP), Minas Gerais (MG), Santa Catarina (SC), Rio Grande do Sul (RS) e Paraná (PR) cobram 12%. Rio de Janeiro (RJ) cobra 20%. Os demais estados cobram 17%. O ICMS é calculado “por dentro” sobre a base total já com os demais impostos.",
  },
  {
    q: "Carros clássicos americanos pagam menos imposto no Brasil?",
    a: "Veículos com mais de 30 anos são considerados clássicos e podem ter tratamento aduaneiro diferenciado dependendo da classificação fiscal (NCM). Alguns podem ser elegíveis a benefícios específicos, mas isso depende do modelo e da situação de cada veículo. Consulte sempre um despachante aduaneiro habilitado antes de tomar qualquer decisão.",
  },
  {
    q: "Como funciona a calculadora de importação?",
    a: "Basta colar o link de um anúncio do Cars.com ou inserir o preço do veículo manualmente. A calculadora busca os dados do anúncio, aplica as alíquotas tributárias vigentes e exibe o custo total internado no Brasil em reais, usando a cotação PTAX do Banco Central do Brasil atualizada.",
  },
  {
    q: "O que é o valor aduaneiro (CIF)?",
    a: "O valor aduaneiro, também chamado CIF (Cost, Insurance and Freight), é a base legal de cálculo dos impostos de importação no Brasil. Ele é composto pelo preço do veículo (FOB) + frete marítimo + seguro marítimo (1,5% do FOB). Todos os impostos federais (II, IPI, PIS, COFINS) são calculados sobre esse valor.",
  },
  {
    q: "Preciso de um despachante aduaneiro para importar um carro?",
    a: "Sim. A legislação brasileira exige a participação de um despachante aduaneiro habilitado pela Receita Federal para realizar o desembaraço aduaneiro de veículos importados. Os honorários do despachante já estão incluídos nas estimativas desta calculadora (aproximadamente USD 1.500).",
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
              <p className="text-slate-500 text-sm leading-relaxed pb-4">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
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
  const [urlResult, setUrlResult] = useState<AnalyzeResult | null>(null);
  const [manualResult, setManualResult] = useState<AnalyzeResult | null>(null);

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setUrlResult(null);
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
      setUrlResult(data);
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

      const res = await fetch(`${API_URL}/api/calculate`, {
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
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Quanto custa trazer aquele carro dos EUA para o Brasil?",
              url: "https://www.carroimportado.com",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              inLanguage: "pt-BR",
              description:
                "Calcule o custo total de importar um carro dos Estados Unidos para o Brasil, incluindo II, IPI, PIS, COFINS e ICMS por estado de destino.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "BRL",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Quanto custa importar um carro dos EUA para o Brasil?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "O custo total de importar um carro dos EUA para o Brasil inclui o preço do veículo (FOB), frete marítimo (~USD 1.500–2.500), Imposto de Importação (35% do FOB), IPI (18,81%), PIS (2,62%), COFINS (12,57%), ICMS (12–20% dependendo do estado) e despesas de desembaraço (~USD 3.000). A carga tributária total costuma superar 100% do valor do veículo.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Carros clássicos americanos pagam menos imposto no Brasil?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Veículos com mais de 30 anos são considerados clássicos e podem ter tratamento aduaneiro diferenciado dependendo da classificação fiscal (NCM). Consulte um despachante aduaneiro habilitado para verificar se há benefícios aplicáveis ao seu veículo.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Qual é o ICMS para importação de veículos por estado?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "O ICMS varia por estado: São Paulo (SP), Minas Gerais (MG), Santa Catarina (SC), Rio Grande do Sul (RS) e Paraná (PR) cobram 12%. Rio de Janeiro (RJ) cobra 20%. Demais estados cobram 17%.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Como funciona a calculadora de importação?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Basta colar o link de um anúncio do Cars.com ou inserir o preço manualmente. A calculadora busca os dados do veículo, aplica as alíquotas tributárias vigentes (II, IPI, PIS, COFINS, ICMS) e exibe o custo total internado no Brasil em reais, usando a cotação PTAX do Banco Central.",
                  },
                },
              ],
            },
          ]),
        }}
      />
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

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-4">
            Quanto custa trazer aquele carro<br className="hidden sm:block" /> dos EUA para o Brasil?
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Cole o link do anúncio no <strong className="text-white">Cars.com</strong> e veja o custo real em segundos —
            impostos, frete e despesas de desembaraço, tudo detalhado.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
              ⚠️ A carga tributária costuma passar de <strong>100%</strong> do valor do carro
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
              💱 Câmbio PTAX do Banco Central
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
              ✅ Gratuito · Sem cadastro
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Form card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-slate-500 mb-6 text-sm">
            Cole o link de um anúncio do <strong>Cars.com</strong> ou insira os valores manualmente.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
            <button onClick={() => { setTab("url"); setError(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              🔗 Cole um link
            </button>
            <button onClick={() => { setTab("manual"); setError(null); }}
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

        {/* Resultados */}
        {tab === "url" && urlResult && !loading && <Results result={urlResult} />}
        {tab === "manual" && manualResult && !loading && <Results result={manualResult} />}

        {/* Links úteis */}
        <UsefulLinks />

        {/* FAQ */}
        <FAQ />

        <footer className="text-center text-xs text-slate-500 pb-8 pt-4 space-y-1.5">
          <p className="font-medium text-slate-600">carroimportado.com — Calculadora de importação de veículos EUA → Brasil</p>
          <p>Alíquotas: Receita Federal · Câmbio: PTAX Banco Central do Brasil · Preços de referência: Tabela FIPE</p>
          <p className="text-slate-400">Os valores são estimativas. Consulte um despachante aduaneiro habilitado para cotações precisas.</p>
          <p>
            <a href="/privacy" className="hover:text-slate-700 underline">Política de Privacidade</a>
            {" · "}
            <a href="/terms" className="hover:text-slate-700 underline">Termos de Uso</a>
          </p>
          <p className="text-slate-400">© {new Date().getFullYear()} carroimportado.com — Todos os direitos reservados</p>
        </footer>
      </div>
    </main>
  );
}
