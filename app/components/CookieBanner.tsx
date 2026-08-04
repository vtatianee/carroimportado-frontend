"use client";

import Link from "next/link";
import { useConsent } from "./ConsentContext";

/**
 * Aviso de cookies com recusa de verdade.
 *
 * Os dois botões têm o mesmo peso visual de propósito. Um "Aceitar" azul ao
 * lado de um "Recusar" apagado é desenho que empurra a escolha — e o art. 5º,
 * XII da LGPD pede manifestação LIVRE. Se recusar custa mais atenção que
 * aceitar, o consentimento fica frágil justamente no ponto em que a política
 * o invoca como base legal.
 *
 * O texto também não diz mais "ao continuar navegando, você concorda":
 * navegação não é consentimento, e afirmar isso era outra promessa que o
 * código não cumpria.
 */
export default function CookieBanner() {
  const { consentimento, carregado, decidir } = useConsent();

  // Só aparece depois de ler o storage: renderizar antes faria o banner piscar
  // para quem já decidiu.
  if (!carregado || consentimento !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso sobre cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white px-4 py-4 shadow-lg"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm flex-1 text-slate-200">
          🍪 Usamos cookies do <strong>Google AdSense</strong> para exibir anúncios, o que ajuda a
          manter o site gratuito. Recusar não limita nada — a calculadora e todo o conteúdo
          continuam iguais. Detalhes na{" "}
          <Link href="/privacy" className="underline text-blue-300 hover:text-blue-200">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => decidir("rejected")}
            className="px-4 py-2 text-sm rounded-lg border border-slate-500 text-white hover:bg-slate-800 font-medium transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={() => decidir("accepted")}
            className="px-4 py-2 text-sm rounded-lg border border-slate-500 bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
