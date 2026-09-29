// Eventos registrados no backend (logs do Railway), não no Vercel Analytics:
// no plano Hobby da Vercel os eventos customizados de track() são descartados.
export interface EventoVerAnuncios {
  nome: "jogo_ver_anuncios";
  modo: "diario" | "treino";
  carroId: string;
  estado: string;
}

/** Dispara e esquece: falha de log nunca pode atrapalhar o clique do jogador. */
export function registrarEvento(evento: EventoVerAnuncios): void {
  try {
    fetch("/jogo/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
      // keepalive: a requisição termina mesmo se a aba for fechada logo em seguida.
      keepalive: true,
    }).catch(() => {});
  } catch {
    // fetch indisponível: ignora
  }
}
