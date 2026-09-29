"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import NavHeader from "../components/NavHeader";
import MapaEUA from "./components/MapaEUA";
import CartaCarro from "./components/CartaCarro";
import PalpitePreco from "./components/PalpitePreco";
import ResultadoRodada from "./components/ResultadoRodada";
import PainelPontuacoes from "./components/PainelPontuacoes";
import { CARROS, ESTADOS_COM_CARRO, carroPorId, carrosDoEstado, type Carro } from "../lib/jogo/carros";
import { ondeFica } from "../lib/jogo/estados";
import { carroDoDia, dataHoje } from "../lib/jogo/desafio-diario";
import { calcularDiferenca, calcularPontos } from "../lib/jogo/pontuacao";
import {
  assinarHistorico,
  assinarRecorde,
  interpretarHistorico,
  interpretarRecorde,
  lerHistoricoBruto,
  lerRecordeBruto,
  registrarPontuacao,
  salvarPontuacao,
} from "../lib/jogo/historico";
import {
  assinarProgresso,
  interpretarProgresso,
  lerProgressoBruto,
  registrarConclusaoDiaria,
  salvarProgresso,
  sequenciaVigente,
} from "../lib/jogo/progresso";

type Modo = "diario" | "treino";

interface Rodada {
  modo: Modo;
  carro: Carro;
}

interface Palpite {
  palpite: number;
  diferenca: number;
  pontos: number;
  novoRecorde: boolean;
}

const semAssinatura = () => () => {};
const nadaNoServidor = () => null;
const NENHUM: ReadonlySet<string> = new Set();

