import { z } from "zod";
import { CARROS_EXEMPLO, type Carro } from "./carros";
import { estadoPorSigla } from "./estados";
import { fotoUtilizavel } from "./foto";

const BACKEND_URL = process.env.API_URL || "https://api.carroimportado.com";

// Formato de GET /api/jogo/carros do backend (garageusa_backend, routes/jogo.js).
const CarroImportado = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,80}$/),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  versao: z.string().nullable(),
  ano: z.number().int(),
  preco: z.number().positive(),
  milhas: z.number().int().nonnegative().nullable(),
  urlAnuncio: z.url(),
  fotoUrl: z.string(),
  estado: z.string().nullable(),
  dataImportacao: z.string(),
});

const Resposta = z.object({ carros: z.array(z.unknown()) });

function paraCarro(bruto: unknown): Carro | null {
  const r = CarroImportado.safeParse(bruto);
  if (!r.success) return null;
  const c = r.data;
  // Sem estado do mapa não há onde clicar para chegar no carro; sem foto
  // utilizável ele não pode aparecer (todo carro do jogo tem imagem).
  if (!c.estado || !estadoPorSigla(c.estado) || !fotoUtilizavel(c.fotoUrl)) return null;
  return {
    id: c.id,
    modelo: [c.marca, c.modelo, c.versao].filter(Boolean).join(" "),
    ano: c.ano,
    milhas: c.milhas,
    estado: c.estado,
    precoReal: Math.round(c.preco),
    fotoUrl: c.fotoUrl,
    fonte: "cars.com",
    urlAnuncio: c.urlAnuncio,
    importadoEm: c.dataImportacao.slice(0, 10),
  };
}

export interface CarrosDoJogo {
  carros: Carro[];
  /** false = base vazia, jogando com os exemplos fictícios. */
  reais: boolean;
}

const exemplos = (): CarrosDoJogo => ({ carros: [...CARROS_EXEMPLO], reais: false });

/**
 * Carros do jogo: os anúncios reais importados pelo backend ou, só se a base
 * estiver vazia, os 12 exemplos fictícios.
 *
 * Se o backend falhar durante o build, o jogo sai com os exemplos em vez de
 * quebrar o deploy. Fora do build o erro sobe de propósito: a regeneração
 * da página (ISR) falha e a Vercel continua servindo a última versão boa, em
 * vez de trocar os carros reais pelos fictícios por uma instabilidade.
 */
export async function carregarCarros(): Promise<CarrosDoJogo> {
  let brutos: unknown[];
  try {
    const res = await fetch(`${BACKEND_URL}/api/jogo/carros`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`backend respondeu ${res.status}`);
    brutos = Resposta.parse(await res.json()).carros;
  } catch (err) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.error("[jogo] carros reais indisponíveis no build — usando os exemplos:", err);
      return exemplos();
    }
    throw err;
  }

  const carros = brutos.map(paraCarro).filter((c): c is Carro => c !== null);
  if (carros.length === 0) return exemplos();
  // O backend embaralha; o desafio diário precisa da mesma ordem para todos.
  carros.sort((a, b) => a.id.localeCompare(b.id));
  return { carros, reais: true };
}
