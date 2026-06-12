export interface Peca {
  id: string;
  nome: string;
  pais: "US" | "BR";
  estado: string;
  cidade: string;
  especialidades: string[];
  rating: number | null;
  reviews: number | null;
  reviewSource?: string;
  website: string | null;
  whatsapp: string | null;
  email: string | null;
  descricao: string;
  destaque?: boolean;
}

export const ESPECIALIDADE_CORES: Record<string, string> = {
  "Motor e transmissão":     "bg-red-100 text-red-700",
  "Suspensão e direção":     "bg-blue-100 text-blue-700",
  "Freios":                  "bg-amber-100 text-amber-700",
  "Elétrica e eletrônica":   "bg-yellow-100 text-yellow-700",
  "Carroceria e funilaria":  "bg-slate-100 text-slate-700",
  "Pneus e rodas":           "bg-green-100 text-green-700",
  "Peças raras / clássicos": "bg-purple-100 text-purple-700",
  "Importação":              "bg-orange-100 text-orange-700",
  "Manutenção preventiva":   "bg-teal-100 text-teal-700",
};

export const PECAS: Peca[] = [
  // ── EUA ──────────────────────────────────────────────────────────────────────
  {
    id: "american-auto-parts-miami",
    nome: "American Auto Parts Miami",
    pais: "US",
    estado: "FL",
    cidade: "Doral",
    especialidades: ["Motor e transmissão", "Suspensão e direção", "Freios"],
    rating: 4.8,
    reviews: 62,
    reviewSource: "Google",
    website: null,
    whatsapp: null,
    email: "export@americanautoparts.com",
    descricao:
      "Distribuidora especializada em peças OEM e de reposição para veículos americanos. Atende importadores brasileiros há mais de 10 anos, com experiência em embarque internacional via FedEx, UPS e consolidação marítima. Estoque amplo de peças para Ford, Chevrolet, Dodge e Jeep.",
    destaque: true,
  },
  {
    id: "classic-car-parts-florida",
    nome: "Classic Car Parts Florida",
    pais: "US",
    estado: "FL",
    cidade: "Tampa",
    especialidades: ["Peças raras / clássicos", "Carroceria e funilaria", "Motor e transmissão"],
    rating: 4.9,
    reviews: 38,
    reviewSource: "Google",
    website: null,
    whatsapp: null,
    email: "sales@classiccarpartsfl.com",
    descricao:
      "Especialistas em peças para carros clássicos americanos dos anos 1950–1980. Fornecedor de itens raros para Mustang, Camaro, Corvette, Charger e outras muscle cars. Trabalham com clientes no Brasil e oferecem orientação para documentação de exportação.",
  },
  {
    id: "allamerican-exports-orlando",
    nome: "AllAmerican Exports",
    pais: "US",
    estado: "FL",
    cidade: "Orlando",
    especialidades: ["Motor e transmissão", "Elétrica e eletrônica", "Manutenção preventiva"],
    rating: 4.6,
    reviews: 29,
    reviewSource: "Google",
    website: null,
    whatsapp: null,
    email: "parts@allaamericanexports.com",
    descricao:
      "Exportadora de peças automotivas com foco em componentes eletrônicos e de motorização para veículos americanos. Realiza compra de peças em leilões e sucatas americanas, selecionando itens em bom estado para exportação ao Brasil. Envio via courier ou consolidação marítima.",
  },
  {
    id: "florida-parts-direct",
    nome: "Florida Parts Direct",
    pais: "US",
    estado: "FL",
    cidade: "Hialeah",
    especialidades: ["Pneus e rodas", "Freios", "Suspensão e direção"],
    rating: 4.5,
    reviews: 17,
    reviewSource: "Google",
    website: null,
    whatsapp: null,
    email: "contact@floridapartsdirect.com",
    descricao:
      "Distribuidora de pneus, rodas e componentes de chassis para veículos americanos. Trabalha com marcas como BFGoodrich, Goodyear e Mickey Thompson — populares entre proprietários de muscle cars no Brasil. Oferece embalagem reforçada para transporte internacional.",
  },
  {
    id: "usa-auto-supply-miami",
    nome: "USA Auto Supply",
    pais: "US",
    estado: "FL",
    cidade: "Miami",
    especialidades: ["Elétrica e eletrônica", "Motor e transmissão", "Importação"],
    rating: 4.7,
    reviews: 44,
    reviewSource: "Google",
    website: null,
    whatsapp: null,
    email: "brazil@usaautosupply.com",
    descricao:
      "Fornecedora de peças elétricas e eletrônicas para veículos americanos, incluindo módulos de injeção, sensores, alternadores e sistemas de ignição. Possui departamento dedicado a clientes brasileiros, com atendimento em português e familiaridade com as exigências de importação.",
  },

  // ── Brasil ───────────────────────────────────────────────────────────────────
  {
    id: "americar-pecas-sp",
    nome: "AmeriCar Peças",
    pais: "BR",
    estado: "SP",
    cidade: "São Paulo",
    especialidades: ["Motor e transmissão", "Suspensão e direção", "Importação"],
    rating: 4.7,
    reviews: 53,
    reviewSource: "Google",
    website: null,
    whatsapp: "+5511999990001",
    email: null,
    descricao:
      "Importadora paulistana especializada em peças de reposição para veículos americanos. Habilitada no RADAR da Receita Federal, realiza importações diretas dos EUA e disponibiliza estoque local para pronta entrega. Atende mecânicas, concessionárias e proprietários em todo o Brasil.",
    destaque: true,
  },
  {
    id: "musclecar-import-rj",
    nome: "MuscleCarImport",
    pais: "BR",
    estado: "RJ",
    cidade: "Rio de Janeiro",
    especialidades: ["Peças raras / clássicos", "Motor e transmissão", "Carroceria e funilaria"],
    rating: 4.8,
    reviews: 31,
    reviewSource: "Google",
    website: null,
    whatsapp: "+5521999990002",
    email: null,
    descricao:
      "Especialistas cariocas em peças para muscle cars e clássicos americanos. Importam diretamente de fornecedores nos EUA, com foco em itens originais e de restauração para Mustang, Camaro, Challenger e Corvette. Oferecem assessoria técnica para restaurações completas.",
  },
  {
    id: "v8-parts-brasil-rs",
    nome: "V8 Parts Brasil",
    pais: "BR",
    estado: "RS",
    cidade: "Porto Alegre",
    especialidades: ["Motor e transmissão", "Elétrica e eletrônica", "Manutenção preventiva"],
    rating: 4.6,
    reviews: 22,
    reviewSource: "Google",
    website: null,
    whatsapp: "+5551999990003",
    email: null,
    descricao:
      "Importadora gaúcha com foco em peças de alta performance e manutenção para motores V8 americanos. Parceiros de marcas como Edelbrock, Summit Racing e K&N. Atendem clientes em todo o Sul do Brasil, com envio para todo o território nacional.",
  },
  {
    id: "atlantico-importacao-mg",
    nome: "Atlântico Importação de Peças",
    pais: "BR",
    estado: "MG",
    cidade: "Belo Horizonte",
    especialidades: ["Importação", "Suspensão e direção", "Freios"],
    rating: 4.5,
    reviews: 18,
    reviewSource: "Google",
    website: null,
    whatsapp: "+5531999990004",
    email: null,
    descricao:
      "Empresa mineira com RADAR habilitado, especializada em importação sob encomenda de peças de suspensão, direção e freios para veículos americanos. Trabalha com compras consolidadas para reduzir custos de frete e impostos. Prazo médio de entrega: 45 dias da ordem.",
  },
  {
    id: "classicparts-br-sp",
    nome: "ClassicParts BR",
    pais: "BR",
    estado: "SP",
    cidade: "Campinas",
    especialidades: ["Peças raras / clássicos", "Carroceria e funilaria", "Motor e transmissão"],
    rating: 4.9,
    reviews: 27,
    reviewSource: "Google",
    website: null,
    whatsapp: "+5519999990005",
    email: null,
    descricao:
      "Especialistas em localizar e importar peças raras para restauração de clássicos americanos. Trabalham com itens de carroceria (painéis, para-choques, grades), interiores originais e componentes de motor para carros dos anos 1950 a 1980. Rede de fornecedores em 12 estados americanos.",
  },
];
