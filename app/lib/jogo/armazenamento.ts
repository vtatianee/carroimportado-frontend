// Uma chave do localStorage no formato de store externo, para useSyncExternalStore:
// o HTML pré-renderizado sai com o snapshot do servidor (null) e o cliente troca
// pelo valor salvo logo após hidratar — sem erro de hidratação e sem setState
// dentro de useEffect.
export interface Armazenamento {
  assinar: (ouvinte: () => void) => () => void;
  /** Valor bruto (string JSON) — string é comparada por valor, então o snapshot é estável. */
  ler: () => string | null;
  salvar: (valor: unknown) => void;
}

export function criarArmazenamento(chave: string): Armazenamento {
  const ouvintes = new Set<() => void>();
  // Fallback em memória: em aba anônima do Safari o localStorage pode lançar
  // exceção, e o jogo ainda precisa lembrar das coisas durante a visita.
  let emMemoria: string | null = null;

  return {
    assinar(ouvinte) {
      ouvintes.add(ouvinte);
      const outraAba = (e: StorageEvent) => {
        if (e.key === chave) ouvinte();
      };
      window.addEventListener("storage", outraAba);
      return () => {
        ouvintes.delete(ouvinte);
        window.removeEventListener("storage", outraAba);
      };
    },
    ler() {
      try {
        return window.localStorage.getItem(chave) ?? emMemoria;
      } catch {
        return emMemoria;
      }
    },
    salvar(valor) {
      emMemoria = JSON.stringify(valor);
      try {
        window.localStorage.setItem(chave, emMemoria);
      } catch {
        // sem localStorage: fica só em memória nesta visita
      }
      ouvintes.forEach((o) => o());
    },
  };
}

export function numeroValido(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
