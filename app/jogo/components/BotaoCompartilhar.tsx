"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

interface Props {
  texto: string;
  modo: "diario" | "treino";
}

export default function BotaoCompartilhar({ texto, modo }: Props) {
  const [status, setStatus] = useState<"parado" | "copiado" | "erro">("parado");

  async function compartilhar() {
    // Web Share só no celular (toque): no desktop a folha de compartilhar do
    // sistema é menos útil que simplesmente copiar o texto.
    const celular = typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;
    if (celular) {
      try {
        await navigator.share({ text: texto });
        track("jogo_compartilhado", { modo, metodo: "web_share" });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // usuário cancelou
        // qualquer outra falha: tenta copiar
      }
    }

    try {
      await navigator.clipboard.writeText(texto);
      setStatus("copiado");
      track("jogo_compartilhado", { modo, metodo: "clipboard" });
      setTimeout(() => setStatus("parado"), 2500);
    } catch {
      // Navegadores embutidos (Instagram, Facebook) costumam negar o
      // clipboard: mostra o texto para o jogador copiar à mão.
      setStatus("erro");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={compartilhar}
        className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
      >
        {status === "copiado" ? "✅ Copiado!" : "📤 Compartilhar resultado"}
      </button>
      <p aria-live="polite" className="text-xs text-center mt-1 min-h-4 text-slate-500">
        {status === "copiado" && "Texto copiado — é só colar no WhatsApp, X ou Instagram."}
        {status === "erro" && "Copie o texto abaixo para compartilhar:"}
      </p>
      {status === "erro" && (
        <textarea
          readOnly
          value={texto}
          rows={3}
          aria-label="Texto para compartilhar"
          onFocus={(e) => e.currentTarget.select()}
          ref={(el) => el?.select()}
          className="mt-1 w-full text-base text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none"
        />
      )}
    </div>
  );
}
