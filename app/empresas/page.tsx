import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";

export const metadata: Metadata = {
  title: "Empresas de Importação de Carros dos EUA para o Brasil",
  description:
    "Diretório curado de empresas especializadas em exportação de veículos nos EUA (Flórida) e importação no Brasil. Compare exportadoras, importadoras e despachantes aduaneiros de confiança.",
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
