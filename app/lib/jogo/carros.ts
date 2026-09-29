import dados from "../../data/carros.json";
import { fotoUtilizavel } from "./foto";

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
  /** Slugs da busca do Cars.com (ver lib/jogo/cars-com.ts). Sem eles, não há botão de anúncios. */
  carsCom?: { marca: string; modelo: string };
}

// TODO(fotos reais): `fotoUrl` em app/data/carros.json hoje aponta para a
// silhueta genérica (FOTO_PLACEHOLDER). Troque pela URL da foto do anúncio
// real (hotlink, sem baixar) e mude `fonte` para a origem (ex: "cars.com") —
// o selo "Anúncio de exemplo" da CartaCarro some sozinho quando `fonte`
// deixa de ser "exemplo".
//
// Carro sem foto utilizável não entra no jogo: todo carro exibido tem imagem.
export const CARROS: readonly Carro[] = dados.filter((c) => fotoUtilizavel(c.fotoUrl));

export const ESTADOS_COM_CARRO: ReadonlySet<string> = new Set(CARROS.map((c) => c.estado));

export function carrosDoEstado(sigla: string): Carro[] {
  return CARROS.filter((c) => c.estado === sigla);
}

export function carroPorId(id: string): Carro | undefined {
  return CARROS.find((c) => c.id === id);
}
