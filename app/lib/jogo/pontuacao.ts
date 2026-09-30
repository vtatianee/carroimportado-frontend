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

/** A partir daqui a rodada conta como "palpite bom" e mantém a sequência. */
export const PONTOS_BOM_PALPITE = 700;

/** Etiqueta de desempenho da rodada, usada no resultado e no ranking pessoal. */
export function etiquetaDesempenho(pontos: number): string {
  if (pontos >= PONTOS_MAXIMOS) return "🎯 Na mosca!";
  if (pontos >= 900) return "✨ Muito perto!";
  if (pontos >= PONTOS_BOM_PALPITE) return "👍 Bom palpite";
  if (pontos >= 400) return "😐 Razoável";
  return "🧊 Passou longe";
}

export function formatarUsd(valor: number): string {
  return Math.round(valor).toLocaleString("pt-BR");
}
