/**
 * Formatação de datas de post.
 *
 * O problema que isto resolve: `new Date("2026-07-30")` é interpretado como
 * meia-noite UTC. Ao renderizar em qualquer fuso a oeste de Greenwich — o que
 * inclui todo o Brasil (UTC-3) — o resultado volta um dia e o post aparece
 * como 29 de julho.
 *
 * A correção é ancorar ao meio-dia local: `new Date("2026-07-30T12:00:00")`
 * usa o fuso local em vez de UTC, e o meio-dia dá 12h de folga em cada direção,
 * o que sobrevive a qualquer mudança de horário de verão.
 *
 * As datas do blog são dias de calendário, não instantes — não faz sentido
 * elas mudarem conforme quem lê.
 */

/** "2026-07-30" -> Date ancorada ao meio-dia local */
export function parsePostDate(isoDay: string): Date {
  return new Date(`${isoDay}T12:00:00`);
}

/** "2026-07-30" -> "30 de julho de 2026" */
export function formatPostDate(isoDay: string): string {
  return parsePostDate(isoDay).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
