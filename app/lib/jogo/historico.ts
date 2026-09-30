import { criarArmazenamento, numeroValido } from "./armazenamento";
import { PONTOS_BOM_PALPITE } from "./pontuacao";

// Mesmo esquema do histórico de pesquisa da calculadora (search_history em
// _HomeClient.tsx): lista JSON no localStorage, mais recente primeiro, com
// limite de itens e id = timestamp. O recorde fica numa chave à parte porque a
// lista é cortada — senão o melhor resultado sumiria depois de algumas partidas.
// Pelo mesmo motivo, total acumulado e sequência de palpites bons também têm
// chave própria (jogo_acumulado): somados a partir da lista, parariam em 10 rodadas.
export const MAX_HISTORICO = 10;

export interface EntradaPontuacao {
  id: string; // timestamp como ID único
  pontos: number;
  modelo: string;
  ano: number;
  estado: string;
  modo: "diario" | "treino";
  jogado_em: number; // Date.now()
  /** Ausentes em rodadas salvas antes de o ranking guardar os valores. */
  palpite?: number;
  precoReal?: number;
}

export interface Acumulado {
  pontos: number;
  rodadas: number;
  /** Rodadas seguidas com PONTOS_BOM_PALPITE ou mais; zera na primeira abaixo. */
  bonsSeguidos: number;
}

const historico = criarArmazenamento("jogo_historico_pontuacoes");
const recorde = criarArmazenamento("jogo_recorde");
const acumulado = criarArmazenamento("jogo_acumulado");

export const assinarHistorico = historico.assinar;
export const lerHistoricoBruto = historico.ler;
export const assinarRecorde = recorde.assinar;
export const lerRecordeBruto = recorde.ler;
export const assinarAcumulado = acumulado.assinar;
export const lerAcumuladoBruto = acumulado.ler;

function entradaValida(e: unknown): e is EntradaPontuacao {
  const x = e as EntradaPontuacao;
  return !!x && typeof x.id === "string" && typeof x.modelo === "string" && typeof x.estado === "string";
}

const valorPositivo = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : undefined);

function normalizar(e: EntradaPontuacao): EntradaPontuacao {
  return {
    ...e,
    pontos: numeroValido(e.pontos),
    ano: numeroValido(e.ano),
    jogado_em: numeroValido(e.jogado_em),
    modo: e.modo === "diario" ? "diario" : "treino",
    palpite: valorPositivo(e.palpite),
    precoReal: valorPositivo(e.precoReal),
  };
}

const ehBom = (e: EntradaPontuacao) => e.pontos >= PONTOS_BOM_PALPITE;

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
 * Total e sequência salvos. Quem jogou antes de existir a chave parte do que
 * está na lista (até 10 rodadas), em vez de começar do zero.
 */
export function interpretarAcumulado(bruto: string | null, ultimas: readonly EntradaPontuacao[]): Acumulado {
  if (bruto) {
    try {
      const a = JSON.parse(bruto);
      if (a && typeof a === "object") {
        return {
          pontos: numeroValido(a.pontos),
          rodadas: numeroValido(a.rodadas),
          bonsSeguidos: numeroValido(a.bonsSeguidos),
        };
      }
    } catch {
      // cai no cálculo a partir da lista
    }
  }
  const primeiraRuim = ultimas.findIndex((e) => !ehBom(e));
  return {
    pontos: ultimas.reduce((soma, e) => soma + e.pontos, 0),
    rodadas: ultimas.length,
    bonsSeguidos: primeiraRuim === -1 ? ultimas.length : primeiraRuim,
  };
}

/**
 * Acrescenta a rodada ao histórico e diz se bateu o recorde. A primeira partida
 * vira o recorde, mas não conta como "novo recorde" — não havia nada para bater.
 */
export function registrarPontuacao(
  ultimas: EntradaPontuacao[],
  recordeAtual: EntradaPontuacao | null,
  acumuladoAtual: Acumulado,
  entrada: EntradaPontuacao,
): { ultimas: EntradaPontuacao[]; recorde: EntradaPontuacao; acumulado: Acumulado; novoRecorde: boolean } {
  const bateu = recordeAtual === null || entrada.pontos > recordeAtual.pontos;
  return {
    ultimas: [entrada, ...ultimas].slice(0, MAX_HISTORICO),
    recorde: bateu ? entrada : recordeAtual,
    acumulado: {
      pontos: acumuladoAtual.pontos + entrada.pontos,
      rodadas: acumuladoAtual.rodadas + 1,
      bonsSeguidos: ehBom(entrada) ? acumuladoAtual.bonsSeguidos + 1 : 0,
    },
    novoRecorde: bateu && recordeAtual !== null,
  };
}

export function salvarPontuacao(resultado: {
  ultimas: EntradaPontuacao[];
  recorde: EntradaPontuacao;
  acumulado: Acumulado;
}): void {
  historico.salvar(resultado.ultimas);
  recorde.salvar(resultado.recorde);
  acumulado.salvar(resultado.acumulado);
}
