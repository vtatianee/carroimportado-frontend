"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Consentimento de cookies publicitários.
 *
 * Antes desta versão o banner só gravava "accepted" e não bloqueava nada — o
 * script do AdSense era carregado no <head> do layout, ou seja, antes de o
 * banner sequer aparecer. Na prática não havia consentimento: nem opção de
 * recusa, nem efeito ao aceitar. A política, porém, declarava base legal
 * "consentimento" (art. 7º, I). Texto e código diziam coisas diferentes.
 *
 * Agora a decisão é real: o AdSense só é injetado depois de um "aceito"
 * explícito, e "recusado" é um estado que o site respeita.
 *
 * `null` = ainda não decidiu (mostra o banner).
 */
export type Consentimento = "accepted" | "rejected" | null;

/** Mantida a chave antiga: quem já aceitou não precisa decidir de novo. */
const CHAVE = "cookie_consent";

interface Ctx {
  consentimento: Consentimento;
  /** `false` até o primeiro efeito rodar — evita piscar o banner na hidratação. */
  carregado: boolean;
  decidir: (valor: Exclude<Consentimento, null>) => void;
  /** Reabre a escolha. Usado pelo botão na página de privacidade. */
  reabrir: () => void;
}

const ConsentContext = createContext<Ctx>({
  consentimento: null,
  carregado: false,
  decidir: () => {},
  reabrir: () => {},
});

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentimento, setConsentimento] = useState<Consentimento>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    // localStorage não existe no servidor; a leitura precisa ser em efeito.
    // Enquanto isso o padrão é `null`, que é o estado conservador: sem
    // consentimento, sem anúncio.
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo === "accepted" || salvo === "rejected") setConsentimento(salvo);
    } catch {
      // Safari em navegação privada pode lançar. Sem storage, trata como
      // "não decidiu" — o banner reaparece, que é o comportamento correto.
    }
    setCarregado(true);
  }, []);

  const decidir = (valor: Exclude<Consentimento, null>) => {
    try {
      localStorage.setItem(CHAVE, valor);
    } catch {
      // Mesmo sem conseguir gravar, respeita a escolha nesta sessão.
    }
    setConsentimento(valor);
  };

  const reabrir = () => {
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      /* idem */
    }
    setConsentimento(null);
  };

  return (
    <ConsentContext.Provider value={{ consentimento, carregado, decidir, reabrir }}>
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => useContext(ConsentContext);
