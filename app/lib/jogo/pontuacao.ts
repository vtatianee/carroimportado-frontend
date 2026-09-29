export const PONTOS_MAXIMOS = 1000;

export function calcularDiferenca(palpite: number, precoReal: number): number {
  return Math.round(Math.abs(palpite - precoReal));
}

/**
 * Pontos proporcionais ao erro percentual: max(0, round(1000 * (1 - diferença / preço))).
 * Errou 10% → 900; errou 50% → 500; errou 100% ou mais → 0.
 */
export function calcularPontos(diferenca: number, precoReal: number): number {
  return Math.max(0, Math.round(PONTOS_MAXIMOS * (1 - diferenca / precoReal)));
}

export function formatarUsd(valor: number): string {
  return Math.round(valor).toLocaleString("pt-BR");
}
