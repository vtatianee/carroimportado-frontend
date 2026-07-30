// Dados do guia de importação — fonte única para a página /guia e para o
// content API consumido pelo app iOS (/api/content/v1/guia).
//
// Antes viviam dentro de app/guia/page.tsx e app/guia/ChecklistClient.tsx, o
// que os tornava inacessíveis para qualquer coisa que não fosse aquele render.
// As cores (colorMap/bgMap) ficaram na página de propósito: são classes
// Tailwind, inúteis fora da web. O campo `color` aqui é um token neutro
// ("blue", "green"...) que cada plataforma mapeia como quiser.

export interface GuiaStep {
  number: number;
  title: string;
  duration: string;
  color: string;
  icon: string;
  description: string;
  actions: string[];
  warning?: string;
  tip?: string;
  documents: string[];
}

export interface CostSummaryItem {
  label: string;
  value: string;
  color: string;
}

export interface CheckItem {
  id: string;
  label: string;
  note?: string;
}

export interface CheckGroup {
  id: string;
  icon: string;
  title: string;
  items: CheckItem[];
}

export const STEPS: GuiaStep[] = [
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

export const COSTS_SUMMARY: CostSummaryItem[] = [
  { label: "Imposto de Importação (II)", value: "35% do CIF (valor aduaneiro)", color: "text-red-600" },
  { label: "IPI", value: "18,81% sobre (CIF + II) — 0% para clássicos 30+ anos | 25% para motores acima de 2.0L", color: "text-orange-600" },
  { label: "PIS", value: "2,62% do CIF", color: "text-amber-600" },
  { label: "COFINS", value: "12,57% do CIF", color: "text-amber-600" },
  { label: "ICMS (SP)", value: "12% — cálculo por dentro", color: "text-yellow-600" },
  { label: "Frete marítimo (estimativa)", value: "USD 1.500–2.500", color: "text-slate-600" },
  // Varia com o frete: despachante 1.500 + THC 500 + armazenagem 375 + AFRMM
  // (25% do frete). Para frete de USD 1.200–2.500 → USD 2.675–3.000.
  { label: "Desembaraço aduaneiro", value: "USD 2.700–3.000", color: "text-slate-600" },
];

export const CHECKLIST_GROUPS: CheckGroup[] = [
  {
    id: "pesquisa",
    icon: "🔍",
    title: "Antes de comprar (EUA)",
    items: [
      { id: "title_clean", label: "Certificate of Title limpo (sem gravames)", note: "Verifique liens no DMV do estado" },
      { id: "carfax", label: "Relatório Carfax ou AutoCheck obtido" },
      { id: "mecanico", label: "Avaliação com mecânico nos EUA", note: "Recomendado para clássicos" },
      { id: "frete_cotacao", label: "Cotação de frete marítimo (mín. 2 transportadoras)" },
      { id: "seguro_cotacao", label: "Cotação de seguro marítimo obtida" },
    ],
  },
  {
    id: "compra",
    icon: "📄",
    title: "Compra e exportação (EUA)",
    items: [
      { id: "bill_of_sale", label: "Bill of Sale assinado com o vendedor" },
      { id: "title_transfer", label: "Certificate of Title transferido para seu nome" },
      { id: "eei", label: "EEI registrado no CBP (72h antes do embarque)", note: "Automated Export System" },
      { id: "passaporte", label: "Passaporte ou documento de identidade com cópia" },
    ],
  },
  {
    id: "radar",
    icon: "🔐",
    title: "Habilitação RADAR (Brasil)",
    items: [
      { id: "cpf_regular", label: "CPF/CNPJ regular na Receita Federal (sem pendências)" },
      { id: "radar_solicitado", label: "Solicitação de habilitação RADAR enviada", note: "Prazo: 30–90 dias" },
      { id: "radar_aprovado", label: "RADAR aprovado e ativo" },
    ],
  },
  {
    id: "frete",
    icon: "🚢",
    title: "Frete marítimo",
    items: [
      { id: "transportadora", label: "Transportadora especializada contratada (RoRo ou container)" },
      { id: "bill_of_lading", label: "Bill of Lading (conhecimento de embarque) recebido" },
      { id: "seguro_contrato", label: "Contrato de seguro marítimo assinado" },
      { id: "invoice_frete", label: "Invoice da transportadora recebida" },
    ],
  },
  {
    id: "licenca",
    icon: "📋",
    title: "Licença de Importação e impostos",
    items: [
      { id: "despachante", label: "Despachante aduaneiro habilitado contratado" },
      { id: "li_siscomex", label: "Licença de Importação aberta no Siscomex (SECEX/MDIC)" },
      { id: "ibama", label: "Laudo IBAMA obtido", note: "Exige análise de emissões — clássicos geralmente aprovados" },
      { id: "li_aprovada", label: "Licença de Importação aprovada" },
      { id: "darf_pago", label: "DARF de impostos quitado (II, IPI, PIS, COFINS, ICMS)" },
    ],
  },
  {
    id: "desembaraco",
    icon: "🏛",
    title: "Desembaraço aduaneiro",
    items: [
      { id: "thc_pago", label: "THC (Terminal Handling Charge) pago" },
      { id: "afrmm_pago", label: "AFRMM pago (25% do frete marítimo)" },
      { id: "armazenagem", label: "Armazenagem e capatazia quitados" },
      { id: "nota_desembaraco", label: "Nota de desembaraço / DI liberada pela Receita Federal" },
    ],
  },
  {
    id: "homologacao",
    icon: "✅",
    title: "Homologação e emplacamento",
    items: [
      { id: "cat_senatrans", label: "CAT (SENATRANS) aprovado", note: "Certificado de Adequação à Legislação de Trânsito" },
      { id: "inmetro", label: "Laudo INMETRO emitido pelo laboratório credenciado" },
      { id: "detran_vistoria", label: "Vistoria no DETRAN aprovada" },
      { id: "crv", label: "CRV emitido (Certificado de Registro do Veículo)" },
      { id: "placa", label: "Placa brasileira instalada" },
    ],
  },
];
