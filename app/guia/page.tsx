import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como Importar um Carro dos EUA para o Brasil — Guia Completo 2026",
  description:
    "Guia passo a passo completo para importar um carro dos Estados Unidos para o Brasil em 2026. Todas as etapas: DECEX, IBAMA, CAT, Siscomex, impostos e DETRAN.",
  alternates: {
    canonical: "https://www.carroimportado.com/guia",
  },
  openGraph: {
    title: "Como Importar um Carro dos EUA para o Brasil — Guia Completo 2026",
    description:
      "Todas as etapas do processo de importação: documentação, impostos, desembaraço aduaneiro e emplacamento. Tempo médio: 60 a 120 dias.",
    url: "https://www.carroimportado.com/guia",
  },
};

const STEPS = [
  {
    number: 1,
    title: "Escolha e verificação do veículo",
    duration: "1–4 semanas",
    color: "blue",
    icon: "🔍",
    description:
      "Antes de qualquer coisa, confirme que o veículo é elegível para importação ao Brasil. A legislação permite apenas veículos 0 km ou com mais de 30 anos de fabricação.",
    actions: [
      "Verifique o ano de fabricação — deve ser 0 km ou anterior a 1996 (30+ anos)",
      "Confira o título de propriedade (Title) — deve estar limpo, sem gravames",
      "Pesquise o histórico do veículo no Carfax ou AutoCheck",
      "Avalie o estado de conservação com um mecânico de confiança nos EUA",
      "Obtenha cotações de frete marítimo antes de fechar negócio",
    ],
    warning: "Veículos usados com menos de 30 anos não podem ser importados. Não há exceções para uso pessoal.",
    documents: ["Título de propriedade (Certificate of Title)", "Relatório Carfax / AutoCheck"],
  },
  {
    number: 2,
    title: "Compra e documentação americana",
    duration: "1–2 semanas",
    color: "blue",
    icon: "📄",
    description:
      "Após fechar a compra, providencie toda a documentação necessária para a exportação do veículo pelos EUA. A alfândega americana (CBP) exige notificação prévia.",
    actions: [
      "Assine o Bill of Sale (nota fiscal de compra) com o vendedor",
      "Transfira o título para seu nome",
      "Registre a exportação no CBP (AES — Automated Export System) com 72h de antecedência",
      "Obtenha o comprovante de exportação (EEI — Electronic Export Information)",
      "Contrate um despachante americano se necessário",
    ],
    documents: [
      "Bill of Sale",
      "Certificate of Title transferido",
      "EEI — Electronic Export Information (CBP)",
      "Passaporte ou documento de identidade",
    ],
  },
  {
    number: 3,
    title: "Frete marítimo",
    duration: "3–6 semanas",
    color: "indigo",
    icon: "🚢",
    description:
      "O veículo é embarcado em um navio nos EUA com destino a um porto brasileiro (Santos/SP é o mais comum). A travessia marítima leva de 15 a 30 dias.",
    actions: [
      "Contrate uma transportadora especializada em veículos (RoRo ou container)",
      "RoRo (Roll-on/Roll-off): mais barato, veículo fica exposto no navio",
      "Container: mais caro, maior proteção — recomendado para clássicos",
      "Porto de destino mais comum: Santos (SP) — facilita o desembaraço",
      "Contrate seguro marítimo (1–2% do valor do veículo)",
    ],
    tip: "Container fechado é recomendado para carros clássicos ou de alto valor. O custo adicional compensa a proteção contra maresia e danos físicos.",
    documents: [
      "Bill of Lading (conhecimento de embarque)",
      "Contrato de seguro marítimo",
      "Invoice da transportadora",
    ],
  },
  {
    number: 4,
    title: "Licença de Importação — DECEX e IBAMA",
    duration: "2–4 semanas",
    color: "violet",
    icon: "🏛️",
    description:
      "Enquanto o navio está em trânsito, inicie o processo de licenciamento no Brasil. O DECEX autoriza a operação e o IBAMA verifica a conformidade ambiental do veículo.",
    actions: [
      "Contrate um despachante aduaneiro habilitado pela Receita Federal",
      "Solicite a Licença de Importação (LI) no Siscomex",
      "DECEX (MDIC) analisa e aprova a operação de importação",
      "IBAMA verifica se o veículo atende às normas de emissão vigentes",
      "Para clássicos (30+ anos), o IBAMA geralmente concede isenção de laudo",
    ],
    warning: "A LI deve ser aprovada antes do desembaraço aduaneiro. Iniciar esse processo com o navio em trânsito economiza semanas.",
    documents: [
      "Licença de Importação (LI) — Siscomex",
      "Comprovante de aprovação DECEX",
      "Laudo IBAMA ou isenção para clássicos",
    ],
  },
  {
    number: 5,
    title: "Homologação técnica — CAT (SENATRAN)",
    duration: "2–8 semanas",
    color: "purple",
    icon: "🔧",
    description:
      "O Certificado de Adequação à Legislação de Trânsito (CAT) certifica que o veículo atende às normas técnicas brasileiras de segurança e trânsito.",
    actions: [
      "Verifique se o modelo tem CAT pré-aprovado (modelos comuns já têm)",
      "Para clássicos únicos, pode ser necessário laudo técnico individual",
      "O despachante aduaneiro geralmente coordena esse processo",
      "Adaptações podem ser necessárias: faróis, retrovisores, cintos etc.",
    ],
    tip: "Carros clássicos americanos amplamente conhecidos (Mustang, Camaro, Corvette etc.) geralmente têm o processo facilitado. Modelos raros podem exigir laudos individuais.",
    documents: [
      "CAT — Certificado de Adequação à Legislação de Trânsito",
      "Laudo técnico (se necessário)",
    ],
  },
  {
    number: 6,
    title: "Desembaraço aduaneiro e pagamento de impostos",
    duration: "1–3 semanas",
    color: "amber",
    icon: "📦",
    description:
      "Com o veículo no porto e a documentação em dia, seu despachante registra a Declaração de Importação no Siscomex e a Receita Federal calcula os impostos devidos.",
    actions: [
      "Despachante registra a Declaração de Importação (DI) no Siscomex",
      "Receita Federal valida a documentação e emite o DARF de impostos",
      "Pagamento dos impostos: II, IPI, PIS, COFINS e ICMS",
      "Pagamento das despesas de desembaraço: despachante, THC, AFRMM, armazenagem",
      "Após confirmação do pagamento, veículo é liberado para retirada",
    ],
    warning: "O veículo gera custos de armazenagem no porto desde o momento do desembarque. Agilize a documentação para evitar taxas extras.",
    documents: [
      "Declaração de Importação (DI) — Siscomex",
      "DARF — Documento de Arrecadação de Receitas Federais",
      "Comprovantes de pagamento II, IPI, PIS, COFINS, ICMS",
      "Nota fiscal do despachante",
    ],
  },
  {
    number: 7,
    title: "Retirada no porto e transporte",
    duration: "1–3 dias",
    color: "orange",
    icon: "🚛",
    description:
      "Com o desembaraço concluído e os impostos pagos, o veículo pode ser retirado. Se não estiver em condições de rodar, contrate um cegonha ou reboque especializado.",
    actions: [
      "Retire o Comprovante de Importação (CI) com o despachante",
      "Inspecione o veículo antes de assinar a liberação do porto",
      "Se o veículo não rodar, contrate transporte por cegonha",
      "Documente quaisquer danos ocorridos durante o transporte marítimo",
      "Guarde toda a documentação — será necessária no DETRAN",
    ],
    documents: [
      "Comprovante de Importação (CI)",
      "CLND — Certificado de Licença para Tráfego",
    ],
  },
  {
    number: 8,
    title: "Emplacamento no DETRAN",
    duration: "1–2 semanas",
    color: "green",
    icon: "✅",
    description:
      "Última etapa: registrar o veículo no DETRAN do estado de destino para obter o emplacamento brasileiro. A partir daqui, o carro está pronto para circular legalmente.",
    actions: [
      "Leve toda a documentação ao DETRAN do seu estado",
      "Pague o IPVA proporcional ao ano corrente",
      "Pague o DPVAT (seguro obrigatório)",
      "Realize a vistoria veicular obrigatória",
      "Receba as placas Mercosul e o CRLV (documento do veículo)",
    ],
    tip: "Alguns estados têm filas maiores no DETRAN. Com toda a documentação em ordem, o processo é rápido.",
    documents: [
      "DI — Declaração de Importação",
      "CI — Comprovante de Importação",
      "CAT — Certificado de Adequação",
      "Laudo IBAMA",
      "Nota Fiscal de importação",
      "Documento de identidade e CPF",
    ],
  },
];

