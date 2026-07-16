import type { Metadata } from "next";
import OrcamentoClient from "./OrcamentoClient";

export const metadata: Metadata = {
  title: "Solicitar Orçamentos — Despachante, Importadora e Frete",
  description:
    "Preencha seus dados uma vez e receba orçamentos reais de despachantes aduaneiros, importadoras e exportadoras especializadas em carros americanos.",
  robots: { index: false, follow: false },
};

export default function OrcamentoPage() {
  return <OrcamentoClient />;
}
