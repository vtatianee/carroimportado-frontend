export interface Empresa {
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

export const EMPRESAS: Empresa[] = [
  // ── Flórida — EUA ──────────────────────────────────────────────────────────
  {
    id: "latin-american-cargo",
    nome: "Latin American Cargo (LAC)",
    pais: "US",
    estado: "FL",
    cidade: "Miami",
    especialidades: ["Exportação", "Frete marítimo", "RORO", "Container", "Despachante EUA"],
    rating: 4.9,
    reviews: 103,
    reviewSource: "reviews.io",
    website: "https://www.latinamericancargo.com",
    whatsapp: null,
    email: null,
    descricao:
      "Especialista em frete internacional para a América Latina há mais de 25 anos. Oferece RORO e container a partir dos principais portos da Flórida, com suporte em português.",
    destaque: true,
  },
  {
    id: "world-class-shipping",
    nome: "World Class Shipping",
    pais: "US",
    estado: "FL",
    cidade: "Miramar",
    especialidades: ["Exportação", "Frete marítimo", "RORO", "Container"],
    rating: null,
    reviews: null,
    website: "https://www.wcshipping.com",
    whatsapp: null,
    email: null,
    descricao:
      "Transporta mais de 16.000 veículos por ano. Quase 40 anos de experiência, com instalações em Miami e rotas regulares para o Brasil.",
  },
  {
    id: "east-west-auto-transport",
    nome: "East West Auto Transport",
    pais: "US",
    estado: "FL",
    cidade: "Miami",
    especialidades: ["Exportação", "Clássicos", "Exóticos", "Frete marítimo"],
    rating: 5.0,
    reviews: null,
    reviewSource: "transportreviews.com",
    website: "https://www.eastwestautotransport.com",
    whatsapp: null,
    email: null,
    descricao:
      "Especializado em veículos de alto valor, clássicos e exóticos. A+ no Better Business Bureau. Operações desde 1986.",
  },
  {
    id: "advance-miami",
    nome: "Advance Miami",
    pais: "US",
    estado: "FL",
    cidade: "Doral",
    especialidades: ["Exportação", "Clássicos", "Despachante EUA"],
    rating: null,
    reviews: null,
    website: "https://www.advancemiami.com.br",
    whatsapp: null,
    email: "sac@advancemiami.com.br",
    descricao:
      "Mais de 35 anos no mercado de importação e exportação de veículos entre Brasil e EUA. Pioneira no segmento de clássicos. Sede em Doral, FL.",
    destaque: true,
  },
  {
    id: "a1-auto-transport",
    nome: "A-1 Auto Transport",
    pais: "US",
    estado: "FL",
    cidade: "Miami",
    especialidades: ["Exportação", "Frete marítimo", "RORO"],
    rating: 3.7,
    reviews: 60,
    reviewSource: "Trustpilot",
    website: "https://www.a1autotransport.com",
    whatsapp: null,
    email: null,
    descricao:
      "Uma das maiores transportadoras de veículos dos EUA. Serviço bi-semanal para o Brasil a partir de Jacksonville e Miami.",
  },

  // ── Brasil ─────────────────────────────────────────────────────────────────
  {
    id: "direct-imports",
    nome: "Direct Imports",
    pais: "BR",
    estado: "SP",
    cidade: "São Paulo",
    especialidades: ["Importação", "Despachante", "Luxo", "Clássicos", "Esportivos"],
    rating: null,
    reviews: null,
    website: "https://directimports.com.br",
    whatsapp: "+5511978899330",
    email: "contato@directimports.com.br",
    descricao:
      "Referência nacional em importação de veículos de alto desempenho. 15 anos de atuação, mais de 650 importações entregues. Av. JK, 2041 Torre B, Vila Olímpia — SP.",
    destaque: true,
  },
  {
    id: "wbc-trade",
    nome: "WBC Trade",
    pais: "BR",
    estado: "SC",
    cidade: "Itajaí",
    especialidades: ["Importação", "Despachante", "Luxo", "Supercarros"],
    rating: null,
    reviews: null,
    website: "https://www.wbctrade.com",
    whatsapp: null,
    email: null,
    descricao:
      "Importadora de veículos de luxo com mais de 20 anos de mercado. Especializada em Ferrari, Lamborghini, Porsche e McLaren. Mais de 2.000 veículos entregues.",
  },
  {
    id: "miami-imports-bc",
    nome: "Miami Imports",
    pais: "BR",
    estado: "SC",
    cidade: "Balneário Camboriú",
    especialidades: ["Importação", "Despachante", "Premium"],
    rating: null,
    reviews: null,
    website: "https://miamiimports.com.br",
    whatsapp: "+5547984729391",
    email: "mkt@miamiimports.com.br",
    descricao:
      "Importação independente de veículos premium desde 2019. Mais de 300 carros entregues. Prazo médio de 60 dias.",
  },
  {
    id: "classic-import",
    nome: "Classic Import",
    pais: "BR",
    estado: "SP",
    cidade: "São Paulo",
    especialidades: ["Importação", "Clássicos", "Premium", "Door-to-door"],
    rating: null,
    reviews: null,
    website: "https://classicimport.com.br",
    whatsapp: null,
    email: null,
    descricao:
      "Operação door-to-door para importação de veículos premium e antigos de coleção. Escritórios no Brasil (+55 11 4200-0594) e EUA (+1 407 300-6451).",
  },
  {
    id: "comprou-na-america",
    nome: "Comprou na América",
    pais: "BR",
    estado: "PR",
    cidade: "Curitiba",
    especialidades: ["Importação", "Peças", "Despachante"],
    rating: null,
    reviews: null,
    website: "https://comprounaamerica.com.br",
    whatsapp: null,
    email: null,
    descricao:
      "Importadora de carros e peças com sedes em Miami e Orlando. Atende todo o Brasil a partir de Curitiba/PR.",
  },
];

export const ESPECIALIDADE_CORES: Record<string, string> = {
  Exportação: "bg-blue-100 text-blue-700",
  Importação: "bg-green-100 text-green-700",
  "Frete marítimo": "bg-orange-100 text-orange-700",
  RORO: "bg-orange-100 text-orange-700",
  Container: "bg-orange-100 text-orange-700",
  Clássicos: "bg-amber-100 text-amber-700",
  Luxo: "bg-purple-100 text-purple-700",
  Supercarros: "bg-purple-100 text-purple-700",
  Premium: "bg-purple-100 text-purple-700",
  Exóticos: "bg-purple-100 text-purple-700",
  Despachante: "bg-teal-100 text-teal-700",
  "Despachante EUA": "bg-teal-100 text-teal-700",
  Esportivos: "bg-red-100 text-red-700",
  Peças: "bg-slate-100 text-slate-700",
  "Door-to-door": "bg-cyan-100 text-cyan-700",
};
