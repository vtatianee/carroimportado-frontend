"use client";

import { useState } from "react";
import { ALTURA_MAPA, CONTORNOS, LARGURA_MAPA } from "../../lib/jogo/mapa-eua";
import { estadoPorSigla, ondeFica } from "../../lib/jogo/estados";

// Tons de terra de foto de satélite: deserto, cerrado, mata, solo exposto.
const TONS_TERRA = ["#8a6f4a", "#6e7447", "#9b8158", "#5c6a42", "#7f6446", "#a08a60"];
// Os mesmos tons ~28% mais escuros, para estados que não dá para jogar agora.
// (Transparência misturaria com o azul do oceano e deixaria tudo cinza.)
const TONS_TERRA_APAGADOS = ["#635035", "#4f5433", "#705d3f", "#424c30", "#5b4832", "#736345"];

// No celular o mapa tem ~340px de largura e Rhode Island fica com ~5px:
// estes ganham botões próprios abaixo do mapa.
const ESTADOS_PEQUENOS = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD"];

function tomDeTerra(sigla: string, apagado: boolean): string {
  const tons = apagado ? TONS_TERRA_APAGADOS : TONS_TERRA;
  return tons[(sigla.charCodeAt(0) * 7 + sigla.charCodeAt(1)) % tons.length];
}

interface Props {
  /** Estados que têm pelo menos um carro na base. */
  comCarro: ReadonlySet<string>;
  /** Estados que podem ser jogados agora (no desafio diário, só o do dia). */
  clicaveis: ReadonlySet<string>;
  /** Estado do desafio de hoje, com marcador pulsante. */
  destaque: string | null;
  onJogar: (sigla: string) => void;
}

