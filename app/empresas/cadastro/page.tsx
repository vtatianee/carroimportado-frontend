import type { Metadata } from "next";
import CadastroClient from "./CadastroClient";

export const metadata: Metadata = {
  title: "Cadastrar Empresa — Diretório de Importação",
  description: "Solicite o cadastro da sua empresa no diretório de empresas de importação de carros dos EUA para o Brasil.",
  robots: { index: false, follow: false },
};

export default function CadastroPage() {
  return <CadastroClient />;
}
