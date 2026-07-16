import type { Metadata } from "next";
import { Suspense } from "react";
import OrcamentoClient from "./OrcamentoClient";

export const metadata: Metadata = {
  title: "Solicitar Orçamentos — Despachante, Importadora e Frete",
  description:
    "Preencha seus dados uma vez e receba orçamentos reais de despachantes aduaneiros, importadoras e exportadoras especializadas em carros americanos.",
  robots: { index: false, follow: false },
};

export default function OrcamentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OrcamentoClient />
    </Suspense>
  );
}