export default function MapaEUA({ comCarro, clicaveis, destaque, onJogar }: Props) {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const contornoSel = selecionado ? CONTORNOS.find((c) => c.sigla === selecionado) : undefined;
  const estadoSel = selecionado ? estadoPorSigla(selecionado) : undefined;
  const podeJogar = selecionado !== null && clicaveis.has(selecionado);

  function tocar(sigla: string) {
    // Segundo toque no mesmo estado jogável = confirmar, como o botão do painel.
    if (sigla === selecionado && clicaveis.has(sigla)) onJogar(sigla);
    else setSelecionado(sigla);
  }

  let situacao = "";
  if (selecionado && estadoSel) {
    if (podeJogar) situacao = "Tem carro à venda aqui.";
    else if (comCarro.has(selecionado))
      situacao = destaque
        ? `Hoje o desafio diário está ${ondeFica(destaque)}. Jogue este no modo treino.`
        : "Disponível no modo treino.";
    else situacao = `Em breve — ainda não temos carro ${ondeFica(selecionado)}.`;
  }

  // Rótulo com o nome em HTML sobre o SVG: fica legível em qualquer tamanho de
  // tela, enquanto texto dentro do SVG encolheria junto com o mapa.
  let rotulo: { left: string; top: string; transform: string } | null = null;
  if (contornoSel) {
    const x = contornoSel.cx / LARGURA_MAPA;
    const y = contornoSel.cy / ALTURA_MAPA;
    const tx = x > 0.82 ? "-100%" : x < 0.18 ? "0%" : "-50%";
    const ty = y < 0.2 ? "40%" : "-140%";
    rotulo = { left: `${x * 100}%`, top: `${y * 100}%`, transform: `translate(${tx}, ${ty})` };
  }

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden bg-[#070d18]">
        <svg
          viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`}
          className="block w-full h-auto select-none"
          // manipulation: sem zoom por toque duplo nem atraso de 300ms no tap
          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          role="group"
          aria-label="Mapa dos Estados Unidos"
        >
          <defs>
            <radialGradient id="mapa-oceano" cx="55%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#15294a" />
              <stop offset="100%" stopColor="#060b16" />
            </radialGradient>
            {/* Halo de água rasa ao longo do litoral */}
            <filter id="mapa-costa" x="-5%" y="-5%" width="110%" height="110%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="expandido" />
              <feGaussianBlur in="expandido" stdDeviation="5" result="borrado" />
              <feFlood floodColor="#38bdf8" floodOpacity="0.3" />
              <feComposite in2="borrado" operator="in" />
            </filter>
            {/* Textura de relevo: manchas de ruído só onde há terra */}
            <filter id="mapa-relevo" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="4" result="ruido" />
              <feColorMatrix
                in="ruido"
                type="matrix"
                values="0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 0 0.05  -1.6 0 0 0 0.95"
                result="manchas"
              />
              <feComposite in="manchas" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>

          <rect width={LARGURA_MAPA} height={ALTURA_MAPA} fill="url(#mapa-oceano)" />
          <use href="#mapa-terra" filter="url(#mapa-costa)" pointerEvents="none" />

          <g id="mapa-terra">
            {CONTORNOS.map((c) => {
              const nome = estadoPorSigla(c.sigla)?.nome ?? c.sigla;
              const clicavel = clicaveis.has(c.sigla);
              return (
                <path
                  key={c.sigla}
                  d={c.d}
                  fill={tomDeTerra(c.sigla, !clicavel)}
                  stroke="#f3e7c9"
                  strokeOpacity={0.9}
                  strokeWidth={1}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  role="button"
                  tabIndex={clicavel ? 0 : -1}
                  aria-pressed={selecionado === c.sigla}
                  aria-label={clicavel ? `${nome}: tem carro` : nome}
                  onClick={() => tocar(c.sigla)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      tocar(c.sigla);
                    }
                  }}
                  className="cursor-pointer outline-none hover:stroke-white focus-visible:stroke-orange-400"
                >
                  <title>{nome}</title>
                </path>
              );
            })}
          </g>

          <use href="#mapa-terra" filter="url(#mapa-relevo)" pointerEvents="none" />

          {contornoSel && (
            <path
              d={contornoSel.d}
              fill="#fbbf24"
              fillOpacity={0.18}
              stroke="#fb923c"
              strokeWidth={3}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}

          {CONTORNOS.filter((c) => clicaveis.has(c.sigla)).map((c) => (
            <g key={c.sigla} pointerEvents="none">
              {c.sigla === destaque && (
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={12}
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                  className="motion-safe:animate-ping"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={11}
                fill="#ffffff"
                stroke="#ea580c"
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {rotulo && estadoSel && (
          <div
            className="absolute pointer-events-none whitespace-nowrap bg-slate-950/90 text-white text-sm font-semibold px-2.5 py-1 rounded-lg shadow-lg ring-1 ring-orange-400/60"
            style={rotulo}
          >
            {estadoSel.nome}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Estados pequenos">
        <span className="text-xs text-slate-500 mr-1">Estados pequenos:</span>
        {ESTADOS_PEQUENOS.map((sigla) => {
          const ativo = selecionado === sigla;
          const clicavel = clicaveis.has(sigla);
          return (
            <button
              key={sigla}
              type="button"
              onClick={() => tocar(sigla)}
              aria-pressed={ativo}
              aria-label={estadoPorSigla(sigla)?.nome ?? sigla}
              className={`min-w-11 h-9 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                ativo
                  ? "bg-orange-500 text-white"
                  : clicavel
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {sigla}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-3 min-h-16">
        {estadoSel ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="font-bold text-slate-900">📍 {estadoSel.nome}</p>
              <p className="text-xs text-slate-500">{situacao}</p>
            </div>
            {podeJogar && selecionado && (
              <button
                type="button"
                onClick={() => onJogar(selecionado)}
                className="shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Ver o carro →
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center pt-2">
            Toque num estado para ver o nome. Os marcados com um ponto têm carro.
          </p>
        )}
      </div>
    </div>
  );
}
