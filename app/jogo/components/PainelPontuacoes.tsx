import type { Acumulado, EntradaPontuacao } from "../../lib/jogo/historico";
import { PONTOS_BOM_PALPITE, etiquetaDesempenho, formatarUsd } from "../../lib/jogo/pontuacao";

const LIMITE_EXIBIDO = 5;

function dataCurta(ms: number): string {
  return new Date(ms).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const plural = (n: number, um: string, varios: string) => `${n.toLocaleString("pt-BR")} ${n === 1 ? um : varios}`;

interface Props {
  recorde: EntradaPontuacao | null;
  ultimas: readonly EntradaPontuacao[];
  acumulado: Acumulado;
}

export default function PainelPontuacoes({ recorde, ultimas, acumulado }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5" aria-labelledby="titulo-pontuacoes">
      <h2 id="titulo-pontuacoes" className="font-bold text-slate-900 mb-3">
        Suas pontuações
      </h2>

      {!recorde ? (
        <p className="text-sm text-slate-500">Jogue uma rodada e sua pontuação aparece aqui.</p>
      ) : (
        <>
          <div className="rounded-xl bg-blue-600 text-white px-4 py-4 text-center">
            <p className="text-3xl font-extrabold tracking-tight">{acumulado.pontos.toLocaleString("pt-BR")}</p>
            <p className="text-sm text-blue-100">
              pontos acumulados em {plural(acumulado.rodadas, "rodada", "rodadas")}
            </p>
          </div>

          <p className="mt-3 text-sm text-center text-slate-700">
            {acumulado.bonsSeguidos > 0 ? (
              <>
                🔥 <strong>{plural(acumulado.bonsSeguidos, "palpite bom seguido", "palpites bons seguidos")}</strong>
              </>
            ) : (
              <span className="text-slate-500">
                Faça {PONTOS_BOM_PALPITE}+ pontos numa rodada para começar uma sequência de palpites bons.
              </span>
            )}
          </p>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
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
              <li key={e.id} className="flex justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-slate-700">
                    {e.modelo} {e.ano}
                    <span className="ml-2 text-xs text-slate-400">
                      {e.modo === "diario" ? "Diário" : "Treino"} · {dataCurta(e.jogado_em)}
                    </span>
                  </p>
                  {/* Rodadas salvas antes de o ranking guardar palpite e preço ficam sem esta linha. */}
                  {e.palpite !== undefined && e.precoReal !== undefined && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      Você: US$ {formatarUsd(e.palpite)} · Real: US$ {formatarUsd(e.precoReal)} · diferença de US${" "}
                      {formatarUsd(Math.abs(e.palpite - e.precoReal))}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-blue-700">{e.pontos} pts</p>
                  <p className="text-xs text-slate-500 whitespace-nowrap">{etiquetaDesempenho(e.pontos)}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
