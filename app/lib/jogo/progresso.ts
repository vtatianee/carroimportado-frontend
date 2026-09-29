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

// ── Armazenamento (localStorage) no formato de store externo ─────────────────
// Lido via useSyncExternalStore: o HTML pré-renderizado sai com o snapshot do
// servidor (null) e o cliente troca pelo valor salvo logo após hidratar, sem
// erro de hidratação e sem setState dentro de useEffect.

const CHAVE = "jogo_adivinhe_preco_v1";
const ouvintes = new Set<() => void>();
// Fallback em memória: em aba anônima do Safari o localStorage pode lançar
// exceção, e a sequência ainda precisa funcionar durante a visita.
let emMemoria: string | null = null;

export function assinarProgresso(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  const outraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) ouvinte();
  };
  window.addEventListener("storage", outraAba);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", outraAba);
  };
}

export function lerProgressoBruto(): string | null {
  try {
    return window.localStorage.getItem(CHAVE) ?? emMemoria;
  } catch {
    return emMemoria;
  }
}

export function salvarProgresso(p: Progresso): void {
  emMemoria = JSON.stringify(p);
  try {
    window.localStorage.setItem(CHAVE, emMemoria);
  } catch {
    // sem localStorage: fica só em memória nesta visita
  }
  ouvintes.forEach((o) => o());
}

function numero(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function interpretarProgresso(bruto: string | null): Progresso {
  if (!bruto) return PROGRESSO_VAZIO;
  try {
    const p = JSON.parse(bruto);
    const d = p?.diario;
    const diario: ResultadoDiario | null =
      d && typeof d.data === "string" && typeof d.carroId === "string"
        ? { data: d.data, carroId: d.carroId, palpite: numero(d.palpite), diferenca: numero(d.diferenca), pontos: numero(d.pontos) }
        : null;
    return {
      atual: numero(p?.atual),
      melhor: numero(p?.melhor),
      ultimaData: typeof p?.ultimaData === "string" ? p.ultimaData : null,
      diario,
    };
  } catch {
    return PROGRESSO_VAZIO;
  }
}
