"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CHAVE_CONSENTIMENTO,
  EVENTO_PREFERENCIAS,
  EVENTO_REGIAO,
  type Consentimento,
} from "../lib/anuncios";

type JanelaAnuncios = Window & {
  __anunciosGdpr?: boolean;
  adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: 0 | 1 };
  googlefc?: { showRevocationMessage?: () => void; callbackQueue?: unknown[] };
};

function lerEscolha(): Consentimento | null {
  try {
    const v = localStorage.getItem(CHAVE_CONSENTIMENTO);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Aviso de cookies para quem está FORA do EEE/Reino Unido/Suíça (Brasil
 * incluído). Lá dentro, a mensagem do Google cuida disso — ver lib/anuncios.ts.
 */
export default function AvisoCookies() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const w = window as JanelaAnuncios;
    const aoSaberRegiao = (gdpr: boolean) => {
      if (!gdpr && lerEscolha() === null) setAberto(true);
    };
    const ouvirRegiao = (e: Event) => aoSaberRegiao((e as CustomEvent<{ gdpr: boolean }>).detail.gdpr);
    const ouvirPreferencias = () => {
      if (w.__anunciosGdpr) w.googlefc?.showRevocationMessage?.();
      else setAberto(true);
    };

    // O script inline do layout pode ter decidido a região antes da hidratação.
    if (typeof w.__anunciosGdpr === "boolean") aoSaberRegiao(w.__anunciosGdpr);
    window.addEventListener(EVENTO_REGIAO, ouvirRegiao);
    window.addEventListener(EVENTO_PREFERENCIAS, ouvirPreferencias);
    return () => {
      window.removeEventListener(EVENTO_REGIAO, ouvirRegiao);
      window.removeEventListener(EVENTO_PREFERENCIAS, ouvirPreferencias);
    };
  }, []);

  function escolher(valor: Consentimento) {
    try {
      localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
    } catch {}
    // Vale para os próximos pedidos de anúncio desta visita.
    const ads = ((window as JanelaAnuncios).adsbygoogle ??= []);
    ads.requestNonPersonalizedAds = valor === "aceito" ? 0 : 1;
    setAberto(false);
  }

  if (!aberto) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:flex sm:items-center sm:gap-4">
        <p className="text-sm text-slate-700 leading-relaxed sm:flex-1">
          🍪 O site exibe anúncios do Google. Com a sua permissão, o Google pode usar cookies para
          personalizar os anúncios com base na sua navegação. Se recusar, os anúncios continuam, mas
          sem personalização. Detalhes na{" "}
          <Link href="/privacy" className="text-blue-600 underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
          <button
            type="button"
            onClick={() => escolher("recusado")}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => escolher("aceito")}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

/** Reabre a escolha (LGPD: revogar o consentimento a qualquer momento). */
export function BotaoPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENTO_PREFERENCIAS))}
      className={className}
    >
      Preferências de cookies
    </button>
  );
}
