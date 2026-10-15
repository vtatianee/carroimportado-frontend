// Título e descrição que o Google mostra para cada post — curtos o bastante
// para não serem cortados na busca (~60 e ~155 caracteres). O título e o
// resumo do próprio post (frontmatter em content/blog) continuam sendo os da
// página e do app; isto só muda as tags <title> e <meta description>.
//
// Fica aqui, e não no frontmatter, porque o frontmatter é contrato com o app
// iOS (app/lib/contracts → npm run sync:contracts no app). Post sem entrada
// aqui usa o título e o resumo originais.

interface SeoPost {
  titulo: string;
  descricao: string;
}

export const SEO_POSTS: Readonly<Record<string, SeoPost>> = {
  "cambio-dolar-julho-2026-importacao-carro-americano": {
    titulo: "Dólar em queda: quanto economiza na importação do carro",
    descricao:
      "O dólar caiu 18% desde o pico de 2024. Com impostos em cascata, a queda vale muito mais no custo final do carro importado. Veja a conta.",
  },
  "custos-ocultos-importacao-carro-eua-brasil": {
    titulo: "Custos ocultos de importar carro dos EUA: AFRMM e taxas",
    descricao:
      "AFRMM, capatazia, armazenagem, despachante e frete interno somam 15% a 25% do custo de importar um carro dos EUA. Entenda cada item.",
  },
  "despachante-aduaneiro-importacao-carro-americano": {
    titulo: "Despachante aduaneiro para importar carro: preço e função",
    descricao:
      "O que faz o despachante aduaneiro na importação de carro dos EUA, quanto cobra, como escolher e se dá para importar sem ele.",
  },
  "icms-importacao-carro-por-estado-brasil-2026": {
    titulo: "ICMS na importação de carro por estado: qual cobra menos",
    descricao:
      "O ICMS na importação de carro vai de 12% a 20% conforme o estado. Calculado por dentro, a diferença chega a R$ 60 mil. Veja a tabela.",
  },
  "importacao-veiculos-dobra-2026-carro-americano": {
    titulo: "Importação de veículos dobrou em 2026: o que muda para você",
    descricao:
      "A importação de veículos subiu 114% no início de 2026, mas a maior parte veio da China. Veja por que muda pouco para quem traz um carro dos EUA.",
  },
  "imposto-importacao-eletricos-hibridos-35-2026": {
    titulo: "Imposto de importação de elétricos e híbridos: 35% em 2026",
    descricao:
      "Desde julho de 2026, elétricos e híbridos importados pagam 35% de imposto de importação, como os a combustão. Veja o impacto no custo.",
  },
  "mustang-camaro-f100-qual-classico-americano-valoriza-mais-brasil": {
    titulo: "Mustang, F-100 ou Camaro: qual clássico valoriza mais",
    descricao:
      "Mustang, F-100, Camaro, C10 e Charger comparados por custo de importação, liquidez e valorização no mercado brasileiro de clássicos.",
  },
  "negociacao-tarifas-eua-brasil-carros-2026": {
    titulo: "EUA pedem corte no imposto de carros: o que muda no Brasil",
    descricao:
      "Os EUA pediram ao Brasil reduzir o imposto de 35% sobre carros americanos. Entenda o pedido, por que travou e o que muda para quem importa.",
  },
  "quanto-tempo-leva-importar-carro-eua-brasil-2026": {
    titulo: "Quanto tempo leva importar um carro dos EUA em 2026",
    descricao:
      "Importar um carro dos EUA leva de 90 a 150 dias. Veja o prazo de cada etapa: compra, frete marítimo, desembaraço e emplacamento.",
  },
  "roro-ou-conteiner-importar-carro-eua-brasil": {
    titulo: "RoRo ou contêiner para importar carro dos EUA: qual escolher",
    descricao:
      "Como o frete entra na base dos impostos, cada R$ 1 a mais vira R$ 2,28 no custo final. Veja quando vale RoRo e quando vale contêiner.",
  },
};
