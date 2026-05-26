"use client";

import { useState } from "react";

interface Phase {
  id: string;
  icon: string;
  label: string;
  minWeeks: number;
  maxWeeks: number;
  color: string;
  bar: string;
  parallel?: boolean;
  parallelNote?: string;
}

const PHASES: Phase[] = [
  {
    id: "pesquisa",
    icon: "🔍",
    label: "Pesquisa e verificação",
    minWeeks: 1,
    maxWeeks: 4,
    color: "text-blue-700",
    bar: "bg-blue-400",
  },
  {
    id: "compra",
    icon: "📄",
    label: "Compra e exportação (EUA)",
    minWeeks: 1,
    maxWeeks: 2,
    color: "text-blue-700",
    bar: "bg-blue-500",
  },
  {
    id: "frete",
    icon: "🚢",
    label: "Frete marítimo",
    minWeeks: 3,
    maxWeeks: 6,
    color: "text-indigo-700",
    bar: "bg-indigo-400",
  },
  {
    id: "licenca",
    icon: "📋",
    label: "Licença de Importação (Siscomex/IBAMA)",
    minWeeks: 2,
    maxWeeks: 4,
    color: "text-violet-700",
    bar: "bg-violet-400",
  },
  {
    id: "desembaraco",
    icon: "🏛",
    label: "Desembaraço aduaneiro",
    minWeeks: 1,
    maxWeeks: 3,
    color: "text-amber-700",
    bar: "bg-amber-400",
  },
  {
    id: "homologacao",
    icon: "🔧",
    label: "Homologação SENATRANS/INMETRO",
    minWeeks: 4,
    maxWeeks: 8,
    color: "text-orange-700",
    bar: "bg-orange-400",
  },
  {
    id: "emplacamento",
    icon: "✅",
    label: "Emplacamento (DETRAN)",
    minWeeks: 1,
    maxWeeks: 2,
    color: "text-green-700",
    bar: "bg-green-400",
  },
];

const TOTAL_MIN = PHASES.reduce((s, p) => s + p.minWeeks, 0); // 13
const TOTAL_MAX = PHASES.reduce((s, p) => s + p.maxWeeks, 0); // 29

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtDateInput(d: Date): string {
  return d.toISOString().split("T")[0];
}

type Scenario = "otimista" | "realista" | "pessimista";

const SCENARIO_LABELS: Record<Scenario, string> = {
  otimista: "Otimista",
  realista: "Realista",
  pessimista: "Pessimista",
};

function getWeeks(phase: Phase, scenario: Scenario): number {
  if (scenario === "otimista") return phase.minWeeks;
  if (scenario === "pessimista") return phase.maxWeeks;
  return Math.ceil((phase.minWeeks + phase.maxWeeks) / 2);
}

export function TimelineClient() {
  const today = new Date();
  const [startDate, setStartDate] = useState(fmtDateInput(today));
  const [scenario, setScenario] = useState<Scenario>("realista");

  const start = new Date(startDate + "T12:00:00");

  // Build phase timeline
  let cursor = new Date(start);
  const phaseTimeline = PHASES.map((phase) => {
    const weeks = getWeeks(phase, scenario);
    const phaseStart = new Date(cursor);
    const phaseEnd = addWeeks(cursor, weeks);
    cursor = new Date(phaseEnd);
    return { phase, weeks, start: phaseStart, end: phaseEnd };
  });

  const totalWeeks = phaseTimeline.reduce((s, p) => s + p.weeks, 0);
  const completionDate = phaseTimeline[phaseTimeline.length - 1].end;

  // For bar widths — proportional to max scenario total
  const maxTotalWeeks = TOTAL_MAX;

  // RADAR parallel: starts same day, lasts 4–12 weeks
  const radarWeeks = scenario === "otimista" ? 4 : scenario === "pessimista" ? 12 : 8;
  const radarEnd = addWeeks(start, radarWeeks);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Data de início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Cenário</label>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
            {(["otimista", "realista", "pessimista"] as Scenario[]).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-3 py-2 font-medium transition-colors ${
                  scenario === s
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {SCENARIO_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RADAR alerta */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2 text-sm">
        <span className="text-amber-500 mt-0.5 shrink-0">⚡</span>
        <div className="text-amber-700">
          <strong>Inicie o RADAR agora</strong> — a habilitação na Receita Federal leva{" "}
          <strong>{scenario === "otimista" ? "~30" : scenario === "pessimista" ? "~90" : "~60"} dias</strong> e corre em paralelo com as primeiras etapas.
          Prazo estimado de aprovação: <strong>{fmtDate(radarEnd)}</strong>.
          Sem RADAR ativo, o desembaraço aduaneiro não pode começar.
        </div>
      </div>

      {/* Fases */}
      <div className="space-y-3 mb-6">
        {phaseTimeline.map(({ phase, weeks, start: ps, end: pe }, i) => {
          const barPct = Math.max(8, Math.round((weeks / maxTotalWeeks) * 100));
          return (
            <div key={phase.id}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base shrink-0">{phase.icon}</span>
                  <span className={`text-sm font-medium truncate ${phase.color}`}>{phase.label}</span>
                </div>
                <span className="text-xs text-slate-500 shrink-0 tabular-nums">
                  {weeks} {weeks === 1 ? "sem." : "sem."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden relative">
                  {/* offset bar to show position in total timeline */}
                  <div
                    className={`h-full ${phase.bar} rounded-md flex items-center px-2`}
                    style={{ width: `${barPct}%` }}
                  >
                    <span className="text-white text-[10px] font-medium whitespace-nowrap overflow-hidden">
                      {weeks > 1 ? `${weeks} sem.` : ""}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 w-44 hidden sm:block">
                  <span className="text-xs text-slate-500 tabular-nums">
                    {fmtDate(ps)} → {fmtDate(pe)}
                  </span>
                </div>
              </div>
              {/* Mobile dates */}
              <div className="text-xs text-slate-400 mt-0.5 sm:hidden">
                {fmtDate(ps)} → {fmtDate(pe)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resultado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">
              Conclusão estimada — cenário {SCENARIO_LABELS[scenario].toLowerCase()}
            </p>
            <p className="text-2xl font-bold">{fmtDate(completionDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs mb-1">Duração total</p>
            <p className="text-xl font-bold">{totalWeeks} semanas</p>
            <p className="text-blue-200 text-xs">({Math.round(totalWeeks / 4.3)} meses)</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-500 flex gap-4 text-xs text-blue-200">
          <span>Otimista: {TOTAL_MIN} sem. (~{Math.round(TOTAL_MIN / 4.3)} meses)</span>
          <span>Pessimista: {TOTAL_MAX} sem. (~{Math.round(TOTAL_MAX / 4.3)} meses)</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-3">
        Estimativas baseadas em prazos típicos do processo. Atrasos burocráticos ou alfandegários podem estender o prazo.
      </p>
    </div>
  );
}
