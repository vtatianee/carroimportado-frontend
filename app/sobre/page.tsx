import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre o carroimportado.com",
  description:
    "Conheça o carroimportado.com — a ferramenta gratuita que ajuda brasileiros a calcular o custo real de importar um carro dos Estados Unidos, com impostos detalhados e câmbio do Banco Central.",
  alternates: { canonical: "https://www.carroimportado.com/sobre" },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500" />
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">
              carro<span className="text-blue-600">importado</span>.com
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">
              Calculadora
            </Link>
            <Link href="/guia" className="text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block">
              Guia
            </Link>
            <Link href="/guia#checklist" className="text-sm text-white font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              Checklist
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
        {/* Hero */}
        <div className="mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Sobre nós
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Calculadora gratuita de importação de carros dos EUA para o Brasil
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            O <strong>carroimportado.com</strong> foi criado para ajudar brasileiros a entender,
            de forma simples e transparente, o custo real de importar um veículo dos Estados Unidos.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Nossa missão</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Importar um carro dos EUA para o Brasil envolve uma série de impostos, taxas e despesas
            que, juntos, costumam superar 100% do valor original do veículo. Muita gente descobre
            isso tarde demais — após já ter negociado o carro.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Criamos esta ferramenta para que qualquer pessoa, mesmo sem conhecimento técnico,
            possa simular o custo completo antes de tomar qualquer decisão. Gratuitamente, sem
            cadastro e com dados reais do Banco Central e da Receita Federal.
          </p>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Como funciona</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">1.</span>
              <span>Cole o link de um anúncio do <strong>Cars.com</strong> e a calculadora extrai automaticamente o preço, ano, modelo e quilometragem.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">2.</span>
              <span>Selecione seu estado de destino — o ICMS varia entre 12% e 20% dependendo do estado.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">3.</span>
              <span>A calculadora aplica as alíquotas vigentes da Receita Federal (II 35%, IPI, PIS, COFINS) e o câmbio PTAX do dia.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">4.</span>
              <span>Você vê o custo total — veículo + impostos + desembaraço — em reais, com detalhamento de cada item.</span>
            </li>
          </ul>
        </section>

        {/* What we calculate */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">O que a calculadora inclui</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "🏛️", label: "II — Imposto de Importação", desc: "35% sobre o valor FOB" },
              { icon: "🏭", label: "IPI — Imposto sobre Produtos Industrializados", desc: "18,81% (0% para clássicos +30 anos)" },
              { icon: "📊", label: "PIS e COFINS", desc: "2,62% e 12,57% sobre o CIF" },
              { icon: "🗺️", label: "ICMS por estado", desc: "12% a 20% conforme destino" },
              { icon: "⚓", label: "Frete e seguro marítimo", desc: "Estimativa baseada na rota EUA → Brasil" },
              { icon: "📋", label: "Desembaraço aduaneiro", desc: "Despachante, THC, AFRMM e armazenagem" },
              { icon: "💱", label: "Câmbio PTAX", desc: "Cotação oficial do Banco Central do Brasil" },
              { icon: "📈", label: "Valor estimado de revenda", desc: "+25% de prêmio típico para clássicos americanos" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who we are */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Quem somos</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            O <strong>carroimportado.com</strong> é operado por <strong>Tatiane Assink</strong>.
            O site foi desenvolvido com o objetivo de democratizar o acesso à informação sobre
            importação de veículos — um processo que historicamente exigia consultores caros
            ou horas de pesquisa em legislação aduaneira.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Os valores apresentados são estimativas baseadas nas alíquotas vigentes da Receita
            Federal e no câmbio PTAX do Banco Central. Sempre consulte um despachante aduaneiro
            habilitado antes de tomar qualquer decisão de importação.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">📬 Contato</h2>
          <p className="text-slate-600 mb-4">
            Dúvidas, sugestões ou questões sobre privacidade de dados? Entre em contato:
          </p>
          <a
            href="mailto:arche.boost@gmail.com"
            className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
          >
            arche.boost@gmail.com
          </a>
          <p className="text-slate-500 text-sm mt-3">
            Para questões relacionadas à LGPD (acesso, correção ou exclusão de dados),
            consulte nossa{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          <p>
            <strong>⚠️ Aviso:</strong> As estimativas do carroimportado.com são baseadas em dados
            públicos e servem apenas para fins informativos. Não constituem assessoria jurídica,
            aduaneira ou financeira. Valores reais podem variar. Consulte sempre um{" "}
            <strong>despachante aduaneiro habilitado</strong>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 text-center text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">carroimportado.com</p>
        <p className="mb-3">Calculadora de importação de veículos EUA → Brasil</p>
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">Política de Privacidade</Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">Termos de Uso</Link>
          <Link href="/sobre" className="hover:text-blue-600 transition-colors">Sobre</Link>
        </div>
        <p className="mt-3">© 2026 carroimportado.com — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