export default function JogoClient() {
  const [modo, setModo] = useState<Modo>("diario");
  const [rodada, setRodada] = useState<Rodada | null>(null);
  const [resultado, setResultado] = useState<Palpite | null>(null);

  // A página é pré-renderizada no build: data e localStorage só existem no
  // navegador. Com o snapshot do servidor = null, o HTML inicial é o mesmo
  // para todos e o dado real entra logo após a hidratação.
  const hoje = useSyncExternalStore(semAssinatura, dataHoje, nadaNoServidor);
  const progressoBruto = useSyncExternalStore(assinarProgresso, lerProgressoBruto, nadaNoServidor);
  const progresso = useMemo(() => interpretarProgresso(progressoBruto), [progressoBruto]);
  const historicoBruto = useSyncExternalStore(assinarHistorico, lerHistoricoBruto, nadaNoServidor);
  const ultimas = useMemo(() => interpretarHistorico(historicoBruto), [historicoBruto]);
  const recordeBruto = useSyncExternalStore(assinarRecorde, lerRecordeBruto, nadaNoServidor);
  const recorde = useMemo(() => interpretarRecorde(recordeBruto), [recordeBruto]);

  const carroHoje = hoje ? carroDoDia(CARROS, hoje) : null;
  const sequencia = hoje ? sequenciaVigente(progresso, hoje) : 0;
  const salvoHoje = hoje && progresso.diario?.data === hoje ? progresso.diario : null;
  const carroSalvoHoje = salvoHoje ? carroPorId(salvoHoje.carroId) : undefined;

  const clicaveis = useMemo<ReadonlySet<string>>(() => {
    if (modo === "treino") return ESTADOS_COM_CARRO;
    return carroHoje ? new Set([carroHoje.estado]) : NENHUM;
  }, [modo, carroHoje]);

  function trocarModo(novo: Modo) {
    setModo(novo);
    setRodada(null);
    setResultado(null);
  }

  function selecionarEstado(sigla: string) {
    let carro: Carro | undefined;
    if (modo === "diario") {
      if (carroHoje?.estado !== sigla) return;
      carro = carroHoje;
    } else {
      const opcoes = carrosDoEstado(sigla);
      carro = opcoes[Math.floor(Math.random() * opcoes.length)];
    }
    if (!carro) return;
    setRodada({ modo, carro });
    setResultado(null);
    track("jogo_iniciado", { modo, estado: sigla });
  }

  function enviarPalpite(palpite: number) {
    if (!rodada) return;
    const diferenca = calcularDiferenca(palpite, rodada.carro.precoReal);
    const pontos = calcularPontos(diferenca, rodada.carro.precoReal);
    const agora = Date.now();
    const registro = registrarPontuacao(ultimas, recorde, {
      id: String(agora),
      pontos,
      modelo: rodada.carro.modelo,
      ano: rodada.carro.ano,
      estado: rodada.carro.estado,
      modo: rodada.modo,
      jogado_em: agora,
    });
    salvarPontuacao(registro);
    setResultado({ palpite, diferenca, pontos, novoRecorde: registro.novoRecorde });
    track("palpite_enviado", { modo: rodada.modo, diferenca, pontos });

    if (rodada.modo === "diario" && hoje) {
      salvarProgresso(
        registrarConclusaoDiaria(progresso, { data: hoje, carroId: rodada.carro.id, palpite, diferenca, pontos }),
      );
    }
  }

  function jogarNovamente() {
    if (modo === "diario") trocarModo("treino");
    else {
      setRodada(null);
      setResultado(null);
    }
  }

  let conteudo: React.ReactNode;
  if (rodada && resultado) {
    conteudo = (
      <ResultadoRodada
        carro={rodada.carro}
        {...resultado}
        modo={rodada.modo}
        sequencia={sequencia}
        melhorSequencia={progresso.melhor}
        onJogarNovamente={jogarNovamente}
      />
    );
  } else if (rodada) {
    conteudo = (
      <div className="space-y-4">
        <CartaCarro carro={rodada.carro} />
        <PalpitePreco onEnviar={enviarPalpite} />
        <button
          type="button"
          onClick={() => setRodada(null)}
          className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 cursor-pointer"
        >
          ← Voltar ao mapa
        </button>
      </div>
    );
  } else if (modo === "diario" && salvoHoje && carroSalvoHoje) {
    // Desafio de hoje já feito (inclusive após recarregar): mostra o resultado
    // salvo em vez de deixar jogar de novo.
    conteudo = (
      <ResultadoRodada
        carro={carroSalvoHoje}
        palpite={salvoHoje.palpite}
        diferenca={salvoHoje.diferenca}
        pontos={salvoHoje.pontos}
        novoRecorde={false}
        modo="diario"
        sequencia={sequencia}
        melhorSequencia={progresso.melhor}
        onJogarNovamente={jogarNovamente}
      />
    );
  } else {
    conteudo = (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-6">
        <p className="text-sm text-slate-700 text-center mb-3 px-2">
          {modo === "treino"
            ? "Escolha um estado marcado com um ponto para ver um carro à venda lá."
            : carroHoje
              ? `O carro de hoje está ${ondeFica(carroHoje.estado)}. Toque no estado marcado.`
              : "Carregando o desafio de hoje…"}
        </p>
        {/* key={modo}: trocar de modo limpa o estado selecionado no mapa */}
        <MapaEUA
          key={modo}
          comCarro={ESTADOS_COM_CARRO}
          clicaveis={clicaveis}
          destaque={modo === "diario" ? (carroHoje?.estado ?? null) : null}
          onJogar={selecionarEstado}
        />
      </section>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavHeader />

      <main className="max-w-2xl w-full mx-auto px-4 py-6 sm:py-10 flex-1 space-y-5">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">🗺️ Adivinhe o Preço</h1>
          <p className="text-slate-600 mt-1">Escolha um estado, veja o carro e chute quanto ele custa nos EUA.</p>
          <p className="text-sm text-slate-500 mt-2">
            🔥 Sequência: <strong>{hoje ? sequencia : "–"}</strong> · Melhor sequência:{" "}
            <strong>{hoje ? progresso.melhor : "–"}</strong>
          </p>
        </header>

        <div className="flex gap-1 bg-slate-100 rounded-xl p-1" role="group" aria-label="Modo de jogo">
          {(
            [
              ["diario", "📅 Desafio diário"],
              ["treino", "🎲 Treino livre"],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              aria-pressed={modo === valor}
              onClick={() => trocarModo(valor)}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                modo === valor ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>

        {conteudo}

        {/* Some durante o palpite (para não distrair) e antes de hidratar
            (o histórico só existe no navegador). */}
        {hoje && !(rodada && !resultado) && <PainelPontuacoes recorde={recorde} ultimas={ultimas} />}

        <footer className="text-center text-xs text-slate-500 pt-4 space-y-1.5">
          <p>Pontos: até 1.000, descontando o quanto o seu palpite errou em percentual (errou 10% = 900 pontos).</p>
          <p>Carros e preços de exemplo, só para diversão — não são ofertas de venda.</p>
          <p>
            <Link href="/" className="underline hover:text-slate-700">
              Calculadora de importação
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
