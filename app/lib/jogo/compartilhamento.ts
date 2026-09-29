import { ondeFica } from "./estados";
import { formatarUsd } from "./pontuacao";

export const URL_JOGO = "https://carroimportado.com/jogo";

interface DadosCompartilhamento {
  modelo: string;
  ano: number;
  estado: string;
  diferenca: number;
  sequencia: number;
}

export function textoCompartilhamento({ modelo, ano, estado, diferenca, sequencia }: DadosCompartilhamento): string {
  const carro = `${modelo} ${ano} ${ondeFica(estado)}`;
  const resultado =
    diferenca === 0
      ? `Acertei em cheio o preço de um ${carro}`
      : `Errei o preço de um ${carro} por US$ ${formatarUsd(diferenca)}`;
  const fechamento =
    sequencia > 0 ? ` — ${sequencia} ${sequencia === 1 ? "dia" : "dias"} de sequência!` : "!";
  return `🗺️🚗 ${resultado}${fechamento} Jogue: ${URL_JOGO}`;
}