const COSTS_SUMMARY = [
  { label: "Imposto de Importação (II)", value: "35% do FOB", color: "text-red-600" },
  { label: "IPI", value: "18,81% sobre (FOB + II)", color: "text-orange-600" },
  { label: "PIS", value: "2,62% do CIF", color: "text-amber-600" },
  { label: "COFINS", value: "12,57% do CIF", color: "text-amber-600" },
  { label: "ICMS (SP)", value: "12% — cálculo por dentro", color: "text-yellow-600" },
  { label: "Frete marítimo (estimativa)", value: "USD 1.500–2.500", color: "text-slate-600" },
  { label: "Desembaraço aduaneiro", value: "~USD 3.000", color: "text-slate-600" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-600 border-blue-200",
  indigo: "bg-indigo-600 border-indigo-200",
  violet: "bg-violet-600 border-violet-200",
  purple: "bg-purple-600 border-purple-200",
  amber: "bg-amber-500 border-amber-200",
  orange: "bg-orange-500 border-orange-200",
  green: "bg-green-600 border-green-200",
};

const bgMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-100",
  indigo: "bg-indigo-50 border-indigo-100",
  violet: "bg-violet-50 border-violet-100",
  purple: "bg-purple-50 border-purple-100",
  amber: "bg-amber-50 border-amber-100",
  orange: "bg-orange-50 border-orange-100",
  green: "bg-green-50 border-green-100",
};

