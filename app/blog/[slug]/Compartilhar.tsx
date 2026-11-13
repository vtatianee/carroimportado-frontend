"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * Botões de compartilhar o post. Só links de compartilhamento das próprias
 * redes, sem script ou widget de terceiros: não grava cookie, não carrega nada
 * extra e não exige mudar a política de privacidade.
 *
 * No celular, se o navegador tiver o compartilhamento nativo (Web Share API),
 * aparece também o botão "Compartilhar", que abre a folha do sistema com todos
 * os apps instalados.
 */

const assinarNada = () => () => {};
// Servidor: false. Cliente: o que o navegador suporta. Sem setState em efeito
// e sem divergência de hidratação.
const temCompartilharNativo = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

type Rede = { nome: string; cor: string; href: (url: string, titulo: string) => string };

const REDES: Rede[] = [
  {
    nome: "WhatsApp",
    cor: "bg-[#25D366] hover:bg-[#1ebe5a] text-white",
    href: (url, titulo) => `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`,
  },
  {
    nome: "Facebook",
    cor: "bg-[#1877F2] hover:bg-[#0f66d8] text-white",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    nome: "X",
    cor: "bg-black hover:bg-slate-800 text-white",
    href: (url, titulo) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`,
  },
  {
    nome: "LinkedIn",
    cor: "bg-[#0A66C2] hover:bg-[#0957a6] text-white",
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    nome: "Telegram",
    cor: "bg-[#229ED9] hover:bg-[#1c8bc0] text-white",
    href: (url, titulo) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
  },
];

export default function Compartilhar({
  url,
  titulo,
  variante = "completo",
}: {
  url: string;
  titulo: string;
  variante?: "completo" | "compacto";
}) {
  const nativo = useSyncExternalStore(assinarNada, temCompartilharNativo, () => false);
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  async function compartilharNativo() {
    try {
      await navigator.share({ title: titulo, url });
    } catch {
      // cancelado pela pessoa: nada a fazer
    }
  }

  const botao = "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors";

  const lista = (
    <div className="flex flex-wrap gap-2">
      {nativo && (
        <button type="button" onClick={compartilharNativo} className={`${botao} bg-slate-900 hover:bg-slate-700 text-white`}>
          📤 Compartilhar
        </button>
      )}
      {REDES.map((r) => (
        <a
          key={r.nome}
          href={r.href(url, titulo)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartilhar no ${r.nome}`}
          className={`${botao} ${r.cor}`}
        >
          {r.nome}
        </a>
      ))}
      <button
        type="button"
        onClick={copiar}
        className={`${botao} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
        aria-live="polite"
      >
        {copiado ? "✓ Link copiado" : "🔗 Copiar link"}
      </button>
    </div>
  );

  if (variante === "compacto") {
    return (
      <div className="flex flex-wrap items-center gap-2" aria-label="Compartilhar este artigo">
        <span className="text-xs font-medium text-slate-500">Compartilhe:</span>
        {lista}
      </div>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="compartilhar-titulo">
      <h2 id="compartilhar-titulo" className="font-bold text-slate-900 mb-1">
        Gostou? Compartilhe este artigo
      </h2>
      <p className="text-slate-500 text-sm mb-4">Ajude quem está pensando em importar um carro dos EUA.</p>
      {lista}
    </section>
  );
}
