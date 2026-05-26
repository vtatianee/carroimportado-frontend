import type { Metadata } from "next";
import Link from "next/link";
import { ChecklistClient } from "./ChecklistClient";
import { TimelineClient } from "./TimelineClient";

export const metadata: Metadata = {
  title: "Como Importar um Carro dos EUA para o Brasil — Guia Completo 2026",
  description:
    "Guia passo a passo completo para importar um carro dos Estados Unidos para o Brasil em 2026. Todas as etapas: Licença de Importação, IBAMA, CAT, Siscomex, impostos e DETRAN.",
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
      "Antes de fechar negócio, confirme que o veículo está em boas condições, que o título está limpo e que você tem cotações de frete e seguro. Uma inspeção presencial nos EUA evita surpresas caras.",
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
    title: "Licença de Importação — Siscomex e IBAMA",
    duration: "2–4 semanas",
    color: "violet",
    icon: "🏛️",
    description:
      "Enquanto o navio está em trânsito, inicie o processo de licenciamento no Brasil. A Licença de Importação (LI) é solicitada no Siscomex e analisada pela SECEX (Secretaria de Comércio Exterior/MDIC). O IBAMA verifica a conformidade ambiental do veículo.",
    actions: [
      "Contrate um despachante aduaneiro habilitado pela Receita Federal",
      "Solicite a Licença de Importação (LI) no Siscomex",
      "SECEX/MDIC analisa e aprova a operação de importação",
      "IBAMA verifica se o veículo atende às normas de emissão vigentes",
      "Para clássicos (30+ anos), o IBAMA geralmente concede isenção de laudo",
    ],
    warning: "A LI deve ser aprovada antes do desembaraço aduaneiro. Iniciar esse processo com o navio em trânsito economiza semanas.",
    documents: [
      "Licença de Importação (LI) — Siscomex",
      "Comprovante de aprovação SECEX/MDIC",
      "Laudo IBAMA ou isenção para clássicos",
    ],
  },
  {
    number: 5,
    title: "Homologação técnica — CAT (SENATRANS)",
    duration: "2–8 semanas",
    color: "purple",
    icon: "🔧",
    description:
      "O Certificado de Adequação à Legislação de Trânsito (CAT) certifica que o veículo atende às normas técnicas brasileiras de segurança e trânsito. A aprovação final é do SENATRANS (Secretaria Nacional de Trânsito), vinculado ao Ministério dos Transportes.",
    actions: [
      "Verifique se o modelo tem CAT pré-aprovado (modelos comuns já têm)",
      "Para clássicos únicos, pode ser necessário laudo técnico individual",
      "O despachante aduaneiro geralmente coordena esse processo",
      "Adaptações podem ser necessárias: faróis, retrovisores, cintos etc.",
    ],
    tip: "Carros clássicos americanos amplamente conhecidos (Mustang, Camaro, Corvette etc.) geralmente têm o processo facilitado. Modelos raros podem exigir laudos individuais. Atenção: reprovação pode gerar custos de adaptação de R$ 15.000 a R$ 80.000 — pesquise antes de comprar.",
    warning: "Se o veículo não passar na homologação e não puder ser adaptado, deverá ser reexportado ou destruído — mesmo após todos os impostos terem sido pagos.",
    documents: [
      "CAT — Certificado de Adequação à Legislação de Trânsito (SENATRANS)",
      "Laudo técnico do laboratório credenciado pelo INMETRO (se necessário)",
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
    warning: "O veículo gera custos de armazenagem no porto desde o desembarque (~R$ 150–300/dia após a franquia). Se não for retirado em 90 dias, pode ser declarado abandonado e leiloado pela Receita Federal — mesmo com todos os impostos pagos.",
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
  { label: "IPI", value: "18,81% sobre (FOB + II) — 0% para clássicos 30+ anos", color: "text-orange-600" },
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

        {/* Checklist interativo */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">☑️ Checklist de documentos</h2>
          <p className="text-slate-500 text-sm mb-6">
            Marque cada item conforme você avança. O progresso é salvo automaticamente no seu navegador.
          </p>
          <ChecklistClient />
        </section>

        {/* Estimador de prazo */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">📅 Estimador de prazo</h2>
          <p className="text-slate-500 text-sm mb-6">
            Informe quando pretende começar e veja a data estimada de conclusão por cenário.
          </p>
          <TimelineClient />
        </section>

        {/* Resumo de custos */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">💰 Resumo dos impostos e custos</h2>
          <p className="text-sm text-slate-500 mb-5">A carga tributária total costuma superar 100% do valor do veículo.</p>
          <div className="divide-y divide-slate-100">
            {COSTS_SUMMARY.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">Exemplo: veículo FOB USD 30.000 (combustão, SP)</p>
            <p>II ≈ R$ 60.375 · IPI ≈ R$ 43.800 · PIS+COFINS ≈ R$ 26.000 · ICMS ≈ R$ 51.000 · Desembaraço ≈ R$ 17.000</p>
            <p className="mt-1 font-semibold text-slate-800">Total estimado: ~R$ 330.000 — carga tributária efetiva ~103%</p>
          </div>
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 flex items-center justify-between gap-4 flex-wrap">
            <span>Calcule com os valores exatos do veículo que você encontrou — câmbio PTAX do dia.</span>
            <Link href="/" className="shrink-0 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap">
              Calcular impostos do meu veículo →
            </Link>
          </div>
        </section>

        {/* Portos e AFRMM */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">⚓ Portos e AFRMM</h2>
          <p className="text-sm text-slate-500 mb-5">A escolha do porto impacta o custo de THC, armazenagem e transporte interno.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-slate-600 font-semibold">Porto</th>
                  <th className="text-left pb-3 text-slate-600 font-semibold">Estado</th>
                  <th className="text-left pb-3 text-slate-600 font-semibold">ICMS</th>
                  <th className="text-left pb-3 text-slate-600 font-semibold">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { porto: "Santos", estado: "SP", icms: "12%", obs: "Mais utilizado — maior estrutura e volume" },
                  { porto: "Paranaguá", estado: "PR", icms: "12%", obs: "Boa alternativa para Sul e Centro-Oeste" },
                  { porto: "Itajaí / Navegantes", estado: "SC", icms: "12%", obs: "Bastante utilizado, bom custo de THC" },
                  { porto: "Rio de Janeiro / Sepetiba", estado: "RJ", icms: "20%", obs: "ICMS mais alto — desvantagem tributária" },
                  { porto: "Suape", estado: "PE", icms: "17%", obs: "Referência para o Nordeste" },
                ].map((r) => (
                  <tr key={r.porto}>
                    <td className="py-3 font-medium text-slate-800">{r.porto}</td>
                    <td className="py-3 text-slate-600">{r.estado}</td>
                    <td className={`py-3 font-semibold ${r.icms === "20%" ? "text-red-600" : "text-green-700"}`}>{r.icms}</td>
                    <td className="py-3 text-slate-500 text-xs">{r.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>AFRMM (Adicional ao Frete para Renovação da Marinha Mercante):</strong> Cobrado pela ANTAQ, equivale a 25% do frete marítimo internacional (Lei 10.893/2004). Para um frete de USD 1.800 com câmbio a R$ 5,75: AFRMM ≈ <strong>R$ 2.588</strong>. Já está incluído nas estimativas de desembaraço desta calculadora.
          </div>
        </section>

        {/* Veículos Elétricos */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">⚡ Importando veículos elétricos (EVs)</h2>
          <p className="text-slate-500 text-sm mb-6">Regras específicas e vantagens fiscais para elétricos importados dos EUA</p>

          {/* IPI destaque */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💚</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">IPI = 0% para veículos elétricos puros</p>
                <p className="text-green-700 text-sm mt-1">
                  Pelo <strong>Decreto 11.394/2023</strong>, veículos elétricos a bateria (BEV) têm alíquota zero de IPI na importação.
                  Isso representa uma economia de <strong>18,81%</strong> sobre o valor do veículo + II, comparado a um carro a combustão equivalente.
                  A calculadora aplica essa isenção automaticamente quando você seleciona &quot;Elétrico&quot; no tipo de veículo.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Elegibilidade */}
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">🎯 Quais EVs podem ser importados?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><strong>Veículos 0 km (novos)</strong> — principal via para EVs modernos (Tesla, Rivian, Lucid etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><strong>30+ anos de fabricação</strong> — raros, mas tecnicamente elegíveis (ex: carros elétricos experimentais dos anos 1990)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span><strong>EVs usados com menos de 30 anos</strong> — <em>não permitidos</em>, mesma regra de combustão</span>
                </li>
              </ul>
            </div>

            {/* Infraestrutura */}
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">🔌 Compatibilidade elétrica</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  <span>Rede elétrica dos EUA: <strong>120V / 60Hz</strong> — Brasil usa <strong>127V–220V / 60Hz</strong>. Verifique compatibilidade do carregador</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  <span>Conector americano padrão: <strong>J1772 / CCS1</strong>. Brasil adota <strong>Type 2 / CCS2</strong>. Adaptadores ou onboard charger compatível são necessários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">ℹ</span>
                  <span>Tesla usa conector NACS (North American Charging Standard) — verifique disponibilidade de Superchargers no Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Homologação EV */}
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-amber-800 text-sm mb-2">🏛 Homologação mais complexa para EVs</h3>
            <p className="text-amber-700 text-sm mb-2">
              O processo de <strong>CAT (Certificado de Adequação à Legislação de Trânsito)</strong> no SENATRANS é mais criterioso para elétricos:
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Laudos específicos de segurança do sistema de bateria (térmica, elétrica, mecânica)</li>
              <li>• Certificação INMETRO para o sistema de recarga</li>
              <li>• Verificação de compatibilidade com a norma NBR 16620 (veículos elétricos)</li>
              <li>• Prazo de homologação pode ser <strong>50–100% maior</strong> que para veículos convencionais</li>
            </ul>
          </div>

          {/* ICMS estadual */}
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 text-sm mb-2">🏷 ICMS: verifique incentivos estaduais</h3>
            <p className="text-blue-700 text-sm">
              Alguns estados brasileiros concedem <strong>redução ou isenção de ICMS</strong> para veículos elétricos importados.
              Consulte a legislação do seu estado antes de definir o porto de destino — a escolha do estado pode impactar
              significativamente o custo total, além dos 12–20% já calculados pela regra geral.
            </p>
          </div>
        </section>

        {/* PF vs PJ */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">👤 Pessoa Física vs Pessoa Jurídica</h2>
          <p className="text-slate-500 text-sm mb-6">Diferenças importantes dependendo de quem importa o veículo</p>

          {/* RADAR destaque */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 text-sm mb-1">🔐 Habilitação RADAR — obrigatória para todos</h3>
            <p className="text-blue-700 text-sm">
              Antes de importar, qualquer importador (PF ou PJ) precisa de habilitação no <strong>RADAR</strong> (Registro e
              Rastreamento da Atuação dos Intervenientes Aduaneiros) da Receita Federal. O processo leva <strong>30 a 90 dias</strong> e
              deve ser iniciado com antecedência. Sem RADAR ativo, o despacho aduaneiro não pode ser iniciado.
            </p>
          </div>

          {/* Tabela comparativa */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold rounded-tl-lg border border-slate-200">Critério</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold border border-slate-200">👤 Pessoa Física (PF)</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold rounded-tr-lg border border-slate-200">🏢 Pessoa Jurídica (PJ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Pode importar?</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">✅ Sim, para uso próprio</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">✅ Sim, inclusive para revenda</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">RADAR</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Limitado (até USD 150k/semestre) ou Ilimitado</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Ilimitado (exige patrimônio líquido mínimo)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Impostos de importação</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">II, IPI, PIS, COFINS, ICMS — iguais para ambos</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Mesmos impostos; PJ no Lucro Real pode creditar PIS/COFINS</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Revenda</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">⚠️ Restrita — importação para uso pessoal, não comercial</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">✅ Permitida, desde que no objeto social da empresa</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Ganho de capital na venda</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">IR: 15% a 22,5% sobre o lucro obtido</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Tributação conforme regime (Simples, Presumido ou Real)</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Despachante</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Obrigatório (mesma regra)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Obrigatório (mesma regra)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-700 font-medium border border-slate-200">Vantagens fiscais extras</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Nenhuma além das isenções de IPI (clássicos/EVs)</td>
                  <td className="px-4 py-3 text-slate-600 border border-slate-200">Crédito de PIS/COFINS (Lucro Real), depreciação contábil</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Alertas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 text-sm mb-2">⚠️ Atenção — PF importando para revenda</h3>
              <p className="text-amber-700 text-sm">
                Importar um veículo como PF e revendê-lo em seguida pode ser caracterizado como prática comercial habitual
                pela Receita Federal, sujeitando o importador a autuação fiscal, multas e, em casos reincidentes, processo
                por sonegação. Consulte um contador antes.
              </p>
            </div>
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 text-sm mb-2">✅ Recomendação prática</h3>
              <p className="text-green-700 text-sm">
                Para importação de <strong>uso pessoal</strong> (coleção, uso próprio): PF é mais simples e sem exigência
                de patrimônio mínimo. Para <strong>negócio</strong> (revenda, frota): abra uma PJ com objeto social adequado
                e habilite o RADAR Ilimitado. Em ambos os casos, conte com despachante aduaneiro e contador especializados.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Calcule o custo do seu veículo agora</h2>
          <p className="text-slate-300 text-sm mb-2 max-w-lg mx-auto">
            Cole o link de qualquer anúncio do Cars.com e receba o breakdown completo de impostos — II, IPI, PIS, COFINS, ICMS e desembaraço — com câmbio PTAX do dia.
          </p>
          <p className="text-slate-400 text-xs mb-6">Gratuito · Sem cadastro · Resultado em segundos</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            🚗 Calcular impostos do meu veículo →
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