export default function GuiaPage() {
  return (
    <main className="flex-1 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">carroimportado.com</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Calculadora
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Guia atualizado — 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Como importar um carro dos EUA para o Brasil
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-6">
            Guia completo com todas as 8 etapas do processo — da compra do veículo nos EUA ao emplacamento no DETRAN. Tempo médio: <strong className="text-white">60 a 120 dias</strong>.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">🏛️ Processo 100% legal</span>
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">📋 8 etapas detalhadas</span>
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">📄 Lista de documentos</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Regra básica */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900 mb-1">Regra fundamental da legislação brasileira</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                O Brasil permite importar apenas <strong>veículos 0 km</strong> ou <strong>veículos com mais de 30 anos de fabricação</strong> (considerados clássicos). Veículos usados com menos de 30 anos não podem ser importados, sem exceções para uso pessoal.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline de etapas */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">As 8 etapas do processo</h2>
          <p className="text-slate-500 text-sm mb-8">Clique em cada etapa para ver os detalhes, documentos e dicas.</p>

          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />

            <div className="space-y-6">
              {STEPS.map((step) => (
                <div key={step.number} className="relative sm:pl-16">
                  {/* Círculo numerado */}
                  <div className={`absolute left-0 top-5 w-12 h-12 rounded-full ${colorMap[step.color].split(" ")[0]} text-white font-bold text-lg flex items-center justify-center shadow-md hidden sm:flex z-10`}>
                    {step.number}
                  </div>

                  <div className={`rounded-2xl border p-5 sm:p-6 ${bgMap[step.color]}`}>
                    {/* Cabeçalho */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`w-8 h-8 rounded-full ${colorMap[step.color].split(" ")[0]} text-white flex items-center justify-center text-sm font-bold shrink-0 sm:hidden`}>
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                            {step.icon} {step.title}
                          </h3>
                          <span className="text-xs font-medium bg-white/80 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                            ⏱ {step.duration}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">O que fazer</p>
                      <ul className="space-y-1.5">
                        {step.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-slate-400 mt-0.5 shrink-0">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aviso */}
                    {step.warning && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex gap-2">
                        <span className="shrink-0">🚫</span>
                        {step.warning}
                      </div>
                    )}

                    {/* Dica */}
                    {step.tip && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex gap-2">
                        <span className="shrink-0">💡</span>
                        {step.tip}
                      </div>
                    )}

                    {/* Documentos */}
                    <div className="mt-4 pt-4 border-t border-white/60">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">📄 Documentos desta etapa</p>
                      <div className="flex flex-wrap gap-2">
                        {step.documents.map((doc) => (
                          <span key={doc} className="bg-white/80 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resumo de custos */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Resumo dos impostos e custos</h2>
          <p className="text-sm text-slate-500 mb-5">A carga tributária total costuma superar 100% do valor do veículo.</p>
          <div className="divide-y divide-slate-100">
            {COSTS_SUMMARY.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            💡 Use a calculadora para simular o custo total com os valores reais do veículo que você encontrou.
          </div>
        </section>

        {/* Checklist geral */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5">📋 Checklist completo de documentos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">🇺🇸 Documentação americana</h3>
              <ul className="space-y-2">
                {["Certificate of Title", "Bill of Sale", "EEI — Electronic Export Information (CBP)", "Bill of Lading", "Relatório Carfax/AutoCheck", "Invoice da compra"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-4 h-4 rounded border-2 border-slate-300 shrink-0 flex items-center justify-center" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">🇧🇷 Documentação brasileira</h3>
              <ul className="space-y-2">
                {["Licença de Importação (LI) — Siscomex", "Aprovação DECEX", "Laudo / Isenção IBAMA", "CAT — Certificado de Adequação", "Declaração de Importação (DI)", "DARF quitado (II, IPI, PIS, COFINS)", "Comprovante ICMS", "Comprovante de Importação (CI)", "CRLV + Placas DETRAN"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-4 h-4 rounded border-2 border-slate-300 shrink-0 flex items-center justify-center" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tempo total */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5">⏱ Tempo estimado por etapa</h2>
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div key={step.number} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-4 shrink-0">{step.number}.</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-700 truncate">{step.title}</span>
                    <span className="text-xs text-slate-500 shrink-0">{step.duration}</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorMap[step.color].split(" ")[0]}`}
                      style={{ width: step.number <= 2 ? "25%" : step.number <= 4 ? "45%" : step.number <= 6 ? "75%" : "95%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">Tempo total estimado</span>
              <span className="font-bold text-blue-600">60 — 120 dias</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Pronto para calcular o custo do seu veículo?</h2>
          <p className="text-blue-100 text-sm mb-6 max-w-lg mx-auto">
            Cole o link do anúncio do Cars.com e veja todos os impostos detalhados — II, IPI, PIS, COFINS e ICMS do seu estado — em segundos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            🚗 Ir para a calculadora →
          </Link>
        </section>

        <footer className="text-center text-xs text-slate-400 pb-6 space-y-1">
          <p>As informações deste guia são de caráter educativo. Consulte sempre um despachante aduaneiro habilitado pela Receita Federal para orientações específicas ao seu caso.</p>
          <p>
            <Link href="/" className="hover:text-slate-600 underline">Calculadora</Link>
            {" · "}
            <Link href="/privacy" className="hover:text-slate-600 underline">Privacidade</Link>
            {" · "}
            <Link href="/terms" className="hover:text-slate-600 underline">Termos</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
