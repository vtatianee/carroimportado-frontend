// O "dia" do desafio vira à meia-noite de Brasília para todo mundo — sem isso,
// dois jogadores em fusos diferentes veriam carros diferentes na mesma hora.
const FORMATO_DATA = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Data de hoje em Brasília, no formato yyyy-mm-dd. */
export function dataHoje(agora: Date = new Date()): string {
  const partes = FORMATO_DATA.formatToParts(agora);
  const parte = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((p) => p.type === tipo)?.value ?? "";
  return `${parte("year")}-${parte("month")}-${parte("day")}`;
}

/** Dia anterior a uma data yyyy-mm-dd (aritmética de calendário, sem fuso). */
export function diaAnterior(data: string): string {
  const d = new Date(`${data}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// FNV-1a 32 bits: determinístico e espalha bem datas consecutivas, que
// diferem só no último caractere.
function hash(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Carro do desafio de uma data — o mesmo para todos os jogadores naquele dia.
 * Adicionar ou remover carros da base muda o sorteio (é hash % total), então
 * faça isso de preferência logo após a meia-noite de Brasília.
 */
export function carroDoDia<T>(carros: readonly T[], data: string): T {
  return carros[hash(data) % carros.length];
}
