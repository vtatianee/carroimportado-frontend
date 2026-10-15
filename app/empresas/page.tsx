import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";

export const metadata: Metadata = {
  title: { absolute: "Empresas de Importação de Carros dos EUA para o Brasil" },
  description:
    "Exportadoras na Flórida, importadoras no Brasil, despachantes aduaneiros e frete RoRo ou contêiner: empresas para importar seu carro dos EUA.",
  keywords: [
    "empresa importação carro EUA Brasil",
    "exportadora carros Florida Brasil",
    "importadora veículos EUA São Paulo",
    "despachante aduaneiro importação carro",
    "empresa frete marítimo carro EUA",
    "RORO container veículo EUA Brasil",
    "importadora carros clássicos americanos Brasil",
  ],
  alternates: { canonical: "https://www.carroimportado.com/empresas" },
  openGraph: {
    title: "Empresas de Importação de Carros dos EUA para o Brasil",
    description:
      "Diretório curado de exportadoras nos EUA e importadoras no Brasil especializadas em veículos.",
    url: "https://www.carroimportado.com/empresas",
  },
};

export default function EmpresasPage() {
  return <EmpresasClient />;
}
