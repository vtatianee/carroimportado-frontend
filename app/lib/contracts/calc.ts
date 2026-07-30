import { z } from "zod";

/**
 * Contrato das respostas da calculadora (backend Express em api.carroimportado.com).
 *
 * O backend é CommonJS sem tipos, então estes schemas são escritos à mão a
 * partir de garageusa_backend/src/calculator/importCosts.js e das rotas
 * analyze/calculate/reverse/search. Eles são a fonte da verdade compartilhada
 * entre site e app.
 *
 * O motivo de serem zod e não apenas `interface`: o app consome JSON de uma
 * rede que não controla. `safeParse` transforma "o backend renomeou um campo e
 * o app crashou num .toFixed() de undefined" em erro limpo e reportável.
 *
 * Ao mudar o backend, atualizar aqui e rodar o smoke test de contrato.
 */

export const ESTADOS = ["SP", "RJ", "MG", "SC", "RS", "PR", "OTHER"] as const;
export const EstadoSchema = z.enum(ESTADOS);

export const VehicleTypeSchema = z.enum(["standard", "electric", "hybrid"]);

// ── Cotação ───────────────────────────────────────────────────────────────────
export const CotacaoDolarSchema = z.object({
  valor: z.number().positive(),
  fonte: z.string(),
  data: z.string().nullable(),
  nota: z.string(),
});

// ── Breakdown de custos ───────────────────────────────────────────────────────
// As 12 chaves são idênticas em breakdown_usd e breakdown_brl.
export const CostBreakdownSchema = z.object({
  fob_vehicle: z.number(),
  frete_maritimo: z.number(),
  seguro_maritimo: z.number(),
  cif: z.number(),
  ii_imposto_importacao: z.number(),
  ipi: z.number(),
  pis: z.number(),
  cofins: z.number(),
  icms: z.number(),
  desembaraco: z.number(),
  total_taxes: z.number(),
  total_landed: z.number(),
});

export const ValorAduaneiroSchema = z.object({
  fob_usd: z.number(),
  fob_brl: z.number(),
  frete_usd: z.number(),
  frete_brl: z.number(),
  frete_fonte: z.string(),
  frete_sugerido: z.object({
    min_usd: z.number(),
    max_usd: z.number(),
    nota: z.string(),
  }),
  seguro_usd: z.number(),
  seguro_brl: z.number(),
  seguro_nota: z.string(),
  cif_usd: z.number(),
  cif_brl: z.number(),
  cif_nota: z.string(),
});

export const DesembaracoSchema = z.object({
  despachante_honorarios_usd: z.number(),
  thc_usd: z.number(),
  afrmm_usd: z.number(),
  afrmm_nota: z.string(),
  armazenagem_capatazia_usd: z.number(),
  total_usd: z.number(),
  total_brl: z.number(),
});

export const ImportCostsSchema = z.object({
  exchange_rate_usd_brl: z.number().positive(),
  destination_state: z.string(),
  icms_rate_pct: z.number(),
  ipi_rate_pct: z.number(),
  is_classic: z.boolean(),
  ipi_note: z.string(),
  valor_aduaneiro: ValorAduaneiroSchema,
  desembaraco_aduaneiro: DesembaracoSchema,
  breakdown_usd: CostBreakdownSchema,
  breakdown_brl: CostBreakdownSchema,
  total_landed_brl: z.number(),
  effective_tax_rate_pct: z.number(),
  valor_mercado_estimado_brl: z.number(),
  valor_mercado_estimado_usd: z.number(),
  market_premium_note: z.string(),
});

