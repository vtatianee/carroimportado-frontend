import type { Metadata } from "next";
import JogoClient from "./JogoClient";

const URL_PAGINA = "https://www.carroimportado.com/jogo";
const TITULO = "Adivinhe o Preço — jogo de carros dos EUA";
const DESCRICAO =
  "Escolha um estado no mapa dos EUA, veja um carro à venda e chute o preço em dólar. Um desafio novo por dia — mantenha sua sequência!";

// As imagens de Open Graph e Twitter vêm de opengraph-image.tsx e
// twitter-image.tsx nesta pasta (metadata baseada em arquivo tem prioridade).
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: URL_PAGINA },
  openGraph: {
    type: "website",
    url: URL_PAGINA,
    siteName: "Carro Importado",
    title: TITULO,
    description: DESCRICAO,
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
};

export default function JogoPage() {
  return <JogoClient />;
}
