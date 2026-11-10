import type { Metadata } from "next";
import Link from "next/link";
import NavHeader from "../components/NavHeader";
import { BotaoPreferenciasCookies } from "../components/AvisoCookies";

const EMAIL = "arche.boost@gmail.com";

export const metadata: Metadata = {
  // O template do layout acrescenta " | Carro Importado".
  title: "Contato",
  description:
    "Fale com a equipe do carroimportado.com: dúvidas sobre a calculadora, sugestões, correções e parcerias.",
  alternates: { canonical: "https://www.carroimportado.com/contato" },
};

const ASSUNTOS = [
  {
    titulo: "Dúvidas sobre a calculadora",
    texto: "como interpretar o resultado ou por que um valor parece diferente do esperado;",
  },
  {
    titulo: "Correção de dados",
    texto: "alíquota, câmbio ou regra que mudou e ainda não refletimos no site;",
  },
  {
    titulo: "Sugestões",
    texto: "temas para o blog, carros para o jogo Adivinhe o Preço ou melhorias na ferramenta;",
  },
  {
    titulo: "Parcerias",
    texto:
      "despachantes, transportadoras e empresas do setor que queiram aparecer no diretório ou no pedido de orçamento;",
  },
];

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavHeader />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
        {/* Hero */}
        <div className="mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Contato
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">Contato</h1>
        </div>

        {/* Fale com a gente */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">📬 Fale com a gente</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Dúvidas sobre a calculadora, sugestão de tema para o blog, correção de algum dado ou
            proposta de parceria: escreva para
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
          >
            {EMAIL}
          </a>
        </section>

        {/* Assuntos */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Sobre o que podemos ajudar</h2>
          <ul className="space-y-3 text-slate-600 leading-relaxed">
            {ASSUNTOS.map((a) => (
              <li key={a.titulo} className="flex gap-3">
                <span className="text-blue-600 font-bold shrink-0">•</span>
                <span>
                  <strong className="text-slate-800">{a.titulo}</strong> — {a.texto}
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>
                <strong className="text-slate-800">Privacidade (LGPD)</strong> — acesso, correção ou
                exclusão dos seus dados pessoais, conforme a nossa{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>
                . Pedidos de titulares são respondidos em até 15 dias.
              </span>
            </li>
          </ul>
        </section>

        {/* O que o site não faz */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">O que o site não faz</h2>
          <p className="text-slate-600 leading-relaxed">
            O carroimportado.com é uma ferramenta de simulação e informação.{" "}
            <strong>Não somos despachante aduaneiro, transportadora ou importadora</strong> e não
            intermediamos a compra de veículos. Para contratar os serviços da importação, use o nosso{" "}
            <Link href="/orcamento" className="text-blue-600 hover:underline">
              pedido de orçamento
            </Link>
            : seus dados vão para até 8 empresas do diretório, que entram em contato com você.
          </p>
        </section>

        {/* Aviso */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          <h2 className="font-bold mb-1">⚠️ Aviso</h2>
          <p>
            As estimativas do site são baseadas em dados públicos e servem apenas para fins
            informativos. Não constituem assessoria jurídica, aduaneira ou financeira. Valores reais
            podem variar. Consulte sempre um <strong>despachante aduaneiro habilitado</strong> antes
            de tomar qualquer decisão de importação.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 text-center text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">carroimportado.com</p>
        <p className="mb-3">Calculadora de importação de veículos EUA → Brasil</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">Política de Privacidade</Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">Termos de Uso</Link>
          <Link href="/sobre" className="hover:text-blue-600 transition-colors">Sobre</Link>
          <Link href="/contato" className="hover:text-blue-600 transition-colors">Contato</Link>
          <BotaoPreferenciasCookies className="hover:text-blue-600 transition-colors" />
        </div>
        <p className="mt-3">© 2026 carroimportado.com — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
