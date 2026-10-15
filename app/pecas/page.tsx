import type { Metadata } from "next";
import PecasClient from "./PecasClient";

export const metadata: Metadata = {
  title: { absolute: "Peças para Carros Americanos — Fornecedores EUA e Brasil" },
  description:
    "Fornecedores de peças para carros americanos nos EUA e no Brasil: motor, suspensão, freios, elétrica e peças raras para Mustang, Camaro e Corvette.",
  keywords: [
    "peças carro americano brasil",
    "importar peças EUA brasil",
    "fornecedor peças Ford Chevrolet Dodge Brasil",
    "peças Mustang Camaro Corvette brasil",
    "importadora peças automotivas americanas",
    "peças reposição carros americanos",
    "peças clássicos americanos brasil",
    "motor transmissão carro americano",
    "suspensão freios carro americano brasil",
  ],
  alternates: { canonical: "https://www.carroimportado.com/pecas" },
  openGraph: {
    title: "Peças para Carros Americanos — Fornecedores EUA e Brasil",
    description:
      "Diretório de fornecedoras de peças de reposição nos EUA e importadoras no Brasil. Motor, suspensão, freios, elétrica e itens raros.",
    url: "https://www.carroimportado.com/pecas",
    images: [
      {
        url: "https://www.carroimportado.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fornecedores de peças para carros americanos no Brasil",
      },
    ],
  },
};

export default function PecasPage() {
  return <PecasClient />;
}
