"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";
import { URL_JOGO, urlCompartilhamento, type RedeSocial } from "../../lib/jogo/compartilhamento";

interface Props {
  /** Resultado da rodada, sem o link (cada rede recebe o link do seu jeito). */
  resumo: string;
  modo: "diario" | "treino";
}

type Metodo = RedeSocial | "instagram" | "copiar_link" | "web_share";

type Aviso = { tipo: "copiado"; mensagem: string } | { tipo: "manual"; mensagem: string; conteudo: string };

const REDES: { rede: RedeSocial; rotulo: string; icone: string; fundo: string }[] = [
  { rede: "whatsapp", rotulo: "WhatsApp", icone: "💬", fundo: "bg-[#25D366]" },
  { rede: "x", rotulo: "X", icone: "𝕏", fundo: "bg-black" },
  { rede: "facebook", rotulo: "Facebook", icone: "f", fundo: "bg-[#1877F2]" },
  { rede: "telegram", rotulo: "Telegram", icone: "✈", fundo: "bg-[#26A5E4]" },
];

const semAssinatura = () => () => {};
const temWebShare = () => typeof navigator.share === "function";
const semWebShareNoServidor = () => false;

export default function BotaoCompartilhar({ resumo, modo }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const webShare = useSyncExternalStore(semAssinatura, temWebShare, semWebShareNoServidor);
  const texto = `${resumo} Jogue: ${URL_JOGO}`;

  const registrar = (metodo: Metodo) => track("jogo_compartilhado", { modo, metodo });

  async function copiar(conteudo: string, metodo: Metodo, mensagem: string) {
    try {
      await navigator.clipboard.writeText(conteudo);
      setAviso({ tipo: "copiado", mensagem });
      registrar(metodo);
    } catch {
      // Navegadores embutidos (Instagram, Facebook) costumam negar o
      // clipboard: mostra o conteúdo para o jogador copiar à mão.
      setAviso({ tipo: "manual", mensagem: "Copie abaixo:", conteudo });
    }
  }

  async function compartilharNativo() {
    try {
      await navigator.share({ text: texto });
      registrar("web_share");
      dialogo.current?.close();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // usuário cancelou
      await copiar(texto, "web_share", "Texto copiado — é só colar onde quiser.");
    }
  }

  const botaoOpcao = "flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer";
  const iconeOpcao = "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold";

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
      >
        📤 Compartilhar resultado
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="titulo-compartilhar"
        onClose={() => setAviso(null)}
        // Toque no fundo escurecido (fora do conteúdo) fecha a janela.
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="w-full max-w-md mt-auto mb-0 sm:m-auto p-0 rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl backdrop:bg-slate-950/60"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 id="titulo-compartilhar" className="font-bold text-slate-900">
              Compartilhar resultado
            </h2>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              aria-label="Fechar"
              className="w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {REDES.map(({ rede, rotulo, icone, fundo }) => (
              <a
                key={rede}
                href={urlCompartilhamento(rede, resumo)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  registrar(rede);
                  dialogo.current?.close();
                }}
                className={botaoOpcao}
              >
                <span className={`${iconeOpcao} ${fundo}`} aria-hidden="true">
                  {icone}
                </span>
                <span className="text-xs text-slate-700">{rotulo}</span>
              </a>
            ))}
            <button
              type="button"
              // O Instagram não tem link de compartilhamento na web: copia o texto para colar.
              onClick={() => copiar(texto, "instagram", "Texto copiado! Abra o Instagram e cole no story ou na DM.")}
              className={botaoOpcao}
            >
              <span
                className={`${iconeOpcao} bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]`}
                aria-hidden="true"
              >
                📷
              </span>
              <span className="text-xs text-slate-700">Instagram</span>
            </button>
            <button
              type="button"
              onClick={() => copiar(URL_JOGO, "copiar_link", "Link copiado!")}
              className={botaoOpcao}
            >
              <span className={`${iconeOpcao} bg-slate-200 text-slate-700`} aria-hidden="true">
                🔗
              </span>
              <span className="text-xs text-slate-700">Copiar link</span>
            </button>
          </div>

          {webShare && (
            <button
              type="button"
              onClick={compartilharNativo}
              className="mt-3 w-full py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Mais opções…
            </button>
          )}

          <div aria-live="polite">
            {aviso?.tipo === "copiado" && (
              <p className="mt-3 text-sm text-center text-green-700 bg-green-50 rounded-lg py-2">✅ {aviso.mensagem}</p>
            )}
            {aviso?.tipo === "manual" && (
              <>
                <p className="mt-3 text-xs text-slate-500">{aviso.mensagem}</p>
                <textarea
                  readOnly
                  value={aviso.conteudo}
                  rows={3}
                  aria-label="Texto para compartilhar"
                  onFocus={(e) => e.currentTarget.select()}
                  ref={(el) => el?.select()}
                  className="mt-1 w-full text-base text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none"
                />
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
