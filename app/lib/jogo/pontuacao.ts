export const PONTOS_MAXIMOS = 1000;

export function calcularDiferenca(palpite: number, precoReal: number): number {
  return Math.round(Math.abs(palpite - precoReal));
}

/** pontos = max(0, 1000 - diferença em USD). Errou por US$ 400 → 600 pontos. */
export function calcularPontos(diferenca: number): number {
  return Math.max(0, PONTOS_MAXIMOS - diferenca);
}

export function formatarUsd(valor: number): string {
  return Math.round(valor).toLocaleString("pt-BR");
}
