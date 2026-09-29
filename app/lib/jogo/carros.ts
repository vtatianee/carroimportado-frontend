import dados from "../../data/carros.json";
import { fotoUtilizavel } from "./foto";

export interface Carro {
  id: string;
  modelo: string;
  ano: number;
  /** null quando o anúncio não informa. */
  milhas: number | null;
  /** Sigla do estado americano, ex: "TX". */
  estado: string;
  precoReal: number;
  fotoUrl: string;
  /** "exemplo" nos fictícios (mostra o selo "Anúncio de exemplo"); "cars.com" nos importados. */
  fonte: string;
  /** Slugs da busca do Cars.com (ver lib/jogo/cars-com.ts), usados pelos exemplos. */
  carsCom?: { marca: string; modelo: string };
  /** Anúncio real de onde o carro veio; tem prioridade sobre a busca por modelo. */
  urlAnuncio?: string;
  /** Data (yyyy-mm-dd, UTC) em que o anúncio entrou na base — ver elegiveisParaODia. */
  importadoEm?: string;
}

// Os 12 carros fictícios de app/data/carros.json, com a silhueta genérica no
// lugar da foto. O jogo só usa estes quando a base de anúncios reais do
// backend está vazia (ver carros-servidor.ts).
//
// Carro sem foto utilizável não entra no jogo: todo carro exibido tem imagem.
export const CARROS_EXEMPLO: readonly Carro[] = dados.filter((c) => fotoUtilizavel(c.fotoUrl));

export function estadosComCarro(carros: readonly Carro[]): ReadonlySet<string> {
  return new Set(carros.map((c) => c.estado));
}

export function carrosDoEstado(carros: readonly Carro[], sigla: string): Carro[] {
  return carros.filter((c) => c.estado === sigla);
}

export function carroPorId(carros: readonly Carro[], id: string): Carro | undefined {
  return carros.find((c) => c.id === id);
}
