/**
 * Smoke test de contrato.
 *
 * Valida que os schemas em app/lib/contracts/ batem com (a) os dados estáticos
 * do site e (b) as respostas reais do backend em produção.
 *
 * Roda com:  npx tsx scripts/check-contracts.ts
 *
 * Pega o caso "renomeei um campo em empresas.ts e esqueci que o app lê" ANTES
 * de o site subir. Deve entrar no CI depois.
 */
import { z } from "zod";
import {
  DirectoryEntrySchema,
  CategoriaRfqSchema,
  GuiaStepSchema,
  CostSummaryItemSchema,
  CheckGroupSchema,
  BlogPostFrontmatterSchema,
  CalculateResultSchema,
  ReverseResultSchema,
  SearchResultSchema,
  envelopeOf,
  BlogListSchema,
  EmpresasPayloadSchema,
  PecasPayloadSchema,
  GuiaPayloadSchema,
  AppConfigSchema,
  ManifestSchema,
} from "../app/lib/contracts";

import { EMPRESAS, CATEGORIAS_RFQ } from "../app/data/empresas";
import { PECAS } from "../app/data/pecas";
import { STEPS, COSTS_SUMMARY, CHECKLIST_GROUPS } from "../app/data/guia";
import { BLOG_POSTS } from "../app/data/blog";

const API = process.env.API_URL || "https://api.carroimportado.com";
// Content API: por padrão o dev local, já que em produção ele só existe depois
// do próximo deploy. Passar CONTENT_URL para apontar para produção.
const CONTENT = process.env.CONTENT_URL || "http://localhost:3000";

let falhas = 0;

function checar(nome: string, schema: z.ZodTypeAny, valor: unknown) {
  const r = schema.safeParse(valor);
  if (r.success) {
    console.log(`  ok    ${nome}`);
  } else {
    falhas += 1;
    console.log(`  FALHA ${nome}`);
    for (const issue of r.error.issues.slice(0, 6)) {
      console.log(`          ${issue.path.join(".") || "(raiz)"}: ${issue.message}`);
    }
  }
}

async function main() {
  console.log("\n── Dados estáticos do site ──────────────────────────────────");
  checar(`EMPRESAS (${EMPRESAS.length})`, z.array(DirectoryEntrySchema), EMPRESAS);
  checar(`PECAS (${PECAS.length})`, z.array(DirectoryEntrySchema), PECAS);
  checar(`CATEGORIAS_RFQ (${CATEGORIAS_RFQ.length})`, z.array(CategoriaRfqSchema), CATEGORIAS_RFQ);
  checar(`STEPS (${STEPS.length})`, z.array(GuiaStepSchema), STEPS);
  checar(`COSTS_SUMMARY (${COSTS_SUMMARY.length})`, z.array(CostSummaryItemSchema), COSTS_SUMMARY);
  checar(`CHECKLIST_GROUPS (${CHECKLIST_GROUPS.length})`, z.array(CheckGroupSchema), CHECKLIST_GROUPS);
  checar(`BLOG_POSTS (${BLOG_POSTS.length})`, z.array(BlogPostFrontmatterSchema), BLOG_POSTS);

  console.log(`\n── Respostas reais do backend (${API}) ──────────────────`);
  try {
    const calc = await fetch(`${API}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_usd: 35000, state: "SP", usd_brl_rate: 5.15, frete_usd: 1500 }),
      signal: AbortSignal.timeout(30_000),
    });
    checar("POST /api/calculate", CalculateResultSchema, await calc.json());

    const rev = await fetch(`${API}/api/reverse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget_brl: 400000, state: "SP", usd_brl_rate: 5.15, frete_usd: 1500 }),
      signal: AbortSignal.timeout(30_000),
    });
    checar("POST /api/reverse", ReverseResultSchema, await rev.json());

    const search = await fetch(`${API}/api/search?priceMin=30000&priceMax=40000&count=3`, {
      signal: AbortSignal.timeout(60_000),
    });
    checar("GET /api/search", SearchResultSchema, await search.json());
  } catch (e) {
    falhas += 1;
    console.log(`  FALHA rede: ${e instanceof Error ? e.message : String(e)}`);
  }

  // /api/analyze não entra: cada chamada dispara um scrape real e gasta
  // crédito de ScraperAPI. Seu shape difere de CalculateResult apenas por
  // description_pt e benchmark_brasil, cobertos pelo typecheck.

  console.log(`\n── Content API (${CONTENT}) ─────────────────────────`);
  const rotas: [string, z.ZodTypeAny][] = [
    ["manifest", ManifestSchema],
    ["config", AppConfigSchema],
    ["blog", BlogListSchema],
    ["empresas", EmpresasPayloadSchema],
    ["pecas", PecasPayloadSchema],
    ["guia", GuiaPayloadSchema],
  ];

  for (const [rota, dataSchema] of rotas) {
    try {
      const res = await fetch(`${CONTENT}/api/content/v1/${rota}`, {
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) {
        falhas += 1;
        console.log(`  FALHA GET /${rota} -> HTTP ${res.status}`);
        continue;
      }
      // Valida o envelope inteiro, não só o data: se `v` mudar sem o app
      // saber, é exatamente o caso que o versionamento existe para pegar.
      checar(`GET /api/content/v1/${rota}`, envelopeOf(dataSchema), await res.json());
    } catch (e) {
      falhas += 1;
      console.log(`  FALHA GET /${rota}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.log(
    falhas === 0
      ? "\nTodos os contratos conferem.\n"
      : `\n${falhas} contrato(s) divergindo — corrigir antes de subir.\n`
  );
  process.exit(falhas === 0 ? 0 : 1);
}

main();
