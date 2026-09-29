"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import BotaoCompartilhar from "./BotaoCompartilhar";
import type { Carro } from "../../lib/jogo/carros";
import { formatarUsd, PONTOS_MAXIMOS } from "../../lib/jogo/pontuacao";
import { textoCompartilhamento } from "../../lib/jogo/compartilhamento";

interface Props {
  carro: Carro;
  palpite: number;
  diferenca: number;
  pontos: number;
  modo: "diario" | "treino";
  sequencia: number;
  melhorSequencia: number;
  onJogarNovamente: () => void;
}

function manchete(pontos: number): string {
  if (pontos === PONTOS_MAXIMOS) return "🎯 Na mosca!";
  if (pontos >= 700) return "🔥 Quase lá!";
  if (pontos > 0) return "👏 Chegou perto!";
  return "😅 Passou longe!";
}

export default function ResultadoRodada({
  carro,
  palpite,
  diferenca,
  pontos,
  modo,
  sequencia,
  melhorSequencia,
  onJogarNovamente,
}: Props) {
  const percentual = Math.round((diferenca / carro.precoReal) * 100);
  const direcao = palpite > carro.precoReal ? "acima" : "abaixo";

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <p className="text-2xl font-bold text-slate-900 text-center">{manchete(pontos)}</p>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">Preço real do {carro.modelo} {carro.ano}</p>
        <p className="text-4xl font-extrabold text-blue-600 tracking-tight">US$ {formatarUsd(carro.precoReal)}</p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 rounded-xl px-2 py-3">
          <dt className="text-xs text-slate-500">Seu palpite</dt>
          <dd className="font-semibold text-slate-900">US$ {formatarUsd(palpite)}</dd>
        </div>
        <div className="bg-slate-50 rounded-xl px-2 py-3">
          <dt className="text-xs text-slate-500">Diferença</dt>
          <dd className="font-semibold text-slate-900">US$ {formatarUsd(diferenca)}</dd>
          {diferenca > 0 && (
            <dd className="text-xs text-slate-500">
              {percentual}% {direcao}
            </dd>
          )}
        </div>
        <div className="bg-blue-50 rounded-xl px-2 py-3">
          <dt className="text-xs text-blue-700">Pontos</dt>
          <dd className="font-bold text-blue-700 text-lg">+{pontos}</dd>
        </div>
      </dl>

      <p className="mt-4 text-center text-sm text-slate-600">
        🔥 Sequência atual: <strong>{sequencia}</strong> · 🏆 Melhor: <strong>{melhorSequencia}</strong>
      </p>

      <div className="mt-5 space-y-3">
        <BotaoCompartilhar
          modo={modo}
          texto={textoCompartilhamento({
            modelo: carro.modelo,
            ano: carro.ano,
            estado: carro.estado,
            diferenca,
            sequencia,
          })}
        />

        <Link
          href={`/?preco=${carro.precoReal}#calculadora`}
          onClick={() => track("cta_calculadora_clique", { modo, preco: carro.precoReal })}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          🧮 Calcular custo de importação
        </Link>
        <p className="-mt-1 text-xs text-center text-slate-500">Quanto esse carro custaria trazido para o Brasil?</p>

        <button
          type="button"
          onClick={onJogarNovamente}
          className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {modo === "diario" ? "🎲 Jogar no modo treino" : "🎲 Jogar novamente"}
        </button>
        {modo === "diario" && (
          <p className="text-xs text-center text-slate-500">Um novo desafio diário sai à meia-noite (horário de Brasília).</p>
        )}
      </div>

      {/* Reservado para o AdSense entre rodadas — ainda sem anúncio. */}
      <div id="ad-slot-jogo" aria-hidden="true" />
    </section>
  );
}
