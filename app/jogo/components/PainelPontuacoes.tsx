import type { EntradaPontuacao } from "../../lib/jogo/historico";

const LIMITE_EXIBIDO = 5;

function dataCurta(ms: number): string {
  return new Date(ms).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

interface Props {
  recorde: EntradaPontuacao | null;
  ultimas: readonly EntradaPontuacao[];
}

export default function PainelPontuacoes({ recorde, ultimas }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5" aria-labelledby="titulo-pontuacoes">
      <h2 id="titulo-pontuacoes" className="font-bold text-slate-900 mb-3">
        Suas pontuações
      </h2>

      {!recorde ? (
        <p className="text-sm text-slate-500">Jogue uma rodada e sua pontuação aparece aqui.</p>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <span className="text-2xl" aria-hidden="true">
              🏆
            </span>
            <div className="min-w-0">
              <p className="text-xs text-amber-800 font-semibold uppercase tracking-wide">Recorde</p>
              <p className="font-bold text-slate-900">
                {recorde.pontos} pontos{" "}
                <span className="font-normal text-slate-600 text-sm">
                  · {recorde.modelo} {recorde.ano} · {dataCurta(recorde.jogado_em)}
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-4 mb-2">Últimas rodadas</h3>
          <ol className="divide-y divide-slate-100">
            {ultimas.slice(0, LIMITE_EXIBIDO).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate text-slate-700">
                  {e.modelo} {e.ano}
                  <span className="ml-2 text-xs text-slate-400">
                    {e.modo === "diario" ? "Diário" : "Treino"} · {dataCurta(e.jogado_em)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-blue-700">{e.pontos} pts</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
