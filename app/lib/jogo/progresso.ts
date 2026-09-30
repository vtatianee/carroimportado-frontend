import { criarArmazenamento, numeroValido } from "./armazenamento";
import { diaAnterior } from "./desafio-diario";

export interface ResultadoDiario {
  data: string;
  carroId: string;
  palpite: number;
  diferenca: number;
  pontos: number;
}

export interface Progresso {
  /** Sequência na data `ultimaData` — use `sequenciaVigente` para exibir. */
  atual: number;
  melhor: number;
  /** Último dia (yyyy-mm-dd) em que o desafio diário foi concluído. */
  ultimaData: string | null;
  diario: ResultadoDiario | null;
}

export const PROGRESSO_VAZIO: Progresso = { atual: 0, melhor: 0, ultimaData: null, diario: null };

/** Incrementa a sequência no máximo 1x por dia; zera se o jogador pulou um dia. */
export function registrarConclusaoDiaria(p: Progresso, resultado: ResultadoDiario): Progresso {
  if (p.ultimaData === resultado.data) return p;
  const atual = p.ultimaData === diaAnterior(resultado.data) ? p.atual + 1 : 1;
  return { atual, melhor: Math.max(p.melhor, atual), ultimaData: resultado.data, diario: resultado };
}

/** Sequência que ainda vale hoje: ontem ou hoje concluídos mantêm; mais que isso, quebrou. */
export function sequenciaVigente(p: Progresso, hoje: string): number {
  if (p.ultimaData === hoje || p.ultimaData === diaAnterior(hoje)) return p.atual;
  return 0;
}

const armazenamento = criarArmazenamento("jogo_adivinhe_preco_v1");
export const assinarProgresso = armazenamento.assinar;
export const lerProgressoBruto = armazenamento.ler;
export const salvarProgresso: (p: Progresso) => void = armazenamento.salvar;

export function interpretarProgresso(bruto: string | null): Progresso {
  if (!bruto) return PROGRESSO_VAZIO;
  try {
    const p = JSON.parse(bruto);
    const d = p?.diario;
    const diario: ResultadoDiario | null =
      d && typeof d.data === "string" && typeof d.carroId === "string"
        ? {
            data: d.data,
            carroId: d.carroId,
            palpite: numeroValido(d.palpite),
            diferenca: numeroValido(d.diferenca),
            pontos: numeroValido(d.pontos),
          }
        : null;
    return {
      atual: numeroValido(p?.atual),
      melhor: numeroValido(p?.melhor),
      ultimaData: typeof p?.ultimaData === "string" ? p.ultimaData : null,
      diario,
    };
  } catch {
    return PROGRESSO_VAZIO;
  }
}

/** "1 dia" / "3 dias" — contagem da sequência do desafio diário. */
export function dias(n: number): string {
  return `${n.toLocaleString("pt-BR")} ${n === 1 ? "dia" : "dias"}`;
}

/** "1 dia seguido" / "3 dias seguidos". */
export function diasSeguidos(n: number): string {
  return `${dias(n)} ${n === 1 ? "seguido" : "seguidos"}`;
}
