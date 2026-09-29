// URL de busca do Cars.com num lugar só, para dar para acrescentar parâmetros
// de afiliado depois sem caçar links pelo código.
//
// Formato conferido com buscas reais: `makes[]` é a marca em minúsculas e
// `models[]` é "{marca}-{modelo}" com espaços e hífens virando "_"
// (ford-f_150, tesla-model_3, chevrolet-silverado_1500). Não dá para derivar
// do nome exibido: o BMW "330i" é `bmw-330` (`bmw-330i` retorna zero anúncios)
// e o Wrangler Unlimited é um modelo à parte (`jeep-wrangler_unlimited`).
// Por isso os slugs ficam salvos em cada carro de app/data/carros.json.

const BUSCA_CARS_COM = "https://www.cars.com/shopping/results/";

// Vazio por enquanto; é aqui que entram os parâmetros de afiliado.
const PARAMETROS_AFILIADO: Readonly<Record<string, string>> = {};

interface FiltroBusca {
  marca: string;
  modelo: string;
  ano: number;
}

/** Busca de usados daquele modelo e ano no país inteiro. */
export function urlBuscaCarsCom({ marca, modelo, ano }: FiltroBusca): string {
  const params = new URLSearchParams({
    stock_type: "used",
    "makes[]": marca,
    "models[]": modelo,
    year_min: String(ano),
    year_max: String(ano),
    // Sem isto o Cars.com limita a busca a um raio em volta de um CEP.
    maximum_distance: "all",
    ...PARAMETROS_AFILIADO,
  });
  return `${BUSCA_CARS_COM}?${params.toString()}`;
}
