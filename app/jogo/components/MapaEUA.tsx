"use client";

import { useState } from "react";
import { COLUNAS_MAPA, ESTADOS, LINHAS_MAPA, type EstadoEUA } from "../../lib/jogo/estados";

const CELULA = 48;
const LADO = 45;

interface Props {
  /** Estados que têm pelo menos um carro na base. */
  comCarro: ReadonlySet<string>;
  /** Estados que podem ser tocados agora (no desafio diário, só o do dia). */
  clicaveis: ReadonlySet<string>;
  onSelecionar: (sigla: string) => void;
}

export default function MapaEUA({ comCarro, clicaveis, onSelecionar }: Props) {
  const [aviso, setAviso] = useState<string | null>(null);

  function tocar(e: EstadoEUA) {
    if (clicaveis.has(e.sigla)) {
      setAviso(null);
      onSelecionar(e.sigla);
    } else if (comCarro.has(e.sigla)) {
      setAviso(`${e.nome}: hoje o desafio diário está em outro estado. Jogue este no modo treino.`);
    } else {
      setAviso(`${e.nome}: em breve!`);
    }
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${COLUNAS_MAPA * CELULA} ${LINHAS_MAPA * CELULA}`}
        className="w-full h-auto select-none"
        // manipulation: sem zoom por toque duplo nem atraso de 300ms no tap
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        role="group"
        aria-label="Mapa dos Estados Unidos"
      >
        {ESTADOS.map((e) => {
          const clicavel = clicaveis.has(e.sigla);
          const temCarro = comCarro.has(e.sigla);
          const fundo = clicavel ? "#2563eb" : temCarro ? "#dbeafe" : "#f1f5f9";
          const texto = clicavel ? "#ffffff" : temCarro ? "#1d4ed8" : "#94a3b8";
          const descricao = clicavel
            ? `${e.nome}: ver carro`
            : temCarro
              ? `${e.nome}: disponível no modo treino`
              : `${e.nome}: em breve`;

          return (
            <g
              key={e.sigla}
              transform={`translate(${e.col * CELULA + 1.5} ${e.lin * CELULA + 1.5})`}
              role="button"
              tabIndex={clicavel ? 0 : -1}
              aria-disabled={!clicavel}
              aria-label={descricao}
              onClick={() => tocar(e)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  tocar(e);
                }
              }}
              className={`outline-none ${
                clicavel
                  ? "cursor-pointer [&:hover>rect]:fill-blue-700 [&:focus-visible>rect]:stroke-orange-500"
                  : "cursor-not-allowed"
              }`}
            >
              <title>{clicavel ? e.nome : temCarro ? `${e.nome} — só no modo treino` : `${e.nome} — em breve`}</title>
              <rect width={LADO} height={LADO} rx={7} fill={fundo} stroke="transparent" strokeWidth={3} />
              <text
                x={LADO / 2}
                y={LADO / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={15}
                fontWeight={700}
                fill={texto}
                pointerEvents="none"
              >
                {e.sigla}
              </text>
            </g>
          );
        })}
      </svg>

      <p aria-live="polite" className="min-h-5 mt-2 text-sm text-slate-600 text-center">
        {aviso}
      </p>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-600" /> Toque para jogar
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-100" /> Só no modo treino
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-slate-100 border border-slate-200" /> Em breve
        </li>
      </ul>
    </div>
  );
}
