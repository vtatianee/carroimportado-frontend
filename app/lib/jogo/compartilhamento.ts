import { formatarUsd } from "./pontuacao";

export const URL_JOGO = "https://carroimportado.com/jogo";

interface DadosCompartilhamento {
  modelo: string;
  ano: number;
  diferenca: number;
  pontos: number;
}

/**
 * Resultado da rodada, sem o link — para redes que recebem texto e URL separados.
 * Ex: "Adivinhei o preço de um Ford Mustang GT 2019 a US$ 1.500 de diferença!
 * Fiz 980 pontos no Adivinhe o Preço 🚗"
 */
export function resumoResultado({ modelo, ano, diferenca, pontos }: DadosCompartilhamento): string {
  const carro = `${modelo} ${ano}`;
  const resultado =
    diferenca === 0
      ? `Acertei em cheio o preço de um ${carro}!`
      : `Adivinhei o preço de um ${carro} a US$ ${formatarUsd(diferenca)} de diferença!`;
  return `${resultado} Fiz ${pontos.toLocaleString("pt-BR")} pontos no Adivinhe o Preço 🚗`;
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
