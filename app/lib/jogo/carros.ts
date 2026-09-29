import dados from "../../data/carros.json";

export interface Carro {
  id: string;
  modelo: string;
  ano: number;
  milhas: number;
  /** Sigla do estado americano, ex: "TX". */
  estado: string;
  precoReal: number;
  fotoUrl: string;
  /** "exemplo" enquanto os dados forem fictícios; mostra o selo "Anúncio de exemplo". */
  fonte: string;
}

// TODO(fotos reais): `fotoUrl` em app/data/carros.json hoje aponta para
// placeholders do placehold.co. Troque pela URL da foto do anúncio real e
// mude `fonte` para a origem (ex: "cars.com") — o selo "Anúncio de exemplo"
// da CartaCarro some sozinho quando `fonte` deixa de ser "exemplo".
export const CARROS: readonly Carro[] = dados;

export const ESTADOS_COM_CARRO: ReadonlySet<string> = new Set(CARROS.map((c) => c.estado));

export function carrosDoEstado(sigla: string): Carro[] {
  return CARROS.filter((c) => c.estado === sigla);
}

export function carroPorId(id: string): Carro | undefined {
  return CARROS.find((c) => c.id === id);
}
