import { criarArmazenamento, numeroValido } from "./armazenamento";

// Mesmo esquema do histórico de pesquisa da calculadora (search_history em
// _HomeClient.tsx): lista JSON no localStorage, mais recente primeiro, com
// limite de itens e id = timestamp. O recorde fica numa chave à parte porque a
// lista é cortada — senão o melhor resultado sumiria depois de algumas partidas.
export const MAX_HISTORICO = 10;

export interface EntradaPontuacao {
  id: string; // timestamp como ID único
  pontos: number;
  modelo: string;
  ano: number;
  estado: string;
  modo: "diario" | "treino";
  jogado_em: number; // Date.now()
}

const historico = criarArmazenamento("jogo_historico_pontuacoes");
const recorde = criarArmazenamento("jogo_recorde");

export const assinarHistorico = historico.assinar;
export const lerHistoricoBruto = historico.ler;
export const assinarRecorde = recorde.assinar;
export const lerRecordeBruto = recorde.ler;

function entradaValida(e: unknown): e is EntradaPontuacao {
  const x = e as EntradaPontuacao;
  return !!x && typeof x.id === "string" && typeof x.modelo === "string" && typeof x.estado === "string";
}

function normalizar(e: EntradaPontuacao): EntradaPontuacao {
  return {
    ...e,
    pontos: numeroValido(e.pontos),
    ano: numeroValido(e.ano),
    jogado_em: numeroValido(e.jogado_em),
    modo: e.modo === "diario" ? "diario" : "treino",
  };
}

export function interpretarHistorico(bruto: string | null): EntradaPontuacao[] {
  if (!bruto) return [];
  try {
    const lista = JSON.parse(bruto);
    return Array.isArray(lista) ? lista.filter(entradaValida).map(normalizar) : [];
  } catch {
    return [];
  }
}

export function interpretarRecorde(bruto: string | null): EntradaPontuacao | null {
  if (!bruto) return null;
  try {
    const e = JSON.parse(bruto);
    return entradaValida(e) ? normalizar(e) : null;
  } catch {
    return null;
  }
}

/**
 * Acrescenta a rodada ao histórico e diz se bateu o recorde. A primeira partida
 * vira o recorde, mas não conta como "novo recorde" — não havia nada para bater.
 */
export function registrarPontuacao(
  ultimas: EntradaPontuacao[],
  recordeAtual: EntradaPontuacao | null,
  entrada: EntradaPontuacao,
): { ultimas: EntradaPontuacao[]; recorde: EntradaPontuacao; novoRecorde: boolean } {
  const bateu = recordeAtual === null || entrada.pontos > recordeAtual.pontos;
  return {
    ultimas: [entrada, ...ultimas].slice(0, MAX_HISTORICO),
    recorde: bateu ? entrada : recordeAtual,
    novoRecorde: bateu && recordeAtual !== null,
  };
}

export function salvarPontuacao(resultado: { ultimas: EntradaPontuacao[]; recorde: EntradaPontuacao }): void {
  historico.salvar(resultado.ultimas);
  recorde.salvar(resultado.recorde);
}
