"use client";

import { useState } from "react";

export default function PalpitePreco({ onEnviar }: { onEnviar: (palpite: number) => void }) {
  const [digitos, setDigitos] = useState("");
  const valor = digitos ? Number(digitos) : 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valor > 0) onEnviar(valor);
      }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <label htmlFor="palpite" className="block text-sm font-semibold text-slate-800 mb-2">
        Quanto esse carro custa nos EUA?
      </label>
      <div className="flex items-center rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        <span className="pl-4 pr-1 text-slate-500 font-semibold">US$</span>
        {/* text-base (16px): abaixo disso o Safari do iPhone dá zoom ao focar o campo */}
        <input
          id="palpite"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          enterKeyHint="done"
          value={valor > 0 ? valor.toLocaleString("pt-BR") : ""}
          onChange={(e) => setDigitos(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 7))}
          placeholder="ex: 25.000"
          className="flex-1 min-w-0 px-2 py-3 text-base font-semibold text-slate-900 bg-transparent rounded-r-xl focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={valor <= 0}
        className="mt-3 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        Confirmar palpite
      </button>
    </form>
  );
}
