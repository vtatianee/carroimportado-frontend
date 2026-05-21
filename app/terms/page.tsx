import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do carroimportado.com — condições de uso da calculadora de importação de veículos dos EUA para o Brasil.",
  alternates: {
    canonical: "https://www.carroimportado.com/terms",
  },
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return <TermsClient />;
}
