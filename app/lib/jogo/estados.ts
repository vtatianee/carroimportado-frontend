export interface EstadoEUA {
  sigla: string;
  nome: string;
  /** Preposição em pt-BR: "no Texas", "na Flórida", "em Nova York". */
  prep: "no" | "na" | "em";
}

export const ESTADOS: readonly EstadoEUA[] = [
  { sigla: "AK", nome: "Alasca", prep: "no" },
  { sigla: "ME", nome: "Maine", prep: "no" },

  { sigla: "VT", nome: "Vermont", prep: "em" },
  { sigla: "NH", nome: "New Hampshire", prep: "em" },

  { sigla: "WA", nome: "Washington", prep: "em" },
  { sigla: "ID", nome: "Idaho", prep: "em" },
  { sigla: "MT", nome: "Montana", prep: "em" },
  { sigla: "ND", nome: "Dakota do Norte", prep: "na" },
  { sigla: "MN", nome: "Minnesota", prep: "em" },
  { sigla: "IL", nome: "Illinois", prep: "em" },
  { sigla: "WI", nome: "Wisconsin", prep: "em" },
  { sigla: "MI", nome: "Michigan", prep: "em" },
  { sigla: "NY", nome: "Nova York", prep: "em" },
  { sigla: "RI", nome: "Rhode Island", prep: "em" },
  { sigla: "MA", nome: "Massachusetts", prep: "em" },

  { sigla: "OR", nome: "Oregon", prep: "no" },
  { sigla: "NV", nome: "Nevada", prep: "em" },
  { sigla: "WY", nome: "Wyoming", prep: "em" },
  { sigla: "SD", nome: "Dakota do Sul", prep: "na" },
  { sigla: "IA", nome: "Iowa", prep: "em" },
  { sigla: "IN", nome: "Indiana", prep: "em" },
  { sigla: "OH", nome: "Ohio", prep: "em" },
  { sigla: "PA", nome: "Pensilvânia", prep: "na" },
  { sigla: "NJ", nome: "Nova Jersey", prep: "em" },
  { sigla: "CT", nome: "Connecticut", prep: "em" },

  { sigla: "CA", nome: "Califórnia", prep: "na" },
  { sigla: "UT", nome: "Utah", prep: "em" },
  { sigla: "CO", nome: "Colorado", prep: "no" },
  { sigla: "NE", nome: "Nebraska", prep: "em" },
  { sigla: "MO", nome: "Missouri", prep: "no" },
  { sigla: "KY", nome: "Kentucky", prep: "no" },
  { sigla: "WV", nome: "Virgínia Ocidental", prep: "na" },
  { sigla: "VA", nome: "Virgínia", prep: "na" },
  { sigla: "MD", nome: "Maryland", prep: "em" },
  { sigla: "DE", nome: "Delaware", prep: "em" },

  { sigla: "AZ", nome: "Arizona", prep: "no" },
  { sigla: "NM", nome: "Novo México", prep: "no" },
  { sigla: "KS", nome: "Kansas", prep: "no" },
  { sigla: "AR", nome: "Arkansas", prep: "no" },
  { sigla: "TN", nome: "Tennessee", prep: "no" },
  { sigla: "NC", nome: "Carolina do Norte", prep: "na" },
  { sigla: "SC", nome: "Carolina do Sul", prep: "na" },

  { sigla: "OK", nome: "Oklahoma", prep: "em" },
  { sigla: "LA", nome: "Luisiana", prep: "na" },
  { sigla: "MS", nome: "Mississippi", prep: "no" },
  { sigla: "AL", nome: "Alabama", prep: "no" },
  { sigla: "GA", nome: "Geórgia", prep: "na" },

  { sigla: "HI", nome: "Havaí", prep: "no" },
  { sigla: "TX", nome: "Texas", prep: "no" },
  { sigla: "FL", nome: "Flórida", prep: "na" },
];

const POR_SIGLA = new Map(ESTADOS.map((e) => [e.sigla, e]));

export function estadoPorSigla(sigla: string): EstadoEUA | undefined {
  return POR_SIGLA.get(sigla);
}

/** "no Texas", "na Flórida" — cai em "em {sigla}" se a sigla não existir. */
export function ondeFica(sigla: string): string {
  const e = POR_SIGLA.get(sigla);
  return e ? `${e.prep} ${e.nome}` : `em ${sigla}`;
}
