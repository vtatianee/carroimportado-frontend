export interface EstadoEUA {
  sigla: string;
  nome: string;
  /** Preposição em pt-BR: "no Texas", "na Flórida", "em Nova York". */
  prep: "no" | "na" | "em";
  /** Posição no mapa em grade (tile map). */
  col: number;
  lin: number;
}

// Mapa em grade (um quadrado por estado, mesmo tamanho para todos) em vez de
// contorno geográfico: no celular, Rhode Island ou Delaware geográficos teriam
// poucos pixels e seriam impossíveis de tocar. Layout baseado no tile map da NPR.
export const ESTADOS: readonly EstadoEUA[] = [
  { sigla: "AK", nome: "Alasca", prep: "no", col: 0, lin: 0 },
  { sigla: "ME", nome: "Maine", prep: "no", col: 10, lin: 0 },

  { sigla: "VT", nome: "Vermont", prep: "em", col: 9, lin: 1 },
  { sigla: "NH", nome: "New Hampshire", prep: "em", col: 10, lin: 1 },

  { sigla: "WA", nome: "Washington", prep: "em", col: 0, lin: 2 },
  { sigla: "ID", nome: "Idaho", prep: "em", col: 1, lin: 2 },
  { sigla: "MT", nome: "Montana", prep: "em", col: 2, lin: 2 },
  { sigla: "ND", nome: "Dakota do Norte", prep: "na", col: 3, lin: 2 },
  { sigla: "MN", nome: "Minnesota", prep: "em", col: 4, lin: 2 },
  { sigla: "IL", nome: "Illinois", prep: "em", col: 5, lin: 2 },
  { sigla: "WI", nome: "Wisconsin", prep: "em", col: 6, lin: 2 },
  { sigla: "MI", nome: "Michigan", prep: "em", col: 7, lin: 2 },
  { sigla: "NY", nome: "Nova York", prep: "em", col: 8, lin: 2 },
  { sigla: "RI", nome: "Rhode Island", prep: "em", col: 9, lin: 2 },
  { sigla: "MA", nome: "Massachusetts", prep: "em", col: 10, lin: 2 },

  { sigla: "OR", nome: "Oregon", prep: "no", col: 0, lin: 3 },
  { sigla: "NV", nome: "Nevada", prep: "em", col: 1, lin: 3 },
  { sigla: "WY", nome: "Wyoming", prep: "em", col: 2, lin: 3 },
  { sigla: "SD", nome: "Dakota do Sul", prep: "na", col: 3, lin: 3 },
  { sigla: "IA", nome: "Iowa", prep: "em", col: 4, lin: 3 },
  { sigla: "IN", nome: "Indiana", prep: "em", col: 5, lin: 3 },
  { sigla: "OH", nome: "Ohio", prep: "em", col: 6, lin: 3 },
  { sigla: "PA", nome: "Pensilvânia", prep: "na", col: 7, lin: 3 },
  { sigla: "NJ", nome: "Nova Jersey", prep: "em", col: 8, lin: 3 },
  { sigla: "CT", nome: "Connecticut", prep: "em", col: 9, lin: 3 },

  { sigla: "CA", nome: "Califórnia", prep: "na", col: 0, lin: 4 },
  { sigla: "UT", nome: "Utah", prep: "em", col: 1, lin: 4 },
  { sigla: "CO", nome: "Colorado", prep: "no", col: 2, lin: 4 },
  { sigla: "NE", nome: "Nebraska", prep: "em", col: 3, lin: 4 },
  { sigla: "MO", nome: "Missouri", prep: "no", col: 4, lin: 4 },
  { sigla: "KY", nome: "Kentucky", prep: "no", col: 5, lin: 4 },
  { sigla: "WV", nome: "Virgínia Ocidental", prep: "na", col: 6, lin: 4 },
  { sigla: "VA", nome: "Virgínia", prep: "na", col: 7, lin: 4 },
  { sigla: "MD", nome: "Maryland", prep: "em", col: 8, lin: 4 },
  { sigla: "DE", nome: "Delaware", prep: "em", col: 9, lin: 4 },

  { sigla: "AZ", nome: "Arizona", prep: "no", col: 1, lin: 5 },
  { sigla: "NM", nome: "Novo México", prep: "no", col: 2, lin: 5 },
  { sigla: "KS", nome: "Kansas", prep: "no", col: 3, lin: 5 },
  { sigla: "AR", nome: "Arkansas", prep: "no", col: 4, lin: 5 },
  { sigla: "TN", nome: "Tennessee", prep: "no", col: 5, lin: 5 },
  { sigla: "NC", nome: "Carolina do Norte", prep: "na", col: 6, lin: 5 },
  { sigla: "SC", nome: "Carolina do Sul", prep: "na", col: 7, lin: 5 },

  { sigla: "OK", nome: "Oklahoma", prep: "em", col: 3, lin: 6 },
  { sigla: "LA", nome: "Luisiana", prep: "na", col: 4, lin: 6 },
  { sigla: "MS", nome: "Mississippi", prep: "no", col: 5, lin: 6 },
  { sigla: "AL", nome: "Alabama", prep: "no", col: 6, lin: 6 },
  { sigla: "GA", nome: "Geórgia", prep: "na", col: 7, lin: 6 },

  { sigla: "HI", nome: "Havaí", prep: "no", col: 0, lin: 7 },
  { sigla: "TX", nome: "Texas", prep: "no", col: 3, lin: 7 },
  { sigla: "FL", nome: "Flórida", prep: "na", col: 8, lin: 7 },
];

export const COLUNAS_MAPA = 11;
export const LINHAS_MAPA = 8;

const POR_SIGLA = new Map(ESTADOS.map((e) => [e.sigla, e]));

export function estadoPorSigla(sigla: string): EstadoEUA | undefined {
  return POR_SIGLA.get(sigla);
}

/** "no Texas", "na Flórida" — cai em "em {sigla}" se a sigla não existir. */
export function ondeFica(sigla: string): string {
  const e = POR_SIGLA.get(sigla);
  return e ? `${e.prep} ${e.nome}` : `em ${sigla}`;
}
