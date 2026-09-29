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

/** Resultado da rodada, sem o link — para redes que recebem texto e URL separados. */
export function resumoResultado({ modelo, ano, estado, diferenca, sequencia }: DadosCompartilhamento): string {
  const carro = `${modelo} ${ano} ${ondeFica(estado)}`;
  const resultado =
    diferenca === 0
      ? `Acertei em cheio o preço de um ${carro}`
      : `Errei o preço de um ${carro} por US$ ${formatarUsd(diferenca)}`;
  const fechamento =
    sequencia > 0 ? ` — ${sequencia} ${sequencia === 1 ? "dia" : "dias"} de sequência!` : "!";
  return `🗺️🚗 ${resultado}${fechamento}`;
}

export function textoCompartilhamento(dados: DadosCompartilhamento): string {
  return `${resumoResultado(dados)} Jogue: ${URL_JOGO}`;
}

export type RedeSocial = "whatsapp" | "x" | "facebook" | "telegram";

/** URLs oficiais de compartilhamento de cada rede. */
export function urlCompartilhamento(rede: RedeSocial, resumo: string): string {
  const texto = encodeURIComponent(`${resumo} Jogue: ${URL_JOGO}`);
  const url = encodeURIComponent(URL_JOGO);
  switch (rede) {
    case "whatsapp":
      return `https://wa.me/?text=${texto}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${texto}`;
    case "facebook":
      // O Facebook não aceita texto pré-preenchido: compartilha o link, e o
      // cartão vem das meta tags Open Graph da página /jogo.
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "telegram":
      return `https://t.me/share/url?url=${url}&text=${encodeURIComponent(resumo)}`;
  }
}