// ── Dados do veículo ──────────────────────────────────────────────────────────
// /api/analyze devolve source_url e scraped_at; /api/calculate e /api/reverse
// não. Por isso os dois campos são opcionais.
export const CarDataSchema = z.object({
  source_url: z.string().optional(),
  price_usd: z.number(),
  year: z.number().int().nullable(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  mileage_miles: z.number().nullable(),
  condition: z.string().nullable(),
  photos: z.array(z.string()),
  is_classic: z.boolean().nullable(),
  scraped_at: z.string().optional(),
});

// ── Benchmark FIPE ────────────────────────────────────────────────────────────
export const BenchmarkBrasilSchema = z.object({
  source: z.string(),
  fipe_code: z.string().nullable(),
  descricao: z.string().nullable(),
  preco_brl: z.number().nullable(),
  mes_referencia: z.string().nullable(),
  nota: z.string(),
  comparativo: z
    .object({
      custo_importar_brl: z.number(),
      preco_local_brl: z.number(),
      diferenca_brl: z.number(),
      importar_e_mais_caro: z.boolean(),
      contexto: z.string(),
    })
    .nullable(),
});

// ── Respostas por endpoint ────────────────────────────────────────────────────

/** POST /api/analyze — scraping de anúncio do cars.com (lento, 30s+) */
export const AnalyzeResultSchema = z.object({
  plano: z.string().optional(),
  modo: z.string().optional(),
  cotacao_dolar: CotacaoDolarSchema,
  car_data: CarDataSchema,
  description_pt: z.string().nullable().optional(),
  import_costs: ImportCostsSchema,
  benchmark_brasil: BenchmarkBrasilSchema.optional(),
});

/** POST /api/calculate — cálculo direto, rápido */
export const CalculateResultSchema = z.object({
  modo: z.literal("manual"),
  cotacao_dolar: CotacaoDolarSchema,
  car_data: CarDataSchema,
  import_costs: ImportCostsSchema,
});

/** POST /api/reverse — resolve o FOB que cabe num orçamento */
export const ReverseResultSchema = z.object({
  modo: z.literal("reversa"),
  orcamento_brl: z.number(),
  fob_usd_sugerido: z.number(),
  faixa_busca: z.object({
    min_usd: z.number(),
    max_usd: z.number(),
  }),
  cotacao_dolar: CotacaoDolarSchema,
  car_data: CarDataSchema,
  import_costs: ImportCostsSchema,
});

/** GET /api/search — anúncios do cars.com. Resultados vêm embaralhados: NÃO cachear. */
export const SearchListingSchema = z.object({
  title: z.string(),
  price_usd: z.number(),
  mileage_miles: z.number().nullable(),
  condition: z.string(),
  photo_url: z.string().nullable(),
  photo_count: z.number().nullable(),
  listing_url: z.string(),
  year: z.number().int().nullable(),
  is_classic: z.boolean().nullable(),
});

export const SearchResultSchema = z.object({
  listings: z.array(SearchListingSchema),
  total: z.number().int(),
});

// ── Erros ─────────────────────────────────────────────────────────────────────
// O backend responde de três formas diferentes, o que o cliente precisa saber:
//  - 400 nas rotas POST: zod flatten() -> { error: { formErrors, fieldErrors } }
//  - 400 em /api/search: { error, details: string[] }
//  - 422 / 429 / 500: { error: string, ... }
export const ZodFlattenErrorSchema = z.object({
  error: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.string(), z.array(z.string())),
  }),
});

export const SimpleErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.array(z.string()).optional(),
});

export type Estado = z.infer<typeof EstadoSchema>;
export type VehicleType = z.infer<typeof VehicleTypeSchema>;
export type CotacaoDolar = z.infer<typeof CotacaoDolarSchema>;
export type CostBreakdown = z.infer<typeof CostBreakdownSchema>;
export type ImportCosts = z.infer<typeof ImportCostsSchema>;
export type CarData = z.infer<typeof CarDataSchema>;
export type BenchmarkBrasil = z.infer<typeof BenchmarkBrasilSchema>;
export type AnalyzeResult = z.infer<typeof AnalyzeResultSchema>;
export type CalculateResult = z.infer<typeof CalculateResultSchema>;
export type ReverseResult = z.infer<typeof ReverseResultSchema>;
export type SearchListing = z.infer<typeof SearchListingSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
