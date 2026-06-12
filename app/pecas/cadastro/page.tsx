import type { Metadata } from "next";
import CadastroPecasClient from "./CadastroPecasClient";

export const metadata: Metadata = {
  title: "Cadastrar Fornecedor de Peças",
  description: "Solicite o cadastro do seu fornecedor de peças para carros americanos no diretório do carroimportado.com.",
  robots: { index: false, follow: false },
};

export default function CadastroPecasPage() {
  return <CadastroPecasClient />;
}
