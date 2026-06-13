// Server Component — sem "use client"
// Injeta o JSON-LD no HTML estático gerado pelo servidor (melhor para rich results do Google)

const FAQ_SCHEMA = [
  {
    "@type": "Question",
    name: "Quanto custa importar um carro dos EUA para o Brasil?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "O custo total inclui o preço do veículo (FOB), frete marítimo (aproximadamente USD 1.500–2.500), Imposto de Importação (35% do FOB), IPI (18,81%), PIS (2,62%), COFINS (12,57%), ICMS (12–20% dependendo do estado) e despesas de desembaraço aduaneiro (~USD 3.000). A carga tributária total costuma superar 100% do valor do veículo nos EUA.",
    },
  },
  {
    "@type": "Question",
    name: "Qual é o ICMS para importação de veículos por estado?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "O ICMS varia por estado de destino: São Paulo (SP), Minas Gerais (MG), Santa Catarina (SC), Rio Grande do Sul (RS) e Paraná (PR) cobram 12%. Rio de Janeiro (RJ) cobra 20%. Os demais estados cobram 17%. O ICMS é calculado por dentro sobre a base total já com os demais impostos.",
    },
  },
  {
    "@type": "Question",
    name: "Carros clássicos americanos pagam menos imposto no Brasil?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Veículos com mais de 30 anos são considerados clássicos e podem ter tratamento aduaneiro diferenciado dependendo da classificação fiscal (NCM). Alguns podem ser elegíveis a benefícios específicos, mas isso depende do modelo e da situação de cada veículo. Consulte sempre um despachante aduaneiro habilitado antes de tomar qualquer decisão.",
    },
  },
  {
    "@type": "Question",
    name: "Como funciona a calculadora de importação?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Basta colar o link de um anúncio do Cars.com ou inserir o preço do veículo manualmente. A calculadora busca os dados do anúncio, aplica as alíquotas tributárias vigentes e exibe o custo total internado no Brasil em reais, usando a cotação PTAX do Banco Central do Brasil atualizada.",
    },
  },
  {
    "@type": "Question",
    name: "O que é o valor aduaneiro (CIF)?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "O valor aduaneiro, também chamado CIF (Cost, Insurance and Freight), é a base legal de cálculo dos impostos de importação no Brasil. Ele é composto pelo preço do veículo (FOB) + frete marítimo + seguro marítimo (1,5% do FOB). Todos os impostos federais (II, IPI, PIS, COFINS) são calculados sobre esse valor.",
    },
  },
  {
    "@type": "Question",
    name: "Preciso de um despachante aduaneiro para importar um carro?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Sim. A legislação brasileira exige a participação de um despachante aduaneiro habilitado pela Receita Federal para realizar o desembaraço aduaneiro de veículos importados. Os honorários do despachante já estão incluídos nas estimativas desta calculadora (aproximadamente USD 1.500).",
    },
  },
];

export function JsonLd() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculadora de Importação de Carros EUA → Brasil",
    url: "https://www.carroimportado.com/",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    description:
      "Calcule o custo total de importar um carro dos Estados Unidos para o Brasil, incluindo II, IPI, PIS, COFINS e ICMS por estado de destino.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SCHEMA,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
