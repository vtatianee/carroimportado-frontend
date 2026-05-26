"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "carroimportado_checklist_v1";

interface CheckItem {
  id: string;
  label: string;
  note?: string;
}

interface CheckGroup {
  id: string;
  icon: string;
  title: string;
  items: CheckItem[];
}

const GROUPS: CheckGroup[] = [
  {
    id: "pesquisa",
    icon: "🔍",
    title: "Antes de comprar (EUA)",
    items: [
      { id: "title_clean", label: "Certificate of Title limpo (sem gravames)", note: "Verifique liens no DMV do estado" },
      { id: "carfax", label: "Relatório Carfax ou AutoCheck obtido" },
      { id: "mecanico", label: "Avaliação com mecânico nos EUA", note: "Recomendado para clássicos" },
      { id: "frete_cotacao", label: "Cotação de frete marítimo (mín. 2 transportadoras)" },
      { id: "seguro_cotacao", label: "Cotação de seguro marítimo obtida" },
    ],
  },
  {
    id: "compra",
    icon: "📄",
    title: "Compra e exportação (EUA)",
    items: [
      { id: "bill_of_sale", label: "Bill of Sale assinado com o vendedor" },
      { id: "title_transfer", label: "Certificate of Title transferido para seu nome" },
      { id: "eei", label: "EEI registrado no CBP (72h antes do embarque)", note: "Automated Export System" },
      { id: "passaporte", label: "Passaporte ou documento de identidade com cópia" },
    ],
  },
  {
    id: "radar",
    icon: "🔐",
    title: "Habilitação RADAR (Brasil)",
    items: [
      { id: "cpf_regular", label: "CPF/CNPJ regular na Receita Federal (sem pendências)" },
      { id: "radar_solicitado", label: "Solicitação de habilitação RADAR enviada", note: "Prazo: 30–90 dias" },
      { id: "radar_aprovado", label: "RADAR aprovado e ativo" },
    ],
  },
  {
    id: "frete",
    icon: "🚢",
    title: "Frete marítimo",
    items: [
      { id: "transportadora", label: "Transportadora especializada contratada (RoRo ou container)" },
      { id: "bill_of_lading", label: "Bill of Lading (conhecimento de embarque) recebido" },
      { id: "seguro_contrato", label: "Contrato de seguro marítimo assinado" },
      { id: "invoice_frete", label: "Invoice da transportadora recebida" },
    ],
  },
  {
    id: "licenca",
    icon: "📋",
    title: "Licença de Importação e impostos",
    items: [
      { id: "despachante", label: "Despachante aduaneiro habilitado contratado" },
      { id: "li_siscomex", label: "Licença de Importação aberta no Siscomex (SECEX/MDIC)" },
      { id: "ibama", label: "Laudo IBAMA obtido", note: "Exige análise de emissões — clássicos geralmente aprovados" },
      { id: "li_aprovada", label: "Licença de Importação aprovada" },
      { id: "darf_pago", label: "DARF de impostos quitado (II, IPI, PIS, COFINS, ICMS)" },
    ],
  },
  {
    id: "desembaraco",
    icon: "🏛",
    title: "Desembaraço aduaneiro",
    items: [
      { id: "thc_pago", label: "THC (Terminal Handling Charge) pago" },
      { id: "afrmm_pago", label: "AFRMM pago (25% do frete marítimo)" },
      { id: "armazenagem", label: "Armazenagem e capatazia quitados" },
      { id: "nota_desembaraco", label: "Nota de desembaraço / DI liberada pela Receita Federal" },
    ],
  },
  {
    id: "homologacao",
    icon: "✅",
    title: "Homologação e emplacamento",
    items: [
      { id: "cat_senatrans", label: "CAT (SENATRANS) aprovado", note: "Certificado de Adequação à Legislação de Trânsito" },
      { id: "inmetro", label: "Laudo INMETRO emitido pelo laboratório credenciado" },
      { id: "detran_vistoria", label: "Vistoria no DETRAN aprovada" },
      { id: "crv", label: "CRV emitido (Certificado de Registro do Veículo)" },
      { id: "placa", label: "Placa brasileira instalada" },
    ],
  },
];

function totalItems(groups: CheckGroup[]) {
  return groups.reduce((acc, g) => acc + g.items.length, 0);
}

export function ChecklistClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {}
  }, [checked, loaded]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => {
    if (confirm("Deseja reiniciar o checklist? Todo o progresso será perdido.")) {
      setChecked({});
    }
  };

  const total = totalItems(GROUPS);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  if (!loaded) return null;

  return (
    <div>
      {/* Progress geral */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {done} de {total} itens concluídos
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-blue-600">{pct}%</span>
            {done > 0 && (
              <button onClick={reset}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors underline">
                Reiniciar
              </button>
            )}
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-center text-green-600 text-sm font-semibold mt-3">
            🎉 Checklist completo! Seu veículo está pronto para as ruas.
          </p>
        )}
      </div>

      {/* Grupos */}
      <div className="space-y-5">
        {GROUPS.map((group) => {
          const groupDone = group.items.filter((i) => checked[i.id]).length;
          const groupTotal = group.items.length;
          const groupPct = Math.round((groupDone / groupTotal) * 100);
          const allDone = groupDone === groupTotal;

          return (
            <div key={group.id}
              className={`border rounded-xl overflow-hidden transition-colors ${allDone ? "border-green-200 bg-green-50/30" : "border-slate-200 bg-white"}`}>
              {/* Header do grupo */}
              <div className={`flex items-center justify-between px-4 py-3 ${allDone ? "bg-green-50" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2">
                  <span>{group.icon}</span>
                  <span className={`font-semibold text-sm ${allDone ? "text-green-800" : "text-slate-800"}`}>
                    {group.title}
                  </span>
                  {allDone && <span className="text-green-600 text-xs font-bold">✓ Concluído</span>}
                </div>
                <span className={`text-xs font-medium ${allDone ? "text-green-600" : "text-slate-500"}`}>
                  {groupDone}/{groupTotal}
                </span>
              </div>

              {/* Progress do grupo */}
              <div className="h-1 bg-slate-100">
                <div
                  className={`h-full transition-all duration-300 ${allDone ? "bg-green-400" : "bg-blue-400"}`}
                  style={{ width: `${groupPct}%` }}
                />
              </div>

              {/* Itens */}
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <label key={item.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                    <div>
                      <span className={`text-sm transition-colors ${checked[item.id] ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {item.label}
                      </span>
                      {item.note && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.note}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        Progresso salvo automaticamente no seu navegador.
      </p>
    </div>
  );
}
